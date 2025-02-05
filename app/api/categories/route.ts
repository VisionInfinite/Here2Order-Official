import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAuth } from "@/lib/auth-utils"

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const categories = await prisma.menuCategory.findMany({
      where: {
        restaurantId: user.restaurant.id,
      },
      include: {
        menuItems: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Get the highest order number
    const lastCategory = await prisma.menuCategory.findFirst({
      where: {
        restaurantId: user.restaurant.id,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const newOrder = (lastCategory?.order ?? -1) + 1;

    const category = await prisma.menuCategory.create({
      data: {
        name,
        order: newOrder,
        restaurantId: user.restaurant.id,
      },
      include: {
        menuItems: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return new NextResponse("Unauthorized", { status: 401 });
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

    // Update all categories in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.menuCategory.update({
          where: {
            id: item.id,
          },
          data: {
            order: item.order,
          },
        })
      )
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error('PATCH /api/categories error:', error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
} 