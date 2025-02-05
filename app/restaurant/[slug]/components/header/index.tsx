import { Search } from 'lucide-react'
import { CartButton } from './cart-button'
import { LocationButton } from './location-button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <Search className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <LocationButton />
        
        <CartButton />
      </div>
    </header>
  )
} 