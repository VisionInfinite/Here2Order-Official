'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { MenuItemCard } from '@/components/menu/menu-item-card'
import { MenuForm } from '@/components/menu/menu-form'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'

export function MenuList() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await fetch('/api/menu')
      if (!res.ok) throw new Error('Failed to fetch menu items')
      return res.json()
    },
  })

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const updateOrder = useMutation({
    mutationFn: async ({ id, order }: { id: string; order: number }) => {
      const res = await fetch(`/api/menu/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      })
      if (!res.ok) throw new Error('Failed to update order')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['menu'])
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update item order',
        variant: 'destructive',
      })
    },
  })

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(menuItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update orders in the database
    items.forEach((item, index) => {
      updateOrder.mutate({ id: item.id, order: index })
    })
  }

  if (menuLoading || categoriesLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="menu-items">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {menuItems?.map((item: any, index: number) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {editingId === item.id ? (
                      <MenuForm
                        item={item}
                        categories={categories || []}
                        onClose={() => setEditingId(null)}
                      />
                    ) : (
                      <MenuItemCard
                        item={item}
                        onEdit={() => setEditingId(item.id)}
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
} 