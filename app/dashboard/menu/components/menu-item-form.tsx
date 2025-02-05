'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateMenuItem } from '@/app/actions/menu-items'
import { MenuItem, MenuCategory } from '@/lib/types'

interface MenuItemFormProps {
  menuItem: MenuItem
  categories: MenuCategory[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function MenuItemForm({ 
  menuItem, 
  categories, 
  onSuccess, 
  onCancel 
}: MenuItemFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        categoryId: formData.get('categoryId') as string,
        image: formData.get('image') as string || null,
      }

      const result = await updateMenuItem(menuItem.id, data)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update menu item')
      }

      // Force a hard refresh of the page data
      router.refresh()
      
      // Close the form
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={menuItem.name}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={menuItem.description || ''}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            defaultValue={menuItem.price}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={menuItem.categoryId}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            defaultValue={menuItem.image || ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                   border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-[#FF4B3A] 
                   rounded-md hover:bg-[#FF6B3A] disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Menu Item'}
        </button>
      </div>
    </form>
  )
} 