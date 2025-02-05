import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAuth } from "@/lib/auth-utils"

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await requireAuth();
    if (!user.restaurant) {
      return new NextResponse("Restaurant not found", { status: 404 });
    }

    const category = await prisma.menuCategory.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category.restaurantId !== user.restaurant.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.menuCategory.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/categories/[categoryId] error:', error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
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

    const category = await prisma.menuCategory.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category.restaurantId !== user.restaurant.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedCategory = await prisma.menuCategory.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      },
      include: {
        menuItems: true,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('PATCH /api/categories/[categoryId] error:', error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
} 