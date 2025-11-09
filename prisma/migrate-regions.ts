import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

/**
 * Migration script to update old region slugs to new ones
 * Run this before the seed script on production
 */
async function main() {
  console.log('🔄 Migrating regions...')

  // Map old slugs to new slugs
  const migrations = [
    { oldSlug: 'tashkent', newSlug: 'tashkent-city', newName: 'Тошкент шаҳри' },
  ]

  for (const migration of migrations) {
    const oldRegion = await prisma.region.findUnique({
      where: { slug: migration.oldSlug },
      include: {
        restaurants: true,
      },
    })

    if (oldRegion) {
      console.log(`📌 Found old region: ${oldRegion.name} (${migration.oldSlug})`)

      // Check if new region already exists
      const newRegion = await prisma.region.findUnique({
        where: { slug: migration.newSlug },
      })

      if (newRegion) {
        // New region exists, migrate restaurants to it
        console.log(`✅ New region exists: ${newRegion.name} (${migration.newSlug})`)
        console.log(`📦 Migrating ${oldRegion.restaurants.length} restaurants...`)

        await prisma.restaurant.updateMany({
          where: { regionId: oldRegion.id },
          data: { regionId: newRegion.id },
        })

        // Delete old region
        await prisma.region.delete({
          where: { id: oldRegion.id },
        })

        console.log(`🗑️ Deleted old region: ${oldRegion.name}`)
      } else {
        // New region doesn't exist, update the old one
        console.log(`🔄 Updating region slug and name...`)

        await prisma.region.update({
          where: { id: oldRegion.id },
          data: {
            slug: migration.newSlug,
            name: migration.newName,
          },
        })

        console.log(`✅ Updated region to: ${migration.newName} (${migration.newSlug})`)
      }
    }
  }

  console.log('✨ Region migration completed!')
}

main()
  .catch((e) => {
    console.error('❌ Migration error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
