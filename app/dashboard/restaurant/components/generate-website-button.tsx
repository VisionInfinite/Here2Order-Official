'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface GenerateWebsiteButtonProps {
  isGenerated: boolean
  slug: string
}

export function GenerateWebsiteButton({ isGenerated, slug }: GenerateWebsiteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerateWebsite = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/restaurant/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to generate website')
      }

      const data = await response.json()

      toast({
        title: "Success!",
        description: "Your website has been generated. You can now view it.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerateWebsite}
        disabled={isLoading || isGenerated}
        className="gap-2"
        variant={isGenerated ? "secondary" : "default"}
      >
        <Globe className="w-4 h-4" />
        {isGenerated ? 'Website Generated' : 'Generate Website'}
      </Button>
      {isGenerated && slug && (
        <a
          href={`/restaurant/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:underline text-center"
        >
          View your website →
        </a>
      )}
    </div>
  )
} 