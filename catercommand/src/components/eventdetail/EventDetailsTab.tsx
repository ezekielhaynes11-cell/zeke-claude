import { useState } from 'react'
import { useUpdateEvent } from '@/hooks/useEvents'
import { useClients } from '@/hooks/useClients'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { Event } from '@/types'

interface Props {
  event: Event
}

const EVENT_TYPE_OPTIONS = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Graduation', label: 'Graduation' },
  { value: 'Holiday Party', label: 'Holiday Party' },
  { value: 'Fundraiser', label: 'Fundraiser' },
  { value: 'Other', label: 'Other' },
]

export function EventDetailsTab({ event }: Props) {
  const updateEvent = useUpdateEvent()
  const { data: clients = [] } = useClients()

  const [form, setForm] = useState({
    event_name: event.event_name,
    event_type: event.event_type ?? '',
    event_date: event.event_date,
    start_time: event.start_time ?? '',
    end_time: event.end_time ?? '',
    venue: event.venue ?? '',
    venue_address: event.venue_address ?? '',
    guest_count: event.guest_count,
    notes: event.notes ?? '',
    total_quoted: event.total_quoted,
    deposit_amount: event.deposit_amount,
    deposit_paid: event.deposit_paid,
    balance_due: event.balance_due,
    balance_paid: event.balance_paid,
    client_id: event.client_id ?? '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      await updateEvent.mutateAsync({ id: event.id, ...form, client_id: form.client_id || undefined })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }))

  return (
    <form onSubmit={handleSave}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Event Name"
            value={form.event_name}
            onChange={(e) => setField('event_name', e.target.value)}
            required
          />
          <Select
            label="Client"
            value={form.client_id}
            onChange={(e) => setField('client_id', e.target.value)}
            options={clientOptions}
            placeholder="Select a client..."
          />
          <Select
            label="Event Type"
            value={form.event_type}
            onChange={(e) => setField('event_type', e.target.value)}
            options={EVENT_TYPE_OPTIONS}
            placeholder="Select type..."
          />
          <Input
            label="Date"
            type="date"
            value={form.event_date}
            onChange={(e) => setField('event_date', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={(e) => setField('start_time', e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={(e) => setField('end_time', e.target.value)}
            />
          </div>
          <Input
            label="Guest Count"
            type="number"
            min={1}
            value={form.guest_count}
            onChange={(e) => setField('guest_count', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-4">
          <Input
            label="Venue"
            value={form.venue}
            onChange={(e) => setField('venue', e.target.value)}
          />
          <Input
            label="Venue Address"
            value={form.venue_address}
            onChange={(e) => setField('venue_address', e.target.value)}
          />
          <Input
            label="Total Quoted ($)"
            type="number"
            min={0}
            step={0.01}
            value={form.total_quoted}
            onChange={(e) => setField('total_quoted', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Deposit Amount ($)"
            type="number"
            min={0}
            step={0.01}
            value={form.deposit_amount}
            onChange={(e) => setField('deposit_amount', parseFloat(e.target.value) || 0)}
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.deposit_paid}
                onChange={(e) => setField('deposit_paid', e.target.checked)}
                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-gray-700">Deposit Paid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.balance_paid}
                onChange={(e) => setField('balance_paid', e.target.checked)}
                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-gray-700">Balance Paid</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={4}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      <div className="flex items-center gap-3 mt-6">
        <Button type="submit" loading={updateEvent.isPending}>
          Save Changes
        </Button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
      </div>
    </form>
  )
}
