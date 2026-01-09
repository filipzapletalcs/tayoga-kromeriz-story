import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  dayIndex: number
  dayName: string
  slots: TimeSlot[]
}

const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']

// Format time from "HH:MM:SS" to "H:MM"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${parseInt(hours)}:${minutes}`
}

export function useOpeningHours() {
  return useQuery({
    queryKey: ['opening-hours'],
    queryFn: async (): Promise<DaySchedule[]> => {
      const { data, error } = await supabase
        .from('recurring_classes')
        .select('day_of_week, time_start, time_end')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) throw error

      // Group by day of week (1 = Monday ... 5 = Friday for display)
      // Supabase uses 0 = Sunday, 1 = Monday, etc.
      const dayMap = new Map<number, TimeSlot[]>()

      // Initialize all weekdays (Monday=1 to Friday=5)
      for (let i = 1; i <= 5; i++) {
        dayMap.set(i, [])
      }

      // Fill in the slots from database
      data?.forEach(cls => {
        const slots = dayMap.get(cls.day_of_week) || []
        slots.push({
          start: formatTime(cls.time_start),
          end: formatTime(cls.time_end),
        })
        dayMap.set(cls.day_of_week, slots)
      })

      // Convert to array, ordered Monday to Friday
      const result: DaySchedule[] = []
      for (let i = 1; i <= 5; i++) {
        result.push({
          dayIndex: i,
          dayName: DAY_NAMES[i],
          slots: dayMap.get(i) || [],
        })
      }

      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Format slots for display (e.g., "8:00 - 9:30, 10:00 - 11:30" or "Zavřeno")
export function formatDayHours(slots: TimeSlot[]): string {
  if (slots.length === 0) {
    return 'Zavřeno'
  }
  return slots.map(slot => `${slot.start} - ${slot.end}`).join(', ')
}
