import { useState } from 'react'
import { Plus, MessageSquare, Check, Trash2 } from 'lucide-react'
import {
  useEventStaff,
  useAssignStaff,
  useUpdateEventStaff,
  useRemoveEventStaff,
} from '@/hooks/useEventStaff'
import { useStaff } from '@/hooks/useStaff'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import type { Event, EventStaff } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  eventId: string
  event: Event
}

interface AssignmentFormData {
  staff_id: string
  role: string
  call_time: string
  hours_scheduled: number
  assignment_notes: string
}

const emptyForm: AssignmentFormData = {
  staff_id: '',
  role: '',
  call_time: '',
  hours_scheduled: 0,
  assignment_notes: '',
}

function generateBriefing(event: Event, assignment: EventStaff): string {
  return [
    `EVENT BRIEFING: ${event.event_name}`,
    `Date: ${formatDate(event.event_date)}`,
    `Venue: ${event.venue ?? 'TBD'}`,
    `Guests: ${event.guest_count}`,
    '',
    'YOUR ASSIGNMENT:',
    `Name: ${assignment.staff?.name ?? 'Staff'}`,
    `Role: ${assignment.role ?? 'General'}`,
    `Call Time: ${assignment.call_time ?? 'TBD'}`,
    assignment.hours_scheduled ? `Hours: ${assignment.hours_scheduled}` : '',
    assignment.assignment_notes ? `Notes: ${assignment.assignment_notes}` : '',
    '',
    'Reply CONFIRM to confirm.',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export function EventStaffTab({ eventId, event }: Props) {
  const { data: assignments = [], isLoading } = useEventStaff(eventId)
  const { data: availableStaff = [] } = useStaff()
  const assignStaff = useAssignStaff()
  const updateAssignment = useUpdateEventStaff()
  const removeAssignment = useRemoveEventStaff()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EventStaff | null>(null)
  const [form, setForm] = useState<AssignmentFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const assignedIds = assignments.map((a) => a.staff_id)
  const unassignedStaff = availableStaff.filter((s) => !assignedIds.includes(s.id))

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(assignment: EventStaff) {
    setEditing(assignment)
    setForm({
      staff_id: assignment.staff_id,
      role: assignment.role ?? '',
      call_time: assignment.call_time ?? '',
      hours_scheduled: assignment.hours_scheduled ?? 0,
      assignment_notes: assignment.assignment_notes ?? '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateAssignment.mutateAsync({
          id: editing.id,
          event_id: eventId,
          ...form,
        })
      } else {
        await assignStaff.mutateAsync({ event_id: eventId, confirmed: false, ...form })
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function toggleConfirm(assignment: EventStaff) {
    await updateAssignment.mutateAsync({
      id: assignment.id,
      event_id: eventId,
      confirmed: !assignment.confirmed,
    })
  }

  function handleSMS(assignment: EventStaff) {
    const phone = assignment.staff?.phone?.replace(/\D/g, '') ?? ''
    const body = generateBriefing(event, assignment)
    if (phone) {
      window.location.href = `sms:${phone}?body=${encodeURIComponent(body)}`
    } else {
      const email = assignment.staff?.email ?? ''
      window.location.href = `mailto:${email}?subject=Event Briefing: ${event.event_name}&body=${encodeURIComponent(body)}`
    }
  }

  const staffOptions = (editing
    ? availableStaff
    : unassignedStaff
  ).map((s) => ({ value: s.id, label: `${s.name}${s.role ? ` — ${s.role}` : ''}` }))

  const isPending = assignStaff.isPending || updateAssignment.isPending

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          Staff Assignments ({assignments.length})
        </h2>
        <Button size="sm" onClick={openAdd} disabled={unassignedStaff.length === 0}>
          <Plus className="h-4 w-4" />
          Assign Staff
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl text-sm">
          No staff assigned yet.
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleConfirm(a)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                    a.confirmed
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  title={a.confirmed ? 'Confirmed — click to unconfirm' : 'Click to confirm'}
                >
                  {a.confirmed && <Check className="h-4 w-4" />}
                </button>
                <div>
                  <p className="font-medium text-gray-900">{a.staff?.name}</p>
                  <p className="text-sm text-gray-500">
                    {a.role ?? 'No role'} &middot; Call time: {a.call_time ?? 'TBD'}
                    {a.hours_scheduled ? ` · ${a.hours_scheduled}h` : ''}
                  </p>
                  {a.assignment_notes && (
                    <p className="text-xs text-gray-400 mt-0.5">{a.assignment_notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSMS(a)}
                  title="Send briefing SMS or email"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeAssignment.mutateAsync({ id: a.id, eventId })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Assignment' : 'Assign Staff Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Staff Member"
            value={form.staff_id}
            onChange={(e) => setForm((f) => ({ ...f, staff_id: e.target.value }))}
            options={staffOptions}
            placeholder="Select staff..."
            required
            disabled={!!editing}
          />
          <Input
            label="Role for This Event"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="e.g. Head Server"
          />
          <Input
            label="Call Time"
            type="time"
            value={form.call_time}
            onChange={(e) => setForm((f) => ({ ...f, call_time: e.target.value }))}
          />
          <Input
            label="Hours Scheduled"
            type="number"
            min={0}
            step={0.5}
            value={form.hours_scheduled}
            onChange={(e) =>
              setForm((f) => ({ ...f, hours_scheduled: parseFloat(e.target.value) || 0 }))
            }
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.assignment_notes}
              onChange={(e) => setForm((f) => ({ ...f, assignment_notes: e.target.value }))}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {editing ? 'Save Changes' : 'Assign'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
