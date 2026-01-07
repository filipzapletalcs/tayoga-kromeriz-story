import { useState, useEffect, useMemo, useCallback } from 'react'
import { format, addDays, startOfMonth, getDay, startOfDay, isBefore } from 'date-fns'
import { cs } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useCancelInstance } from '@/hooks/useClasses'
import { useQueryClient } from '@tanstack/react-query'
import { Check, X, Loader2 } from 'lucide-react'

interface RecurringClassSchedulePreviewProps {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  recurringClassId?: string // for existing class
  weeksToShow?: number // default 8
  className?: string
  // For new classes - track dates to cancel
  pendingCancellations?: Set<string>
  onPendingCancellationsChange?: (dates: Set<string>) => void
}

interface InstanceData {
  id: string
  date: string
  is_cancelled: boolean
}

export function RecurringClassSchedulePreview({
  dayOfWeek,
  recurringClassId,
  weeksToShow = 8,
  className,
  pendingCancellations,
  onPendingCancellationsChange,
}: RecurringClassSchedulePreviewProps) {
  const [instances, setInstances] = useState<Map<string, InstanceData>>(new Map())
  const [loading, setLoading] = useState(false)
  const [togglingDate, setTogglingDate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cancelInstance = useCancelInstance()
  const queryClient = useQueryClient()

  // Calculate the dates for the selected day of week
  const upcomingDates = useMemo(() => {
    const today = startOfDay(new Date())
    const dates: Date[] = []

    for (let i = 0; i < weeksToShow * 7; i++) {
      const date = addDays(today, i)
      if (getDay(date) === dayOfWeek) {
        dates.push(date)
      }
    }

    return dates
  }, [dayOfWeek, weeksToShow])

  // Load existing instances for this class
  useEffect(() => {
    if (!recurringClassId || upcomingDates.length === 0) {
      setInstances(new Map())
      return
    }

    const loadInstances = async () => {
      setLoading(true)
      setError(null)
      try {
        const startDate = format(upcomingDates[0], 'yyyy-MM-dd')
        const endDate = format(upcomingDates[upcomingDates.length - 1], 'yyyy-MM-dd')

        const { data, error: fetchError } = await supabase
          .from('class_instances')
          .select('id, date, is_cancelled')
          .eq('recurring_class_id', recurringClassId)
          .gte('date', startDate)
          .lte('date', endDate)

        if (fetchError) throw fetchError

        const instanceMap = new Map<string, InstanceData>()
        data?.forEach(instance => {
          instanceMap.set(instance.date, instance)
        })
        setInstances(instanceMap)
      } catch (err) {
        console.error('Error loading instances:', err)
        setError('Nepodařilo se načíst termíny')
      } finally {
        setLoading(false)
      }
    }

    loadInstances()
  }, [recurringClassId, upcomingDates])

  // Toggle cancellation for a specific date (for existing classes)
  const handleToggleDateExisting = useCallback(async (date: Date) => {
    if (!recurringClassId) return

    const dateStr = format(date, 'yyyy-MM-dd')
    setTogglingDate(dateStr)
    setError(null)

    try {
      const existingInstance = instances.get(dateStr)

      if (existingInstance) {
        // Toggle existing instance
        const newCancelledState = !existingInstance.is_cancelled

        const { error: updateError } = await supabase
          .from('class_instances')
          .update({ is_cancelled: newCancelledState })
          .eq('id', existingInstance.id)

        if (updateError) throw updateError

        setInstances(prev => {
          const newMap = new Map(prev)
          newMap.set(dateStr, {
            ...existingInstance,
            is_cancelled: newCancelledState,
          })
          return newMap
        })
      } else {
        // Create new instance and mark as cancelled
        const { data: instanceId, error: rpcError } = await supabase
          .rpc('get_or_create_class_instance', {
            p_recurring_class_id: recurringClassId,
            p_date: dateStr,
          })

        if (rpcError) throw rpcError

        // Now cancel it
        const { error: updateError } = await supabase
          .from('class_instances')
          .update({ is_cancelled: true })
          .eq('id', instanceId)

        if (updateError) throw updateError

        setInstances(prev => {
          const newMap = new Map(prev)
          newMap.set(dateStr, {
            id: instanceId,
            date: dateStr,
            is_cancelled: true,
          })
          return newMap
        })
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
      queryClient.invalidateQueries({ queryKey: ['class-instances'] })
      queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
    } catch (err) {
      console.error('Error toggling instance:', err)
      setError('Nepodařilo se změnit stav termínu')
    } finally {
      setTogglingDate(null)
    }
  }, [recurringClassId, instances, queryClient])

  // Toggle for new classes (just track in local state)
  const handleToggleDateNew = useCallback((date: Date) => {
    if (!onPendingCancellationsChange || !pendingCancellations) return

    const dateStr = format(date, 'yyyy-MM-dd')
    const newSet = new Set(pendingCancellations)

    if (newSet.has(dateStr)) {
      newSet.delete(dateStr)
    } else {
      newSet.add(dateStr)
    }

    onPendingCancellationsChange(newSet)
  }, [pendingCancellations, onPendingCancellationsChange])

  // Unified click handler
  const handleToggleDate = useCallback((date: Date) => {
    if (recurringClassId) {
      handleToggleDateExisting(date)
    } else if (onPendingCancellationsChange) {
      handleToggleDateNew(date)
    }
  }, [recurringClassId, handleToggleDateExisting, handleToggleDateNew, onPendingCancellationsChange])

  // Check if date is cancelled (either from DB or pending)
  const isDateCancelled = useCallback((dateStr: string): boolean => {
    if (recurringClassId) {
      return instances.get(dateStr)?.is_cancelled ?? false
    }
    return pendingCancellations?.has(dateStr) ?? false
  }, [recurringClassId, instances, pendingCancellations])

  // Group dates by month for display
  const datesByMonth = useMemo(() => {
    const grouped: { month: Date; dates: Date[] }[] = []

    upcomingDates.forEach(date => {
      const monthKey = format(date, 'yyyy-MM')
      const existing = grouped.find(g => format(g.month, 'yyyy-MM') === monthKey)

      if (existing) {
        existing.dates.push(date)
      } else {
        grouped.push({ month: startOfMonth(date), dates: [date] })
      }
    })

    return grouped
  }, [upcomingDates])

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    return null
  }

  const dayName = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][dayOfWeek]
  const isInteractive = !!recurringClassId || !!onPendingCancellationsChange

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-sm">Nadcházející termíny ({dayName})</h4>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {error && (
        <div className="mb-3 text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {datesByMonth.map(({ month, dates }) => (
          <div key={format(month, 'yyyy-MM')}>
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {format(month, 'LLLL yyyy', { locale: cs })}
            </div>
            <div className="flex flex-wrap gap-2">
              {dates.map(date => {
                const dateStr = format(date, 'yyyy-MM-dd')
                const isCancelled = isDateCancelled(dateStr)
                const isToggling = togglingDate === dateStr
                const isPast = isBefore(date, startOfDay(new Date()))

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isToggling || isPast || !isInteractive}
                    onClick={() => handleToggleDate(date)}
                    className={cn(
                      'relative flex flex-col items-center justify-center',
                      'w-12 h-14 rounded-md border text-xs transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                      isPast && 'opacity-50 cursor-not-allowed',
                      !isInteractive && 'cursor-default',
                      isInteractive && !isPast && 'hover:scale-105 hover:shadow-md cursor-pointer',
                      isCancelled
                        ? 'border-destructive/50 bg-destructive/10 text-destructive'
                        : 'border-green-500/50 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
                    )}
                    title={
                      isPast
                        ? 'Minulý termín'
                        : !isInteractive
                        ? 'Náhled termínu'
                        : isCancelled
                        ? 'Klikni pro obnovení'
                        : 'Klikni pro zrušení'
                    }
                  >
                    {isToggling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span className="font-semibold text-base">
                          {format(date, 'd')}
                        </span>
                        <span className="text-[10px] opacity-70">
                          {format(date, 'EEE', { locale: cs })}
                        </span>
                        <div className="absolute -top-1 -right-1">
                          {isCancelled ? (
                            <X className="h-3.5 w-3.5 text-destructive" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          )}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-green-500/50 bg-green-50" />
          <span>Aktivní</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-destructive/50 bg-destructive/10" />
          <span>Zrušeno</span>
        </div>
        {isInteractive && (
          <span className="ml-auto italic">Klikni pro změnu</span>
        )}
      </div>
    </div>
  )
}

// Helper function to apply pending cancellations after class creation
export async function applyPendingCancellations(
  recurringClassId: string,
  datesToCancel: Set<string>
): Promise<void> {
  for (const dateStr of datesToCancel) {
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

      // Cancel it
      const { error: updateError } = await supabase
        .from('class_instances')
        .update({ is_cancelled: true })
        .eq('id', instanceId)

      if (updateError) {
        console.error(`Error cancelling instance for ${dateStr}:`, updateError)
      }
    } catch (err) {
      console.error(`Error processing cancellation for ${dateStr}:`, err)
    }
  }
}
