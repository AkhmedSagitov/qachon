# Database Reference Chains - Complete Guide

Deep dive into how Owner → Restaurant → Slots → Images relationships work with visual examples.

---

## Table of Contents

1. [The Complete Reference Chain](#the-complete-reference-chain)
2. [How References Work (Step by Step)](#how-references-work-step-by-step)
3. [Creating Records with References](#creating-records-with-references)
4. [Querying Across References](#querying-across-references)
5. [Updating Referenced Records](#updating-referenced-records)
6. [Deleting and CASCADE](#deleting-and-cascade)
7. [Real Database State Examples](#real-database-state-examples)
8. [Common Operations Explained](#common-operations-explained)

---

## The Complete Reference Chain

### Visual Overview

```
User (Owner)
  │
  │ ownerId (foreign key)
  │
  ├─→ Restaurant #1
  │     │
  │     │ restaurantId (foreign key)
  │     │
  │     ├─→ Image #1
  │     ├─→ Image #2
  │     ├─→ Image #3
  │     │
  │     ├─→ Slot #1
  │     ├─→ Slot #2
  │     └─→ Slot #3
  │
  ├─→ Restaurant #2
  │     │
  │     ├─→ Image #1
  │     ├─→ Slot #1
  │     └─→ Slot #2
  │
  └─→ Restaurant #3
        └─→ Slot #1
```

### Schema Definitions

```prisma
// PARENT: User (Owner)
model User {
  id          String       @id @default(uuid())
  email       String       @unique
  restaurants Restaurant[] // ← HAS MANY restaurants

  @@map("users")
}

// CHILD of User, PARENT of Images/Slots
model Restaurant {
  id       String    @id @default(uuid())

  // REFERENCE UP to User
  ownerId  String    @map("owner_id")  // ← Foreign key field
  owner    User      @relation(         // ← Reference definition
    fields: [ownerId],                  //   This field (ownerId)
    references: [id],                   //   Points to User.id
    onDelete: Cascade                   //   Delete if user deleted
  )

  // REFERENCES DOWN to children
  images     RestaurantImage[] // ← HAS MANY images
  eventSlots EventSlot[]       // ← HAS MANY slots

  @@map("restaurants")
}

// CHILD of Restaurant
model RestaurantImage {
  id    String @id @default(uuid())
  url   String

  // REFERENCE UP to Restaurant
  restaurantId String     @map("restaurant_id")
  restaurant   Restaurant @relation(
    fields: [restaurantId],
    references: [id],
    onDelete: Cascade
  )

  @@map("restaurant_images")
}

// CHILD of Restaurant
model EventSlot {
  id    String @id @default(uuid())
  date  DateTime
  price Decimal

  // REFERENCE UP to Restaurant
  restaurantId String     @map("restaurant_id")
  restaurant   Restaurant @relation(
    fields: [restaurantId],
    references: [id],
    onDelete: Cascade
  )

  @@map("event_slots")
}
```

---

## How References Work (Step by Step)

### Step 1: Understanding Foreign Keys

A **foreign key** is a field that stores the ID of another record.

**Example:**

```typescript
// User record
{
  id: "user-123",
  email: "owner@email.com"
}

// Restaurant record
{
  id: "rest-456",
  name: "My Restaurant",
  ownerId: "user-123"  // ← This is the FOREIGN KEY
                       //   It POINTS TO User.id
}
```

### Step 2: How the Database Links Them

**In the database tables:**

```sql
-- users table
┌──────────┬──────────────────┐
│ id       │ email            │
├──────────┼──────────────────┤
│ user-123 │ owner@email.com  │
└──────────┴──────────────────┘
           ↑
           │ REFERENCES
           │
-- restaurants table
┌──────────┬────────────────┬──────────┐
│ id       │ name           │ owner_id │ ← Foreign Key Column
├──────────┼────────────────┼──────────┤
│ rest-456 │ My Restaurant  │ user-123 │ ← Points to user-123
└──────────┴────────────────┴──────────┘
```

### Step 3: The Complete Chain

**Database tables showing the full chain:**

```sql
-- LEVEL 1: User (Parent)
users table
┌──────────┬──────────────────┐
│ id       │ email            │
├──────────┼──────────────────┤
│ user-123 │ owner@email.com  │
└──────────┴──────────────────┘
           ↑
           │ Referenced by owner_id
           │
-- LEVEL 2: Restaurant (Child of User, Parent of Images/Slots)
restaurants table
┌──────────┬────────────────┬──────────┐
│ id       │ name           │ owner_id │
├──────────┼────────────────┼──────────┤
│ rest-456 │ My Restaurant  │ user-123 │
└──────────┴────────────────┴──────────┘
           ↑
           │ Referenced by restaurant_id
           │
           ├────────────────────┐
           ↓                    ↓
-- LEVEL 3a: Images           LEVEL 3b: Slots
restaurant_images              event_slots
┌────────┬──────────────┬────┐ ┌────────┬───────────────┬────┐
│ id     │ url          │r_id│ │ id     │ date          │r_id│
├────────┼──────────────┼────┤ ├────────┼───────────────┼────┤
│ img-1  │ /pic1.jpg    │r456│ │ slot-1 │ 2024-01-01    │r456│
│ img-2  │ /pic2.jpg    │r456│ │ slot-2 │ 2024-01-02    │r456│
└────────┴──────────────┴────┘ └────────┴───────────────┴────┘
                    ↑ restaurant_id      ↑ restaurant_id
                    Points to rest-456   Points to rest-456
```

**Key Points:**
- `user-123` is the **primary key** in users table
- `rest-456` is the **primary key** in restaurants table
- `owner_id` in restaurants is a **foreign key** pointing to users.id
- `restaurant_id` in images/slots is a **foreign key** pointing to restaurants.id

---

## Creating Records with References

### Example 1: Creating Restaurant (Manually Linking)

```typescript
// Step 1: Get the user ID (the owner)
const user = await prisma.user.findUnique({
  where: { email: "owner@email.com" }
})
// Result: { id: "user-123", email: "owner@email.com" }

// Step 2: Create restaurant with foreign key
const restaurant = await prisma.restaurant.create({
  data: {
    name: "My Restaurant",
    slug: "my-restaurant",
    address: "123 Main St",
    city: "Moscow",
    capacity: 100,
    pricePerHour: 5000,

    ownerId: user.id,     // ← FOREIGN KEY: Links to user-123
    regionId: "region-1"  // ← FOREIGN KEY: Links to region
  }
})
// Result: { id: "rest-456", name: "My Restaurant", ownerId: "user-123" }
```

**What happened in database:**

```sql
INSERT INTO restaurants (
  id, name, slug, address, city, capacity, price_per_hour, owner_id, region_id
) VALUES (
  'rest-456',
  'My Restaurant',
  'my-restaurant',
  '123 Main St',
  'Moscow',
  100,
  5000,
  'user-123',  -- ← Foreign key value stored
  'region-1'
);
```

### Example 2: Creating with Nested Data

```typescript
// Create restaurant AND images in one operation
const restaurant = await prisma.restaurant.create({
  data: {
    name: "My Restaurant",
    ownerId: "user-123",  // Link to user
    regionId: "region-1",

    // Nested create - create images at same time
    images: {
      create: [
        {
          url: "/uploads/pic1.jpg",
          alt: "Restaurant photo 1",
          isPrimary: true
        },
        {
          url: "/uploads/pic2.jpg",
          alt: "Restaurant photo 2",
          isPrimary: false
        }
      ]
    }
  },
  include: {
    images: true  // Return created images
  }
})
```

**Database operations (in transaction):**

```sql
-- 1. Insert restaurant
INSERT INTO restaurants (id, name, owner_id, region_id, ...)
VALUES ('rest-456', 'My Restaurant', 'user-123', 'region-1', ...);

-- 2. Insert images (nested create)
INSERT INTO restaurant_images (id, url, alt, is_primary, restaurant_id)
VALUES
  ('img-1', '/uploads/pic1.jpg', 'Restaurant photo 1', true, 'rest-456'),
  ('img-2', '/uploads/pic2.jpg', 'Restaurant photo 2', false, 'rest-456');
       --                                                          ↑
       --                                    Foreign key automatically set to restaurant id
```

**Result:**

```typescript
{
  id: "rest-456",
  name: "My Restaurant",
  ownerId: "user-123",
  images: [
    { id: "img-1", url: "/uploads/pic1.jpg", restaurantId: "rest-456" },
    { id: "img-2", url: "/uploads/pic2.jpg", restaurantId: "rest-456" }
  ]
}
```

### Example 3: Creating Slot (Child of Restaurant)

```typescript
// Create slot linked to restaurant
const slot = await prisma.eventSlot.create({
  data: {
    date: new Date("2024-01-15"),
    startTime: "18:00",
    endTime: "22:00",
    capacity: 100,
    price: 5000,
    isAvailable: true,

    restaurantId: "rest-456"  // ← FOREIGN KEY: Links to restaurant
  }
})
```

**Database:**

```sql
INSERT INTO event_slots (
  id, date, start_time, end_time, capacity, price, is_available, restaurant_id
) VALUES (
  'slot-789',
  '2024-01-15',
  '18:00:00',
  '22:00:00',
  100,
  5000,
  true,
  'rest-456'  -- ← Foreign key links to restaurant
);
```

**Current database state after all creates:**

```
users
├─ user-123 (owner@email.com)
    │
    └─ restaurants
       └─ rest-456 (My Restaurant, ownerId: user-123)
          │
          ├─ restaurant_images
          │  ├─ img-1 (restaurantId: rest-456)
          │  └─ img-2 (restaurantId: rest-456)
          │
          └─ event_slots
             └─ slot-789 (restaurantId: rest-456)
```

---

## Querying Across References

### Query 1: Get Restaurant with Owner Info (Following Reference UP)

```typescript
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest-456" },
  include: {
    owner: true  // Follow ownerId → User.id
  }
})
```

**What Prisma does:**

```sql
-- Behind the scenes, Prisma executes:
SELECT
  r.*,           -- Restaurant fields
  u.*            -- User fields
FROM restaurants r
LEFT JOIN users u ON r.owner_id = u.id  -- ← JOIN using foreign key
WHERE r.id = 'rest-456';
```

**Result:**

```typescript
{
  id: "rest-456",
  name: "My Restaurant",
  ownerId: "user-123",  // ← Foreign key value

  // Joined data from users table
  owner: {
    id: "user-123",      // ← The user it references
    email: "owner@email.com",
    name: "John Doe"
  }
}
```

### Query 2: Get Restaurant with Children (Following Reference DOWN)

```typescript
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest-456" },
  include: {
    images: true,      // Follow restaurant_id ← RestaurantImage.restaurantId
    eventSlots: true   // Follow restaurant_id ← EventSlot.restaurantId
  }
})
```

**SQL:**

```sql
-- Restaurant
SELECT * FROM restaurants WHERE id = 'rest-456';

-- Images (where restaurant_id points to this restaurant)
SELECT * FROM restaurant_images WHERE restaurant_id = 'rest-456';

-- Slots (where restaurant_id points to this restaurant)
SELECT * FROM event_slots WHERE restaurant_id = 'rest-456';
```

**Result:**

```typescript
{
  id: "rest-456",
  name: "My Restaurant",
  ownerId: "user-123",

  // Children that reference this restaurant
  images: [
    { id: "img-1", url: "/pic1.jpg", restaurantId: "rest-456" },
    { id: "img-2", url: "/pic2.jpg", restaurantId: "rest-456" }
  ],
  eventSlots: [
    { id: "slot-789", date: "2024-01-15", restaurantId: "rest-456" }
  ]
}
```

### Query 3: Get User with ALL Related Data (Following Chain)

```typescript
const user = await prisma.user.findUnique({
  where: { id: "user-123" },
  include: {
    restaurants: {           // Follow ownerId
      include: {
        images: true,        // Follow restaurantId
        eventSlots: true     // Follow restaurantId
      }
    }
  }
})
```

**SQL operations:**

```sql
-- 1. Get user
SELECT * FROM users WHERE id = 'user-123';

-- 2. Get their restaurants
SELECT * FROM restaurants WHERE owner_id = 'user-123';

-- 3. For each restaurant, get images
SELECT * FROM restaurant_images WHERE restaurant_id IN ('rest-456', ...);

-- 4. For each restaurant, get slots
SELECT * FROM event_slots WHERE restaurant_id IN ('rest-456', ...);
```

**Result structure:**

```typescript
{
  id: "user-123",
  email: "owner@email.com",

  restaurants: [
    {
      id: "rest-456",
      name: "My Restaurant",
      ownerId: "user-123",  // ← Points back to user

      images: [
        { id: "img-1", restaurantId: "rest-456" },  // ← Points to restaurant
        { id: "img-2", restaurantId: "rest-456" }
      ],
      eventSlots: [
        { id: "slot-789", restaurantId: "rest-456" }  // ← Points to restaurant
      ]
    }
  ]
}
```

### Query 4: Going UP the Chain (Slot → Restaurant → Owner)

```typescript
const slot = await prisma.eventSlot.findUnique({
  where: { id: "slot-789" },
  include: {
    restaurant: {        // Follow restaurantId → Restaurant.id
      include: {
        owner: true      // Follow ownerId → User.id
      }
    }
  }
})
```

**SQL:**

```sql
SELECT
  s.*,              -- Slot fields
  r.*,              -- Restaurant fields
  u.*               -- User fields
FROM event_slots s
LEFT JOIN restaurants r ON s.restaurant_id = r.id   -- First join
LEFT JOIN users u ON r.owner_id = u.id              -- Second join
WHERE s.id = 'slot-789';
```

**Result:**

```typescript
{
  id: "slot-789",
  date: "2024-01-15",
  restaurantId: "rest-456",  // ← Foreign key to restaurant

  restaurant: {
    id: "rest-456",
    name: "My Restaurant",
    ownerId: "user-123",     // ← Foreign key to user

    owner: {
      id: "user-123",
      email: "owner@email.com"
    }
  }
}
```

**The reference chain followed:**

```
slot-789 (restaurantId: "rest-456")
    ↓
rest-456 (ownerId: "user-123")
    ↓
user-123 (email: "owner@email.com")
```

---

## Updating Referenced Records

### Update 1: Change Restaurant Owner

```typescript
// Transfer restaurant to different owner
await prisma.restaurant.update({
  where: { id: "rest-456" },
  data: {
    ownerId: "user-999"  // Change foreign key to point to different user
  }
})
```

**Database:**

```sql
-- Before
restaurants: { id: "rest-456", ownerId: "user-123" }

-- Update
UPDATE restaurants SET owner_id = 'user-999' WHERE id = 'rest-456';

-- After
restaurants: { id: "rest-456", ownerId: "user-999" }
```

**Effect:**
- Restaurant now belongs to different user
- Images and slots are NOT affected (they still reference same restaurant)
- Old owner no longer has access to this restaurant

### Update 2: Add Images to Existing Restaurant

```typescript
await prisma.restaurant.update({
  where: { id: "rest-456" },
  data: {
    images: {
      create: [  // Create new images
        { url: "/uploads/pic3.jpg", alt: "New photo" }
      ]
    }
  }
})
```

**Database:**

```sql
-- Restaurant stays same
-- New image inserted with foreign key
INSERT INTO restaurant_images (id, url, alt, restaurant_id)
VALUES ('img-3', '/uploads/pic3.jpg', 'New photo', 'rest-456');
                                                        ↑
                                        Foreign key automatically set
```

### Update 3: Replace All Images

```typescript
await prisma.restaurant.update({
  where: { id: "rest-456" },
  data: {
    images: {
      deleteMany: {},  // Delete all existing images
      create: [        // Create new ones
        { url: "/uploads/new1.jpg" },
        { url: "/uploads/new2.jpg" }
      ]
    }
  }
})
```

**Database operations (in transaction):**

```sql
-- 1. Delete old images
DELETE FROM restaurant_images WHERE restaurant_id = 'rest-456';

-- 2. Insert new images
INSERT INTO restaurant_images (id, url, restaurant_id)
VALUES
  ('img-new1', '/uploads/new1.jpg', 'rest-456'),
  ('img-new2', '/uploads/new2.jpg', 'rest-456');
```

---

## Deleting and CASCADE

### CASCADE Behavior Explained

**When you delete a parent, CASCADE automatically deletes children.**

### Delete 1: Delete User (Top of Chain)

```typescript
await prisma.user.delete({
  where: { id: "user-123" }
})
```

**What CASCADE does (automatic):**

```
1. Find User user-123

2. Find all Restaurants where owner_id = "user-123"
   → Found: rest-456, rest-999

3. For EACH restaurant:

   a. Find all Images where restaurant_id = restaurant.id
      → For rest-456: img-1, img-2
      → For rest-999: img-5
      → DELETE all these images

   b. Find all Slots where restaurant_id = restaurant.id
      → For rest-456: slot-789, slot-800
      → For rest-999: slot-900
      → DELETE all these slots

   c. DELETE the restaurant

4. DELETE the user
```

**Database operations:**

```sql
-- PostgreSQL executes (simplified):

-- Level 3: Delete grandchildren
DELETE FROM restaurant_images
WHERE restaurant_id IN (
  SELECT id FROM restaurants WHERE owner_id = 'user-123'
);

DELETE FROM event_slots
WHERE restaurant_id IN (
  SELECT id FROM restaurants WHERE owner_id = 'user-123'
);

-- Level 2: Delete children
DELETE FROM restaurants WHERE owner_id = 'user-123';

-- Level 1: Delete parent
DELETE FROM users WHERE id = 'user-123';
```

**Records deleted:**

```
✗ user-123
  ✗ rest-456
    ✗ img-1
    ✗ img-2
    ✗ slot-789
    ✗ slot-800
  ✗ rest-999
    ✗ img-5
    ✗ slot-900
```

### Delete 2: Delete Restaurant (Middle of Chain)

```typescript
await prisma.restaurant.delete({
  where: { id: "rest-456" }
})
```

**What CASCADE does:**

```
1. Find Restaurant rest-456

2. Find all Images where restaurant_id = "rest-456"
   → Found: img-1, img-2
   → DELETE them

3. Find all Slots where restaurant_id = "rest-456"
   → Found: slot-789
   → DELETE them

4. DELETE the restaurant

User user-123 is NOT deleted (parent stays)
```

**Database:**

```sql
-- Delete children first
DELETE FROM restaurant_images WHERE restaurant_id = 'rest-456';
DELETE FROM event_slots WHERE restaurant_id = 'rest-456';

-- Delete restaurant
DELETE FROM restaurants WHERE id = 'rest-456';

-- User remains unaffected
```

**Result:**

```
✓ user-123 (still exists)
  ✗ rest-456 (deleted)
    ✗ img-1 (deleted)
    ✗ img-2 (deleted)
    ✗ slot-789 (deleted)
```

### Delete 3: Delete Single Image (End of Chain)

```typescript
await prisma.restaurantImage.delete({
  where: { id: "img-1" }
})
```

**What happens:**

```
1. Delete Image img-1
2. Restaurant and User stay intact (CASCADE only goes DOWN, not UP)
```

**Database:**

```sql
DELETE FROM restaurant_images WHERE id = 'img-1';
```

**Result:**

```
✓ user-123 (unchanged)
  ✓ rest-456 (unchanged)
    ✗ img-1 (deleted)
    ✓ img-2 (still exists)
    ✓ slot-789 (still exists)
```

---

## Real Database State Examples

### Example State 1: One Owner, Two Restaurants

**Database tables:**

```sql
-- users
┌──────────┬──────────────────┐
│ id       │ email            │
├──────────┼──────────────────┤
│ u1       │ owner@email.com  │
└──────────┴──────────────────┘

-- restaurants
┌──────────┬────────────┬──────────┐
│ id       │ name       │ owner_id │
├──────────┼────────────┼──────────┤
│ r1       │ Restaurant1│ u1       │ ← Points to u1
│ r2       │ Restaurant2│ u1       │ ← Points to u1
└──────────┴────────────┴──────────┘

-- restaurant_images
┌──────────┬──────────────┬──────────────┐
│ id       │ url          │ restaurant_id│
├──────────┼──────────────┼──────────────┤
│ i1       │ /r1-pic1.jpg │ r1           │ ← Points to r1
│ i2       │ /r1-pic2.jpg │ r1           │ ← Points to r1
│ i3       │ /r2-pic1.jpg │ r2           │ ← Points to r2
└──────────┴──────────────┴──────────────┘

-- event_slots
┌──────────┬────────────┬──────────────┐
│ id       │ date       │ restaurant_id│
├──────────┼────────────┼──────────────┤
│ s1       │ 2024-01-01 │ r1           │ ← Points to r1
│ s2       │ 2024-01-02 │ r1           │ ← Points to r1
│ s3       │ 2024-01-03 │ r2           │ ← Points to r2
└──────────┴────────────┴──────────────┘
```

**Reference structure:**

```
u1 (owner@email.com)
├── r1 (Restaurant1, ownerId: u1)
│   ├── i1 (restaurantId: r1)
│   ├── i2 (restaurantId: r1)
│   ├── s1 (restaurantId: r1)
│   └── s2 (restaurantId: r1)
└── r2 (Restaurant2, ownerId: u1)
    ├── i3 (restaurantId: r2)
    └── s3 (restaurantId: r2)
```

**Query to get this structure:**

```typescript
const owner = await prisma.user.findUnique({
  where: { id: "u1" },
  include: {
    restaurants: {
      include: {
        images: true,
        eventSlots: true
      }
    }
  }
})
```

**If you delete r1:**

```typescript
await prisma.restaurant.delete({ where: { id: "r1" } })
```

**Result:**
```
u1 (still exists)
├── r1 (DELETED)
│   ├── i1 (DELETED - CASCADE)
│   ├── i2 (DELETED - CASCADE)
│   ├── s1 (DELETED - CASCADE)
│   └── s2 (DELETED - CASCADE)
└── r2 (still exists)
    ├── i3 (still exists)
    └── s3 (still exists)
```

### Example State 2: Multiple Owners

```sql
-- users
┌──────────┬──────────────────┐
│ id       │ email            │
├──────────┼──────────────────┤
│ u1       │ owner1@email.com │
│ u2       │ owner2@email.com │
└──────────┴──────────────────┘

-- restaurants
┌──────────┬────────────┬──────────┐
│ id       │ name       │ owner_id │
├──────────┼────────────┼──────────┤
│ r1       │ Restaurant1│ u1       │ ← Owned by u1
│ r2       │ Restaurant2│ u2       │ ← Owned by u2
│ r3       │ Restaurant3│ u1       │ ← Owned by u1
└──────────┴────────────┴──────────┘

-- event_slots
┌──────────┬────────────┬──────────────┐
│ id       │ date       │ restaurant_id│
├──────────┼────────────┼──────────────┤
│ s1       │ 2024-01-01 │ r1           │ ← Belongs to r1 (owner u1)
│ s2       │ 2024-01-02 │ r2           │ ← Belongs to r2 (owner u2)
│ s3       │ 2024-01-03 │ r3           │ ← Belongs to r3 (owner u1)
└──────────┴────────────┴──────────────┘
```

**Structure:**

```
u1 (owner1@email.com)
├── r1 → s1
└── r3 → s3

u2 (owner2@email.com)
└── r2 → s2
```

**Get all slots for owner u1:**

```typescript
const owner = await prisma.user.findUnique({
  where: { id: "u1" },
  include: {
    restaurants: {
      include: {
        eventSlots: true
      }
    }
  }
})

// Results in slots: s1 (via r1) and s3 (via r3)
```

---

## Common Operations Explained

### Operation 1: Check Ownership

**Scenario:** User wants to edit restaurant. Verify they own it.

```typescript
// Get restaurant with owner info
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest-456" },
  select: { ownerId: true }  // Only get ownerId
})

// Check ownership
if (restaurant.ownerId !== currentUserId) {
  throw new Error("Not authorized")
}

// Now safe to update
```

**Why this works:**
- `ownerId` is the foreign key stored in restaurant
- We compare it to current user's ID
- If they match, user owns this restaurant

### Operation 2: Count User's Restaurants

```typescript
const count = await prisma.restaurant.count({
  where: {
    ownerId: "user-123"  // Count where foreign key = user ID
  }
})
```

**SQL:**

```sql
SELECT COUNT(*) FROM restaurants WHERE owner_id = 'user-123';
```

### Operation 3: Get All Slots for User's Restaurants

```typescript
// Method 1: Through relations
const user = await prisma.user.findUnique({
  where: { id: "user-123" },
  include: {
    restaurants: {
      include: {
        eventSlots: true
      }
    }
  }
})

const allSlots = user.restaurants.flatMap(r => r.eventSlots)

// Method 2: Direct query
const slots = await prisma.eventSlot.findMany({
  where: {
    restaurant: {
      ownerId: "user-123"  // Filter by nested relation
    }
  }
})
```

**SQL for Method 2:**

```sql
SELECT s.*
FROM event_slots s
JOIN restaurants r ON s.restaurant_id = r.id  -- Follow foreign key
WHERE r.owner_id = 'user-123';                -- Filter by owner
```

### Operation 4: Transfer Restaurant Ownership

```typescript
async function transferRestaurant(
  restaurantId: string,
  newOwnerId: string
) {
  // Just update the foreign key
  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      ownerId: newOwnerId  // Change who it references
    }
  })

  // Images and slots automatically follow the restaurant
  // No need to update them separately
}
```

**Before:**
```
user-old
└── restaurant (ownerId: user-old)
    ├── image (restaurantId: restaurant)
    └── slot (restaurantId: restaurant)
```

**After:**
```
user-new
└── restaurant (ownerId: user-new)  ← Changed
    ├── image (restaurantId: restaurant)  ← Still same
    └── slot (restaurantId: restaurant)   ← Still same
```

### Operation 5: Bulk Create Slots

```typescript
const slots = []
for (let i = 0; i < 5; i++) {
  slots.push({
    date: new Date(2024, 0, i + 1),
    startTime: "18:00",
    endTime: "22:00",
    capacity: 100,
    price: 5000,
    restaurantId: "rest-456"  // All reference same restaurant
  })
}

await prisma.eventSlot.createMany({
  data: slots
})
```

**Database:**

```sql
INSERT INTO event_slots (id, date, start_time, end_time, capacity, price, restaurant_id)
VALUES
  ('s1', '2024-01-01', '18:00', '22:00', 100, 5000, 'rest-456'),
  ('s2', '2024-01-02', '18:00', '22:00', 100, 5000, 'rest-456'),
  ('s3', '2024-01-03', '18:00', '22:00', 100, 5000, 'rest-456'),
  ('s4', '2024-01-04', '18:00', '22:00', 100, 5000, 'rest-456'),
  ('s5', '2024-01-05', '18:00', '22:00', 100, 5000, 'rest-456');
       --                                                 ↑
       --                                    Same foreign key for all
```

---

## Summary

### Key Concepts

1. **Foreign Key** = Column that stores another record's ID
2. **Reference UP** = Child points to parent (ownerId → User.id)
3. **Reference DOWN** = Parent lists children (Restaurant.eventSlots)
4. **CASCADE** = Delete parent → automatically deletes children
5. **JOIN** = Combine tables using foreign keys

### The Chain

```
User.id (Primary Key)
  ↑
  │ Referenced by
  │
Restaurant.ownerId (Foreign Key)
Restaurant.id (Primary Key)
  ↑
  │ Referenced by
  │
Image.restaurantId (Foreign Key)
Slot.restaurantId (Foreign Key)
```

### Quick Reference

```typescript
// Create with reference
create({ data: { foreignKey: "parent-id" } })

// Query with reference
findUnique({ where: { id }, include: { relation: true } })

// Update reference
update({ where: { id }, data: { foreignKey: "new-parent-id" } })

// Delete (CASCADE happens automatically)
delete({ where: { id } })
```

**Now you understand how every reference works in your database!** 🎯
