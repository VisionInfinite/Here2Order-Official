import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/auth"
import { Session } from "next-auth"

export async function DELETE(
  request: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const session = await auth() as Session | null
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const menuId = params.menuId

    const deletedItem = await prisma.menuItem.deleteMany({
      where: {
        AND: [
          { id: menuId },
          {
            restaurant: {
              userId: session.user.id
            }
          }
        ]
      }
    })

    if (deletedItem.count === 0) {
      return new NextResponse("Menu item not found", { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[MENU_DELETE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const session = await auth() as Session | null
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, categoryId } = body

    const menuItem = await prisma.menuItem.update({
      where: {
        id: params.menuId,
        restaurant: {
          userId: session.user.id
        }
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("[MENU_PATCH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}