import { prisma } from "@/lib/prisma"

export async function validateRestaurantData(restaurantId: string) {
  // Check if restaurant has required data
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      menuCategories: {
        include: {
          menuItems: true
        }
      }
    }
  })

  if (!restaurant) {
    throw new Error("Restaurant not found")
  }

  // Validate required fields
  if (!restaurant.name || !restaurant.description) {
    throw new Error("Restaurant details are incomplete")
  }

  // Validate categories and menu items
  if (restaurant.menuCategories.length === 0) {
    throw new Error("Please add at least one menu category")
  }

  const hasMenuItems = restaurant.menuCategories.some(
    category => category.menuItems.length > 0
  )

  if (!hasMenuItems) {
    throw new Error("Please add at least one menu item")
  }

  return true
} 