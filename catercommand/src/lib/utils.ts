import { format, parseISO } from 'date-fns'
import type { Event } from '@/types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), fmt)
  } catch {
    return dateString
  }
}

export function getStatusColor(status: Event['status']): string {
  const map: Record<Event['status'], string> = {
    inquiry:   'bg-gray-100 text-gray-700',
    quoted:    'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-700'
}

export function calcMarginColor(costPerHead: number, pricePerHead: number): string {
  if (pricePerHead === 0) return 'text-red-600'
  const margin = ((pricePerHead - costPerHead) / pricePerHead) * 100
  if (margin >= 30) return 'text-green-600'
  if (margin >= 15) return 'text-yellow-600'
  return 'text-red-600'
}

export function calcMarginPct(costPerHead: number, pricePerHead: number): number {
  if (pricePerHead === 0) return 0
  return ((pricePerHead - costPerHead) / pricePerHead) * 100
}

export function calcOutstandingBalance(totalQuoted: number, payments: { amount: number }[]): number {
  const paid = payments.reduce((sum, p) => sum + p.amount, 0)
  return totalQuoted - paid
}
