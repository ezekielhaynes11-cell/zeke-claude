export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  notes?: string
  referral_source?: string
  last_event_date?: string
  created_at: string
}

export interface Event {
  id: string
  client_id?: string
  client?: Client
  event_name: string
  event_type?: string
  event_date: string
  start_time?: string
  end_time?: string
  venue?: string
  venue_address?: string
  guest_count: number
  status: 'inquiry' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  total_quoted: number
  deposit_amount: number
  deposit_paid: boolean
  balance_due: number
  balance_paid: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  name: string
  category?: string
  description?: string
  cost_per_head: number
  price_per_head: number
  dietary_tags: string[]
  active: boolean
}

export interface Staff {
  id: string
  name: string
  phone?: string
  email?: string
  role?: string
  hourly_rate?: number
  notes?: string
  active: boolean
}

export interface EventStaff {
  id: string
  event_id: string
  staff_id: string
  staff?: Staff
  role?: string
  call_time?: string
  hours_scheduled?: number
  assignment_notes?: string
  confirmed: boolean
}

export interface QuoteLineItem {
  name: string
  qty: number
  unit_price: number
  total: number
}

export interface Quote {
  id: string
  event_id: string
  line_items: QuoteLineItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes?: string
  sent_at?: string
  viewed_at?: string
  accepted_at?: string
}

export interface Payment {
  id: string
  event_id: string
  type: 'deposit' | 'balance' | 'partial'
  amount: number
  method?: string
  notes?: string
  paid_at: string
}
