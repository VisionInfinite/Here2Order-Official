import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/auth"
import { Session } from "next-auth"
import { validateRestaurantData } from "@/lib/validate-restaurant"

export async function POST(req: Request) {
  try {
    const session = await auth() as Session | null
    
    if (!session?.user || session.user.role !== 'RESTAURANT_ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: session.user.id
      }
    })

    if (!restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 })
    }

    // Validate restaurant data before generating website
    await validateRestaurantData(restaurant.id)

    await prisma.restaurant.update({
      where: {
        id: restaurant.id
      },
      data: {
        websiteGenerated: true
      }
    })

    return NextResponse.json({
      message: "Website generated successfully",
      url: `/restaurant/${restaurant.slug}`
    })
  } catch (error: unknown) {
    console.error("Error generating website:", error)
    
    // Type guard for error message
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }
    
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 