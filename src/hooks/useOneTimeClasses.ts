import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { OneTimeClass, OneTimeClassInsert, OneTimeClassUpdate } from '@/types/database'
import { format, startOfDay } from 'date-fns'

// Fetch all one-time classes (for admin)
export function useOneTimeClasses() {
  return useQuery({
    queryKey: ['one-time-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('one_time_classes')
        .select('*')
        .order('date', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) throw error
      return data as OneTimeClass[]
    },
  })
}

// Fetch upcoming active one-time classes (for public)
export function useUpcomingOneTimeClasses() {
  return useQuery({
    queryKey: ['upcoming-one-time-classes'],
    queryFn: async () => {
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd')

      const { data: classes, error: classError } = await supabase
        .from('one_time_classes')
        .select('*')
        .eq('is_active', true)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time_start', { ascending: true })

      if (classError) throw classError
      if (!classes?.length) return []

      // Get registration counts for each class (including reserved_spots)
      const classesWithCounts = await Promise.all(
        classes.map(async (oneTimeClass) => {
          const { data: countData } = await supabase
            .rpc('get_one_time_class_registration_count', { p_class_id: oneTimeClass.id })

          const onlineRegistrations = countData || 0
          const reservedSpots = (oneTimeClass as { reserved_spots?: number }).reserved_spots || 0

          return {
            oneTimeClass,
            date: new Date(oneTimeClass.date),
            registeredCount: onlineRegistrations + reservedSpots,
          }
        })
      )

      return classesWithCounts
    },
    staleTime: 30000,
  })
}

// Create one-time class
export function useCreateOneTimeClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newClass: OneTimeClassInsert) => {
      const { data, error } = await supabase
        .from('one_time_classes')
        .insert(newClass)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
    },
  })
}

// Update one-time class
export function useUpdateOneTimeClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OneTimeClassUpdate }) => {
      const { data, error } = await supabase
        .from('one_time_classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
    },
  })
}

// Delete one-time class
export function useDeleteOneTimeClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('one_time_classes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-one-time-classes'] })
      queryClient.invalidateQueries({ queryKey: ['schedule-data'] })
    },
  })
}

// Fetch all one-time classes with registration counts (for admin)
export interface OneTimeClassWithCount extends OneTimeClass {
  registeredCount: number
}

export function useOneTimeClassesWithCounts() {
  return useQuery({
    queryKey: ['one-time-classes-with-counts'],
    queryFn: async () => {
      const { data: classes, error } = await supabase
        .from('one_time_classes')
        .select('*')
        .order('date', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) throw error
      if (!classes?.length) return []

      // Get registration counts for each class
      const classesWithCounts = await Promise.all(
        classes.map(async (oneTimeClass) => {
          const { data: countData } = await supabase
            .rpc('get_one_time_class_registration_count', { p_class_id: oneTimeClass.id })

          return {
            ...oneTimeClass,
            registeredCount: countData || 0,
          } as OneTimeClassWithCount
        })
      )

      return classesWithCounts
    },
    staleTime: 10000,
  })
}
