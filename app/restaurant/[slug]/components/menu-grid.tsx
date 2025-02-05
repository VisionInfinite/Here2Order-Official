'use client'

import { motion } from 'framer-motion'
import { MenuCategory } from '@/lib/types'
import Image from 'next/image'

interface MenuGridProps {
  categories: MenuCategory[]
}

export function MenuGrid({ categories }: MenuGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <motion.div
            className="relative aspect-square rounded-3xl overflow-hidden bg-white p-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-4 right-4 z-10">
              <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="h-full flex flex-col justify-between">
              <div className="relative h-3/4 bg-gray-100 rounded-2xl">
                {category.menuItems[0]?.image ? (
                  <Image
                    src={category.menuItems[0].image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  Starting from ${Math.min(...category.menuItems.map(item => item.price)).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  )
} 