import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  RecurringClass,
  RecurringClassInsert,
  RecurringClassUpdate,
  ClassInstance,
  ClassInstanceInsert,
  PublicClassSchedule
} from '@/types/database'
import { addDays, format, startOfDay, getDay } from 'date-fns'

// Fetch all recurring classes (for admin)
export function useRecurringClasses() {
  return useQuery({
    queryKey: ['recurring-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_classes')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) throw error
      return data as RecurringClass[]
    },
  })
}

// Fetch active recurring classes (for public)
export function useActiveClasses() {
  return useQuery({
    queryKey: ['active-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_classes')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) throw error
      return data as RecurringClass[]
    },
  })
}

// Generate upcoming class instances for next N days
export function useUpcomingClasses(days: number = 14) {
  return useQuery({
    queryKey: ['upcoming-classes', days],
    queryFn: async () => {
      // Get active recurring classes
      const { data: classes, error: classError } = await supabase
        .from('recurring_classes')
        .select('*')
        .eq('is_active', true)

      if (classError) throw classError
      if (!classes?.length) return []

      const today = startOfDay(new Date())
      const upcomingDates: { class: RecurringClass; date: Date }[] = []

      // Generate dates for each class
      for (let i = 0; i < days; i++) {
        const date = addDays(today, i)
        const dayOfWeek = getDay(date)

        const matchingClasses = classes.filter(c => c.day_of_week === dayOfWeek)
        matchingClasses.forEach(c => {
          upcomingDates.push({ class: c, date })
        })
      }

      // Sort by date and time
      upcomingDates.sort((a, b) => {
        const dateCompare = a.date.getTime() - b.date.getTime()
        if (dateCompare !== 0) return dateCompare
        return a.class.time_start.localeCompare(b.class.time_start)
      })

      // Get or create instances for these dates
      const instances = await Promise.all(
        upcomingDates.map(async ({ class: c, date }) => {
          const dateStr = format(date, 'yyyy-MM-dd')

          // Check if instance exists
          const { data: existing } = await supabase
            .from('class_instances')
            .select('*')
            .eq('recurring_class_id', c.id)
            .eq('date', dateStr)
            .single()

          if (existing) {
            // Get registration count
            const { data: countData } = await supabase
              .rpc('get_registration_count', { instance_id: existing.id })

            return {
              instance: existing as ClassInstance,
              class: c,
              date,
              registeredCount: countData || 0,
            }
          }

          // Create new instance
          const { data: newInstance, error: insertError } = await supabase
            .from('class_instances')
            .insert({ recurring_class_id: c.id, date: dateStr })
            .select()
            .single()

          if (insertError) {
            // Instance might have been created by another request
            const { data: retry } = await supabase
              .from('class_instances')
              .select('*')
              .eq('recurring_class_id', c.id)
              .eq('date', dateStr)
              .single()

            return {
              instance: retry as ClassInstance,
              class: c,
              date,
              registeredCount: 0,
            }
          }

          return {
            instance: newInstance as ClassInstance,
            class: c,
            date,
            registeredCount: 0,
          }
        })
      )

      // Filter out cancelled instances
      return instances.filter(i => i.instance && !i.instance.is_cancelled)
    },
    staleTime: 30000, // 30 seconds
  })
}

// Create recurring class
export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newClass: RecurringClassInsert) => {
      const { data, error } = await supabase
        .from('recurring_classes')
        .insert(newClass)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-classes'] })
      queryClient.invalidateQueries({ queryKey: ['active-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
    },
  })
}

// Update recurring class
export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RecurringClassUpdate }) => {
      const { data, error } = await supabase
        .from('recurring_classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-classes'] })
      queryClient.invalidateQueries({ queryKey: ['active-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
    },
  })
}

// Delete recurring class
export function useDeleteClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recurring_classes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-classes'] })
      queryClient.invalidateQueries({ queryKey: ['active-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
    },
  })
}

// Cancel class instance
export function useCancelInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, cancelled }: { id: string; cancelled: boolean }) => {
      const { data, error } = await supabase
        .from('class_instances')
        .update({ is_cancelled: cancelled })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
      queryClient.invalidateQueries({ queryKey: ['class-instances'] })
    },
  })
}

// Get class instances for a recurring class (for admin calendar)
export function useClassInstances(recurringClassId?: string, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['class-instances', recurringClassId, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('class_instances')
        .select(`
          *,
          recurring_classes (*),
          registrations (*)
        `)

      if (recurringClassId) {
        query = query.eq('recurring_class_id', recurringClassId)
      }

      if (startDate) {
        query = query.gte('date', format(startDate, 'yyyy-MM-dd'))
      }

      if (endDate) {
        query = query.lte('date', format(endDate, 'yyyy-MM-dd'))
      }

      query = query.order('date', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return data
    },
    enabled: true,
  })
}
