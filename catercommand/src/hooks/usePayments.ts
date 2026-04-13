import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/types'

export const paymentKeys = {
  all:     () => ['payments'] as const,
  byEvent: (eventId: string) => [...paymentKeys.all(), 'event', eventId] as const,
}

export function usePayments(eventId: string) {
  return useQuery({
    queryKey: paymentKeys.byEvent(eventId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('event_id', eventId)
        .order('paid_at', { ascending: false })
      if (error) throw error
      return data as Payment[]
    },
    enabled: !!eventId,
  })
}

export function useAddPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<Payment, 'id'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Payment
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: paymentKeys.byEvent(result.event_id) })
    },
  })
}

export function useDeletePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase.from('payments').delete().eq('id', id)
      if (error) throw error
      return { eventId }
    },
    onSuccess: ({ eventId }) => {
      qc.invalidateQueries({ queryKey: paymentKeys.byEvent(eventId) })
    },
  })
}
