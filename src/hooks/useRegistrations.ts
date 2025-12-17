import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Registration, RegistrationInsert } from '@/types/database'

// Types for joined queries
interface ClassRegistrationWithDetails {
  id: string
  email: string
  name: string
  phone: string | null
  note: string | null
  created_at: string | null
  class_instance_id: string | null
  workshop_id: string | null
  class_instances: {
    date: string
    recurring_classes: {
      title: string
      time_start: string
    } | null
  } | null
}

interface WorkshopRegistrationWithDetails {
  id: string
  email: string
  name: string
  phone: string | null
  note: string | null
  created_at: string | null
  class_instance_id: string | null
  workshop_id: string | null
  workshops: {
    title: string
    date: string
    time_start: string
  } | null
}

export interface FormattedRegistration {
  id: string
  email: string
  name: string
  phone: string | null
  note: string | null
  created_at: string | null
  type: 'class' | 'workshop'
  eventTitle: string
  eventDate: string | undefined
  eventTime: string | undefined
}

export interface Visitor {
  email: string
  name: string
  phone: string | null
  registrations: Array<{
    id: string
    type: 'class' | 'workshop'
    title: string
    date: string
    createdAt: string
  }>
  firstVisit: string
  lastVisit: string
  totalVisits: number
}

// Create a new registration
export function useCreateRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (registration: RegistrationInsert) => {
      // First check if there's capacity
      const { data: hasCapacity, error: capError } = await supabase
        .rpc('check_capacity', { instance_id: registration.class_instance_id! })

      if (capError) throw capError
      if (!hasCapacity) {
        throw new Error('Lekce je již plně obsazená')
      }

      // Create registration
      const { data, error } = await supabase
        .from('registrations')
        .insert(registration)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
    },
  })
}

