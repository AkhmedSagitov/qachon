# 🍽️ Restaurant Event Booking System - Project Structure

## 📊 Database Schema Overview

### **Связи между таблицами:**

```
User (CUSTOMER)
  └─ has many → Booking
  └─ has many → Review

User (RESTAURANT_OWNER)
  └─ has many → Restaurant
      └─ belongs to → Region
      └─ has many → RestaurantImage
      └─ has many → EventSlot
          └─ has many → Booking
      └─ has many → Review
```

---

## 🗂️ Как работает система

### **1. User (Пользователь)**
- **role**: `CUSTOMER` (клиент) или `RESTAURANT_OWNER` (владелец) или `ADMIN`
- Клиенты бронируют слоты
- Владельцы управляют ресторанами

### **2. Region (Регион/Город)**
- Москва, Казань, Санкт-Петербург и т.д.
- Каждый ресторан привязан к региону

### **3. Restaurant (Ресторан)**
- Принадлежит владельцу (`User` с ролью `RESTAURANT_OWNER`)
- Находится в регионе (`Region`)
- Имеет фотографии (`RestaurantImage`)
- Имеет временные слоты (`EventSlot`)
- Имеет отзывы (`Review`)

### **4. EventSlot (Временной слот)**
- Конкретная дата и время
- Принадлежит ресторану
- Имеет цену, вместимость, тип мероприятия
- Может быть забронирован (`Booking`)

### **5. Booking (Бронирование)**
- Связывает клиента со слотом
- Статусы: PENDING, CONFIRMED, CANCELLED, COMPLETED
- Хранит информацию о количестве гостей

### **6. Review (Отзыв)**
- Клиент оставляет отзыв на ресторан
- Рейтинг 1-5 звезд

---

## 📁 Рекомендуемая структура папок

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (customer)/
│   │   ├── page.tsx                    # Главная с поиском
│   │   ├── regions/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Рестораны в регионе
│   │   ├── restaurant/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # Страница ресторана
│   │   │       └── book/
│   │   │           └── page.tsx        # Бронирование
│   │   ├── my-bookings/
│   │   │   └── page.tsx                # История бронирований
│   │   └── booking/
│   │       └── [id]/
│   │           └── page.tsx            # Детали бронирования
│   ├── (owner)/
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard владельца
│   │   ├── restaurant/
│   │   │   ├── create/
│   │   │   │   └── page.tsx            # Создание ресторана
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Управление рестораном
│   │   │       ├── slots/
│   │   │       │   └── page.tsx        # Управление слотами
│   │   │       ├── bookings/
│   │   │       │   └── page.tsx        # Бронирования ресторана
│   │   │       └── settings/
│   │   │           └── page.tsx        # Настройки ресторана
│   │   └── my-restaurants/
│   │       └── page.tsx                # Список ресторанов владельца
│   └── api/
│       ├── restaurants/
│       ├── bookings/
│       ├── slots/
│       └── reviews/
├── components/
│   ├── restaurant/
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantGallery.tsx
│   │   ├── RestaurantInfo.tsx
│   │   └── RestaurantList.tsx
│   ├── booking/
│   │   ├── BookingCalendar.tsx         # React Calendar
│   │   ├── BookingForm.tsx
│   │   ├── BookingCard.tsx
│   │   └── SlotSelector.tsx
│   ├── slot/
│   │   ├── SlotForm.tsx
│   │   ├── SlotList.tsx
│   │   └── SlotCalendar.tsx
│   ├── review/
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   └── RatingStars.tsx
│   ├── region/
│   │   ├── RegionSelector.tsx
│   │   └── RegionCard.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       ├── BookingChart.tsx
│       └── RecentBookings.tsx
├── actions/
│   ├── restaurant.actions.ts
│   ├── booking.actions.ts
│   ├── slot.actions.ts
│   └── review.actions.ts
├── lib/
│   ├── validations/
│   │   ├── restaurant.schema.ts
│   │   ├── booking.schema.ts
│   │   └── slot.schema.ts
│   └── utils/
│       ├── date.utils.ts
│       └── price.utils.ts
└── types/
    ├── restaurant.types.ts
    ├── booking.types.ts
    └── slot.types.ts
