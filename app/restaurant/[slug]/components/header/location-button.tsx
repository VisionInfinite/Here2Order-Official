import { MapPin } from 'lucide-react'

export function LocationButton() {
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
      <MapPin className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Mumbai, India
      </span>
    </button>
  )
} 