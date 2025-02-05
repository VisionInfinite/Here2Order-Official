import type { MenuCategory as PrismaMenuCategory } from "@prisma/client"

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  order: number
  categoryId: string
  restaurantId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category extends PrismaMenuCategory {
  menuItems: MenuItem[]
} 