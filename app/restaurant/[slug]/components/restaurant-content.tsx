'use client'

import { useState } from 'react'
import { Restaurant } from '@/lib/types'
import { SearchBar } from "./search-bar"
import { MenuList } from "./menu-list"

interface RestaurantContentProps {
  restaurant: Restaurant
}

export function RestaurantContent({ restaurant }: RestaurantContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FF4B3A] to-[#FF6B3A] text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-lg">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {restaurant.name}
          </h1>
          <p className="text-[#FFE5DC] text-sm">
            {restaurant.description}
          </p>
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
        </div>
      </div>

      {/* Menu List */}
      <div className="px-6 -mt-6">
        <MenuList 
          categories={restaurant.menuCategories}
          searchQuery={searchQuery}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] p-4">
        <button className="w-full bg-[#FF4B3A] text-white py-3 rounded-xl font-semibold hover:bg-[#FF6B3A] transition-colors">
          View Cart
        </button>
      </div>
    </div>
  )
} 