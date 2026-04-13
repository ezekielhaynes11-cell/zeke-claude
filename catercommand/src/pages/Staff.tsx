import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAllStaff, useCreateStaff, useUpdateStaff } from '@/hooks/useStaff'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import type { Staff } from '@/types'

interface StaffFormData {
  name: string
  role: string
  phone: string
  email: string
  hourly_rate: number
  notes: string
  active: boolean
}

const emptyForm: StaffFormData = {
  name: '',
  role: '',
  phone: '',
  email: '',
  hourly_rate: 0,
  notes: '',
  active: true,
}

export function Staff() {
  const { data: staff = [], isLoading } = useAllStaff()
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [form, setForm] = useState<StaffFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(member: Staff) {
    setEditing(member)
    setForm({
      name: member.name,
      role: member.role ?? '',
      phone: member.phone ?? '',
      email: member.email ?? '',
      hourly_rate: member.hourly_rate ?? 0,
      notes: member.notes ?? '',
      active: member.active,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateStaff.mutateAsync({ id: editing.id, ...form })
      } else {
        await createStaff.mutateAsync(form)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const isPending = createStaff.isPending || updateStaff.isPending

  return (
    <PageWrapper
      title="Staff"
      action={
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      }
    >
      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No staff members yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Phone</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Rate</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    {member.email && (
                      <p className="text-xs text-gray-400">{member.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {member.role ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {member.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                    {member.hourly_rate ? `${formatCurrency(member.hourly_rate)}/hr` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {member.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(member)}>
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
        title={editing ? 'Edit Staff Member' : 'Add Staff Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="e.g. Server, Chef, Bartender"
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
            label="Hourly Rate ($)"
            type="number"
            min={0}
            step={0.5}
            value={form.hourly_rate}
            onChange={(e) => setForm((f) => ({ ...f, hourly_rate: parseFloat(e.target.value) || 0 }))}
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {editing ? 'Save Changes' : 'Add Staff Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
