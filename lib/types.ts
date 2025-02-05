export interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number
  image?: string | null
  categoryId: string
  restaurantId: string
  order: number
}

export interface MenuCategory {
  id: string
  name: string
  restaurantId: string
  order: number
  menuItems: MenuItem[]
}

export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  restaurant: Restaurant | null
}

export interface Restaurant {
  id: string
  name: string
  description: string | null
  logo: string | null
  bannerImage: string | null
  userId: string
  user: User
  slug: string
  menuCategories: MenuCategory[]
}

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      restaurantId?: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
    restaurant?: {
      id: string
    }
  }
} 