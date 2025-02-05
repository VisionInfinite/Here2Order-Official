import { Metadata } from 'next'
import { prisma } from "@/lib/prisma"
import { notFound } from 'next/navigation'
import { Restaurant } from '@/lib/types'
import { RestaurantContent } from "./components/restaurant-content"

interface RestaurantPageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug: slug
    },
    include: {
      menuCategories: {
        include: {
          menuItems: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  }) as Restaurant | null

  if (!restaurant) {
    notFound()
  }

  return <RestaurantContent restaurant={restaurant} />
} 