import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { NewMenuItemForm } from '@/components/menu/new-menu-item-form'

interface NewMenuItemPageProps {
  searchParams: Promise<{ categoryId?: string }>
}

export default async function NewMenuItemPage({
  searchParams,
}: NewMenuItemPageProps) {
  const params = await searchParams
  const user = await getCurrentUser()

  if (!user || user.role !== 'RESTAURANT_ADMIN') {
    redirect('/login')
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

  if (categories.length === 0) {
    redirect('/dashboard/menu')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Add Menu Item</h1>
      <NewMenuItemForm 
        categories={categories} 
        defaultCategoryId={params.categoryId}
      />
    </div>
  )
} 