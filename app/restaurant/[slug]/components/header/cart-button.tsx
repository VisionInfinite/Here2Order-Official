import { ShoppingBag } from 'lucide-react'

export function CartButton() {
  return (
    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
      <ShoppingBag className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-orange-500 text-white text-xs font-medium rounded-full">
        2
      </span>
    </button>
  )
} 