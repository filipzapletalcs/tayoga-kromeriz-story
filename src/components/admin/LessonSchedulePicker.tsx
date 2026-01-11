import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  format,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  startOfDay,
  isBefore,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { cs } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { Check, X, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LessonSchedulePickerProps {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  lessonCount: number | null // if null, show 8 weeks worth
  recurringClassId?: string // for existing class - loads from DB
  className?: string
  // For new classes - track selected dates
  selectedDates?: Set<string>
  onSelectedDatesChange?: (dates: Set<string>) => void
}

interface InstanceData {
  id: string
  date: string
  is_cancelled: boolean
}

export function LessonSchedulePicker({
  dayOfWeek,
  lessonCount,
  recurringClassId,
  className,
  selectedDates: externalSelectedDates,
  onSelectedDatesChange,
}: LessonSchedulePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [instances, setInstances] = useState<Map<string, InstanceData>>(new Map())
  const [loading, setLoading] = useState(false)
  const [savingDate, setSavingDate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Internal state for selected dates (used when not controlled externally)
  const [internalSelectedDates, setInternalSelectedDates] = useState<Set<string>>(new Set())

  // Use external or internal state
  const selectedDates = externalSelectedDates ?? internalSelectedDates
  const setSelectedDates = onSelectedDatesChange ?? setInternalSelectedDates

  // Calculate default dates based on day_of_week and lesson_count
  const defaultDates = useMemo(() => {
    const dates = new Set<string>()
    const today = startOfDay(new Date())
    const count = lessonCount || 8
    let found = 0
    let dayOffset = 0

    while (found < count && dayOffset < 365) {
      const date = addDays(today, dayOffset)
      if (getDay(date) === dayOfWeek) {
        dates.add(format(date, 'yyyy-MM-dd'))
        found++
      }
      dayOffset++
    }

    return dates
  }, [dayOfWeek, lessonCount])

  // Initialize selected dates when dayOfWeek or lessonCount changes (for new classes)
  useEffect(() => {
    if (!recurringClassId && selectedDates.size === 0) {
      setSelectedDates(new Set(defaultDates))
    }
  }, [dayOfWeek, lessonCount, recurringClassId])

  // When day_of_week changes, recalculate dates
  useEffect(() => {
    if (!recurringClassId) {
      setSelectedDates(new Set(defaultDates))
    }
  }, [dayOfWeek])

  // Load existing instances for this class
  useEffect(() => {
    if (!recurringClassId) {
      setInstances(new Map())
      return
    }

    const loadInstances = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from('class_instances')
          .select('id, date, is_cancelled')
          .eq('recurring_class_id', recurringClassId)

        if (fetchError) throw fetchError

        const instanceMap = new Map<string, InstanceData>()
        const activeDates = new Set<string>()

        data?.forEach(instance => {
          instanceMap.set(instance.date, instance)
          if (!instance.is_cancelled) {
            activeDates.add(instance.date)
          }
        })

        setInstances(instanceMap)

        // For existing class, selected dates = active instances + default dates
        // This combines existing active dates with future auto-generated ones
        const combined = new Set([...activeDates, ...defaultDates])
        // Remove cancelled ones
        data?.filter(i => i.is_cancelled).forEach(i => combined.delete(i.date))
        setSelectedDates(combined)
      } catch (err) {
        console.error('Error loading instances:', err)
        setError('Nepodařilo se načíst termíny')
      } finally {
        setLoading(false)
      }
    }

    loadInstances()
  }, [recurringClassId])

  // Get calendar days for current month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Check if a date is a "regular" date (matches day_of_week)
  const isRegularDate = useCallback((date: Date): boolean => {
    return getDay(date) === dayOfWeek
  }, [dayOfWeek])

  // Toggle date selection
  const handleToggleDate = useCallback(async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const isPast = isBefore(date, startOfDay(new Date()))

    if (isPast) return

    if (recurringClassId) {
      // For existing class - save to database
      setSavingDate(dateStr)
      setError(null)

      try {
        const existingInstance = instances.get(dateStr)
        const isCurrentlySelected = selectedDates.has(dateStr)

        if (existingInstance) {
          // Toggle existing instance
          const { error: updateError } = await supabase
            .from('class_instances')
            .update({ is_cancelled: isCurrentlySelected })
            .eq('id', existingInstance.id)

          if (updateError) throw updateError

          setInstances(prev => {
            const newMap = new Map(prev)
            newMap.set(dateStr, { ...existingInstance, is_cancelled: isCurrentlySelected })
            return newMap
          })
        } else {
          // Create new instance (for replacement dates or future regular dates)
          const { data: instanceId, error: rpcError } = await supabase
            .rpc('get_or_create_class_instance', {
              p_recurring_class_id: recurringClassId,
              p_date: dateStr,
            })

          if (rpcError) throw rpcError

          // If we're deselecting, also cancel it
          if (isCurrentlySelected) {
            const { error: updateError } = await supabase
              .from('class_instances')
              .update({ is_cancelled: true })
              .eq('id', instanceId)

            if (updateError) throw updateError
          }

          setInstances(prev => {
            const newMap = new Map(prev)
            newMap.set(dateStr, { id: instanceId, date: dateStr, is_cancelled: isCurrentlySelected })
            return newMap
          })
        }

        // Update selected dates
        const newSelected = new Set(selectedDates)
        if (isCurrentlySelected) {
          newSelected.delete(dateStr)
        } else {
          newSelected.add(dateStr)
        }
        setSelectedDates(newSelected)

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
        queryClient.invalidateQueries({ queryKey: ['class-instances'] })
        queryClient.invalidateQueries({ queryKey: ['upcoming-schedule'] })
      } catch (err) {
        console.error('Error toggling date:', err)
        setError('Nepodařilo se změnit termín')
      } finally {
        setSavingDate(null)
      }
    } else {
      // For new class - just update local state
      const newSelected = new Set(selectedDates)
      if (selectedDates.has(dateStr)) {
        newSelected.delete(dateStr)
      } else {
        newSelected.add(dateStr)
      }
      setSelectedDates(newSelected)
    }
  }, [recurringClassId, instances, selectedDates, setSelectedDates, queryClient])

  // Navigation
  const goToPreviousMonth = () => setCurrentMonth(addMonths(currentMonth, -1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
  const requiredCount = lessonCount || 8
  const selectedCount = selectedDates.size
  const isCountValid = selectedCount === requiredCount

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-sm">Termíny kurzu</h4>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {error && (
        <div className="mb-3 text-sm text-destructive bg-destructive/10 p-2 rounded flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Counter */}
      <div className={cn(
        'mb-4 p-3 rounded-lg text-sm font-medium flex items-center justify-between',
        isCountValid
          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
      )}>
        <span>Vybráno termínů:</span>
        <span className="text-lg">
          {selectedCount} / {requiredCount}
        </span>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: cs })}
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const isSelected = selectedDates.has(dateStr)
          const isRegular = isRegularDate(date)
          const isPast = isBefore(date, startOfDay(new Date()))
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isTodayDate = isToday(date)
          const isSaving = savingDate === dateStr

          // Determine visual state
          const isReplacement = isSelected && !isRegular // Selected but not on regular day
          const isCancelled = isRegular && !isSelected && !isPast // Regular day but not selected

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isPast || isSaving}
              onClick={() => handleToggleDate(date)}
              className={cn(
                'relative aspect-square flex items-center justify-center rounded-md text-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                !isCurrentMonth && 'opacity-30',
                isPast && 'opacity-40 cursor-not-allowed',
                !isPast && isCurrentMonth && 'hover:scale-110 cursor-pointer',
                isTodayDate && 'ring-1 ring-primary',
                // Selected states
                isSelected && isRegular && 'bg-green-100 text-green-800 border-2 border-green-500 dark:bg-green-900/40 dark:text-green-300',
                isSelected && isReplacement && 'bg-blue-100 text-blue-800 border-2 border-blue-500 dark:bg-blue-900/40 dark:text-blue-300',
                // Cancelled regular date
                isCancelled && 'bg-red-50 text-red-400 border border-red-300 line-through dark:bg-red-900/20',
                // Unselected non-regular (available for replacement)
                !isSelected && !isRegular && !isPast && isCurrentMonth && 'hover:bg-muted border border-transparent hover:border-muted-foreground/20',
              )}
              title={
                isPast
                  ? 'Minulý termín'
                  : isSelected && isRegular
                  ? 'Pravidelný termín (klikni pro zrušení)'
                  : isSelected && isReplacement
                  ? 'Náhradní termín (klikni pro odebrání)'
                  : isCancelled
                  ? 'Zrušený termín (klikni pro obnovení)'
                  : 'Klikni pro přidání jako náhradní termín'
              }
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <span className={cn(isCancelled && 'line-through')}>
                    {format(date, 'd')}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <Check className={cn(
                        'h-3 w-3',
                        isReplacement ? 'text-blue-600' : 'text-green-600'
                      )} />
                    </div>
                  )}
                  {isCancelled && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <X className="h-3 w-3 text-red-500" />
                    </div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500" />
          <span>Pravidelný</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500" />
          <span>Náhradní</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-50 border border-red-300 line-through flex items-center justify-center text-red-400 text-[10px]">x</div>
          <span>Zrušený</span>
        </div>
      </div>

      {!isCountValid && (
        <div className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          {selectedCount < requiredCount
            ? `Vyberte ještě ${requiredCount - selectedCount} náhradní termín${requiredCount - selectedCount > 1 ? 'y' : ''}`
            : `Máte o ${selectedCount - requiredCount} termín${selectedCount - requiredCount > 1 ? 'y' : ''} více`
          }
        </div>
      )}
    </div>
  )
}

