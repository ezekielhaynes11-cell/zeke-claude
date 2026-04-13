import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { EventStaff } from '@/types'

export const eventStaffKeys = {
  all:         () => ['event_staff'] as const,
  byEvent:     (eventId: string) => [...eventStaffKeys.all(), 'event', eventId] as const,
}

export function useEventStaff(eventId: string) {
  return useQuery({
    queryKey: eventStaffKeys.byEvent(eventId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_staff')
        .select('*, staff(*)')
        .eq('event_id', eventId)
        .order('call_time')
      if (error) throw error
      return data as EventStaff[]
    },
    enabled: !!eventId,
  })
}

export function useAssignStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<EventStaff, 'id' | 'staff'>) => {
      const { data, error } = await supabase
        .from('event_staff')
        .insert(payload)
        .select('*, staff(*)')
        .single()
      if (error) throw error
      return data as EventStaff
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: eventStaffKeys.byEvent(result.event_id) })
    },
  })
}

export function useUpdateEventStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<EventStaff> & { id: string; event_id: string }) => {
      const { data, error } = await supabase
        .from('event_staff')
        .update(payload)
        .eq('id', id)
        .select('*, staff(*)')
        .single()
      if (error) throw error
      return data as EventStaff
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: eventStaffKeys.byEvent(result.event_id) })
    },
  })
}

export function useRemoveEventStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from('event_staff')
        .delete()
        .eq('id', id)
      if (error) throw error
      return { eventId }
    },
    onSuccess: ({ eventId }) => {
      qc.invalidateQueries({ queryKey: eventStaffKeys.byEvent(eventId) })
    },
  })
}
