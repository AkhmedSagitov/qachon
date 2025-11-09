import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding more test restaurants...')

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
    'Oriental Palace',
    'Silk Road Hall',
    'Khan\'s Garden',
    'Amir Temur Hall',
    'Registan Banquet',
    'Samarkand Plaza',
    'Bukhara Terrace',
    'Fergana Valley',
    'Tashkent Tower',
    'Navoi Restaurant',
    'Ulugbek Palace',
    'Shahrisabz Hall',
    'Chorsu Garden',
    'Alisher Navoi Hall',
    'Babur Restaurant',
    'Mirzo Ulugbek',
    'Avicenna Hall',
    'Al-Khorezmi Palace',
    'Ibn Sino Garden',
    'Mirzo Babur Hall',
    'Tamerlane Palace',
    'Golden Samarkand',
    'Lotus Garden',
    'Imperial Hall',
    'Magnolia Terrace',
    'Orchid Restaurant',
    'Jasmine Hall',
    'Rose Garden Palace',
    'Lily Banquet Hall',
    'Tulip Restaurant',
    'Sunflower Hall',
    'Lavender Terrace',
    'Peony Palace',
    'Dahlia Garden',
    'Iris Restaurant'
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
    'Ресторан с летней террасой и садом',
    'Восточная кухня и европейский сервис',
    'Панорамный вид на город с крыши',
    'Классический интерьер в национальном стиле',
    'Большой зал на 300+ гостей',
    'Современная кухня от шеф-повара',
    'Ресторан с собственной парковкой',
    'Живая музыка каждые выходные',
    'Детская комната и игровая зона'
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
    'Нукус',
    'Коканд',
    'Маргилан',
    'Термез'
  ]

  const timestamp = Date.now()

  for (let i = 0; i < 35; i++) {
    const region = regions[i % regions.length]
    const city = cities[i % cities.length]

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantNames[i],
        slug: restaurantNames[i].toLowerCase().replace(/['\s]+/g, '-') + `-${timestamp}-${i + 1}`,
        description: descriptions[i % descriptions.length],
        address: `ул. ${i + 21}-я, дом ${(i * 3) + 15}`,
        city: city,
        phone: `+998 ${91 + (i % 8)}${(200 + i).toString().padStart(3, '0')}${(2000 + i).toString().padStart(4, '0')}`,
        email: `${restaurantNames[i].toLowerCase().replace(/['\s]+/g, '')}@restaurant.uz`,
        website: i % 4 === 0 ? `https://www.${restaurantNames[i].toLowerCase().replace(/['\s]+/g, '')}.uz` : null,
        capacity: 60 + (i * 15),
        pricePerHour: 6000 + (i * 400),
        regionId: region.id,
        ownerId: owner.id,
        isActive: true,
      },
    })

    console.log(`✅ Created restaurant: ${restaurant.name} (${city}, ${region.name})`)
  }

  console.log('🎉 Successfully created 35 more test restaurants!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding restaurants:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
