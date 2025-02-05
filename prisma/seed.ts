import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import type { UserCreateData } from './types'

async function main() {
  const hashedPassword = await hash('@Here2Order1201', 12)

  const userData: UserCreateData = {
    email: "official.here2order@gmail.com",
    name: "Super Admin",
    hashedPassword,
    role: "SUPER_ADMIN"
  }

  const superAdmin = await prisma.user.upsert({
    where: {
      email: "official.here2order@gmail.com"
    },
    update: {},
    create: userData
  })

  console.log({ superAdmin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 