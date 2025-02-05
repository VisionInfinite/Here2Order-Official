'use client'

import { useState } from 'react'
import { MenuCategory } from '@/lib/types'

interface CategoryFilterProps {
  categories: MenuCategory[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => {
            if (selectedCategories.includes(category.id)) {
              setSelectedCategories(selectedCategories.filter(id => id !== category.id))
            } else {
              setSelectedCategories([...selectedCategories, category.id])
            }
          }}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            selectedCategories.includes(category.id)
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
} 