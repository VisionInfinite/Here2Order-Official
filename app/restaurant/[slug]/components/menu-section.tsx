'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MenuCategory, MenuItem } from '@/lib/types'

interface MenuSectionProps {
  category: MenuCategory
}

export function MenuSection({ category }: MenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  return (
    <section id={category.id} className="scroll-mt-16">
      <h2 className="text-2xl font-bold text-[#252422] mb-6 pl-4 border-l-4 border-[#EB5E28]">
        {category.name}
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.menuItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md 
                          transition-all duration-200 border border-[#CCC5B9]/20">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#252422] group-hover:text-[#EB5E28] 
                               transition-colors duration-200">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-[#403D39]/70 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="text-[#EB5E28] font-bold text-lg">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 