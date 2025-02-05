'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImagePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface ImageUploadProps {
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  id: string
}

export function ImageUpload({ value, onChange, disabled, id }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('field', id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        {value ? (
          <>
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onChange(null)}
              disabled={disabled}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-muted">
            <ImagePlus className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Upload Image
            </p>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={disabled}
        id={`image-upload-${id}`}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={() => document.getElementById(`image-upload-${id}`)?.click()}
      >
        Choose Image
      </Button>
    </div>
  )
} 