import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    // Delete all related records first
    await prisma.order.deleteMany({})
    await prisma.menuItem.deleteMany({})
    await prisma.menuCategory.deleteMany({})
    await prisma.restaurant.deleteMany({})
    await prisma.user.deleteMany({})
    
    console.log('Database has been reset')
  } catch (error) {
    console.error('Error resetting database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase() 