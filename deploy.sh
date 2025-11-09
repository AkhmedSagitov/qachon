#!/bin/bash

# Скрипт для деплоя Tatarskaya Kuxnya
# Использование: ./deploy.sh

echo "🚀 Начинаем деплой Tatarskaya Kuxnya..."

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Ошибка: Файл .env не найден!"
    echo "Создайте файл .env с необходимыми переменными:"
    echo "  DATABASE_URL"
    echo "  NEXTAUTH_URL"
    echo "  NEXTAUTH_SECRET"
    exit 1
fi

echo "✅ Файл .env найден"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

# Генерация Prisma Client
echo ""
echo "🔧 Генерация Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при генерации Prisma Client"
    exit 1
fi

# Применение миграций
echo ""
echo "🗄️  Применение миграций базы данных..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при применении миграций"
    echo "Попробуйте вместо этого: npx prisma db push"
    exit 1
fi

# Сборка проекта
echo ""
echo "🔨 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке проекта"
    exit 1
fi

echo ""
echo "✅ Деплой завершен успешно!"
echo ""
echo "Для запуска проекта выполните:"
echo "  npm start"
echo ""
echo "Или с PM2:"
echo "  pm2 start npm --name tatarskaya-kuxnya -- start"
