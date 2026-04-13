import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Staff } from '@/types'

export const staffKeys = {
  all:    () => ['staff'] as const,
  list:   () => [...staffKeys.all(), 'list'] as const,
  detail: (id: string) => [...staffKeys.all(), 'detail', id] as const,
}

export function useStaff() {
  return useQuery({
    queryKey: staffKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('active', true)
        .order('name')
      if (error) throw error
      return data as Staff[]
    },
  })
}

export function useAllStaff() {
  return useQuery({
    queryKey: [...staffKeys.all(), 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name')
      if (error) throw error
      return data as Staff[]
    },
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<Staff, 'id'>) => {
      const { data, error } = await supabase
        .from('staff')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Staff
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all() }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Staff> & { id: string }) => {
      const { data, error } = await supabase
        .from('staff')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Staff
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all() }),
  })
}
