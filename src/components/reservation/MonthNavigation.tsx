import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { format, isSameMonth } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MonthNavigationProps {
  currentMonth: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}) => {
  const isCurrentMonth = isSameMonth(currentMonth, new Date())
  const monthName = format(currentMonth, 'LLLL yyyy', { locale: cs })
  // Capitalize first letter
  const monthNameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1)

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Previous button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        disabled={isCurrentMonth}
        className={cn(
          'h-10 w-10 rounded-full transition-all',
          isCurrentMonth
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-primary/10 hover:text-primary'
        )}
        aria-label="Předchozí měsíc"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Month name with animation */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          <motion.h2
            key={monthNameCapitalized}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-xl md:text-2xl font-serif font-semibold text-foreground text-center"
          >
            {monthNameCapitalized}
          </motion.h2>
        </AnimatePresence>

        {/* Today button - only visible when not on current month */}
        <AnimatePresence>
          {!isCurrentMonth && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onToday}
                className="h-8 px-3 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
              >
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Dnes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
        aria-label="Další měsíc"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default MonthNavigation
