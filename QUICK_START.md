# Быстрый старт для онлайн деплоя

## Шаг 1: Подготовка базы данных

Создайте PostgreSQL базу данных на одном из сервисов:
- **Supabase** (бесплатно): https://supabase.com
- **Railway** (бесплатно): https://railway.app
- **Neon** (бесплатно): https://neon.tech
- **AWS RDS**, **DigitalOcean**, **Azure**, и т.д.

После создания базы скопируйте connection string (например):
```
postgresql://user:password@host:5432/database
```

## Шаг 2: Настройка переменных окружения

Создайте файл `.env` из примера:
```bash
cp .env.example .env
```

Откройте `.env` и заполните:
```env
DATABASE_URL="postgresql://ваши-данные"
NEXTAUTH_URL="https://ваш-домен.com"
NEXTAUTH_SECRET="сгенерируйте-секретный-ключ"
```

Для генерации `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Шаг 3: Запуск деплоя

### Вариант А: Автоматический (Windows)
Просто запустите файл:
```bash
deploy-simple.bat
```

### Вариант Б: Вручную
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
npm start
```

## Шаг 4: Проверка

Откройте браузер:
```
http://localhost:3000
```

Или ваш домен:
```
https://ваш-домен.com
```

## Для Vercel (рекомендуется)

1. Создайте аккаунт на https://vercel.com
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения в настройках проекта:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Нажмите Deploy

Vercel автоматически выполнит build и запуск!

## Создание первого пользователя

После деплоя:
1. Откройте сайт
2. Нажмите "Кириш" (Войти)
3. Зарегистрируйтесь с email и паролем

Первый пользователь автоматически станет OWNER и сможет добавлять рестораны.

## Добавление регионов

Если база пустая, вам нужно добавить регионы через Prisma Studio:

```bash
npx prisma studio
```

Или создайте seed скрипт с регионами Узбекистана:
- Ташкент
- Самарканд
- Бухара
- Хива
- и т.д.

## Troubleshooting

**Ошибка подключения к БД:**
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что IP вашего сервера в whitelist базы данных

**Ошибка при миграции:**
- Попробуйте `npx prisma db push` вместо `migrate deploy`

**Не работает авторизация:**
- Проверьте `NEXTAUTH_URL` (должен совпадать с реальным URL)
- Проверьте `NEXTAUTH_SECRET` (должен быть установлен)

## Дополнительная помощь

См. файл `DEPLOYMENT.md` для подробной документации.
