import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, CalendarCheck, Sparkles, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterType } from '@/hooks/useScheduleData'

interface FilterOption {
  value: FilterType
  label: string
  icon: React.ReactNode
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'Vše', icon: <LayoutGrid className="w-4 h-4" /> },
  { value: 'recurring', label: 'Pravidelné', icon: <Calendar className="w-4 h-4" /> },
  { value: 'one_time', label: 'Jednorázové', icon: <CalendarCheck className="w-4 h-4" /> },
  { value: 'workshop', label: 'Workshopy', icon: <Sparkles className="w-4 h-4" /> },
]

interface ScheduleFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.value

        return (
          <motion.button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-full',
              'text-sm font-medium transition-colors duration-200',
              'border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card/50 text-muted-foreground border-border/50 hover:bg-card hover:border-border hover:text-foreground'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.icon}
            <span>{option.label}</span>

            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                layoutId="activeFilterIndicator"
                className="absolute inset-0 rounded-full bg-primary -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default ScheduleFilters
