import Image from 'next/image'
import { Star, Clock, MapPin, Plus } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  deliveryTime: string
  distance: string
  rating: number
}

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex gap-4">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{item.deliveryTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{item.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{item.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{item.price.toFixed(2)}
          </span>
          <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 