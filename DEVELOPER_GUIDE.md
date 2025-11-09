# Developer Guide - Restaurant Events Platform

This comprehensive guide explains how the codebase works, what triggers what, and how to extend functionality.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Authentication Flow](#authentication-flow)
3. [Restaurant Management Flow](#restaurant-management-flow)
4. [Slot Management Flow](#slot-management-flow)
5. [File Upload Flow](#file-upload-flow)
6. [Database Schema & Relationships](#database-schema--relationships)
7. [State Management](#state-management)
8. [Content Management](#content-management)
9. [How to Extend](#how-to-extend)
10. [Common Tasks Guide](#common-tasks-guide)

---

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Library**: HeroUI (React)
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **State**: Zustand (for auth state)

### Folder Structure

```
src/
├── actions/              # Server Actions (data mutations)
│   ├── restaurant.actions.ts
│   ├── slot.actions.ts
│   ├── register.tsx
│   ├── sign-in.ts
│   └── sign-out.ts
│
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Home page (public)
│   ├── restaurant/
│   │   └── [slug]/page.tsx  # Restaurant detail (public)
│   ├── owner/           # Protected owner routes
│   │   ├── dashboard/
│   │   ├── my-restaurants/
│   │   └── restaurant/
│   └── api/
│       └── upload/route.ts  # File upload API
│
├── components/          # React components
│   ├── restaurant/     # Restaurant-related components
│   ├── slot/          # Slot-related components
│   └── UI/            # Generic UI components
│
├── forms/              # Form components (login, registration)
├── auth/               # NextAuth configuration
├── actions/            # Server-side actions
├── lib/
│   └── validations/   # Zod validation schemas
├── schema/            # Additional Zod schemas
├── content/           # Centralized text content
├── config/            # App configuration
├── store/             # Zustand stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── hoc/               # Higher-order components
└── generated/prisma/  # Generated Prisma client

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding
```

---

## Authentication Flow

### Components Involved

1. **NextAuth Configuration** (`src/auth/auth.ts`)
2. **Prisma Adapter** (connects NextAuth to database)
3. **Auth Store** (`src/store/auth.store.ts`)
4. **Login Form** (`src/forms/login.form.tsx`)
5. **Registration Form** (`src/forms/registration.form.tsx`)
6. **Server Actions** (`src/actions/sign-in.ts`, `register.tsx`)

### Registration Flow

```mermaid
User clicks "Register"
  ↓
RegistrationModal opens (src/components/UI/modals/registration.modal.tsx)
  ↓
User fills form (src/forms/registration.form.tsx)
  ↓
Form validates with Zod (src/schema/zod.ts - registerSchema)
  ↓
Calls register() server action (src/actions/register.tsx)
  ↓
Server Action:
  1. Validates data again (server-side)
  2. Checks if user exists (Prisma query)
  3. Hashes password (bcryptjs)
  4. Creates user in database (Prisma create)
  5. Signs user in (signIn from NextAuth)
  ↓
Auth state updates (src/store/auth.store.ts)
  ↓
User redirected to appropriate page
```

**Key Functions:**

**`register()` - src/actions/register.tsx**
```typescript
// What it does:
// 1. Validates form data
// 2. Checks for duplicate email
// 3. Hashes password
// 4. Creates user in DB
// 5. Signs user in

// Triggers: Form submission in registration.form.tsx
// Returns: { success: true } or { error: string }
```

**`signInAction()` - src/actions/sign-in.ts**
```typescript
// What it does:
// 1. Validates credentials
// 2. Calls NextAuth signIn()
// 3. Verifies user exists in DB

// Triggers: Form submission in login.form.tsx
// Returns: { success: true } or { error: string }
```

### Login Flow

```
User clicks "Login"
  ↓
LoginModal opens
  ↓
User enters credentials
  ↓
Validates with loginSchema (src/schema/zod.ts)
  ↓
Calls signInAction() (src/actions/sign-in.ts)
  ↓
NextAuth authenticates:
  1. Checks credentials
  2. Queries user from DB
  3. Verifies password
  4. Creates session
  ↓
Session stored in cookie
  ↓
Auth store updates
  ↓
User sees authenticated UI
```

### Session Management

**Where session is checked:**

1. **Server Components**: `await auth()` from `src/auth/auth.ts`
2. **Client Components**: `useAuthStore()` from `src/store/auth.store.ts`
3. **Middleware**: Redirects based on role

**Session Structure:**
```typescript
{
  user: {
    id: string
    email: string
    name: string | null
    role: "OWNER" | "CUSTOMER"
  }
  expires: string
}
```

---

## Restaurant Management Flow

### Create Restaurant Flow

```
Owner clicks "Add Restaurant"
  ↓
Navigate to /owner/restaurant/create
  ↓
RestaurantForm loads (src/components/restaurant/RestaurantForm.tsx)
  ↓
Form uses react-hook-form for state management
  ↓
User fills form:
  - Name, description
  - Region (from getRegions() action)
  - Address, city
  - Capacity, price
  - Images (optional)
  ↓
On submit:
  1. Validates with restaurantSchema (src/lib/validations/restaurant.schema.ts)
  2. Calls createRestaurant() (src/actions/restaurant.actions.ts)
  ↓
Server Action (createRestaurant):
  1. Verifies user is OWNER
  2. Validates data
  3. Creates slug from name (transliteration)
  4. Creates restaurant in DB
  5. Creates related images if provided
  6. Returns restaurant data
  ↓
Redirects to restaurant detail page
```

**Key Functions:**

**`createRestaurant()` - src/actions/restaurant.actions.ts**
```typescript
// What it does:
// 1. Checks authentication & authorization (OWNER role)
// 2. Validates restaurant data with Zod
// 3. Generates unique slug from name
// 4. Creates restaurant record
// 5. Creates image records if provided
// 6. Returns created restaurant or error

// Triggers: Form submission in RestaurantForm.tsx
// Database: Creates Restaurant + RestaurantImage records
// Permissions: OWNER role required
```

**`getRestaurants()` - src/actions/restaurant.actions.ts**
```typescript
// What it does:
// 1. Accepts filters (search, region, page, limit)
// 2. Builds Prisma query with filters
// 3. Fetches restaurants with relations (images, region)
// 4. Calculates pagination
// 5. Returns restaurants + pagination data

// Triggers: Page load on home page, search form submission
// Database: Reads Restaurant + RestaurantImage + Region
// Permissions: Public (no auth required)
```

### Edit Restaurant Flow

```
Owner goes to restaurant detail page
  ↓
Clicks "Edit"
  ↓
Navigate to /owner/restaurant/[id]/edit
  ↓
Page loads (src/app/owner/restaurant/[id]/edit/page.tsx):
  1. Verifies ownership
  2. Fetches restaurant data
  3. Serializes Decimal fields to numbers
  ↓
RestaurantEditForm loads with pre-filled data
  ↓
User modifies fields
  ↓
On submit:
  1. Validates with restaurantSchema
  2. Calls updateRestaurant() (src/actions/restaurant.actions.ts)
  ↓
Server Action (updateRestaurant):
  1. Verifies user is owner of this restaurant
  2. Updates restaurant record
  3. Updates images if changed
  4. Returns success
  ↓
Redirects back to restaurant detail
```

**`updateRestaurant()` - src/actions/restaurant.actions.ts**
```typescript
// What it does:
// 1. Verifies user owns the restaurant
// 2. Validates new data
// 3. Updates restaurant record
// 4. Handles image updates/deletions
// 5. Returns updated restaurant

// Triggers: Form submission in RestaurantEditForm.tsx
// Database: Updates Restaurant + RestaurantImage records
// Permissions: Must be owner of the restaurant
```

### Delete Restaurant Flow

```
Owner on restaurant detail page
  ↓
Clicks "Delete Restaurant"
  ↓
DeleteRestaurantButton shows confirmation modal
  ↓
User confirms
  ↓
Calls deleteRestaurant() (src/actions/restaurant.actions.ts)
  ↓
Server Action:
  1. Verifies ownership
  2. Deletes related records (images, slots) - CASCADE
  3. Deletes restaurant
  4. Returns success
  ↓
Redirects to my-restaurants page
```

### Restaurant Data Flow

```
Database (PostgreSQL)
  ↓
Prisma ORM (type-safe queries)
  ↓
Server Actions (src/actions/restaurant.actions.ts)
  ↓
Server Components (fetch data) or Client Components (mutation)
  ↓
UI Components (display/forms)
```

---

## Slot Management Flow

### What are Slots?

Slots represent available time slots for events at restaurants. Each slot has:
- Date
- Start/End time
- Capacity
- Price
- Event type (wedding, birthday, corporate, other)
- Availability status

### Create Single Slot Flow

```
Owner navigates to restaurant's slot management page
  ↓
URL: /owner/restaurant/[id]/slots
  ↓
SlotForms component loads (src/components/slot/SlotForms.tsx)
  ↓
User selects "Single Slot" tab
  ↓
Fills form:
  - Date
  - Start time
  - End time
  - Price
  - Event type (optional)
  ↓
On submit:
  1. Validates with slotSchema (src/lib/validations/slot.schema.ts)
  2. Calls createEventSlot() (src/actions/slot.actions.ts)
  ↓
Server Action (createEventSlot):
  1. Verifies user owns the restaurant
  2. Validates data
  3. Uses restaurant's capacity as slot capacity
  4. Creates EventSlot record
  5. Returns created slot
  ↓
UI shows success alert
  ↓
SlotList refreshes (router.refresh())
```

**`createEventSlot()` - src/actions/slot.actions.ts**
```typescript
// What it does:
// 1. Verifies user is OWNER
// 2. Checks user owns the restaurant
// 3. Validates slot data with Zod
// 4. Creates slot with restaurant's capacity
// 5. Returns created slot or error

// Triggers: Single slot form submission
// Database: Creates EventSlot record
// Permissions: Must own the restaurant
```

### Create Bulk Slots Flow

```
User selects "Multiple Slots" tab
  ↓
Fills form:
  - Start date
  - End date
  - Start time
  - End time
  - Price
  - Event type
  ↓
On submit:
  1. Validates with bulkSlotSchema
  2. Calls createBulkSlots() (src/actions/slot.actions.ts)
  ↓
Server Action (createBulkSlots):
  1. Verifies ownership
  2. Generates array of dates (start to end)
  3. Creates one slot per day
  4. Uses createMany for efficiency
  5. Returns count of created slots
  ↓
UI shows "Successfully created X slots!"
```

**`createBulkSlots()` - src/actions/slot.actions.ts**
```typescript
// What it does:
// 1. Verifies ownership and validates data
// 2. Generates date range (start to end date)
// 3. Creates one slot for each day
// 4. Batch creates with Prisma createMany
// 5. Returns count of created slots

// Triggers: Bulk slot form submission
// Database: Creates multiple EventSlot records
// Example: Start 2024-01-01, End 2024-01-05 = 5 slots
```

### View/Display Slots Flow

```
Public user visits restaurant page
  ↓
Page loads available slots
  ↓
Calls getAvailableSlots() (src/actions/slot.actions.ts)
  ↓
Server Action:
  1. Queries slots for restaurant
  2. Filters: date >= today, isAvailable = true
  3. Orders by date, then startTime
  4. Returns slots array
  ↓
SlotList component displays slots
  ↓
Groups slots by date (using date-fns)
  ↓
Shows each slot with:
  - Time range
  - Capacity
  - Price
  - Event type
  - Availability status
```

**`getAvailableSlots()` - src/actions/slot.actions.ts**
```typescript
// What it does:
// 1. Fetches slots for a restaurant
// 2. Filters: future dates only, available only
// 3. Orders chronologically
// 4. Returns slot array

// Triggers: Restaurant detail page load
// Database: Reads EventSlot records
// Permissions: Public (no auth required)
```

### Delete Slot Flow

```
Owner viewing slots
  ↓
Clicks "Delete" on a slot
  ↓
Browser confirms: "Are you sure?"
  ↓
If confirmed:
  Calls deleteEventSlot() (src/actions/slot.actions.ts)
  ↓
Server Action:
  1. Verifies user owns the restaurant
  2. Deletes EventSlot record
  3. Returns success
  ↓
Page refreshes to show updated list
```

---

## File Upload Flow

### Image Upload Process

```
User clicks "Add Image" in restaurant form
  ↓
<input type="file"> triggers
  ↓
handleImageUpload() function runs (RestaurantForm.tsx)
  ↓
Creates FormData with file
  ↓
Sends POST to /api/upload
  ↓
Upload API Route (src/app/api/upload/route.ts):
  1. Validates file exists
  2. Checks file type (jpg, png, webp, gif only)
  3. Checks file size (<= 5MB)
  4. Generates unique filename (Date.now())
  5. Saves to /public/uploads/
  6. Returns file URL
  ↓
Form updates images array with new URL
  ↓
On form submit, URLs saved to database
```

**File Upload API** - `src/app/api/upload/route.ts`
```typescript
// What it does:
// 1. Receives multipart/form-data file
// 2. Validates file type and size
// 3. Saves to public/uploads/ directory
// 4. Returns public URL for the file

// Triggers: File selection in forms
// Storage: /public/uploads/[timestamp]-[originalname]
// Returns: { url: "/uploads/[filename]" }
// Max size: 5MB
// Allowed: JPG, PNG, WebP, GIF
```

### Image Display

```
Database stores: "/uploads/image-12345.jpg"
  ↓
Component receives URL
  ↓
Next.js <Image> component
  ↓
Serves from /public directory
  ↓
Browser displays image
```

---

## Database Schema & Relationships

### Core Tables

**User**
```prisma
model User {
  id            String       @id @default(cuid())
  email         String       @unique
  password      String       // Hashed with bcrypt
  name          String?
  phone         String?
  role          UserRole     // OWNER or CUSTOMER

  // Relations
  restaurants   Restaurant[] // One user has many restaurants
  accounts      Account[]    // NextAuth accounts
  sessions      Session[]    // NextAuth sessions
}
```

**Restaurant**
```prisma
model Restaurant {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique    // Generated from name
  description String?
  address     String
  city        String
  phone       String?
  email       String?
  website     String?
  capacity    Int
  pricePerHour Decimal   @db.Decimal(10, 2)
  latitude    Float?
  longitude   Float?

  // Foreign Keys
  ownerId     String
  regionId    String

  // Relations
  owner       User              @relation(...)
  region      Region            @relation(...)
  images      RestaurantImage[]
  eventSlots  EventSlot[]

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**EventSlot**
```prisma
model EventSlot {
  id          String    @id @default(cuid())
  date        DateTime  // Event date
  startTime   String    // Format: "HH:MM"
  endTime     String    // Format: "HH:MM"
  capacity    Int       // Inherited from restaurant
  price       Decimal   @db.Decimal(10, 2)
  isAvailable Boolean   @default(true)
  eventType   String?   // wedding, birthday, corporate, other

  // Foreign Key
  restaurantId String

  // Relations
  restaurant  Restaurant @relation(...)

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**RestaurantImage**
```prisma
model RestaurantImage {
  id          String     @id @default(cuid())
  url         String     // Path to image file
  alt         String?    // Alt text for accessibility
  isPrimary   Boolean    @default(false) // First image

  // Foreign Key
  restaurantId String

  // Relations
  restaurant  Restaurant @relation(...)

  createdAt   DateTime  @default(now())
}
```

**Region**
```prisma
model Region {
  id          String       @id @default(cuid())
  name        String       @unique
  slug        String       @unique

  // Relations
  restaurants Restaurant[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Relationships

```
User (OWNER)
  ├── restaurants (1 to many)
      ├── images (1 to many)
      ├── eventSlots (1 to many)
      └── region (many to 1)
```

### Cascade Deletes

When a Restaurant is deleted:
- All `RestaurantImage` records are deleted (CASCADE)
- All `EventSlot` records are deleted (CASCADE)

Configured in `prisma/schema.prisma`:
```prisma
images @relation(onDelete: Cascade)
eventSlots @relation(onDelete: Cascade)
```

---

## State Management

### Client-Side State

**Auth Store** - `src/store/auth.store.ts`
```typescript
// Purpose: Track authentication state on client
// Uses: Zustand for state management

interface AuthState {
  isAuth: boolean          // Is user logged in?
  status: "loading" | "authenticated" | "unauthenticated"
  session: Session | null  // User session data

  // Actions
  setAuthState: (status, session) => void
  clearAuth: () => void
}

// Where it's used:
// - Header component (show/hide auth buttons)
// - Protected routes (redirect if not auth)
// - User-specific features
```

**How it's updated:**
```typescript
// On app load (AppLoader component)
const session = await auth()  // Fetch from server
store.setAuthState(...)       // Update client state

// On login/register
signIn() → Session created → Store updated

// On logout
signOut() → Session destroyed → Store cleared
```

### Form State

Forms use `react-hook-form` for state management:

```typescript
const form = useForm<RestaurantFormData>({
  resolver: zodResolver(restaurantSchema), // Validation
  defaultValues: { ... }                   // Initial values
})

// Managed automatically:
// - Input values
// - Validation errors
// - Dirty state
// - Submit handling
```

### Server State

Server components fetch data directly:
```typescript
// No state management needed
const restaurants = await getRestaurants()
return <RestaurantList restaurants={restaurants} />
```

Server actions handle mutations:
```typescript
// Updates happen server-side
await updateRestaurant(data)
router.refresh() // Re-fetch server component
```

---

## Content Management

### Centralized Text System

All text content is in: `src/content/text.content.ts`

**Structure:**
```typescript
export const content = {
  site: { title, description, ... },
  auth: { login, register, errors, ... },
  restaurant: { labels, messages, errors, ... },
  slot: { labels, messages, ... },
  validation: { all validation messages },
  // ... more categories
}
```

**Usage in components:**
```typescript
import { content } from "@/content/text.content";

// Simple text
<h1>{content.site.title}</h1>

// Dynamic text (functions)
<p>{content.auth.greeting(user.email)}</p>
<span>{content.restaurant.priceFrom("5000")}</span>

// In validation schemas
z.string().min(2, { message: content.validation.nameMin(2) })
```

**Benefits:**
1. Single source of truth for all text
2. Easy to find and update text
3. Consistent terminology
4. Ready for internationalization (i18n)
5. Type-safe with TypeScript

**Adding new content:**
```typescript
// 1. Add to content object
export const content = {
  myFeature: {
    title: "My Feature",
    description: "Description here",
    action: (name: string) => `Action for ${name}`,
  }
}

// 2. Use in components
import { content } from "@/content/text.content";
<div>{content.myFeature.title}</div>
```

---

## How to Extend

### Adding a New Feature

Let's walk through adding a "Bookings" feature:

#### 1. Database Schema

**Edit `prisma/schema.prisma`:**
```prisma
model Booking {
  id          String    @id @default(cuid())

  // Foreign keys
  customerId  String
  slotId      String

  // Booking details
  guestCount  Int
  totalPrice  Decimal   @db.Decimal(10, 2)
  status      BookingStatus @default(PENDING)
  notes       String?

  // Relations
  customer    User      @relation(fields: [customerId], references: [id])
  slot        EventSlot @relation(fields: [slotId], references: [id])

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

Run migration:
```bash
npx prisma migrate dev --name add-bookings
```

#### 2. TypeScript Types

**Create `src/types/booking.types.ts`:**
```typescript
import { Booking, User, EventSlot } from '@/generated/prisma'

export type BookingWithRelations = Booking & {
  customer: User
  slot: EventSlot & {
    restaurant: Restaurant
  }
}

export type BookingFormData = {
  slotId: string
  guestCount: number
  notes?: string
}
```

#### 3. Validation Schema

**Create `src/lib/validations/booking.schema.ts`:**
```typescript
import { z } from 'zod'
import { content } from '@/content/text.content'

export const bookingSchema = z.object({
  slotId: z.string().uuid(),
  guestCount: z.number().int().min(1),
  notes: z.string().optional(),
})
```

#### 4. Content/Text

**Add to `src/content/text.content.ts`:**
```typescript
export const content = {
  // ... existing content

  booking: {
    title: "Бронирования",
    create: "Создать бронирование",
    myBookings: "Мои бронирования",

    guestCount: "Количество гостей",
    notes: "Примечания",
    totalPrice: "Итоговая цена",

    status: {
      pending: "В ожидании",
      confirmed: "Подтверждено",
      cancelled: "Отменено",
    },

    createSuccess: "Бронирование создано!",
    createError: "Ошибка при создании бронирования",
  },
}
```

#### 5. Server Actions

**Create `src/actions/booking.actions.ts`:**
```typescript
"use server"

import prisma from "@/utils/prisma"
import { auth } from "@/auth/auth"
import { bookingSchema } from "@/lib/validations/booking.schema"
import { content } from "@/content/text.content"

export async function createBooking(data: unknown) {
  // 1. Check authentication
  const session = await auth()
  if (!session) {
    return { error: content.errors.authRequired }
  }

  // 2. Validate data
  const validated = bookingSchema.safeParse(data)
  if (!validated.success) {
    return { error: content.errors.validationError }
  }

  // 3. Fetch slot to calculate price
  const slot = await prisma.eventSlot.findUnique({
    where: { id: validated.data.slotId },
  })

  if (!slot || !slot.isAvailable) {
    return { error: "Slot not available" }
  }

  // 4. Calculate total price
  const totalPrice = slot.price

  // 5. Create booking
  try {
    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        slotId: validated.data.slotId,
        guestCount: validated.data.guestCount,
        totalPrice: totalPrice,
        notes: validated.data.notes,
      },
    })

    // 6. Mark slot as unavailable
    await prisma.eventSlot.update({
      where: { id: validated.data.slotId },
      data: { isAvailable: false },
    })

    return { success: true, booking }
  } catch (error) {
    return { error: content.booking.createError }
  }
}

export async function getMyBookings() {
  const session = await auth()
  if (!session) {
    return { error: content.errors.authRequired }
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      slot: {
        include: {
          restaurant: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return { bookings }
}
```

#### 6. Form Component

**Create `src/forms/booking.form.tsx`:**
```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema } from "@/lib/validations/booking.schema"
import { content } from "@/content/text.content"
import { createBooking } from "@/actions/booking.actions"

export default function BookingForm({ slotId }: { slotId: string }) {
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      slotId,
      guestCount: 1,
      notes: "",
    },
  })

  const onSubmit = async (data) => {
    const result = await createBooking(data)

    if (result.error) {
      alert(result.error)
    } else {
      alert(content.booking.createSuccess)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Input
        label={content.booking.guestCount}
        type="number"
        {...form.register("guestCount", { valueAsNumber: true })}
      />

      <Textarea
        label={content.booking.notes}
        {...form.register("notes")}
      />

      <Button type="submit">{content.booking.create}</Button>
    </form>
  )
}
```

#### 7. Page/Route

**Create `src/app/customer/my-bookings/page.tsx`:**
```typescript
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { getMyBookings } from "@/actions/booking.actions"
import { content } from "@/content/text.content"

export default async function MyBookingsPage() {
  const session = await auth()
  if (!session) redirect("/")

  const { bookings } = await getMyBookings()

  return (
    <div>
      <h1>{content.booking.myBookings}</h1>

      {bookings?.map(booking => (
        <div key={booking.id}>
          <h3>{booking.slot.restaurant.name}</h3>
          <p>{booking.slot.date.toLocaleDateString()}</p>
          <p>{content.booking.status[booking.status.toLowerCase()]}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Common Tasks Guide

### Task 1: Add a New Field to Restaurant

**1. Update Prisma Schema:**
```prisma
model Restaurant {
  // ... existing fields
  parkingSpaces Int? // New field
}
```

**2. Run Migration:**
```bash
npx prisma migrate dev --name add-parking-spaces
```

**3. Update TypeScript Types:**
Types are auto-generated by Prisma, no changes needed.

**4. Update Validation Schema:**
```typescript
// src/lib/validations/restaurant.schema.ts
export const restaurantSchema = z.object({
  // ... existing fields
  parkingSpaces: z.number().int().min(0).optional(),
})
```

**5. Update Content:**
```typescript
// src/content/text.content.ts
restaurant: {
  // ... existing
  parkingSpaces: "Парковочные места",
  parkingSpacesLabel: "Парковочные места",
}
```

**6. Update Form:**
```typescript
// RestaurantForm.tsx
<Input
  label={content.restaurant.parkingSpacesLabel}
  type="number"
  {...form.register("parkingSpaces", { valueAsNumber: true })}
/>
```

**7. Update Server Action:**
Form data will automatically include new field, no changes needed if using spread operator:
```typescript
await prisma.restaurant.create({
  data: validated.data, // Includes parkingSpaces
})
```

### Task 2: Add a New Page

**1. Create Page File:**
```typescript
// src/app/my-new-page/page.tsx
import { content } from "@/content/text.content"

export default function MyNewPage() {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  )
}
```

**2. Add to Navigation (if needed):**
```typescript
// src/config/site.config.ts
navItems: [
  // ... existing
  {href: "/my-new-page", label: "My Page", roles: ["ALL"]},
]
```

**3. Add Content:**
```typescript
// src/content/text.content.ts
myPage: {
  title: "Моя страница",
  description: "Описание",
}
```

### Task 3: Add Form Validation

**1. Define Schema:**
```typescript
// src/lib/validations/myfeature.schema.ts
import { z } from 'zod'
import { content } from '@/content/text.content'

export const mySchema = z.object({
  email: z.string().email({ message: content.validation.emailInvalid }),
  age: z.number().min(18, { message: "Must be 18+" }),
})
```

**2. Use in Form:**
```typescript
const form = useForm({
  resolver: zodResolver(mySchema),
})
```

### Task 4: Protect a Route

**1. Server Component:**
```typescript
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()

  // Check authentication
  if (!session) {
    redirect("/")
  }

  // Check role
  if (session.user.role !== "OWNER") {
    redirect("/")
  }

  return <div>Protected Content</div>
}
```

**2. Client Component:**
```typescript
"use client"

import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedComponent() {
  const { isAuth, session } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuth) {
      router.push("/")
    }
  }, [isAuth])

  if (!isAuth) return null

  return <div>Protected Content</div>
}
```

### Task 5: Add a New Server Action

**1. Create Action File:**
```typescript
// src/actions/myaction.ts
"use server"

import { auth } from "@/auth/auth"
import prisma from "@/utils/prisma"
import { content } from "@/content/text.content"

export async function myAction(data: unknown) {
  // 1. Authentication check
  const session = await auth()
  if (!session) {
    return { error: content.errors.authRequired }
  }

  // 2. Authorization check (role)
  if (session.user.role !== "OWNER") {
    return { error: content.errors.unauthorized }
  }

  // 3. Validate data
  const validated = mySchema.safeParse(data)
  if (!validated.success) {
    return { error: content.errors.validationError }
  }

  // 4. Database operation
  try {
    const result = await prisma.myModel.create({
      data: validated.data,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Error:", error)
    return { error: content.errors.generic }
  }
}
```

**2. Call from Component:**
```typescript
"use client"

import { myAction } from "@/actions/myaction"

export default function MyComponent() {
  const handleSubmit = async (data) => {
    const result = await myAction(data)

    if (result.error) {
      alert(result.error)
    } else {
      alert("Success!")
    }
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

### Task 6: Debug Common Issues

**Issue: "useAuthStore is not a function"**
```typescript
// Wrong:
import useAuthStore from "@/store/auth.store"

// Correct:
import { useAuthStore } from "@/store/auth.store"
```

**Issue: "Hydration mismatch"**
```typescript
// Problem: Client/server rendering mismatch
// Solution: Use dynamic import for client-only code

import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false
})
```

**Issue: "Prisma client not found"**
```bash
# Regenerate Prisma client
npx prisma generate
```

**Issue: "Module not found: @/..."**
```typescript
// Check tsconfig.json has correct paths:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Best Practices

### 1. Server Actions
- Always validate on server (never trust client)
- Check authentication first
- Use try/catch for database operations
- Return consistent format: `{ success, data } | { error }`

### 2. Forms
- Use react-hook-form for complex forms
- Validate with Zod schemas
- Show loading states during submission
- Handle errors gracefully

### 3. Database
- Use Prisma for type safety
- Index frequently queried fields
- Use transactions for multiple operations
- Handle cascading deletes

### 4. Content
- All user-facing text in `content` object
- Use functions for dynamic text
- Consistent terminology
- Easy to translate later

### 5. TypeScript
- Avoid `any` types
- Use generated Prisma types
- Type server action parameters
- Export reusable types

---

## Troubleshooting

### Development Server Won't Start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Regenerate Prisma client
npx prisma generate

# Start server
npm run dev
```

### Database Issues
```bash
# Reset database (WARNING: Deletes data)
npx prisma migrate reset

# Run pending migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

### Type Errors After Schema Changes
```bash
# Regenerate Prisma types
npx prisma generate

# Restart TypeScript server in editor
```

---

## Summary

This platform is built with:
- **Next.js 15** for server/client architecture
- **Prisma** for type-safe database access
- **NextAuth** for authentication
- **Zod** for validation
- **Centralized content** for easy management

**Key Principles:**
1. Server actions handle data mutations
2. Validation happens on both client and server
3. All text is centralized
4. Type safety everywhere
5. Clear separation of concerns

**To extend:**
1. Update database schema
2. Add validation schemas
3. Create server actions
4. Build UI components
5. Wire everything together

Refer to this guide when adding features or debugging issues!