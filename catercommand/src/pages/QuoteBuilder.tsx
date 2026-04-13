import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, Minus, ArrowLeft, Search } from 'lucide-react'
import { useEvent, useUpdateEvent } from '@/hooks/useEvents'
import { useMenuItems } from '@/hooks/useMenuItems'
import { useQuote, useSaveQuote } from '@/hooks/useQuote'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency, calcMarginColor, calcMarginPct } from '@/lib/utils'
import type { QuoteLineItem } from '@/types'

export function QuoteBuilder() {
  const { id: eventId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: event } = useEvent(eventId!)
  const { data: menuItems = [], isLoading: itemsLoading } = useMenuItems()
  const { data: existingQuote, isLoading: quoteLoading } = useQuote(eventId!)
  const saveQuote = useSaveQuote()
  const updateEvent = useUpdateEvent()

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([])
  const [taxRate, setTaxRate] = useState(0.08)
  const [quoteNotes, setQuoteNotes] = useState('')
  const [search, setSearch] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize from existing quote
  useEffect(() => {
    if (!quoteLoading && !initialized) {
      if (existingQuote) {
        setLineItems(existingQuote.line_items)
        setTaxRate(existingQuote.tax_rate)
        setQuoteNotes(existingQuote.notes ?? '')
      }
      setInitialized(true)
    }
  }, [existingQuote, quoteLoading, initialized])

  const subtotal = lineItems.reduce((s, li) => s + li.total, 0)
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  function addMenuItem(item: { name: string; price_per_head: number }) {
    const guests = event?.guest_count ?? 1
    const existing = lineItems.findIndex((li) => li.name === item.name)
    if (existing >= 0) {
      // Already added — scroll to it / ignore
      return
    }
    setLineItems((prev) => [
      ...prev,
      {
        name: item.name,
        qty: guests,
        unit_price: item.price_per_head,
        total: item.price_per_head * guests,
      },
    ])
  }

  function updateLineItem(index: number, field: 'qty' | 'unit_price', value: number) {
    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== index) return li
        const updated = { ...li, [field]: value }
        updated.total = updated.qty * updated.unit_price
        return updated
      }),
    )
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!eventId) return
    setSaveError(null)
    try {
      await saveQuote.mutateAsync({
        event_id: eventId,
        line_items: lineItems,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        notes: quoteNotes,
      })
      // Update event total_quoted and status
      await updateEvent.mutateAsync({
        id: eventId,
        total_quoted: total,
        balance_due: total - (event?.deposit_amount ?? 0),
        status: event?.status === 'inquiry' ? 'quoted' : event?.status,
      })
      navigate(`/events/${eventId}`)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save quote')
    }
  }

  const categories = [...new Set(menuItems.map((i) => i.category ?? 'Uncategorized'))]
  const filteredItems = menuItems.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.category ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  if (quoteLoading || !initialized) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <PageWrapper
      title="Quote Builder"
      action={
        <Link to={`/events/${eventId}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>
      }
    >
      {event && (
        <p className="text-sm text-gray-500 -mt-4 mb-6">
          {event.event_name} &middot; {event.guest_count} guests
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Menu Item Selector */}
        <div className="lg:col-span-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {itemsLoading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {(search ? ['Search Results'] : categories).map((category) => {
                const items = search
                  ? filteredItems
                  : filteredItems.filter((i) => (i.category ?? 'Uncategorized') === category)
                if (items.length === 0) return null
                return (
                  <div key={category}>
                    {!search && (
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        {category}
                      </p>
                    )}
                    <div className="space-y-2">
                      {items.map((item) => {
                        const alreadyAdded = lineItems.some((li) => li.name === item.name)
                        const marginColor = calcMarginColor(item.cost_per_head, item.price_per_head)
                        const marginPct = calcMarginPct(item.cost_per_head, item.price_per_head)
                        return (
                          <button
                            key={item.id}
                            onClick={() => addMenuItem(item)}
                            disabled={alreadyAdded}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              alreadyAdded
                                ? 'border-sky-200 bg-sky-50 opacity-60 cursor-not-allowed'
                                : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <Plus className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span className="text-gray-500">
                                Cost: {formatCurrency(item.cost_per_head)} &middot; Price:{' '}
                                {formatCurrency(item.price_per_head)}
                              </span>
                              <span className={`font-semibold ${marginColor}`}>
                                {marginPct.toFixed(0)}%
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {filteredItems.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No menu items found.</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Line Items + Totals */}
        <div className="lg:col-span-3">
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quote Line Items</h2>

            {lineItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl text-sm">
                Click menu items on the left to add them to the quote.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left font-medium text-gray-500 py-2">Item</th>
                        <th className="text-center font-medium text-gray-500 py-2 w-20">Qty</th>
                        <th className="text-right font-medium text-gray-500 py-2 w-28">Unit Price</th>
                        <th className="text-right font-medium text-gray-500 py-2 w-24">Total</th>
                        <th className="py-2 w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lineItems.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 font-medium text-gray-900">{item.name}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                updateLineItem(i, 'qty', parseInt(e.target.value) || 1)
                              }
                              className="w-16 text-center border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="py-2">
                            <div className="flex justify-end">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={item.unit_price}
                                onChange={(e) =>
                                  updateLineItem(i, 'unit_price', parseFloat(e.target.value) || 0)
                                }
                                className="w-24 text-right border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                              />
                            </div>
                          </td>
                          <td className="py-2 text-right font-medium text-gray-900">
                            {formatCurrency(item.total)}
                          </td>
                          <td className="py-2 pl-2">
                            <button
                              onClick={() => removeLineItem(i)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Tax Rate</span>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.001}
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-16 text-right border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <span className="text-gray-400">({(taxRate * 100).toFixed(1)}%)</span>
                    </div>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  {event?.guest_count && event.guest_count > 0 && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Per Person ({event.guest_count} guests)</span>
                      <span>{formatCurrency(total / event.guest_count)}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Quote Notes */}
            <div className="mt-4">
              <Input
                label="Quote Notes (optional)"
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>

            {saveError && <p className="mt-3 text-red-600 text-sm">{saveError}</p>}

            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleSave}
                loading={saveQuote.isPending || updateEvent.isPending}
                disabled={lineItems.length === 0}
                className="flex-1"
              >
                Save Quote
              </Button>
              <Link to={`/events/${eventId}`}>
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
