# Деплой проекта Tatarskaya Kuxnya

## Подготовка базы данных

### 1. Настройка переменных окружения
Создайте файл `.env` на сервере со следующими переменными:

```bash
# База данных PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_URL="https://ваш-домен.com"
NEXTAUTH_SECRET="ваш-секретный-ключ-генерируйте-случайный"

# Для генерации NEXTAUTH_SECRET используйте:
# openssl rand -base64 32
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Генерация Prisma Client
```bash
npx prisma generate
```

### 4. Создание таблиц в базе данных (пустые таблицы)

**Вариант А: Используя миграции (рекомендуется для production)**
```bash
npx prisma migrate deploy
```

**Вариант Б: Прямая синхронизация схемы (быстрее, но без истории миграций)**
```bash
npx prisma db push
```

### 5. (Опционально) Заполнение начальными данными
Если у вас есть seed скрипт и нужны начальные данные (регионы и т.д.):
```bash
npm run db:seed
```

**Если НЕ нужны начальные данные - пропустите этот шаг!**

## Сборка и запуск проекта

### 6. Сборка проекта для production
```bash
npm run build
```

### 7. Запуск проекта
```bash
npm start
```

Или с указанием порта:
```bash
PORT=3000 npm start
```

## Быстрая команда для первого деплоя

Выполните все команды последовательно:

```bash
# Установка
npm install

# Prisma
npx prisma generate
npx prisma migrate deploy

# Сборка
npm run build

# Запуск
npm start
```

## Для Vercel/Netlify

Если деплоите на Vercel или похожие платформы:

1. Подключите репозиторий
2. Установите переменные окружения в панели управления
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Install Command: `npm install`

Prisma автоматически выполнит `prisma generate` при деплое.

## Для VPS/Dedicated Server с PM2

```bash
# Установка PM2
npm install -g pm2

# Все команды подготовки
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# Запуск с PM2
pm2 start npm --name "tatarskaya-kuxnya" -- start
pm2 save
pm2 startup
```

## Проверка базы данных

После деплоя проверьте, что таблицы созданы:

```bash
npx prisma studio
```

Или подключитесь к базе данных и проверьте список таблиц:
```sql
\dt  -- для PostgreSQL
```

Должны быть созданы таблицы:
- User
- Account
- Session
- VerificationToken
- Region
- Restaurant
- RestaurantImage
- EventSlot

## Обновление в будущем

При обновлении схемы базы данных:

```bash
# Создать миграцию в development
npx prisma migrate dev --name название_изменения

# Применить на production
npx prisma migrate deploy
```

## Troubleshooting

### Ошибка подключения к базе данных
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что PostgreSQL запущен
- Проверьте права доступа пользователя БД

### Ошибка Prisma Client
```bash
npx prisma generate --force
```

### Пересоздать базу данных (ОСТОРОЖНО! Удалит все данные)
```bash
npx prisma migrate reset
```
