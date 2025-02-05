'use client'

import { useState } from 'react'
import { MenuCategory } from '@/lib/types'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MenuListProps {
  categories: MenuCategory[]
  searchQuery: string
}

export function MenuList({ categories, searchQuery }: MenuListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id)

  // Filter menu items based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    menuItems: category.menuItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.menuItems.length > 0)

  return (
    <div className="space-y-8 pb-24">
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${selectedCategory === category.id 
                        ? 'bg-[#FF4B3A] text-white shadow-md' 
                        : 'bg-white text-[#2C2C2C] hover:bg-[#FFE5DC]'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div key={category.id} 
               className={selectedCategory === category.id ? 'block' : 'hidden'}>
            <div className="grid gap-4">
              {category.menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex flex-row items-center">
                    {/* Image Section */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 128px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg 
                            className="w-8 h-8 text-gray-300"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1.5} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="font-semibold text-[#2C2C2C] mb-1">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-[#6B6B6B] line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[#FF4B3A] font-bold">
                            ₹{item.price.toFixed(2)}
                          </p>
                          <button 
                            className="bg-[#FF4B3A]/10 text-[#FF4B3A] px-4 py-2 rounded-lg 
                                     font-medium text-sm hover:bg-[#FF4B3A]/20 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 