import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ScheduleItem, LessonType } from '@/types/database'
import { addDays, format, startOfDay, getDay, parseISO, isSameDay, differenceInDays } from 'date-fns'

export type FilterType = 'all' | 'recurring' | 'one_time' | 'workshop'

interface DaySchedule {
  date: Date
  items: ScheduleItem[]
}

export function useScheduleData(startDate: Date, endDate: Date, filter: FilterType = 'all') {
  return useQuery({
    queryKey: ['schedule-data', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), filter],
    queryFn: async (): Promise<DaySchedule[]> => {
      const startDateNormalized = startOfDay(startDate)
      const endDateNormalized = startOfDay(endDate)
      const startDateStr = format(startDateNormalized, 'yyyy-MM-dd')
      const endDateStr = format(endDateNormalized, 'yyyy-MM-dd')
      const days = differenceInDays(endDateNormalized, startDateNormalized) + 1

      const scheduleItems: ScheduleItem[] = []

      // 1. Fetch recurring classes (if filter allows)
      if (filter === 'all' || filter === 'recurring') {
        const { data: recurringClasses, error: recurringError } = await supabase
          .from('recurring_classes')
          .select('*')
          .eq('is_active', true)

        if (recurringError) throw recurringError

        if (recurringClasses?.length) {
          // Generate instances for each day
          for (let i = 0; i < days; i++) {
            const date = addDays(startDateNormalized, i)
            const dayOfWeek = getDay(date)
            const dateStr = format(date, 'yyyy-MM-dd')

            const matchingClasses = recurringClasses.filter(c => c.day_of_week === dayOfWeek)

            for (const recurringClass of matchingClasses) {
              // Check if instance exists
              const { data: existing } = await supabase
                .from('class_instances')
                .select('*')
                .eq('recurring_class_id', recurringClass.id)
                .eq('date', dateStr)
                .single()

              let instance = existing
              let registeredCount = 0

              if (existing) {
                // Skip cancelled instances
                if (existing.is_cancelled) continue

                const { data: countData } = await supabase
                  .rpc('get_registration_count', { instance_id: existing.id })
                registeredCount = countData || 0
              } else {
                // Create new instance using RPC function (SECURITY DEFINER)
                const { data: instanceId, error: rpcError } = await supabase
                  .rpc('get_or_create_class_instance', {
                    p_recurring_class_id: recurringClass.id,
                    p_date: dateStr
                  })

                if (rpcError) {
                  console.error('Error creating class instance:', rpcError)
                  continue
                }

                // Fetch the created instance
                const { data: newInstance } = await supabase
                  .from('class_instances')
                  .select('*')
                  .eq('id', instanceId)
                  .single()

                instance = newInstance
              }

              if (instance) {
                // Include reserved_spots in the registered count for recurring classes
                const reservedSpots = (recurringClass as { reserved_spots?: number }).reserved_spots || 0
                const totalRegistered = registeredCount + reservedSpots

                scheduleItems.push({
                  id: `recurring-${instance.id}`,
                  type: 'recurring',
                  title: recurringClass.title,
                  description: recurringClass.description,
                  date,
                  time_start: recurringClass.time_start,
                  time_end: recurringClass.time_end,
                  capacity: instance.capacity_override ?? recurringClass.capacity,
                  registeredCount: totalRegistered,
                  price: recurringClass.price,
                  recurringClass,
                  classInstance: instance,
                })
              }
            }
          }
        }
      }

      // 2. Fetch one-time classes (if filter allows)
      if (filter === 'all' || filter === 'one_time') {
        const { data: oneTimeClasses, error: oneTimeError } = await supabase
          .from('one_time_classes')
          .select('*')
          .eq('is_active', true)
          .gte('date', startDateStr)
          .lte('date', endDateStr)
          .order('date', { ascending: true })

        if (oneTimeError) throw oneTimeError

        if (oneTimeClasses?.length) {
          for (const oneTimeClass of oneTimeClasses) {
            const { data: countData } = await supabase
              .rpc('get_one_time_class_registration_count', { p_class_id: oneTimeClass.id })

            // Include reserved_spots in the registered count
            const onlineRegistrations = countData || 0
            const reservedSpots = (oneTimeClass as { reserved_spots?: number }).reserved_spots || 0
            const totalRegistered = onlineRegistrations + reservedSpots

            scheduleItems.push({
              id: `one_time-${oneTimeClass.id}`,
              type: 'one_time',
              title: oneTimeClass.title,
              description: oneTimeClass.description,
              date: parseISO(oneTimeClass.date),
              time_start: oneTimeClass.time_start,
              time_end: oneTimeClass.time_end,
              capacity: oneTimeClass.capacity,
              registeredCount: totalRegistered,
              price: oneTimeClass.price,
              oneTimeClass,
            })
          }
        }
      }

      // 3. Fetch workshops (if filter allows)
      if (filter === 'all' || filter === 'workshop') {
        const { data: workshops, error: workshopError } = await supabase
          .from('workshops')
          .select('*')
          .eq('is_active', true)
          .gte('date', startDateStr)
          .lte('date', endDateStr)
          .order('date', { ascending: true })

        if (workshopError) throw workshopError

        if (workshops?.length) {
          for (const workshop of workshops) {
            const { data: countData } = await supabase
              .rpc('get_workshop_registration_count', { p_workshop_id: workshop.id })

            // Include reserved_spots in the registered count for workshops
            const onlineRegistrations = countData || 0
            const reservedSpots = (workshop as { reserved_spots?: number }).reserved_spots || 0
            const totalRegistered = onlineRegistrations + reservedSpots

            scheduleItems.push({
              id: `workshop-${workshop.id}`,
              type: 'workshop',
              title: workshop.title,
              description: workshop.description,
              date: parseISO(workshop.date),
              time_start: workshop.time_start,
              time_end: workshop.time_end,
              capacity: workshop.capacity,
              registeredCount: totalRegistered,
              price: workshop.price,
              workshop,
            })
          }
        }
      }

      // Group by date
      const dateMap = new Map<string, ScheduleItem[]>()

      for (let i = 0; i < days; i++) {
        const date = addDays(startDateNormalized, i)
        const dateKey = format(date, 'yyyy-MM-dd')
        dateMap.set(dateKey, [])
      }

      for (const item of scheduleItems) {
        const dateKey = format(item.date, 'yyyy-MM-dd')
        const existing = dateMap.get(dateKey)
        if (existing) {
          existing.push(item)
        }
      }

      // Sort items within each day by time
      const result: DaySchedule[] = []

      for (let i = 0; i < days; i++) {
        const date = addDays(startDateNormalized, i)
        const dateKey = format(date, 'yyyy-MM-dd')
        const items = dateMap.get(dateKey) || []

        // Sort by time
        items.sort((a, b) => a.time_start.localeCompare(b.time_start))

        // Only include days with items
        if (items.length > 0) {
          result.push({ date, items })
        }
      }

      return result
    },
    staleTime: 30000,
  })
}

// Helper to get lesson type label in Czech
export function getLessonTypeLabel(type: LessonType): string {
  switch (type) {
    case 'recurring':
      return 'Pravidelná'
    case 'one_time':
      return 'Jednorázová'
    case 'workshop':
      return 'Workshop'
  }
}

// Helper to check if a date is today
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}
