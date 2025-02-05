'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface MenuItemCardProps {
  item: any
  onEdit: () => void
}

export function MenuItemCard({
  item,
  onEdit,
}: MenuItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to delete item')
      }

      queryClient.invalidateQueries(['menu'])
      setShowDeleteDialog(false)
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu item',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-20 hover:opacity-100">
          <GripVertical className="h-6 w-6" />
        </div>
        <div className="flex gap-4 p-4 pl-12">
          {item.image && (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">
                ${Number(item.price).toFixed(2)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 