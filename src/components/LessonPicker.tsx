import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Clock, Sparkles, ChevronRight, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { ScheduleItem } from '@/types/database'
import { getLessonWithRegistrations } from '@/hooks/useUpcomingSchedule'

interface LessonPickerProps {
  items: ScheduleItem[]
  date: Date
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectLesson: (item: ScheduleItem) => void
}

const LessonPicker: React.FC<LessonPickerProps> = ({
  items,
  date,
  open,
  onOpenChange,
  onSelectLesson,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const dayName = format(date, 'EEEE', { locale: cs })
  const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const dateFormatted = format(date, 'd. MMMM', { locale: cs })

  const formatTime = (time: string) => time.substring(0, 5)

  const handleSelect = async (item: ScheduleItem) => {
    setLoadingId(item.id)
    try {
      // Load full details with registration count
      const fullItem = await getLessonWithRegistrations(item)
      onOpenChange(false)
      onSelectLesson(fullItem)
    } catch (error) {
      console.error('Error loading lesson details:', error)
      // Still close and open modal with basic info
      onOpenChange(false)
      onSelectLesson(item)
    } finally {
      setLoadingId(null)
    }
  }

  const getTypeLabel = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'recurring':
        return 'Kurz'
      case 'one_time':
        return 'Jednorázová'
      case 'workshop':
        return 'Workshop'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4 border-b border-border/50">
          <SheetTitle className="text-xl font-serif">
            {dayNameCapitalized}, {dateFormatted}
          </SheetTitle>
          <SheetDescription>
            Vyberte lekci pro zobrazení detailů a rezervaci
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-3">
          {items.map((item, index) => {
            const isWorkshop = item.type === 'workshop'
            const isLoading = loadingId === item.id

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(item)}
                disabled={isLoading}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all',
                  'hover:shadow-md active:scale-[0.98]',
                  'flex items-center justify-between gap-3',
                  isWorkshop
                    ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5 hover:from-amber-500/10 hover:to-orange-500/10'
                    : 'border-primary/20 bg-primary/5 hover:bg-primary/10',
                  isLoading && 'opacity-70 cursor-wait'
                )}
              >
                <div className="flex-1 min-w-0">
                  {/* Type badge */}
                  <div className="mb-1.5">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      isWorkshop
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400'
                        : 'bg-primary/10 text-primary'
                    )}>
                      {isWorkshop && <Sparkles className="w-3 h-3" />}
                      {getTypeLabel(item.type)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground truncate">
                    {item.title}
                  </h3>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {formatTime(item.time_start)} - {formatTime(item.time_end)}
                    </span>
                  </div>

                  {/* Price if available */}
                  {item.price && (
                    <p className="text-sm font-medium text-foreground mt-1">
                      {item.price} Kč
                    </p>
                  )}
                </div>

                {/* Arrow or loader */}
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  isWorkshop
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-primary/10 text-primary'
                )}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default LessonPicker
