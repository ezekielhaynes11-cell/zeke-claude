import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MenuItem } from '@/types'

export const menuItemKeys = {
  all:    () => ['menu_items'] as const,
  list:   (activeOnly?: boolean) => [...menuItemKeys.all(), 'list', activeOnly ?? true] as const,
  detail: (id: string) => [...menuItemKeys.all(), 'detail', id] as const,
}

export function useMenuItems(activeOnly = true) {
  return useQuery({
    queryKey: menuItemKeys.list(activeOnly),
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name')
      if (activeOnly) query = query.eq('active', true)
      const { data, error } = await query
      if (error) throw error
      return data as MenuItem[]
    },
  })
}

export function useCreateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<MenuItem, 'id'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as MenuItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: menuItemKeys.all() }),
  })
}

export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as MenuItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: menuItemKeys.all() }),
  })
}
