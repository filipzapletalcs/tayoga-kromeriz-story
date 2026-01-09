import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Workshop, WorkshopInsert, WorkshopUpdate, Registration } from '@/types/database'
import { sendRegistrationNotification } from '@/lib/notifications'
import { parseISO } from 'date-fns'

// Workshop registration with notification metadata
export interface WorkshopRegistrationParams {
  workshop_id: string
  name: string
  email: string
  phone?: string
  note?: string
  _notification?: {
    lessonTitle: string
    lessonDate: string  // ISO date string
    timeStart: string
    timeEnd: string
    capacity: number
  }
}

// Workshop with registration count
export interface WorkshopWithCount extends Workshop {
  registeredCount: number
}

// Get all workshops (admin)
export function useWorkshops() {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error
      return data as Workshop[]
    },
  })
}

// Get all workshops with registration counts (admin)
export function useWorkshopsWithCounts() {
  return useQuery({
    queryKey: ['workshops-with-counts'],
    queryFn: async () => {
      const { data: workshops, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error

      // Get registration counts for each workshop
      const workshopsWithCounts = await Promise.all(
        (workshops as Workshop[]).map(async (workshop) => {
          const { data: count } = await supabase
            .rpc('get_workshop_registration_count', { p_workshop_id: workshop.id })

          return {
            ...workshop,
            registeredCount: count ?? 0,
          } as WorkshopWithCount
        })
      )

      return workshopsWithCounts
    },
  })
}

// Get upcoming workshops (public)
export function useUpcomingWorkshops() {
  return useQuery({
    queryKey: ['upcoming-workshops'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      const { data: workshops, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .gte('date', today)
        .order('date', { ascending: true })

      if (error) throw error

      // Get registration counts for each workshop
      const workshopsWithCounts = await Promise.all(
        (workshops as Workshop[]).map(async (workshop) => {
          const { data: count } = await supabase
            .rpc('get_workshop_registration_count', { p_workshop_id: workshop.id })

          return {
            workshop,
            registeredCount: count ?? 0,
            date: new Date(workshop.date),
          }
        })
      )

      return workshopsWithCounts
    },
  })
}

// Create workshop
export function useCreateWorkshop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workshop: WorkshopInsert) => {
      const { data, error } = await supabase
        .from('workshops')
        .insert(workshop)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-workshops'] })
    },
  })
}

// Update workshop
export function useUpdateWorkshop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WorkshopUpdate }) => {
      const { data, error } = await supabase
        .from('workshops')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-workshops'] })
    },
  })
}

// Delete workshop
export function useDeleteWorkshop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-workshops'] })
    },
  })
}

// Get registrations for a workshop (admin)
export function useWorkshopRegistrations(workshopId?: string) {
  return useQuery({
    queryKey: ['workshop-registrations', workshopId],
    queryFn: async () => {
      if (!workshopId) return []

      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('workshop_id', workshopId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as Registration[]
    },
    enabled: !!workshopId,
  })
}

// Create workshop registration
export function useCreateWorkshopRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (registration: WorkshopRegistrationParams) => {
      // Extract notification metadata
      const { _notification, ...registrationData } = registration

      // Check capacity first
      const { data: hasCapacity, error: capError } = await supabase
        .rpc('check_workshop_capacity', { p_workshop_id: registrationData.workshop_id })

      if (capError) throw capError
      if (!hasCapacity) {
        throw new Error('Workshop je již plně obsazen')
      }

      // Create registration (no .select() needed - avoids RLS issues for anon users)
      const { error } = await supabase
        .from('registrations')
        .insert({
          workshop_id: registrationData.workshop_id,
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone || null,
          note: registrationData.note || null,
        })

      if (error) throw error

      // Send notification asynchronously (fire-and-forget)
      if (_notification) {
        const { data: count } = await supabase
          .rpc('get_workshop_registration_count', { p_workshop_id: registrationData.workshop_id })

        sendRegistrationNotification({
          lessonType: 'workshop',
          lessonTitle: _notification.lessonTitle,
          lessonDate: parseISO(_notification.lessonDate),
          timeStart: _notification.timeStart,
          timeEnd: _notification.timeEnd,
          participantName: registrationData.name,
          participantEmail: registrationData.email,
          participantPhone: registrationData.phone,
          participantNote: registrationData.note,
          registeredCount: count || 1,
          capacity: _notification.capacity,
        })
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming-workshops'] })
      queryClient.invalidateQueries({ queryKey: ['workshop-registrations'] })
    },
  })
}
