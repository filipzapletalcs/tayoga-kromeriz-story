import React from 'react'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface InlineDatePickerProps {
  value: string // YYYY-MM-DD format
  onChange: (date: string) => void
  minDate?: Date
  maxDate?: Date
  label?: string
  error?: string
  className?: string
}

const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  error,
  className,
}) => {
  // Parse the string value to Date for the Calendar component
  const selectedDate = value ? new Date(value + 'T00:00:00') : undefined

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format to YYYY-MM-DD
      const formatted = format(date, 'yyyy-MM-dd')
      onChange(formatted)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-sm font-medium">{label}</Label>
      )}
      <div className={cn(
        'rounded-lg border bg-card/50 p-2',
        error ? 'border-destructive' : 'border-border/50'
      )}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
          locale={cs}
          className="mx-auto"
        />
      </div>
      {selectedDate && (
        <p className="text-sm text-muted-foreground text-center">
          Vybráno: <span className="font-medium text-foreground">
            {format(selectedDate, 'EEEE d. MMMM yyyy', { locale: cs })}
          </span>
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export default InlineDatePicker
