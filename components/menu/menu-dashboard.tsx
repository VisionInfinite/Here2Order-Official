'use client'

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MoreVertical, Pencil, Trash, GripVertical } from "lucide-react"
import { AddMenuItemDialog } from "./add-menu-item-dialog"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category, MenuItem } from "@/types/menu"
import { toast } from "sonner"

interface MenuDashboardProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
}

export function MenuDashboard({ categories, onCategoriesChange }: MenuDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [isDeletingItem, setIsDeletingItem] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)

  // Add debug logging
  console.log('MenuDashboard Render:', { categories })

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    // Handle category reordering
    if (type === "category") {
      const reorderedCategories = Array.from(categories)
      const [removed] = reorderedCategories.splice(source.index, 1)
      reorderedCategories.splice(destination.index, 0, removed)

      // Update order numbers
      const updatedCategories = reorderedCategories.map((cat, index) => ({
        ...cat,
        order: index,
      }))

      onCategoriesChange(updatedCategories)

      // Update in database
      try {
        await fetch('/api/categories/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories: updatedCategories.map(c => ({ id: c.id, order: c.order })) }),
        })
      } catch (error) {
        console.error('Failed to update category order:', error)
      }
    }

    // Handle menu item reordering
    if (type === "menuItem") {
      const sourceCategory = categories.find(c => c.id === source.droppableId)
      const destCategory = categories.find(c => c.id === destination.droppableId)

      if (!sourceCategory || !destCategory) return

      const newCategories = Array.from(categories)
      const sourceItems = Array.from(sourceCategory.menuItems)
      const destItems = source.droppableId === destination.droppableId
        ? sourceItems
        : Array.from(destCategory.menuItems)

      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      // Update order numbers
      const updatedItems = destItems.map((item, index) => ({
        ...item,
        order: index,
        categoryId: destination.droppableId,
      }))

      const updatedCategories = newCategories.map(category => {
        if (category.id === source.droppableId) {
          return {
            ...category,
            menuItems: source.droppableId === destination.droppableId
              ? updatedItems
              : sourceItems,
          }
        }
        if (category.id === destination.droppableId) {
          return {
            ...category,
            menuItems: updatedItems,
          }
        }
        return category
      })

      onCategoriesChange(updatedCategories)

      // Update in database
      try {
        await fetch('/api/menu-items/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems.map(i => ({ id: i.id, order: i.order, categoryId: i.categoryId })) }),
        })
      } catch (error) {
        console.error('Failed to update menu item order:', error)
      }
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      })

      onCategoriesChange(categories.filter(c => c.id !== selectedCategory.id))
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setIsDeletingCategory(false)
      setSelectedCategory(null)
    }
  }

  const handleDeleteMenuItem = async () => {
    if (!selectedMenuItem) return

    try {
      await fetch(`/api/menu-items/${selectedMenuItem.id}`, {
        method: 'DELETE',
      })

      const updatedCategories = categories.map(category => ({
        ...category,
        menuItems: category.menuItems.filter(item => item.id !== selectedMenuItem.id),
      }))

      onCategoriesChange(updatedCategories)
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    } finally {
      setIsDeletingItem(false)
      setSelectedMenuItem(null)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories" type="category">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category, index) => (
              <Draggable key={category.id} draggableId={category.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="group relative"
                  >
                    <Card className="transition-shadow hover:shadow-md">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab rounded p-1 hover:bg-muted"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <CardTitle className="text-base font-semibold">
                            {category.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            onClick={() => {
                              setSelectedCategory(category)
                              setIsAddingItem(true)
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedCategory(category)
                                  setIsDeletingCategory(true)
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Droppable droppableId={category.id} type="menuItem">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {category.menuItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="group relative flex items-center justify-between rounded-md border bg-card p-3 hover:bg-accent/50"
                                    >
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <p className="truncate text-sm font-medium leading-none">
                                          {item.name}
                                        </p>
                                        {item.description && (
                                          <p className="line-clamp-1 text-sm text-muted-foreground">
                                            {item.description}
                                          </p>
                                        )}
                                        <p className="text-sm font-medium text-primary">
                                          ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      <div className="ml-2 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => {
                                            setSelectedMenuItem(item)
                                            setIsEditingItem(true)
                                          }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-destructive"
                                          onClick={() => {
                                            setSelectedMenuItem(item)
                                            setIsDeletingItem(true)
                                          }}
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {category.menuItems.length === 0 && (
                                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                                  <p className="text-sm text-muted-foreground">
                                    No items in this category
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {selectedCategory && (
        <AddMenuItemDialog
          open={isAddingItem}
          onOpenChange={setIsAddingItem}
          category={selectedCategory}
          onSuccess={(newItem) => {
            const updatedCategories = categories.map(category => {
              if (category.id === selectedCategory.id) {
                return {
                  ...category,
                  menuItems: [...category.menuItems, newItem],
                }
              }
              return category
            })
            onCategoriesChange(updatedCategories)
            setIsAddingItem(false)
          }}
        />
      )}

      {selectedMenuItem && (
        <>
          <EditMenuItemDialog
            open={isEditingItem}
            onOpenChange={setIsEditingItem}
            item={selectedMenuItem}
            categories={categories}
            onSuccess={(updatedItem) => {
              const updatedCategories = categories.map(category => ({
                ...category,
                menuItems: category.menuItems.map(item =>
                  item.id === updatedItem.id ? updatedItem : item
                ),
              }))
              onCategoriesChange(updatedCategories)
              setIsEditingItem(false)
            }}
          />

          <DeleteDialog
            open={isDeletingItem}
            onOpenChange={setIsDeletingItem}
            title="Delete Menu Item"
            description="Are you sure you want to delete this menu item? This action cannot be undone."
            onConfirm={async () => {
              try {
                await fetch(`/api/menu-items/${selectedMenuItem.id}`, {
                  method: 'DELETE',
                })
                const updatedCategories = categories.map(category => ({
                  ...category,
                  menuItems: category.menuItems.filter(
                    item => item.id !== selectedMenuItem.id
                  ),
                }))
                onCategoriesChange(updatedCategories)
                setIsDeletingItem(false)
              } catch (error) {
                console.error('Error deleting menu item:', error)
              }
            }}
          />
        </>
      )}

      {selectedCategory && (
        <DeleteDialog
          open={isDeletingCategory}
          onOpenChange={setIsDeletingCategory}
          title="Delete Category"
          description="Are you sure you want to delete this category? All menu items in this category will also be deleted. This action cannot be undone."
          onConfirm={handleDeleteCategory}
        />
      )}
    </DragDropContext>
  )
}