import { Link } from 'react-router-dom'
import { Plus, Calendar, Users } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useClients } from '@/hooks/useClients'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export function Dashboard() {
  const { data: events = [] } = useEvents()
  const { data: clients = [] } = useClients()

  const confirmed = events.filter((e) => e.status === 'confirmed')
  const today = new Date().toISOString().split('T')[0]
  const upcoming = events
    .filter((e) => e.status === 'confirmed' && e.event_date >= today)
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, 8)
  const totalRevenue = events
    .filter((e) => e.status === 'completed')
    .reduce((sum, e) => sum + e.total_quoted, 0)
  const pendingInquiries = events.filter((e) => e.status === 'inquiry').length

  const stats = [
    { label: 'Total Clients',     value: clients.length.toString(), icon: Users },
    { label: 'Confirmed Events',  value: confirmed.length.toString(), icon: Calendar },
    { label: 'Revenue Collected', value: formatCurrency(totalRevenue), icon: null },
    { label: 'Pending Inquiries', value: pendingInquiries.toString(), icon: null },
  ]

  return (
    <PageWrapper
      title="Dashboard"
      action={
        <Link to="/events/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      }
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link to="/events/new">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
        <Link to="/clients">
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Upcoming Events */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="text-sm text-sky-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {upcoming.length === 0 && (
            <p className="text-gray-400 text-sm py-4 text-center">
              No upcoming confirmed events.
            </p>
          )}
          {upcoming.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-sky-700 transition-colors">
                  {event.event_name}
                </p>
                <p className="text-sm text-gray-500">
                  {event.client?.name ?? 'No client'} &middot;{' '}
                  {formatDate(event.event_date)} &middot;{' '}
                  {event.guest_count} guests
                  {event.venue ? ` · ${event.venue}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(event.total_quoted)}
                </span>
                <Badge label={event.status} className={getStatusColor(event.status)} />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </PageWrapper>
  )
}
