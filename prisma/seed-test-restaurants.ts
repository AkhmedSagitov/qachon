import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding 20 test restaurants...')

  // Get existing regions
  const regions = await prisma.region.findMany()
  if (regions.length === 0) {
    console.error('❌ No regions found. Please run seed-uzbekistan-regions.ts first')
    return
  }

  // Get or create a test owner
  let owner = await prisma.user.findFirst({
    where: { role: 'OWNER' }
  })

  if (!owner) {
    console.log('Creating test owner...')
    owner = await prisma.user.create({
      data: {
        email: 'owner@test.com',
        password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // password123
        role: 'OWNER',
        name: 'Test Owner'
      }
    })
  }

  const restaurantNames = [
    'Grand Palace',
    'Royal Garden',
    'Golden Crown',
    'Silver Moon',
    'Paradise Hall',
    'Crystal Ballroom',
    'Emerald Terrace',
    'Diamond Lounge',
    'Sapphire Restaurant',
    'Ruby Hall',
    'Pearl Banquet',
    'Amber Garden',
    'Jade Palace',
    'Opal Terrace',
    'Coral Bay Restaurant',
    'Marble Hall',
    'Ivory Tower',
    'Azure Sky',
    'Crimson Garden',
    'Velvet Room'
  ]

  const descriptions = [
    'Элегантный ресторан для незабываемых мероприятий',
    'Роскошный банкетный зал с современным дизайном',
    'Уютная атмосфера для свадеб и торжеств',
    'Просторный зал с панорамным видом',
    'Идеальное место для корпоративных мероприятий',
    'Традиционная кухня и современный сервис',
    'Ресторан премиум-класса в центре города',
    'Семейный ресторан с большим залом',
    'Стильный интерьер и профессиональное обслуживание',
    'Ресторан с летней террасой и садом'
  ]

  const cities = [
    'Ташкент',
    'Самарканд',
    'Бухара',
    'Андижан',
    'Фергана',
    'Наманган',
    'Навои',
    'Джизак',
    'Карши',
    'Нукус'
  ]

  for (let i = 0; i < 20; i++) {
    const region = regions[i % regions.length]
    const city = cities[i % cities.length]

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantNames[i],
        slug: restaurantNames[i].toLowerCase().replace(/\s+/g, '-') + `-${i + 1}`,
        description: descriptions[i % descriptions.length],
        address: `ул. ${i + 1}-я, дом ${(i * 5) + 10}`,
        city: city,
        phone: `+998 ${90 + (i % 9)}${(100 + i).toString().padStart(3, '0')}${(1000 + i).toString().padStart(4, '0')}`,
        email: `${restaurantNames[i].toLowerCase().replace(/\s+/g, '')}@restaurant.uz`,
        website: i % 3 === 0 ? `https://www.${restaurantNames[i].toLowerCase().replace(/\s+/g, '')}.uz` : null,
        capacity: 50 + (i * 10),
        pricePerHour: 5000 + (i * 500),
        regionId: region.id,
        ownerId: owner.id,
        isActive: true,
      },
    })

    console.log(`✅ Created restaurant: ${restaurant.name} (${city}, ${region.name})`)
  }

  console.log('🎉 Successfully created 20 test restaurants!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding restaurants:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
