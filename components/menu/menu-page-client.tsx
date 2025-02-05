"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid } from "lucide-react"
import { MenuDashboard } from "@/components/menu/menu-dashboard"
import { AddCategoryDialog } from "@/components/menu/add-category-dialog"
import type { Category } from "@/types/menu"
import { toast } from "sonner"

interface MenuPageClientProps {
  initialCategories: Category[]
}

export function MenuPageClient({ initialCategories }: MenuPageClientProps) {
  const [menuCategories, setMenuCategories] = useState<Category[]>(initialCategories)
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Add debug logging
  useEffect(() => {
    console.log('MenuPageClient Render:', { initialCategories, menuCategories })
  }, [initialCategories, menuCategories])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-md bg-primary/10 p-2">
            <LayoutGrid className="h-full w-full text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Categories</h2>
            <p className="text-sm text-muted-foreground">
              {menuCategories.length} {menuCategories.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {menuCategories.length === 0 ? (
        <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-lg bg-primary/10 p-3">
              <LayoutGrid className="h-full w-full text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No menu categories</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Get started by creating your first menu category.
            </p>
            <Button onClick={() => setIsAddingCategory(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      ) : (
        <MenuDashboard 
          categories={menuCategories} 
          onCategoriesChange={setMenuCategories}
        />
      )}

      <AddCategoryDialog 
        open={isAddingCategory}
        onOpenChange={setIsAddingCategory}
        onSubmit={async (data) => {
          try {
            const response = await fetch('/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })

            if (!response.ok) {
              throw new Error('Failed to create category')
            }

            const newCategory = await response.json()
            setMenuCategories(prev => [...prev, { ...newCategory, menuItems: [] }])
            setIsAddingCategory(false)
            toast.success('Category created successfully')
          } catch (error) {
            console.error('Error creating category:', error)
            toast.error('Failed to create category')
          }
        }}
      />
    </div>
  )
} 