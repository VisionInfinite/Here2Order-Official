const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
    
    const user = await prisma.user.findUnique({
      where: {
        email: 'madhavendrasinghshaktawat@gmail.com'
      }
    })
    
    console.log('Test user:', user)
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 