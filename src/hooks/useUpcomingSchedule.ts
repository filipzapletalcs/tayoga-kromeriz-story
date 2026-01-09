import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { RecurringClass, ScheduleItem, Workshop, OneTimeClass } from '@/types/database'
import { addDays, addMonths, format, startOfDay, getDay, parseISO } from 'date-fns'

// Day slot for weekly schedule display
export interface WeeklySlot {
  time: string
  label: string
  recurringClass: RecurringClass
}

export interface WeekDay {
  day: string
  dayOfWeek: number
  slots: WeeklySlot[]
}

// Data structure for calendar and lesson lookup
export interface UpcomingScheduleData {
  // For left panel - weekly schedule
  weeklySchedule: WeekDay[]
  // For calendar - map of date string to lessons
  lessonsByDate: Map<string, ScheduleItem[]>
  // All dates that have lessons (for calendar highlighting)
  lessonDates: Date[]
  // Loading and error states
  isLoading: boolean
  error: Error | null
}

const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']

// Generate dates for a recurring class within a date range
function generateRecurringDates(
  dayOfWeek: number,
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = []
  let current = startOfDay(startDate)

  // Find first occurrence of this day of week
  while (getDay(current) !== dayOfWeek) {
    current = addDays(current, 1)
  }

  // Generate all occurrences until end date
  while (current <= endDate) {
    dates.push(new Date(current))
    current = addDays(current, 7)
  }

  return dates
}

// Format time for display (HH:mm - HH:mm)
function formatTimeRange(start: string, end: string): string {
  const formatTime = (t: string) => t.substring(0, 5)
  return `${formatTime(start)} - ${formatTime(end)}`
}

export function useUpcomingSchedule(monthsAhead: number = 6): UpcomingScheduleData {
  const today = startOfDay(new Date())
  const endDate = addMonths(today, monthsAhead)

  const { data, isLoading, error } = useQuery({
    queryKey: ['upcoming-schedule', format(today, 'yyyy-MM-dd'), monthsAhead],
    queryFn: async () => {
      // Fetch all active recurring classes
      const { data: recurringClasses, error: recurringError } = await supabase
        .from('recurring_classes')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week')
        .order('time_start')

      if (recurringError) throw recurringError

      // Fetch workshops in date range
      const { data: workshops, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date')

      if (workshopError) throw workshopError

      // Fetch one-time classes in date range
      const { data: oneTimeClasses, error: oneTimeError } = await supabase
        .from('one_time_classes')
        .select('*')
        .eq('is_active', true)
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date')

      if (oneTimeError) throw oneTimeError

      return {
        recurringClasses: recurringClasses || [],
        workshops: workshops || [],
        oneTimeClasses: oneTimeClasses || [],
      }
    },
    staleTime: 60000, // 1 minute
  })

  // Build weekly schedule for left panel
  const weeklySchedule: WeekDay[] = []

  // Days Monday to Friday (1-5)
  for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
    const dayClasses = data?.recurringClasses?.filter(c => c.day_of_week === dayOfWeek) || []

    weeklySchedule.push({
      day: DAY_NAMES[dayOfWeek],
      dayOfWeek,
      slots: dayClasses.map(c => ({
        time: formatTimeRange(c.time_start, c.time_end),
        label: c.title,
        recurringClass: c,
      })),
    })
  }

  // Build lessons by date map
  const lessonsByDate = new Map<string, ScheduleItem[]>()
  const allDates: Date[] = []

  if (data?.recurringClasses) {
    for (const rc of data.recurringClasses) {
      const dates = generateRecurringDates(rc.day_of_week, today, endDate)

      for (const date of dates) {
        const dateKey = format(date, 'yyyy-MM-dd')
        const existing = lessonsByDate.get(dateKey) || []

        existing.push({
          id: `recurring-pending-${rc.id}-${dateKey}`,
          type: 'recurring',
          title: rc.title,
          description: rc.description,
          date,
          time_start: rc.time_start,
          time_end: rc.time_end,
          capacity: rc.capacity,
          registeredCount: 0, // Will be loaded when clicked
          price: rc.price,
          recurringClass: rc,
        })

        lessonsByDate.set(dateKey, existing)
        allDates.push(date)
      }
    }
  }

  // Add workshops
  if (data?.workshops) {
    for (const workshop of data.workshops) {
      const date = parseISO(workshop.date)
      const dateKey = workshop.date
      const existing = lessonsByDate.get(dateKey) || []

      existing.push({
        id: `workshop-${workshop.id}`,
        type: 'workshop',
        title: workshop.title,
        description: workshop.description,
        date,
        time_start: workshop.time_start,
        time_end: workshop.time_end,
        capacity: workshop.capacity,
        registeredCount: 0,
        price: workshop.price,
        workshop,
      })

      lessonsByDate.set(dateKey, existing)
      allDates.push(date)
    }
  }

  // Add one-time classes
  if (data?.oneTimeClasses) {
    for (const otc of data.oneTimeClasses) {
      const date = parseISO(otc.date)
      const dateKey = otc.date
      const existing = lessonsByDate.get(dateKey) || []

      existing.push({
        id: `one_time-${otc.id}`,
        type: 'one_time',
        title: otc.title,
        description: otc.description,
        date,
        time_start: otc.time_start,
        time_end: otc.time_end,
        capacity: otc.capacity,
        registeredCount: 0,
        price: otc.price,
        oneTimeClass: otc,
      })

      lessonsByDate.set(dateKey, existing)
      allDates.push(date)
    }
  }

  // Sort items within each day by time
  for (const [dateKey, items] of lessonsByDate) {
    items.sort((a, b) => a.time_start.localeCompare(b.time_start))
    lessonsByDate.set(dateKey, items)
  }

  return {
    weeklySchedule,
    lessonsByDate,
    lessonDates: allDates,
    isLoading,
    error: error as Error | null,
  }
}

