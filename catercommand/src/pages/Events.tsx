import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'
import type { Event } from '@/types'

type StatusFilter = Event['status'] | 'all'

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'inquiry',   label: 'Inquiry' },
  { key: 'quoted',    label: 'Quoted' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export function Events() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all')
  const { data: events = [], isLoading } = useEvents(
    activeStatus === 'all' ? undefined : activeStatus,
  )

  return (
    <PageWrapper
      title="Events"
      action={
        <Link to="/events/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      }
    >
      {/* Status Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeStatus === tab.key
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No events{activeStatus !== 'all' ? ` with status "${activeStatus}"` : ''} found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Event</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Venue</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Guests</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/events/${event.id}`}
                      className="font-medium text-gray-900 hover:text-sky-700 transition-colors"
                    >
                      {event.event_name}
                    </Link>
                    {event.client && (
                      <p className="text-xs text-gray-400">{event.client.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {formatDate(event.event_date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {event.venue ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                    {event.guest_count}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge label={event.status} className={getStatusColor(event.status)} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(event.total_quoted)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </PageWrapper>
  )
}
