# 🚀 Команды для запуска проекта

## Запуск проекта

### 1. Запуск PostgreSQL
```bash
pg_ctl -D "C:\ProgramData\scoop\apps\postgresql\current\data" start
```

### 2. Проверка миграций
```bash
npx prisma migrate dev
```

### 3. Наполнение БД тестовыми данными (если не делали)
```bash
npm run db:seed
```

### 4. Запуск dev сервера
```bash
npm run dev
```

Откройте: http://localhost:3000

---

## Тестовые аккаунты

**Клиент:**
- Email: `customer@test.com`
- Password: `password123`

**Владелец 1:**
- Email: `owner1@test.com`
- Password: `password123`

**Владелец 2:**
- Email: `owner2@test.com`
- Password: `password123`

---

## Полезные команды

```bash
# Prisma Studio (GUI для БД)
npx prisma studio

# Повторное наполнение БД
npm run db:seed

# Остановить PostgreSQL
pg_ctl -D "C:\ProgramData\scoop\apps\postgresql\current\data" stop

# Build проекта
npm run build

# Запуск production
npm run start
```

---

## Структура проекта

```
/                        - Главная (список ресторанов)
/restaurant/[slug]       - Страница ресторана с календарём
/my-bookings            - Мои бронирования (клиент)

/owner/dashboard         - Dashboard владельца
/owner/my-restaurants    - Список ресторанов владельца
/owner/restaurant/create - Добавить ресторан
/owner/restaurant/[id]   - Управление рестораном
/owner/restaurant/[id]/edit - Редактировать ресторан
/owner/restaurant/[id]/slots - Управление слотами
```

---

## Возможности

### Для клиентов:
✅ Просмотр всех ресторанов
✅ Фильтр по регионам
✅ Календарь бронирования
✅ Создание бронирования
✅ Просмотр своих бронирований

### Для владельцев:
✅ Dashboard с статистикой
✅ Создание ресторана
✅ Редактирование ресторана
✅ Удаление ресторана
✅ Управление слотами
✅ Просмотр бронирований
✅ Видят только свои рестораны

---

## Что реализовано

- ✅ Аутентификация с ролями
- ✅ CRUD для ресторанов (только владельцы)
- ✅ Система бронирований
- ✅ Календарь с доступными датами
- ✅ Валидация форм (Zod)
- ✅ Server Actions
- ✅ Защита маршрутов
- ✅ Responsive дизайн
