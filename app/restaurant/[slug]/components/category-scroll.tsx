'use client'

import { useState } from 'react'

const categories = [
  { id: 'coffee', name: 'Coffee', emoji: '☕' },
  { id: 'tea', name: 'Tea', emoji: '🫖' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'dessert', name: 'Dessert', emoji: '🍰' },
]

export function CategoryScroll() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 py-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex flex-col items-center min-w-[64px] ${
              activeCategory === category.id ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full mb-1">
              <span className="text-xl">{category.emoji}</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
} 