```

---

## 🎨 UI Components (Hero UI)

### **Основные компоненты:**

1. **Calendar Component** (react-calendar)
   - Показывает доступные даты
   - Интеграция с EventSlot

2. **Restaurant Cards**
   - Card component from Hero UI
   - Image carousel for gallery
   - Rating display

3. **Booking Modal/Form**
   - Modal component
   - Form with validation
   - Date/Time picker

4. **Dashboard Widgets**
   - Stats cards
   - Charts (можно использовать recharts)
   - Table для списка бронирований

5. **Navigation**
   - Navbar with role-based menus
   - Breadcrumbs
   - Tabs for dashboard sections

---

## 🚀 Поэтапный план разработки

### **Phase 1: Database & Auth** ✅
- [x] Prisma schema
- [x] Authentication (уже есть)
- [ ] Role-based access control

### **Phase 2: Restaurant Management**
- [ ] Создание/редактирование ресторана
- [ ] Загрузка фотографий
- [ ] Управление профилем ресторана

### **Phase 3: Slot Management**
- [ ] Создание слотов
- [ ] Календарь для владельцев
- [ ] Bulk slot creation (создание множества слотов)

### **Phase 4: Customer Features**
- [ ] Поиск по регионам
- [ ] Просмотр ресторанов
- [ ] Календарь с доступными датами
- [ ] Бронирование

### **Phase 5: Booking Management**
- [ ] Подтверждение/отклонение бронирований
- [ ] История бронирований
- [ ] Email уведомления

### **Phase 6: Reviews & Ratings**
- [ ] Система отзывов
- [ ] Рейтинги
- [ ] Модерация

### **Phase 7: Dashboard & Analytics**
- [ ] Dashboard для владельцев
- [ ] Статистика бронирований
- [ ] Графики и отчеты

---

## 🔧 Технические детали

### **Packages to install:**

```bash
npm install react-calendar @types/react-calendar
npm install recharts
npm install date-fns
npm install react-hook-form
npm install @tanstack/react-query
npm install uploadthing @uploadthing/react  # для загрузки фото
```

### **Environment Variables:**

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
UPLOADTHING_SECRET="..."      # для загрузки изображений
SMTP_HOST="..."                # для email уведомлений (optional)
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASSWORD="..."
```

---

## 💡 Дополнительные возможности (Future)

1. **Google Maps Integration**
   - Карта с маркерами ресторанов
   - Поиск ближайших ресторанов

2. **Email Notifications**
   - Подтверждение бронирования
   - Напоминания о мероприятии
   - Уведомления владельцам

3. **Analytics Dashboard**
   - Популярные даты
   - Статистика бронирований
   - Revenue tracking

4. **Advanced Search**
   - Фильтры по цене
   - Фильтры по вместимости
   - Фильтры по типу мероприятия

5. **Calendar Integration**
   - Export to Google Calendar
   - iCal format

6. **Multi-language Support**
   - next-intl для интернационализации

7. **Mobile App**
   - React Native version

---

## 📝 Example Queries

### **Get available slots for a restaurant:**
```typescript
const slots = await prisma.eventSlot.findMany({
  where: {
    restaurantId: 'xxx',
    date: { gte: new Date() },
    isAvailable: true
  },
  include: {
    restaurant: true,
    bookings: true
  }
})
```

### **Create a booking:**
```typescript
const booking = await prisma.booking.create({
  data: {
    userId: 'xxx',
    eventSlotId: 'xxx',
    guestCount: 50,
    eventType: 'WEDDING',
    customerName: 'Иван Петров',
    customerPhone: '+7...',
    customerEmail: 'ivan@example.com',
    totalPrice: 50000
  }
})
```

### **Get restaurant with all data:**
```typescript
const restaurant = await prisma.restaurant.findUnique({
  where: { slug: 'tatarskaya-kuxnya' },
  include: {
    owner: true,
    region: true,
    images: true,
    eventSlots: {
      where: {
        date: { gte: new Date() },
        isAvailable: true
      }
    },
    reviews: {
      include: { user: true }
    }
  }
})
```
