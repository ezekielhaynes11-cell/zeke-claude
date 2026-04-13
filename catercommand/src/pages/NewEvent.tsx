import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateEvent } from '@/hooks/useEvents'
import { useClients } from '@/hooks/useClients'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { Event } from '@/types'

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

const STATUS_OPTIONS: { value: Event['status']; label: string }[] = [
  { value: 'inquiry',   label: 'Inquiry' },
  { value: 'quoted',    label: 'Quoted' },
  { value: 'confirmed', label: 'Confirmed' },
]

export function NewEvent() {
  const navigate = useNavigate()
  const createEvent = useCreateEvent()
  const { data: clients = [] } = useClients()

  const [form, setForm] = useState({
    event_name: '',
    event_type: '',
    event_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    venue_address: '',
    guest_count: 50,
    status: 'inquiry' as Event['status'],
    notes: '',
    total_quoted: 0,
    deposit_amount: 0,
    deposit_paid: false,
    balance_due: 0,
    balance_paid: false,
    client_id: '',
  })
  const [error, setError] = useState<string | null>(null)

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        ...form,
        client_id: form.client_id || undefined,
        balance_due: form.total_quoted - form.deposit_amount,
      }
      const event = await createEvent.mutateAsync(payload)
      navigate(`/events/${event.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    }
  }

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }))

  return (
    <PageWrapper
      title="New Event"
      action={
        <Link to="/events" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Details */}
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Event Details</h2>
            <Input
              label="Event Name"
              value={form.event_name}
              onChange={(e) => setField('event_name', e.target.value)}
              required
              placeholder="Smith Wedding Reception"
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
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setField('status', e.target.value as Event['status'])}
              options={STATUS_OPTIONS}
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
              required
            />
          </Card>

          {/* Venue & Financials */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Venue</h2>
              <Input
                label="Venue Name"
                value={form.venue}
                onChange={(e) => setField('venue', e.target.value)}
                placeholder="Grand Ballroom"
              />
              <Input
                label="Venue Address"
                value={form.venue_address}
                onChange={(e) => setField('venue_address', e.target.value)}
                placeholder="123 Main St, City, State"
              />
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Financials</h2>
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
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Notes</h2>
              <textarea
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                rows={4}
                placeholder="Any additional notes..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
            </Card>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Link to="/events">
            <Button variant="secondary" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={createEvent.isPending}>
            Create Event
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}