// Get registrations for an instance (admin only)
export function useInstanceRegistrations(instanceId?: string) {
  return useQuery({
    queryKey: ['registrations', instanceId],
    queryFn: async () => {
      if (!instanceId) return []

      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('class_instance_id', instanceId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as Registration[]
    },
    enabled: !!instanceId,
  })
}

// Get all registrations for a date range (admin only)
export function useRegistrationsByDateRange(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['registrations-range', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          class_instances!inner (
            date,
            recurring_class_id,
            recurring_classes (
              title,
              time_start,
              time_end
            )
          )
        `)
        .gte('class_instances.date', startDate)
        .lte('class_instances.date', endDate)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!startDate && !!endDate,
  })
}

// Delete registration (admin only)
export function useDeleteRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-classes'] })
    },
  })
}

// Get registration count for an instance
export function useRegistrationCount(instanceId?: string) {
  return useQuery({
    queryKey: ['registration-count', instanceId],
    queryFn: async () => {
      if (!instanceId) return 0

      const { data, error } = await supabase
        .rpc('get_registration_count', { instance_id: instanceId })

      if (error) throw error
      return data as number
    },
    enabled: !!instanceId,
  })
}

// Get all registrations with related data (admin CRM)
export function useAllRegistrations() {
  return useQuery<FormattedRegistration[]>({
    queryKey: ['all-registrations'],
    queryFn: async () => {
      // Get class registrations
      const { data: classRegs, error: classError } = await supabase
        .from('registrations')
        .select(`
          *,
          class_instances (
            date,
            recurring_classes (
              title,
              time_start
            )
          )
        `)
        .not('class_instance_id', 'is', null)
        .order('created_at', { ascending: false })

      if (classError) throw classError

      // Get workshop registrations
      const { data: workshopRegs, error: workshopError } = await supabase
        .from('registrations')
        .select(`
          *,
          workshops (
            title,
            date,
            time_start
          )
        `)
        .not('workshop_id', 'is', null)
        .order('created_at', { ascending: false })

      if (workshopError) throw workshopError

      // Cast to our types
      const typedClassRegs = classRegs as unknown as ClassRegistrationWithDetails[]
      const typedWorkshopRegs = workshopRegs as unknown as WorkshopRegistrationWithDetails[]

      // Combine and format
      const allRegistrations: FormattedRegistration[] = [
        ...(typedClassRegs || []).map(r => ({
          id: r.id,
          email: r.email,
          name: r.name,
          phone: r.phone,
          note: r.note,
          created_at: r.created_at,
          type: 'class' as const,
          eventTitle: r.class_instances?.recurring_classes?.title || 'Neznámá lekce',
          eventDate: r.class_instances?.date,
          eventTime: r.class_instances?.recurring_classes?.time_start,
        })),
        ...(typedWorkshopRegs || []).map(r => ({
          id: r.id,
          email: r.email,
          name: r.name,
          phone: r.phone,
          note: r.note,
          created_at: r.created_at,
          type: 'workshop' as const,
          eventTitle: r.workshops?.title || 'Neznámý workshop',
          eventDate: r.workshops?.date,
          eventTime: r.workshops?.time_start,
        })),
      ].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())

      return allRegistrations
    },
  })
}

// Get unique visitors grouped by email
export function useVisitors() {
  return useQuery<Visitor[]>({
    queryKey: ['visitors'],
    queryFn: async () => {
      // Get all registrations
      const { data: classRegs, error: classError } = await supabase
        .from('registrations')
        .select(`
          *,
          class_instances (
            date,
            recurring_classes (
              title
            )
          )
        `)
        .not('class_instance_id', 'is', null)

      if (classError) throw classError

      const { data: workshopRegs, error: workshopError } = await supabase
        .from('registrations')
        .select(`
          *,
          workshops (
            title,
            date
          )
        `)
        .not('workshop_id', 'is', null)

      if (workshopError) throw workshopError

      // Cast to our types
      const typedClassRegs = classRegs as unknown as ClassRegistrationWithDetails[]
      const typedWorkshopRegs = workshopRegs as unknown as WorkshopRegistrationWithDetails[]

      // Group by email
      const visitorsMap = new Map<string, Visitor>()

      // Process class registrations
      for (const reg of typedClassRegs || []) {
        const existing = visitorsMap.get(reg.email)
        const regData = {
          id: reg.id,
          type: 'class' as const,
          title: reg.class_instances?.recurring_classes?.title || 'Neznámá lekce',
          date: reg.class_instances?.date || '',
          createdAt: reg.created_at || '',
        }

        if (existing) {
          existing.registrations.push(regData)
          existing.totalVisits++
          if (reg.name) existing.name = reg.name
          if (reg.phone) existing.phone = reg.phone
          if (reg.created_at && reg.created_at < existing.firstVisit) {
            existing.firstVisit = reg.created_at
          }
          if (reg.created_at && reg.created_at > existing.lastVisit) {
            existing.lastVisit = reg.created_at
          }
        } else {
          visitorsMap.set(reg.email, {
            email: reg.email,
            name: reg.name,
            phone: reg.phone,
            registrations: [regData],
            firstVisit: reg.created_at || '',
            lastVisit: reg.created_at || '',
            totalVisits: 1,
          })
        }
      }

      // Process workshop registrations
      for (const reg of typedWorkshopRegs || []) {
        const existing = visitorsMap.get(reg.email)
        const regData = {
          id: reg.id,
          type: 'workshop' as const,
          title: reg.workshops?.title || 'Neznámý workshop',
          date: reg.workshops?.date || '',
          createdAt: reg.created_at || '',
        }

        if (existing) {
          existing.registrations.push(regData)
          existing.totalVisits++
          if (reg.name) existing.name = reg.name
          if (reg.phone) existing.phone = reg.phone
          if (reg.created_at && reg.created_at < existing.firstVisit) {
            existing.firstVisit = reg.created_at
          }
          if (reg.created_at && reg.created_at > existing.lastVisit) {
            existing.lastVisit = reg.created_at
          }
        } else {
          visitorsMap.set(reg.email, {
            email: reg.email,
            name: reg.name,
            phone: reg.phone,
            registrations: [regData],
            firstVisit: reg.created_at || '',
            lastVisit: reg.created_at || '',
            totalVisits: 1,
          })
        }
      }

      // Convert to array and sort by last visit
      return Array.from(visitorsMap.values())
        .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    },
  })
}
