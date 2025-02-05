'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MenuItem, MenuCategory } from '@/lib/types'

interface EditMenuItemFormProps {
  menuItem: MenuItem & {
    category: {
      id: string
      name: string
    }
  }
  categories: {
    id: string
    name: string
  }[]
}

export function EditMenuItemForm({ menuItem, categories }: EditMenuItemFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        categoryId: formData.get('categoryId') as string,
        image: formData.get('image') as string || null,
      }

      const response = await fetch(`/api/menu-items/${menuItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update menu item')
      }

      toast.success('Menu item updated successfully')
      router.push('/dashboard/menu')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update menu item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={menuItem.name}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background 
                     px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={menuItem.description || ''}
            rows={3}
            className="mt-1 block w-full rounded-md border border-input bg-background 
                     px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-foreground">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            defaultValue={menuItem.price}
            step="0.01"
            min="0"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background 
                     px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={menuItem.categoryId}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background 
                     px-3 py-2 text-sm ring-offset-background"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-foreground">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            defaultValue={menuItem.image || ''}
            className="mt-1 block w-full rounded-md border border-input bg-background 
                     px-3 py-2 text-sm ring-offset-background"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm border rounded-md hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md 
                   hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
} 