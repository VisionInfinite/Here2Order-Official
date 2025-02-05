import { PrismaClient } from '@prisma/client'
import { slugify } from '@/lib/utils' // Create this utility if you don't have it

const prisma = new PrismaClient()

async function main() {
  // Get all restaurants
  const restaurants = await prisma.restaurant.findMany({
    include: {
      user: true
    }
  })

  // Update each restaurant
  for (const restaurant of restaurants) {
    // Generate a unique slug if it doesn't exist
    let slug = restaurant.slug
    if (!slug) {
      slug = slugify(restaurant.name)
      // Check if slug exists and make it unique if needed
      let counter = 1
      let uniqueSlug = slug
      while (await prisma.restaurant.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`
        counter++
      }
      slug = uniqueSlug
    }

    try {
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          slug,
          // If userId doesn't exist, create a new user or handle accordingly
          userId: restaurant.userId || restaurant.user?.id
        }
      })
      console.log(`Updated restaurant: ${restaurant.name} with slug: ${slug}`)
    } catch (error) {
      console.error(`Failed to update restaurant ${restaurant.name}:`, error)
    }
  }
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 