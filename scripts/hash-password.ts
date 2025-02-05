import { hash } from 'bcryptjs'

async function hashPassword() {
  const hashedPassword = await hash('@Here2Order1201', 12)
  console.log('Hashed password:', hashedPassword)
}

hashPassword() 