// Helper function to apply selected dates after class creation
export async function applySelectedDates(
  recurringClassId: string,
  selectedDates: Set<string>,
  dayOfWeek: number
): Promise<void> {
  const today = startOfDay(new Date())

  for (const dateStr of selectedDates) {
    const date = new Date(dateStr)
    const isRegularDate = getDay(date) === dayOfWeek

    // Skip past dates
    if (isBefore(date, today)) continue

    try {
      // Create instance
      const { data: instanceId, error: rpcError } = await supabase
        .rpc('get_or_create_class_instance', {
          p_recurring_class_id: recurringClassId,
          p_date: dateStr,
        })

      if (rpcError) {
        console.error(`Error creating instance for ${dateStr}:`, rpcError)
        continue
      }

      // If it's a replacement date (not on regular day), keep it active (default)
      // If it's a regular date that was deselected, we'd need different logic
      // But selected dates are always active
    } catch (err) {
      console.error(`Error processing date ${dateStr}:`, err)
    }
  }

  // Now we need to cancel any regular dates that weren't selected
  // Get all dates that WOULD be selected by default
  const defaultDates = new Set<string>()
  let found = 0
  let dayOffset = 0
  const count = 52 // Check a year's worth

  while (found < count && dayOffset < 365) {
    const date = addDays(today, dayOffset)
    if (getDay(date) === dayOfWeek) {
      defaultDates.add(format(date, 'yyyy-MM-dd'))
      found++
    }
    dayOffset++
  }

  // Cancel dates that are in default but not in selected
  for (const dateStr of defaultDates) {
    if (!selectedDates.has(dateStr)) {
      try {
        const { data: instanceId, error: rpcError } = await supabase
          .rpc('get_or_create_class_instance', {
            p_recurring_class_id: recurringClassId,
            p_date: dateStr,
          })

        if (rpcError) continue

        await supabase
          .from('class_instances')
          .update({ is_cancelled: true })
          .eq('id', instanceId)
      } catch (err) {
        console.error(`Error cancelling date ${dateStr}:`, err)
      }
    }
  }
}
