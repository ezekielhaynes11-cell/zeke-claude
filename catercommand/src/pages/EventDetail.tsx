import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useEvent, useUpdateEvent } from '@/hooks/useEvents'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EventDetailsTab } from '@/components/eventdetail/EventDetailsTab'
import { EventMenuTab } from '@/components/eventdetail/EventMenuTab'
import { EventStaffTab } from '@/components/eventdetail/EventStaffTab'
import { EventQuoteTab } from '@/components/eventdetail/EventQuoteTab'
import { EventPaymentsTab } from '@/components/eventdetail/EventPaymentsTab'
import { formatDate, getStatusColor } from '@/lib/utils'
import type { Event } from '@/types'

type Tab = 'details' | 'menu' | 'staff' | 'quote' | 'payments'

const TABS: { key: Tab; label: string }[] = [
  { key: 'details',  label: 'Details' },
  { key: 'menu',     label: 'Menu' },
  { key: 'staff',    label: 'Staff' },
  { key: 'quote',    label: 'Quote' },
  { key: 'payments', label: 'Payments' },
]

const STATUS_FLOW: Event['status'][] = ['inquiry', 'quoted', 'confirmed', 'completed', 'cancelled']

function StatusDropdown({ event }: { event: Event }) {
  const updateEvent = useUpdateEvent()
  const [open, setOpen] = useState(false)

  async function changeStatus(status: Event['status']) {
    setOpen(false)
    await updateEvent.mutateAsync({ id: event.id, status })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5"
      >
        <Badge label={event.status} className={getStatusColor(event.status)} />
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden min-w-[140px]">
            {STATUS_FLOW.map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  s === event.status ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${getStatusColor(s).split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`} />
                <span className="capitalize">{s}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id!)
  const [activeTab, setActiveTab] = useState<Tab>('details')

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Event not found.</p>
      </div>
    )
  }

  return (
    <PageWrapper
      title={event.event_name}
      action={
        <div className="flex items-center gap-4">
          <StatusDropdown event={event} />
          <Link to="/events" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      }
    >
      {/* Event header info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        <span>{formatDate(event.event_date)}</span>
        {event.start_time && <span>{event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}</span>}
        {event.venue && <span>{event.venue}</span>}
        <span>{event.guest_count} guests</span>
        {event.client && (
          <Link to={`/clients/${event.client_id}`} className="text-sky-600 hover:underline">
            {event.client.name}
          </Link>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'details'  && <EventDetailsTab event={event} />}
      {activeTab === 'menu'     && <EventMenuTab eventId={id!} />}
      {activeTab === 'staff'    && <EventStaffTab eventId={id!} event={event} />}
      {activeTab === 'quote'    && <EventQuoteTab eventId={id!} guestCount={event.guest_count} />}
      {activeTab === 'payments' && <EventPaymentsTab eventId={id!} totalQuoted={event.total_quoted} />}
    </PageWrapper>
  )
}
