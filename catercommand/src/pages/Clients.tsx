import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useClients, useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import type { Client } from '@/types'

interface ClientFormData {
  name: string
  email: string
  phone: string
  notes: string
  referral_source: string
}

const emptyForm: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  referral_source: '',
}

export function Clients() {
  const { data: clients = [], isLoading } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState<ClientFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  )

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(client: Client) {
    setEditing(client)
    setForm({
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      notes: client.notes ?? '',
      referral_source: client.referral_source ?? '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateClient.mutateAsync({ id: editing.id, ...form })
      } else {
        await createClient.mutateAsync(form)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const isPending = createClient.isPending || updateClient.isPending

  return (
    <PageWrapper
      title="Clients"
      action={
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      }
    >
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {search ? 'No clients match your search.' : 'No clients yet. Add your first client!'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Phone</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Last Event</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/clients/${client.id}`}
                      className="font-medium text-gray-900 hover:text-sky-700 transition-colors"
                    >
                      {client.name}
                    </Link>
                    {client.referral_source && (
                      <p className="text-xs text-gray-400">via {client.referral_source}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {client.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {client.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                    {client.last_event_date ? formatDate(client.last_event_date) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(client)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Client' : 'Add Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Referral Source"
            value={form.referral_source}
            onChange={(e) => setForm((f) => ({ ...f, referral_source: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {editing ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
