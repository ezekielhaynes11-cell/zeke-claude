import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useQuote } from '@/hooks/useQuote'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'

interface Props {
  eventId: string
}

export function EventMenuTab({ eventId }: Props) {
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
        <h2 className="font-semibold text-gray-900">Menu / Quote Items</h2>
        <Link to={`/events/${eventId}/quote`}>
          <Button size="sm" variant="secondary">
            <ExternalLink className="h-4 w-4" />
            {quote ? 'Edit Quote' : 'Build Quote'}
          </Button>
        </Link>
      </div>

      {!quote || quote.line_items.length === 0 ? (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">No menu items selected yet.</p>
          <Link to={`/events/${eventId}/quote`} className="text-sky-600 text-sm hover:underline mt-1 inline-block">
            Open Quote Builder →
          </Link>
        </div>
      ) : (
        <div>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 py-2">Item</th>
                <th className="text-right font-medium text-gray-500 py-2">Qty</th>
                <th className="text-right font-medium text-gray-500 py-2">Unit Price</th>
                <th className="text-right font-medium text-gray-500 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quote.line_items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2 font-medium text-gray-900">{item.name}</td>
                  <td className="py-2 text-right text-gray-600">{item.qty}</td>
                  <td className="py-2 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                  <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-gray-200 pt-3 space-y-1 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({(quote.tax_rate * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(quote.tax_amount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1 mt-1">
              <span>Total</span>
              <span>{formatCurrency(quote.total)}</span>
            </div>
          </div>

          {quote.sent_at && (
            <p className="text-xs text-gray-400 mt-4">
              Quote sent: {new Date(quote.sent_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
