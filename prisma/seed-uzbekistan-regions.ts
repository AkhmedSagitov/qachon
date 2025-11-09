import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const uzbekistanRegions = [
  { name: 'Ташкент (город)', slug: 'tashkent-city' },
  { name: 'Ташкентская область', slug: 'tashkent-region' },
  { name: 'Андижанская область', slug: 'andijan' },
  { name: 'Бухарская область', slug: 'bukhara' },
  { name: 'Ферганская область', slug: 'fergana' },
  { name: 'Джизакская область', slug: 'jizzakh' },
  { name: 'Кашкадарьинская область', slug: 'kashkadarya' },
  { name: 'Навоийская область', slug: 'navoiy' },
  { name: 'Наманганская область', slug: 'namangan' },
  { name: 'Самаркандская область', slug: 'samarkand' },
  { name: 'Сырдарьинская область', slug: 'sirdaryo' },
  { name: 'Сурхандарьинская область', slug: 'surxondaryo' },
  { name: 'Хорезмская область', slug: 'xorazm' },
  { name: 'Республика Каракалпакстан', slug: 'karakalpakstan' },
]

async function main() {
  console.log('🇺🇿 Adding Uzbekistan regions...')

  for (const region of uzbekistanRegions) {
    await prisma.region.upsert({
      where: { slug: region.slug },
      update: {},
      create: {
        name: region.name,
        slug: region.slug,
      },
    })
    console.log(`✅ Added: ${region.name}`)
  }

  console.log('✨ All Uzbekistan regions added!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