// Helper to get full lesson details with registration count
export async function getLessonWithRegistrations(item: ScheduleItem): Promise<ScheduleItem> {
  if (item.type === 'recurring' && item.recurringClass) {
    const dateStr = format(item.date, 'yyyy-MM-dd')

    // Get or create class instance
    const { data: instanceId, error: rpcError } = await supabase
      .rpc('get_or_create_class_instance', {
        p_recurring_class_id: item.recurringClass.id,
        p_date: dateStr
      })

    if (rpcError) throw rpcError

    // Fetch the instance
    const { data: instance } = await supabase
      .from('class_instances')
      .select('*')
      .eq('id', instanceId)
      .maybeSingle()

    if (instance?.is_cancelled) {
      throw new Error('Tato lekce byla zrušena')
    }

    // Get registration count
    const { data: count } = await supabase
      .rpc('get_registration_count', { instance_id: instanceId })

    const reservedSpots = item.recurringClass.reserved_spots || 0

    return {
      ...item,
      id: `recurring-${instanceId}`,
      capacity: instance?.capacity_override ?? item.recurringClass.capacity,
      registeredCount: (count || 0) + reservedSpots,
      classInstance: instance,
    }
  }

  if (item.type === 'workshop' && item.workshop) {
    const { data: count } = await supabase
      .rpc('get_workshop_registration_count', { p_workshop_id: item.workshop.id })

    const reservedSpots = item.workshop.reserved_spots || 0

    return {
      ...item,
      registeredCount: (count || 0) + reservedSpots,
    }
  }

  if (item.type === 'one_time' && item.oneTimeClass) {
    const { data: count } = await supabase
      .rpc('get_one_time_class_registration_count', { p_class_id: item.oneTimeClass.id })

    const reservedSpots = item.oneTimeClass.reserved_spots || 0

    return {
      ...item,
      registeredCount: (count || 0) + reservedSpots,
    }
  }

  return item
}
