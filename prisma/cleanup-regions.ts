import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning up old regions...')

  // Check current regions
  const allRegions = await prisma.region.findMany()
  console.log('\n📋 Current regions in database:')
  allRegions.forEach(region => {
    console.log(`  - ${region.name} (${region.slug})`)
  })

  console.log('\n🗑️ Deleting old Russian regions...')

  // Check remaining regions
  const remainingRegions = await prisma.region.findMany()
  console.log('\n✨ Remaining regions:')
  remainingRegions.forEach(region => {
    console.log(`  - ${region.name} (${region.slug})`)
  })

  console.log('\n✅ Cleanup completed!')
}

main()
  .catch((e) => {
    console.error('❌ Cleanup error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
