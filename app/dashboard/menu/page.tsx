import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import Loading from "@/components/loading";
import { Suspense } from "react";
import { MenuPageClient } from "@/components/menu/menu-page-client";
import type { Category } from "@/types/menu";

export default async function MenuPage() {
  try {
    const user = await requireAuth();

    if (!user || !user.restaurant) {
      return (
        <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No restaurant found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Please contact support to set up your restaurant.
            </p>
          </div>
        </div>
      );
    }

    const categories = await prisma.menuCategory.findMany({
      where: {
        restaurantId: user.restaurant.id,
      },
      include: {
        menuItems: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return (
      <div className="container mx-auto space-y-8 py-8">
        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize your menu items and categories with drag and drop functionality.
            </p>
          </div>
          <div className="p-6">
            <Suspense fallback={<Loading />}>
              <MenuPageClient initialCategories={categories} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in MenuPage:', error)
    return (
      <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Error loading menu</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            There was an error loading your menu. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
