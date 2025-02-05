'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateMenuItem(
  menuItemId: string,
  data: {
    name: string
    description?: string | null
    price: number
    image?: string | null
    categoryId: string
  }
) {
  try {
    // First check if the item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    })

    if (!existingItem) {
      return { success: false, error: 'Menu item not found' }
    }

    // Update the existing item
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        categoryId: data.categoryId,
      },
    })

    // Force revalidate all relevant paths
    revalidatePath('/dashboard/menu')
    revalidatePath('/restaurant/[slug]', 'page')

    return { success: true, data: updatedMenuItem }
  } catch (error) {
    console.error('Error updating menu item:', error)
    return { success: false, error: 'Failed to update menu item' }
  }
} 