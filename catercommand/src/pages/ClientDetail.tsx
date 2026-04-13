import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useClient } from '@/hooks/useClients'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useClient(id!)

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Client not found.</p>
      </div>
    )
  }

  const { events = [], ...client } = data

  return (
    <PageWrapper
      title={client.name}
      action={
        <Link to="/clients" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      }
    >
      {/* Profile Card */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Contact Info</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{client.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{client.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Referral Source</dt>
            <dd className="font-medium text-gray-900">{client.referral_source ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Client Since</dt>
            <dd className="font-medium text-gray-900">{formatDate(client.created_at)}</dd>
          </div>
          {client.notes && (
            <div className="col-span-2">
              <dt className="text-gray-500">Notes</dt>
              <dd className="font-medium text-gray-900 whitespace-pre-line">{client.notes}</dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Event History */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Event History ({events.length})</h2>
          <Link to={`/events/new`}>
            <span className="text-sm text-sky-600 hover:underline">+ New Event</span>
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No events for this client yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Event</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Venue</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events
                .sort((a, b) => b.event_date.localeCompare(a.event_date))
                .map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        to={`/events/${event.id}`}
                        className="font-medium text-gray-900 hover:text-sky-700 transition-colors"
                      >
                        {event.event_name}
                      </Link>
                      <p className="text-xs text-gray-400">{event.guest_count} guests</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell">{event.venue ?? '—'}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <Badge label={event.status} className={getStatusColor(event.status)} />
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right">
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
