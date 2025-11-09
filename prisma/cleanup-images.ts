import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Deleting all restaurant images...')

  const result = await prisma.restaurantImage.deleteMany({})

  console.log(`✅ Deleted ${result.count} restaurant images`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
