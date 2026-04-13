import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem } from '@/hooks/useMenuItems'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency, calcMarginColor, calcMarginPct } from '@/lib/utils'
import type { MenuItem } from '@/types'

const DIETARY_TAGS = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Nut-Free',
  'Dairy-Free',
  'Halal',
  'Kosher',
]

const CATEGORIES = [
  'Appetizers',
  'Salads',
  'Mains',
  'Sides',
  'Desserts',
  'Beverages',
  'Staff Meals',
  'Other',
]

interface MenuItemFormData {
  name: string
  category: string
  description: string
  cost_per_head: number
  price_per_head: number
  dietary_tags: string[]
  active: boolean
}

const emptyForm: MenuItemFormData = {
  name: '',
  category: '',
  description: '',
  cost_per_head: 0,
  price_per_head: 0,
  dietary_tags: [],
  active: true,
}

export function Settings() {
  const { data: items = [], isLoading } = useMenuItems(false)
  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<MenuItemFormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const activeItems = items.filter((i) => i.active)
  const categories = [...new Set(activeItems.map((i) => i.category ?? 'Uncategorized'))]

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({
      name: item.name,
      category: item.category ?? '',
      description: item.description ?? '',
      cost_per_head: item.cost_per_head,
      price_per_head: item.price_per_head,
      dietary_tags: item.dietary_tags,
      active: item.active,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateItem.mutateAsync({ id: editing.id, ...form })
      } else {
        await createItem.mutateAsync(form)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function handleArchive(item: MenuItem) {
    await updateItem.mutateAsync({ id: item.id, active: false })
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      dietary_tags: f.dietary_tags.includes(tag)
        ? f.dietary_tags.filter((t) => t !== tag)
        : [...f.dietary_tags, tag],
    }))
  }

  const isPending = createItem.isPending || updateItem.isPending

  return (
    <PageWrapper
      title="Menu Items"
      action={
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : activeItems.length === 0 ? (
        <Card className="p-10 text-center text-gray-400">
          No menu items yet. Add your first item!
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryItems = activeItems.filter(
              (i) => (i.category ?? 'Uncategorized') === category,
            )
            return (
              <div key={category}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryItems.map((item) => {
                    const marginPct = calcMarginPct(item.cost_per_head, item.price_per_head)
                    const marginColor = calcMarginColor(item.cost_per_head, item.price_per_head)
                    return (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-3">
                          <div>
                            <span className="text-gray-500">Cost: </span>
                            <span className="font-medium">{formatCurrency(item.cost_per_head)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Price: </span>
                            <span className="font-medium">{formatCurrency(item.price_per_head)}</span>
                          </div>
                          <div>
                            <span className={`font-semibold ${marginColor}`}>
                              {marginPct.toFixed(0)}% margin
                            </span>
                          </div>
                        </div>
                        {item.dietary_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.dietary_tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleArchive(item)}
                          >
                            Archive
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <input
              list="categories"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Select or type a category"
            />
            <datalist id="categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cost / Head ($)"
              type="number"
              min={0}
              step={0.01}
              value={form.cost_per_head}
              onChange={(e) => setForm((f) => ({ ...f, cost_per_head: parseFloat(e.target.value) || 0 }))}
            />
            <Input
              label="Price / Head ($)"
              type="number"
              min={0}
              step={0.01}
              value={form.price_per_head}
              onChange={(e) => setForm((f) => ({ ...f, price_per_head: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          {form.price_per_head > 0 && (
            <p className={`text-sm font-medium ${calcMarginColor(form.cost_per_head, form.price_per_head)}`}>
              Margin: {calcMarginPct(form.cost_per_head, form.price_per_head).toFixed(1)}%
            </p>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dietary_tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
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
              {editing ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
