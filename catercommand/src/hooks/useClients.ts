import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/types'

export const clientKeys = {
  all:    () => ['clients'] as const,
  list:   () => [...clientKeys.all(), 'list'] as const,
  detail: (id: string) => [...clientKeys.all(), 'detail', id] as const,
}

export function useClients() {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name')
      if (error) throw error
      return data as Client[]
    },
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*, events(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Client & { events: import('@/types').Event[] }
    },
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<Client, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.list() }),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: clientKeys.list() })
      qc.invalidateQueries({ queryKey: clientKeys.detail(updated.id) })
    },
  })
}
