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

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("[RESTAURANT_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 