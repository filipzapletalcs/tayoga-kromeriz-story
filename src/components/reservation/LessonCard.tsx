import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScheduleItem, LessonType } from '@/types/database'
import { getLessonTypeLabel } from '@/hooks/useScheduleData'

interface LessonCardProps {
  item: ScheduleItem
  onClick: () => void
}

const LessonCard: React.FC<LessonCardProps> = ({ item, onClick }) => {
  const spotsRemaining = item.capacity - item.registeredCount
  const isFull = spotsRemaining <= 0
  const isAlmostFull = spotsRemaining > 0 && spotsRemaining <= 2
  const fillPercentage = Math.min((item.registeredCount / item.capacity) * 100, 100)

  // Format time (remove seconds if present)
  const formatTime = (time: string) => {
    const parts = time.split(':')
    return `${parts[0]}:${parts[1]}`
  }

  // Get border color based on type
  const getBorderColor = (type: LessonType) => {
    switch (type) {
      case 'workshop':
        return 'border-l-amber-500'
      default:
        return 'border-l-primary'
    }
  }

  // Get badge styles based on type
  const getBadgeStyles = (type: LessonType) => {
    switch (type) {
      case 'workshop':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400'
      case 'one_time':
        return 'bg-primary/10 text-primary'
      default:
        return null // No badge for recurring
    }
  }

  const badgeStyles = getBadgeStyles(item.type)

  return (
    <motion.button
      onClick={onClick}
      disabled={isFull}
      className={cn(
        'w-full text-left group relative',
        'bg-card/80 backdrop-blur-sm rounded-lg border border-border/50',
        'border-l-4',
        getBorderColor(item.type),
        'transition-all duration-200',
        'hover:shadow-md hover:border-border',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        isFull && 'opacity-60 cursor-not-allowed'
      )}
      whileHover={!isFull ? { scale: 1.01, y: -2 } : undefined}
      whileTap={!isFull ? { scale: 0.99 } : undefined}
    >
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Time and Title */}
          <div className="flex-1 min-w-0">
            {/* Time */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{formatTime(item.time_start)}</span>
              <span className="text-muted-foreground/60">-</span>
              <span>{formatTime(item.time_end)}</span>
            </div>

            {/* Title */}
            <h3 className={cn(
              'font-serif font-semibold text-foreground truncate',
              'group-hover:text-primary transition-colors'
            )}>
              {item.title}
            </h3>

            {/* Price (optional) */}
            {item.price && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.price} Kč
              </p>
            )}
          </div>

          {/* Right side: Badge and Capacity */}
          <div className="flex flex-col items-end gap-2">
            {/* Type badge */}
            {badgeStyles && (
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                badgeStyles
              )}>
                {item.type === 'workshop' && <Sparkles className="w-3 h-3" />}
                {getLessonTypeLabel(item.type)}
              </span>
            )}

            {/* Capacity */}
            <div className={cn(
              'flex items-center gap-1.5 text-sm',
              isFull ? 'text-muted-foreground' : isAlmostFull ? 'text-amber-600' : 'text-muted-foreground'
            )}>
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium">
                {isFull ? (
                  'Obsazeno'
                ) : (
                  <>
                    <span className={isAlmostFull ? 'text-amber-600' : 'text-foreground'}>
                      {spotsRemaining}
                    </span>
                    {' z '}
                    {item.capacity}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-3 h-1 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isFull
                ? 'bg-muted-foreground/40'
                : isAlmostFull
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-primary/60 to-primary'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Hover indicator */}
      {!isFull && (
        <div className={cn(
          'absolute inset-0 rounded-lg pointer-events-none',
          'bg-gradient-to-r from-transparent via-transparent to-primary/5',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )} />
      )}
    </motion.button>
  )
}

export default LessonCard
