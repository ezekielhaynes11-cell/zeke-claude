import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { usePayments, useAddPayment, useDeletePayment } from '@/hooks/usePayments'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency, formatDate, calcOutstandingBalance } from '@/lib/utils'
import type { Payment } from '@/types'

interface Props {
  eventId: string
  totalQuoted: number
}

interface PaymentFormData {
  type: Payment['type']
  amount: number
  method: string
  notes: string
  paid_at: string
}

const emptyForm: PaymentFormData = {
  type: 'deposit',
  amount: 0,
  method: '',
  notes: '',
  paid_at: new Date().toISOString().split('T')[0],
}

const PAYMENT_TYPE_OPTIONS: { value: Payment['type']; label: string }[] = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'balance', label: 'Balance' },
  { value: 'partial', label: 'Partial' },
]

const METHOD_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Check', label: 'Check' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Venmo', label: 'Venmo' },
  { value: 'Zelle', label: 'Zelle' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Other', label: 'Other' },
]

export function EventPaymentsTab({ eventId, totalQuoted }: Props) {
  const { data: payments = [], isLoading } = usePayments(eventId)
  const addPayment = useAddPayment()
  const deletePayment = useDeletePayment()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<PaymentFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const outstanding = calcOutstandingBalance(totalQuoted, payments)
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      await addPayment.mutateAsync({
        event_id: eventId,
        ...form,
        paid_at: new Date(form.paid_at).toISOString(),
      })
      setModalOpen(false)
      setForm(emptyForm)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add payment')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Payments</h2>
        <Button size="sm" onClick={() => { setForm(emptyForm); setFormError(null); setModalOpen(true) }}>
          <Plus className="h-4 w-4" />
          Log Payment
        </Button>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Quoted</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(totalQuoted)}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Paid</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(totalPaid)}</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${outstanding > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outstanding</p>
          <p className={`text-lg font-bold ${outstanding > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {formatCurrency(Math.max(0, outstanding))}
          </p>
        </div>
      </div>

      {/* Payment History */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl text-sm">
          No payments recorded yet.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left font-medium text-gray-500 py-2">Date</th>
              <th className="text-left font-medium text-gray-500 py-2">Type</th>
              <th className="text-left font-medium text-gray-500 py-2 hidden sm:table-cell">Method</th>
              <th className="text-left font-medium text-gray-500 py-2 hidden md:table-cell">Notes</th>
              <th className="text-right font-medium text-gray-500 py-2">Amount</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="py-2 text-gray-600">{formatDate(payment.paid_at, 'MMM d, yyyy')}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    payment.type === 'deposit' ? 'bg-blue-100 text-blue-700' :
                    payment.type === 'balance' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {payment.type}
                  </span>
                </td>
                <td className="py-2 text-gray-600 hidden sm:table-cell">{payment.method ?? '—'}</td>
                <td className="py-2 text-gray-500 hidden md:table-cell">{payment.notes ?? '—'}</td>
                <td className="py-2 text-right font-semibold text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="py-2 pl-2">
                  <button
                    onClick={() => deletePayment.mutateAsync({ id: payment.id, eventId })}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete payment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Payment Type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Payment['type'] }))}
            options={PAYMENT_TYPE_OPTIONS}
          />
          <Input
            label="Amount ($)"
            type="number"
            min={0}
            step={0.01}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
            required
          />
          <Select
            label="Payment Method"
            value={form.method}
            onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
            options={METHOD_OPTIONS}
            placeholder="Select method..."
          />
          <Input
            label="Date"
            type="date"
            value={form.paid_at}
            onChange={(e) => setForm((f) => ({ ...f, paid_at: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={addPayment.isPending}>
              Log Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
