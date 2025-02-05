import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

// Validation schema for restaurant settings
const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().url().optional().nullable(),
  bannerImage: z.string().url().optional().nullable(),
})

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const restaurant = await prisma.restaurant.update({
      where: {
        userId
      },
      data: validatedData,
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 })
    }
    console.error("[SETTINGS_PATCH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 