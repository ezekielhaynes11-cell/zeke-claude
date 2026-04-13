import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

export const eventKeys = {
  all:    () => ['events'] as const,
  list:   (status?: Event['status']) => [...eventKeys.all(), 'list', status ?? 'all'] as const,
  detail: (id: string) => [...eventKeys.all(), 'detail', id] as const,
}

export function useEvents(status?: Event['status']) {
  return useQuery({
    queryKey: eventKeys.list(status),
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*, client:clients(id, name)')
        .order('event_date', { ascending: true })
      if (status) query = query.eq('status', status)
      const { data, error } = await query
      if (error) throw error
      return data as Event[]
    },
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, client:clients(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Event
    },
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Event
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all() }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Event
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: eventKeys.all() })
      qc.invalidateQueries({ queryKey: eventKeys.detail(updated.id) })
    },
  })
}
