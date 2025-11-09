import { PrismaClient, UserRole, EventType } from '../src/generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create test users (all are OWNER role now)
  console.log('👤 Creating users...')

  const ownerUser1 = await prisma.user.upsert({
    where: { email: 'owner1@test.com' },
    update: {},
    create: {
      email: 'owner1@test.com',
      password: hashedPassword,
      role: UserRole.OWNER,
      name: 'Акбар Рахимов',
      phone: '+998 (90) 123-45-67',
    },
  })

  const ownerUser2 = await prisma.user.upsert({
    where: { email: 'owner2@test.com' },
    update: {},
    create: {
      email: 'owner2@test.com',
      password: hashedPassword,
      role: UserRole.OWNER,
      name: 'Дилбар Каримова',
      phone: '+998 (91) 234-56-78',
    },
  })

  console.log('✅ Users created')

  // 2. Create regions
  console.log('🌍 Creating regions...')

  const tashkent = await prisma.region.upsert({
    where: { slug: 'tashkent' },
    update: {},
    create: {
      name: 'Ташкент',
      slug: 'tashkent',
    },
  })

  const samarkand = await prisma.region.upsert({
    where: { slug: 'samarkand' },
    update: {},
    create: {
      name: 'Самарканд',
      slug: 'samarkand',
    },
  })

  const bukhara = await prisma.region.upsert({
    where: { slug: 'bukhara' },
    update: {},
    create: {
      name: 'Бухара',
      slug: 'bukhara',
    },
  })

  console.log('✅ Regions created')

  // 3. Create restaurants
  console.log('🍽️ Creating restaurants...')

  const restaurant1 = await prisma.restaurant.upsert({
    where: { slug: 'oqsaroy-palace' },
    update: {},
    create: {
      name: 'Оқсарой',
      slug: 'oqsaroy-palace',
      description: 'Роскошный банкетный зал в самом центре Ташкента. Традиционная узбекская архитектура с современным комфортом. Идеальное место для проведения свадеб и торжеств.',
      address: 'ул. Амира Темура, 15',
      city: 'Ташкент',
      latitude: 41.311151,
      longitude: 69.279737,
      ownerId: ownerUser1.id,
      regionId: tashkent.id,
      phone: '+998 (71) 200-00-00',
      email: 'info@oqsaroy.uz',
      website: 'https://oqsaroy.uz',
      capacity: 200,
      pricePerHour: 5000,
      isActive: true,
    },
  })

  const restaurant2 = await prisma.restaurant.upsert({
    where: { slug: 'registan-hall' },
    update: {},
    create: {
      name: 'Регистан Холл',
      slug: 'registan-hall',
      description: 'Величественный банкетный зал в историческом центре Самарканда. Роскошный восточный интерьер, изысканная кухня, незабываемая атмосфера.',
      address: 'Регистан площадь, 5',
      city: 'Самарканд',
      latitude: 39.654831,
      longitude: 66.975463,
      ownerId: ownerUser1.id,
      regionId: samarkand.id,
      phone: '+998 (66) 233-11-11',
      email: 'booking@registan-hall.uz',
      website: 'https://registan-hall.uz',
      capacity: 250,
      pricePerHour: 7000,
      isActive: true,
    },
  })

  const restaurant3 = await prisma.restaurant.upsert({
    where: { slug: 'shahriston-garden' },
    update: {},
    create: {
      name: 'Шахристон Гарден',
      slug: 'shahriston-garden',
      description: 'Уютный ресторан с садом в историческом центре Бухары. Традиционная узбекская кухня, приготовленная по старинным семейным рецептам.',
      address: 'ул. Накшбанди, 28',
      city: 'Бухара',
      latitude: 39.775281,
      longitude: 64.421364,
      ownerId: ownerUser2.id,
      regionId: bukhara.id,
      phone: '+998 (65) 224-22-22',
      email: 'info@shahriston.uz',
      capacity: 120,
      pricePerHour: 4000,
      isActive: true,
    },
  })

  const restaurant4 = await prisma.restaurant.upsert({
    where: { slug: 'silk-road-palace' },
    update: {},
    create: {
      name: 'Шелковый Путь',
      slug: 'silk-road-palace',
      description: 'Элегантный банкетный комплекс в Ташкенте. Современный дизайн с восточными мотивами, высокий уровень обслуживания.',
      address: 'просп. Мустакиллик, 45',
      city: 'Ташкент',
      latitude: 41.326181,
      longitude: 69.288521,
      ownerId: ownerUser2.id,
      regionId: tashkent.id,
      phone: '+998 (71) 150-50-50',
      email: 'info@silkroad.uz',
      capacity: 180,
      pricePerHour: 6000,
      isActive: true,
    },
  })

  console.log('✅ Restaurants created')

  // 4. Add restaurant images - COMMENTED OUT (no actual image files exist)
  // Restaurants will use placeholder images from SafeImage component
  console.log('ℹ️ Skipping restaurant images (using placeholders)')

  // 5. Create event slots for the next 30 days
  console.log('📅 Creating event slots...')

  const today = new Date()
  const slots = []

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Create 3-4 slots per day for each restaurant (утро, день, вечер, ночь)
    const timeSlots = [
      {
        start: '10:00:00',
        end: '14:00:00',
        price: 20000,
        type: EventType.CORPORATE,
        description: 'Утренний слот - идеально для бизнес-завтраков и корпоративов'
      },
      {
        start: '14:00:00',
        end: '18:00:00',
        price: 25000,
        type: EventType.WEDDING,
        description: 'Дневное время - отлично для свадебных церемоний и юбилеев'
      },
      {
        start: '18:00:00',
        end: '22:00:00',
        price: 35000,
        type: EventType.BIRTHDAY,
        description: 'Вечернее время - романтическая атмосфера для празднования'
      },
      {
        start: '22:00:00',
        end: '02:00:00',
        price: 30000,
        type: EventType.OTHER,
        description: 'Ночное время - для тех кто любит праздновать до утра'
      },
    ]

    for (const restaurant of [restaurant1, restaurant2, restaurant3, restaurant4]) {
      // Создаём 3-4 случайных слота на день (не все 4, чтобы было разнообразие)
      const numSlots = Math.floor(Math.random() * 2) + 2 // 2 или 3 слота
      const selectedSlots = timeSlots.slice(0, numSlots + 1) // Берём первые 2-3 слота

      for (const timeSlot of selectedSlots) {
        // Create time objects
        const startTime = new Date(`1970-01-01T${timeSlot.start}Z`)
        const endTime = new Date(`1970-01-01T${timeSlot.end}Z`)

        slots.push({
          restaurantId: restaurant.id,
          date: date,
          startTime: startTime,
          endTime: endTime,
          capacity: restaurant.capacity,
          eventType: timeSlot.type,
          price: timeSlot.price,
          isAvailable: Math.random() > 0.2, // 80% available
          description: timeSlot.description,
        })
      }
    }
  }

  await prisma.eventSlot.createMany({
    data: slots,
  })

  console.log(`✅ Created ${slots.length} event slots`)
  console.log(`📊 Average ${Math.round(slots.length / 30 / 4)} slots per day per restaurant`)

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
