import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'RESTAURANT_ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            restaurant: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    })

    if (!menuItem || menuItem.category.restaurant.userId !== user.id) {
      return new NextResponse('Not found', { status: 404 })
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        categoryId: data.categoryId,
      }
    })

    return NextResponse.json(updatedMenuItem)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 