import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Transliterate cyrillic to latin
function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('');
}

async function main() {
  console.log('🔧 Fixing restaurant slugs...')

  const restaurants = await prisma.restaurant.findMany()

  for (const restaurant of restaurants) {
    // Check if slug contains cyrillic characters
    if (/[а-яё]/i.test(restaurant.slug)) {
      const transliterated = transliterate(restaurant.name);
      const newSlug = transliterated
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);

      const finalSlug = `${newSlug}-${Date.now()}`;

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { slug: finalSlug }
      })

      console.log(`✅ Updated: ${restaurant.name}`)
      console.log(`   Old slug: ${restaurant.slug}`)
      console.log(`   New slug: ${finalSlug}`)
    }
  }

  console.log('✨ Done!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
