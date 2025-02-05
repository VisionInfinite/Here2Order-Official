import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/auth"
import { Session } from "next-auth"

export async function GET() {
  try {
    const session = await auth() as Session | null

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // First get the restaurant for this user
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        menuItems: {
          include: {
            category: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 })
    }

    return NextResponse.json(restaurant.menuItems)
  } catch (error) {
    console.error("[MENU_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth() as Session | null

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, categoryId } = body

    if (!name || !price || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // First get the restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        menuCategories: true // Changed from categories to menuCategories
      }
    })

    if (!restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 })
    }

    // Verify the category exists and belongs to this restaurant
    const category = await prisma.menuCategory.findFirst({ // Changed from Category to MenuCategory
      where: {
        id: categoryId,
        restaurantId: restaurant.id
      }
    })

    if (!category) {
      // Add more detailed logging
      console.log('Debug - Category lookup failed:', {
        categoryId,
        restaurantId: restaurant.id,
        userId: session.user.id,
        availableCategories: restaurant.menuCategories.map(c => ({ id: c.id, name: c.name }))
      })
      return new NextResponse("Category not found", { status: 404 })
    }

    // Create the menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        categoryId,
        restaurantId: restaurant.id,
        order: 0
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("[MENU_POST]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 