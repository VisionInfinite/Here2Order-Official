'use client'

import { useState } from 'react'
import { MenuCategory } from '@/lib/types'
import { MenuItemForm } from './menu-item-form'

interface MenuListProps {
  categories: MenuCategory[]
}

export function MenuList({ categories }: MenuListProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="space-y-4">
            {category.menuItems.map((item) => (
              <div 
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingItem(item.id)}
                    className="px-3 py-1.5 text-sm font-medium text-[#FF4B3A] 
                             bg-[#FF4B3A]/10 rounded-md hover:bg-[#FF4B3A]/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>
            <MenuItemForm
              menuItem={categories
                .flatMap(c => c.menuItems)
                .find(item => item.id === editingItem)!}
              categories={categories}
              onSuccess={() => setEditingItem(null)}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 