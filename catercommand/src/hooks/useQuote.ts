import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Quote } from '@/types'

export const quoteKeys = {
  all:     () => ['quotes'] as const,
  byEvent: (eventId: string) => [...quoteKeys.all(), 'event', eventId] as const,
}

export function useQuote(eventId: string) {
  return useQuery({
    queryKey: quoteKeys.byEvent(eventId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('event_id', eventId)
        .maybeSingle()
      if (error) throw error
      return data as Quote | null
    },
    enabled: !!eventId,
  })
}

export function useSaveQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<Quote, 'id'>) => {
      const { data, error } = await supabase
        .from('quotes')
        .upsert(payload, { onConflict: 'event_id' })
        .select()
        .single()
      if (error) throw error
      return data as Quote
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: quoteKeys.byEvent(result.event_id) })
    },
  })
}
