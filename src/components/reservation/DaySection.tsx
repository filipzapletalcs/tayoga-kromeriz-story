import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { ScheduleItem } from '@/types/database'
import { isToday } from '@/hooks/useScheduleData'
import LessonCard from './LessonCard'

interface DaySectionProps {
  date: Date
  items: ScheduleItem[]
  onSelectItem: (item: ScheduleItem) => void
  index: number
}

const DaySection: React.FC<DaySectionProps> = ({ date, items, onSelectItem, index }) => {
  const today = isToday(date)

  // Format date: "Středa 8. ledna"
  const dayName = format(date, 'EEEE', { locale: cs })
  const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const dateFormatted = format(date, 'd. MMMM', { locale: cs })

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="mb-6"
    >
      {/* Day header */}
      <div className={cn(
        'flex items-center gap-3 mb-3 pb-2 border-b',
        today ? 'border-primary/30' : 'border-border/50'
      )}>
        {/* Date info */}
        <div className="flex items-baseline gap-2">
          <h2 className={cn(
            'text-lg font-serif font-semibold',
            today ? 'text-primary' : 'text-foreground'
          )}>
            {dayNameCapitalized}
          </h2>
          <span className="text-muted-foreground">
            {dateFormatted}
          </span>
        </div>

        {/* Today badge */}
        {today && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Dnes
          </span>
        )}

        {/* Items count */}
        <span className="ml-auto text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'lekce' : items.length < 5 ? 'lekce' : 'lekcí'}
        </span>
      </div>

      {/* Lessons grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, itemIndex) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + itemIndex * 0.03, duration: 0.2 }}
          >
            <LessonCard
              item={item}
              onClick={() => onSelectItem(item)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default DaySection
