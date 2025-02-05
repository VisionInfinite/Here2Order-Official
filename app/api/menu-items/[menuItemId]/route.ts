import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAuth } from "@/lib/auth-utils"

export async function DELETE(
  request: Request,
  { params }: { params: { menuItemId: string } }
) {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: params.menuItemId,
      },
    });

    if (!menuItem) {
      return new NextResponse("Menu item not found", { status: 404 });
    }

    if (menuItem.restaurantId !== user.restaurant.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.menuItem.delete({
      where: {
        id: params.menuItemId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/menu-items/[menuItemId] error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { menuItemId: string } }
) {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const body = await request.json();
    const { name, description, price, categoryId } = body;

    if (!name || typeof price !== 'number' || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: params.menuItemId,
      },
    });

    if (!menuItem) {
      return new NextResponse("Menu item not found", { status: 404 });
    }

    if (menuItem.restaurantId !== user.restaurant.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the category belongs to this restaurant
    const category = await prisma.menuCategory.findUnique({
      where: {
        id: categoryId,
        restaurantId: user.restaurant.id,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: params.menuItemId,
      },
      data: {
        name,
        description,
        price,
        categoryId,
      },
    });

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error('PATCH /api/menu-items/[menuItemId] error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 