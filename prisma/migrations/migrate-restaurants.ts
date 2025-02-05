import { PrismaClient } from '@prisma/client'
import { slugify } from '@/lib/utils'

const prisma = new PrismaClient()

async function main() {
  // Update existing restaurants
  const users = await prisma.user.findMany({
    where: {
      role: 'RESTAURANT_ADMIN'
    }
  })

  for (const user of users) {
    try {
      // First check if restaurant already exists
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: {
          userId: user.id
        }
      })

      if (existingRestaurant) {
        console.log(`Restaurant already exists for user: ${user.name}`)
        continue
      }

      // Generate a unique slug
      let baseSlug = slugify(`${user.name}'s Restaurant`)
      let slug = baseSlug
      let counter = 1

      // Keep checking until we find a unique slug
      while (await prisma.restaurant.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Create the restaurant with the unique slug
      await prisma.restaurant.create({
        data: {
          name: `${user.name}'s Restaurant`,
          description: `Welcome to ${user.name}'s Restaurant`,
          websiteGenerated: false,
          user: {
            connect: {
              id: user.id
            }
          },
          slug // This will be unique
        }
      })

      console.log(`Created restaurant for user: ${user.name} with slug: ${slug}`)
    } catch (error) {
      console.error(`Failed to create restaurant for user: ${user.name}`, error)
    }
  }
}

main()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 