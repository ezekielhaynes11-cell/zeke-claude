import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useQuote } from '@/hooks/useQuote'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'

interface Props {
  eventId: string
  guestCount: number
}

export function EventQuoteTab({ eventId, guestCount }: Props) {
  const { data: quote, isLoading } = useQuote(eventId)

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Quote Summary</h2>
        <Link to={`/events/${eventId}/quote`}>
          <Button size="sm" variant="secondary">
            <ExternalLink className="h-4 w-4" />
            {quote ? 'Edit Quote' : 'Build Quote'}
          </Button>
        </Link>
      </div>

      {!quote ? (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">No quote built yet.</p>
          <Link to={`/events/${eventId}/quote`} className="text-sky-600 text-sm hover:underline mt-1 inline-block">
            Open Quote Builder →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Financials</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium">{formatCurrency(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Tax ({(quote.tax_rate * 100).toFixed(1)}%)</dt>
                <dd className="font-medium">{formatCurrency(quote.tax_amount)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold text-base">
                <dt>Total</dt>
                <dd>{formatCurrency(quote.total)}</dd>
              </div>
              {guestCount > 0 && (
                <div className="flex justify-between text-gray-400 text-xs pt-1">
                  <dt>Per Person</dt>
                  <dd>{formatCurrency(quote.total / guestCount)}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Line Items</dt>
                <dd className="font-medium">{quote.line_items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Sent</dt>
                <dd className="font-medium">
                  {quote.sent_at ? new Date(quote.sent_at).toLocaleDateString() : 'Not sent'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Accepted</dt>
                <dd className="font-medium">
                  {quote.accepted_at ? new Date(quote.accepted_at).toLocaleDateString() : 'Pending'}
                </dd>
              </div>
            </dl>
            {quote.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-700">{quote.notes}</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
