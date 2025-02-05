import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditMenuItemForm } from '@/components/menu/edit-menu-item-form'

export default async function EditMenuItemPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'RESTAURANT_ADMIN') {
    redirect('/login')
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id: params.id },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!menuItem) {
    redirect('/dashboard/menu')
  }

  const categories = await prisma.menuCategory.findMany({
    where: {
      restaurant: {
        userId: user.id
      }
    },
    select: {
      id: true,
      name: true
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Menu Item</h1>
      <EditMenuItemForm menuItem={menuItem} categories={categories} />
    </div>
  )
} 