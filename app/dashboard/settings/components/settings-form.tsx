'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SettingsFormProps {
  user: any
  restaurant: any
}

export function SettingsForm({ user, restaurant }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/restaurant/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          logo: formData.get('logo'),
          bannerImage: formData.get('bannerImage'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      toast.success('Settings updated successfully')
      router.refresh() // Refresh the current page data
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your form fields here */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        {isLoading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
} 