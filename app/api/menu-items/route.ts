import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAuth } from "@/lib/auth-utils"

export async function POST(request: Request) {
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

    // Get the highest order number for this category
    const lastItem = await prisma.menuItem.findFirst({
      where: {
        categoryId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const newOrder = (lastItem?.order ?? -1) + 1;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        order: newOrder,
        categoryId,
        restaurantId: user.restaurant.id,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('POST /api/menu-items error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.menuItem.update({
          where: {
            id: item.id,
            restaurantId: user.restaurant.id,
          },
          data: {
            order: item.order,
            categoryId: item.categoryId,
          },
        })
      )
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error('PATCH /api/menu-items error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 