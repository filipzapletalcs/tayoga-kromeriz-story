import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Loader2, Info } from 'lucide-react'
import { startOfMonth, endOfMonth, startOfDay, addMonths, subMonths, isSameMonth, max } from 'date-fns'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useScheduleData, FilterType } from '@/hooks/useScheduleData'
import type { ScheduleItem } from '@/types/database'
import ScheduleFilters from './ScheduleFilters'
import DaySection from './DaySection'
import LessonDetailModal from './LessonDetailModal'
import MonthNavigation from './MonthNavigation'

const ScheduleCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Calculate date range for the month
  // For current month, start from today; for future months, start from 1st
  const today = startOfDay(new Date())
  const monthStart = startOfMonth(currentMonth)
  const startDate = max([monthStart, today])
  const endDate = endOfMonth(currentMonth)

  const { data: scheduleData, isLoading, error } = useScheduleData(startDate, endDate, filter)

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const goToToday = () => setCurrentMonth(startOfMonth(new Date()))

  const canGoPrevious = !isSameMonth(currentMonth, new Date())

  const handleSelectItem = (item: ScheduleItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      // Delay clearing selected item to allow animation
      setTimeout(() => setSelectedItem(null), 200)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Načítám rozvrh...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertDescription>
          Nepodařilo se načíst data. Zkuste to prosím později.
        </AlertDescription>
      </Alert>
    )
  }

  // Empty state
  const hasData = scheduleData && scheduleData.length > 0

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Month Navigation */}
      <MonthNavigation
        currentMonth={currentMonth}
        onPreviousMonth={canGoPrevious ? goToPreviousMonth : () => {}}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {/* Filters */}
      <ScheduleFilters
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Schedule content */}
      {!hasData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            Žádné nadcházející termíny
          </h3>
          <p className="text-muted-foreground mb-6">
            {filter !== 'all'
              ? 'Pro tento typ lekcí nejsou naplánovány žádné termíny.'
              : 'Momentálně nejsou naplánovány žádné lekce ani workshopy.'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-primary hover:underline"
            >
              Zobrazit všechny typy
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-2">
          {scheduleData.map((day, index) => (
            <DaySection
              key={day.date.toISOString()}
              date={day.date}
              items={day.items}
              onSelectItem={handleSelectItem}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Info section */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Alert className="bg-accent/20 border-accent/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-foreground">
              <strong>Důležité informace:</strong> Rezervace je závazná.
              V případě, že se nemůžete zúčastnit, kontaktujte nás prosím
              telefonicky nebo emailem minimálně 24 hodin předem.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Detail Modal */}
      <LessonDetailModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}

export default ScheduleCalendar
