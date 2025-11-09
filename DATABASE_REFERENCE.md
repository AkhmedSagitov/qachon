# Database Reference Guide - Deep Dive

Complete guide to understanding how your database works, relationships, queries, and real examples.

---

## Table of Contents

1. [Database Overview](#database-overview)
2. [Understanding Relationships](#understanding-relationships)
3. [Foreign Keys Explained](#foreign-keys-explained)
4. [Cascade Behaviors](#cascade-behaviors)
5. [Query Examples](#query-examples)
6. [Indexes & Performance](#indexes--performance)
7. [Real-World Examples](#real-world-examples)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Database Overview

### Technology Stack

- **Database**: PostgreSQL (Production-grade relational database)
- **ORM**: Prisma (Type-safe database client)
- **Schema Location**: `prisma/schema.prisma`
- **Generated Types**: `src/generated/prisma/`

### Current Schema Tables

```
users (User)
  ↓ owns
restaurants (Restaurant)
  ├── images (RestaurantImage)
  └── slots (EventSlot)

regions (Region)
  ↓ belongs to
restaurants (Restaurant)

accounts (Account) - NextAuth
sessions (Session) - NextAuth
verification_tokens (VerificationToken) - NextAuth
```

---

## Understanding Relationships

### 1. One-to-Many Relationship

**Definition**: One record can have multiple related records, but each related record belongs to only one parent.

#### Example: User → Restaurants

```prisma
model User {
  id          String       @id @default(uuid())
  restaurants Restaurant[] // Array - one user has MANY restaurants
}

model Restaurant {
  id      String @id @default(uuid())
  ownerId String @map("owner_id")  // Foreign key - points to User.id
  owner   User   @relation(fields: [ownerId], references: [id])
}
```

**How it works:**

```
User (id: "abc123")
  └── Restaurant (ownerId: "abc123")  // Foreign key points to user
  └── Restaurant (ownerId: "abc123")  // Same user
  └── Restaurant (ownerId: "abc123")  // Same user
```

**In the database:**

```sql
-- users table
| id     | email           |
|--------|-----------------|
| abc123 | owner@email.com |

-- restaurants table
| id     | name        | owner_id |  ← Foreign key column
|--------|-------------|----------|
| rest1  | Restaurant1 | abc123   |  ← Points to user abc123
| rest2  | Restaurant2 | abc123   |  ← Same user
| rest3  | Restaurant3 | abc123   |  ← Same user
```

**Querying:**

```typescript
// Get user with all their restaurants
const userWithRestaurants = await prisma.user.findUnique({
  where: { id: "abc123" },
  include: {
    restaurants: true, // Fetches all related restaurants
  },
})

// Result:
{
  id: "abc123",
  email: "owner@email.com",
  restaurants: [
    { id: "rest1", name: "Restaurant1", ownerId: "abc123" },
    { id: "rest2", name: "Restaurant2", ownerId: "abc123" },
    { id: "rest3", name: "Restaurant3", ownerId: "abc123" }
  ]
}

// Get restaurant with owner info
const restaurantWithOwner = await prisma.restaurant.findUnique({
  where: { id: "rest1" },
  include: {
    owner: true, // Fetches the related user
  },
})

// Result:
{
  id: "rest1",
  name: "Restaurant1",
  ownerId: "abc123",
  owner: {
    id: "abc123",
    email: "owner@email.com"
  }
}
```

#### Example: Restaurant → Images

```prisma
model Restaurant {
  id     String            @id
  images RestaurantImage[] // One restaurant has MANY images
}

model RestaurantImage {
  id           String     @id
  restaurantId String     @map("restaurant_id")
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
}
```

**Database structure:**

```sql
-- restaurants table
| id     | name        |
|--------|-------------|
| rest1  | Restaurant1 |

-- restaurant_images table
| id     | url              | restaurant_id |  ← Foreign key
|--------|------------------|---------------|
| img1   | /uploads/pic1.jpg| rest1         |  ← Belongs to rest1
| img2   | /uploads/pic2.jpg| rest1         |  ← Same restaurant
| img3   | /uploads/pic3.jpg| rest1         |  ← Same restaurant
```

### 2. Many-to-One Relationship

The inverse of one-to-many. Multiple records point to one parent.

#### Example: Many Restaurants → One Region

```prisma
model Restaurant {
  regionId String  @map("region_id")  // Foreign key
  region   Region  @relation(fields: [regionId], references: [id])
}

model Region {
  id          String       @id
  restaurants Restaurant[] // One region has MANY restaurants
}
```

**How it works:**

```
Region (id: "reg1", name: "Ташкент")
  ← Restaurant (regionId: "reg1")  // Points to region
  ← Restaurant (regionId: "reg1")  // Same region
  ← Restaurant (regionId: "reg1")  // Same region
```

**Database:**

```sql
-- regions table
| id   | name      | slug      |
|------|-----------|-----------|
| reg1 | Ташкент   | tashkent  |
| reg2 | Самарканд | samarkand |

-- restaurants table
| id     | name        | region_id |  ← Foreign key points to regions
|--------|-------------|-----------|
| rest1  | Restaurant1 | reg1      |  ← Moscow
| rest2  | Restaurant2 | reg1      |  ← Moscow
| rest3  | Restaurant3 | reg2      |  ← Kazan
```

**Query examples:**

```typescript
// Get all restaurants in Moscow
const moscowRestaurants = await prisma.restaurant.findMany({
  where: {
    regionId: "reg1", // Filter by foreign key
  },
  include: {
    region: true, // Include region details
  },
})

// Result:
[
  {
    id: "rest1",
    name: "Restaurant1",
    regionId: "reg1",
    region: { id: "reg1", name: "Москва", slug: "moscow" }
  },
  {
    id: "rest2",
    name: "Restaurant2",
    regionId: "reg1",
    region: { id: "reg1", name: "Москва", slug: "moscow" }
  }
]

// Get region with all its restaurants
const regionWithRestaurants = await prisma.region.findUnique({
  where: { id: "reg1" },
  include: {
    restaurants: true, // All restaurants in this region
  },
})

// Result:
{
  id: "reg1",
  name: "Москва",
  slug: "moscow",
  restaurants: [
    { id: "rest1", name: "Restaurant1", regionId: "reg1" },
    { id: "rest2", name: "Restaurant2", regionId: "reg1" }
  ]
}
```

---

## Foreign Keys Explained

### What is a Foreign Key?

A foreign key is a column that **references the primary key of another table**. It creates a link between two tables.

### Anatomy of a Foreign Key in Prisma

```prisma
model Restaurant {
  id       String @id @default(uuid())  // Primary key

  ownerId  String @map("owner_id")      // ← Foreign key field
  owner    User   @relation(            // ← Relation field
    fields: [ownerId],                  // ← This field
    references: [id],                   // ← Points to User.id
    onDelete: Cascade                   // ← Cascade behavior
  )
}
```

**Breaking it down:**

1. **`ownerId String`** - The actual column in the database that stores the user ID
2. **`@map("owner_id")`** - Database column name (snake_case convention)
3. **`owner User`** - Virtual field for TypeScript (not in DB, just for queries)
4. **`@relation(...)`** - Defines the relationship
5. **`fields: [ownerId]`** - Which local field is the foreign key
6. **`references: [id]`** - Which field in the parent table to link to
7. **`onDelete: Cascade`** - What happens when parent is deleted

### How Foreign Keys Enforce Data Integrity

**Without foreign key:**
```sql
-- restaurants table
| id     | owner_id |
|--------|----------|
| rest1  | abc123   |  ← owner_id could be ANYTHING
| rest2  | xyz999   |  ← Even if user doesn't exist!
```

**With foreign key:**
```sql
-- PostgreSQL won't let you:
INSERT INTO restaurants (id, owner_id) VALUES ('rest1', 'nonexistent');
-- ERROR: violates foreign key constraint

-- owner_id MUST exist in users table
```

**Benefits:**
1. **Prevents orphaned records** - Can't have restaurant with invalid owner
2. **Enforces referential integrity** - Data stays consistent
3. **Cascade operations** - Automatic cleanup when parent deleted
4. **Database-level validation** - Can't be bypassed

---

## Cascade Behaviors

### What is CASCADE?

When you delete a parent record, what happens to child records?

### Your Schema's CASCADE Rules

```prisma
model Restaurant {
  ownerId String
  owner   User @relation(
    fields: [ownerId],
    references: [id],
    onDelete: Cascade  // ← When User deleted, delete Restaurants
  )

  images     RestaurantImage[]
  eventSlots EventSlot[]
}

model RestaurantImage {
  restaurantId String
  restaurant   Restaurant @relation(
    fields: [restaurantId],
    references: [id],
    onDelete: Cascade  // ← When Restaurant deleted, delete Images
  )
}

model EventSlot {
  restaurantId String
  restaurant   Restaurant @relation(
    fields: [restaurantId],
    references: [id],
    onDelete: Cascade  // ← When Restaurant deleted, delete Slots
  )
}
```

### CASCADE in Action

**Scenario: Delete a User**

```typescript
// Delete user
await prisma.user.delete({
  where: { id: "abc123" }
})
```

**What happens:**

```
1. PostgreSQL finds User (id: "abc123")
2. Finds all Restaurants where owner_id = "abc123"
3. For each Restaurant:
   a. Finds all RestaurantImages where restaurant_id = [restaurant.id]
   b. DELETES all those images (CASCADE)
   c. Finds all EventSlots where restaurant_id = [restaurant.id]
   d. DELETES all those slots (CASCADE)
   e. DELETES the Restaurant
4. DELETES the User
```

**Database operations:**

```sql
-- Automatic cascade (you don't write this, it happens automatically)
DELETE FROM restaurant_images WHERE restaurant_id IN (
  SELECT id FROM restaurants WHERE owner_id = 'abc123'
);

DELETE FROM event_slots WHERE restaurant_id IN (
  SELECT id FROM restaurants WHERE owner_id = 'abc123'
);

DELETE FROM restaurants WHERE owner_id = 'abc123';

DELETE FROM users WHERE id = 'abc123';
```

### Real Example from Your Code

**File: `src/actions/restaurant.actions.ts`**

```typescript
export async function deleteRestaurant(restaurantId: string, userId: string) {
  // ...authentication checks...

  // Simply delete the restaurant
  await prisma.restaurant.delete({
    where: { id: restaurantId }
  })

  // CASCADE automatically:
  // 1. Deletes all RestaurantImage records
  // 2. Deletes all EventSlot records
  // No need to manually delete children!
}
```

### Other CASCADE Options

```prisma
onDelete: Cascade    // Delete children when parent deleted
onDelete: SetNull    // Set foreign key to NULL
onDelete: Restrict   // Prevent deletion if children exist
onDelete: NoAction   // Do nothing (may cause errors)
```

---

## Query Examples

### Basic Queries

#### 1. Find One Record

```typescript
// Find user by ID
const user = await prisma.user.findUnique({
  where: { id: "abc123" }
})

// Find restaurant by slug
const restaurant = await prisma.restaurant.findUnique({
  where: { slug: "restaurant-name" }
})

// Find region by unique field
const region = await prisma.region.findUnique({
  where: { slug: "moscow" }
})
```

#### 2. Find Many Records

```typescript
// Find all restaurants
const restaurants = await prisma.restaurant.findMany()

// Find with filter
const moscowRestaurants = await prisma.restaurant.findMany({
  where: {
    regionId: "reg1"
  }
})

// Find with multiple filters
const results = await prisma.restaurant.findMany({
  where: {
    regionId: "reg1",
    capacity: { gte: 50 },  // Greater than or equal
    isActive: true
  }
})
```

### Queries with Relations (JOIN)

#### 1. Include Related Data

```typescript
// Restaurant with ALL related data
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest1" },
  include: {
    owner: true,        // Include owner info
    region: true,       // Include region info
    images: true,       // Include all images
    eventSlots: true,   // Include all slots
  }
})

// Result structure:
{
  id: "rest1",
  name: "Restaurant",
  ownerId: "abc123",
  regionId: "reg1",

  // Included relations:
  owner: {
    id: "abc123",
    email: "owner@email.com",
    name: "John"
  },
  region: {
    id: "reg1",
    name: "Москва",
    slug: "moscow"
  },
  images: [
    { id: "img1", url: "/uploads/pic1.jpg", isPrimary: true },
    { id: "img2", url: "/uploads/pic2.jpg", isPrimary: false }
  ],
  eventSlots: [
    { id: "slot1", date: "2024-01-01", startTime: "18:00", ... },
    { id: "slot2", date: "2024-01-02", startTime: "19:00", ... }
  ]
}
```

#### 2. Selective Includes

```typescript
// Only include what you need
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest1" },
  include: {
    images: true,  // Include images
    region: true,  // Include region
    // NOT including owner or eventSlots
  }
})
```

#### 3. Nested Includes

```typescript
// Get user with restaurants, and each restaurant's images
const user = await prisma.user.findUnique({
  where: { id: "abc123" },
  include: {
    restaurants: {          // Include restaurants
      include: {            // For each restaurant...
        images: true,       // Include its images
        region: true,       // Include its region
        eventSlots: {       // Include its slots
          where: {          // Filter slots
            isAvailable: true
          }
        }
      }
    }
  }
})

// Result:
{
  id: "abc123",
  email: "owner@email.com",
  restaurants: [
    {
      id: "rest1",
      name: "Restaurant1",
      images: [ {...}, {...} ],
      region: { id: "reg1", name: "Москва" },
      eventSlots: [ {...}, {...} ]  // Only available ones
    }
  ]
}
```

### Select Specific Fields

```typescript
// Only get specific fields (performance optimization)
const restaurants = await prisma.restaurant.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    capacity: true,
    // NOT selecting: description, address, etc.

    // Can still include relations
    images: {
      select: {
        url: true,
        isPrimary: true
      }
    }
  }
})

// Result - smaller, faster:
[
  {
    id: "rest1",
    name: "Restaurant1",
    slug: "restaurant-1",
    capacity: 100,
    images: [
      { url: "/uploads/pic1.jpg", isPrimary: true }
    ]
  }
]
```

### Filtering and Searching

#### 1. Text Search

```typescript
// Case-insensitive search
const restaurants = await prisma.restaurant.findMany({
  where: {
    name: {
      contains: "pizza",    // LIKE '%pizza%'
      mode: "insensitive"   // Case-insensitive
    }
  }
})

// Search in multiple fields
const results = await prisma.restaurant.findMany({
  where: {
    OR: [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ]
  }
})
```

#### 2. Number Comparisons

```typescript
// Find restaurants with capacity >= 50 and price <= 5000
const restaurants = await prisma.restaurant.findMany({
  where: {
    capacity: { gte: 50 },          // Greater than or equal
    pricePerHour: { lte: 5000 },    // Less than or equal
  }
})

// Other operators:
// gt: greater than
// lt: less than
// gte: greater than or equal
// lte: less than or equal
// not: not equal
```

#### 3. Date Filtering

```typescript
// Find slots for future dates
const futureSlots = await prisma.eventSlot.findMany({
  where: {
    date: {
      gte: new Date()  // Greater than or equal to today
    }
  }
})

// Find slots in date range
const slotsInRange = await prisma.eventSlot.findMany({
  where: {
    date: {
      gte: new Date("2024-01-01"),
      lte: new Date("2024-01-31")
    }
  }
})
```

#### 4. Complex Filters

```typescript
// Combine multiple conditions
const results = await prisma.restaurant.findMany({
  where: {
    AND: [
      { isActive: true },
      { capacity: { gte: 50 } },
      {
        OR: [
          { regionId: "reg1" },
          { regionId: "reg2" }
        ]
      }
    ]
  }
})

// SQL equivalent:
// WHERE is_active = true
//   AND capacity >= 50
//   AND (region_id = 'reg1' OR region_id = 'reg2')
```

### Pagination

```typescript
// Page 1: items 0-9
const page1 = await prisma.restaurant.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' }
})

// Page 2: items 10-19
const page2 = await prisma.restaurant.findMany({
  skip: 10,
  take: 10,
  orderBy: { createdAt: 'desc' }
})

// Get total count for pagination UI
const total = await prisma.restaurant.count({
  where: { isActive: true }
})

const totalPages = Math.ceil(total / 10)
```

### Sorting

```typescript
// Sort by one field
const restaurants = await prisma.restaurant.findMany({
  orderBy: {
    createdAt: 'desc'  // Newest first
  }
})

// Sort by multiple fields
const sorted = await prisma.restaurant.findMany({
  orderBy: [
    { capacity: 'desc' },      // Highest capacity first
    { pricePerHour: 'asc' },   // Then lowest price
    { name: 'asc' }            // Then alphabetically
  ]
})

// Sort by related field
const restaurants = await prisma.restaurant.findMany({
  orderBy: {
    region: {
      name: 'asc'  // Sort by region name
    }
  }
})
```

---

## Real-World Examples from Your Code

### Example 1: Get Restaurants for Home Page

**File: `src/actions/restaurant.actions.ts`**

```typescript
export async function getRestaurants({
  search,
  region,
  page = 1,
  limit = 12
}: GetRestaurantsParams) {

  // Build where clause dynamically
  const where: Prisma.RestaurantWhereInput = {}

  // Add search filter if provided
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive"
    }
  }

  // Add region filter if provided
  if (region) {
    where.regionId = region
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Query with filters, includes, pagination
  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      include: {
        region: true,      // Include region for display
        images: {          // Include images
          take: 1,         // Only first image
          where: {
            isPrimary: true  // Primary image only
          }
        },
        _count: {
          select: {
            eventSlots: true  // Count slots
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.restaurant.count({ where })  // Total for pagination
  ])

  return {
    restaurants,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
```

**What this does:**
1. Builds dynamic filters based on search/region
2. Paginates results (skip/take)
3. Includes related data (region, images, slot count)
4. Runs two queries in parallel (findMany + count)
5. Returns data + pagination info

**SQL equivalent (approximately):**
```sql
SELECT r.*, reg.*, img.*,
  (SELECT COUNT(*) FROM event_slots WHERE restaurant_id = r.id) as slot_count
FROM restaurants r
LEFT JOIN regions reg ON r.region_id = reg.id
LEFT JOIN restaurant_images img ON r.id = img.restaurant_id AND img.is_primary = true
WHERE r.name ILIKE '%search%'
  AND r.region_id = 'reg1'
ORDER BY r.created_at DESC
LIMIT 12 OFFSET 0;
```

### Example 2: Get Restaurant Detail

**File: `src/app/restaurant/[slug]/page.tsx`**

```typescript
const restaurant = await prisma.restaurant.findUnique({
  where: { slug: params.slug },
  include: {
    owner: {
      select: {
        name: true,
        email: true,
        // NOT selecting password!
      }
    },
    region: true,
    images: {
      orderBy: {
        isPrimary: 'desc'  // Primary image first
      }
    }
  }
})

// Separately get available slots
const slots = await prisma.eventSlot.findMany({
  where: {
    restaurantId: restaurant.id,
    date: { gte: new Date() },    // Future dates only
    isAvailable: true              // Available only
  },
  orderBy: [
    { date: 'asc' },
    { startTime: 'asc' }
  ]
})
```

**Why separate queries?**
- Keep data structure clean
- Easier to modify slot filters
- Better performance (don't load slots for all restaurants on list page)

### Example 3: Create Restaurant with Images

**File: `src/actions/restaurant.actions.ts`**

```typescript
export async function createRestaurant(data: RestaurantFormData) {
  // ... validation ...

  const restaurant = await prisma.restaurant.create({
    data: {
      name: validated.data.name,
      slug: generateSlug(validated.data.name),
      description: validated.data.description,

      // Foreign keys - just provide IDs
      ownerId: session.user.id,     // Links to User
      regionId: validated.data.regionId,  // Links to Region

      // Nested create - create images at same time
      images: {
        create: validated.data.images?.map((img, index) => ({
          url: img.url,
          alt: `${validated.data.name} - изображение ${index + 1}`,
          isPrimary: index === 0  // First image is primary
        })) || []
      }
    },

    // Include created images in response
    include: {
      images: true,
      region: true
    }
  })

  return { success: true, restaurant }
}
```

**What happens in database:**

```sql
-- Transaction starts

-- 1. Insert restaurant
INSERT INTO restaurants (id, name, slug, owner_id, region_id, ...)
VALUES ('rest1', 'Restaurant', 'restaurant', 'abc123', 'reg1', ...);

-- 2. Insert images (nested create)
INSERT INTO restaurant_images (id, restaurant_id, url, alt, is_primary)
VALUES
  ('img1', 'rest1', '/uploads/pic1.jpg', 'Restaurant - изображение 1', true),
  ('img2', 'rest1', '/uploads/pic2.jpg', 'Restaurant - изображение 2', false);

-- 3. Fetch created restaurant with relations
SELECT r.*, reg.*, img.*
FROM restaurants r
LEFT JOIN regions reg ON r.region_id = reg.id
LEFT JOIN restaurant_images img ON r.id = img.restaurant_id
WHERE r.id = 'rest1';

-- Transaction commits
```

### Example 4: Update with Relation Changes

**File: `src/actions/restaurant.actions.ts`**

```typescript
export async function updateRestaurant(
  restaurantId: string,
  data: RestaurantFormData
) {
  // ... validation ...

  // Delete old images and create new ones
  const restaurant = await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      name: validated.data.name,
      description: validated.data.description,

      // Update nested relations
      images: {
        deleteMany: {},  // Delete all existing images
        create: validated.data.images?.map((img, index) => ({
          url: img.url,
          alt: `${validated.data.name} - изображение ${index + 1}`,
          isPrimary: index === 0
        })) || []
      }
    },
    include: {
      images: true
    }
  })

  return { success: true, restaurant }
}
```

**Database operations:**

```sql
-- Transaction starts

-- 1. Delete old images
DELETE FROM restaurant_images WHERE restaurant_id = 'rest1';

-- 2. Update restaurant
UPDATE restaurants
SET name = 'New Name', description = 'New Description', updated_at = NOW()
WHERE id = 'rest1';

-- 3. Insert new images
INSERT INTO restaurant_images (id, restaurant_id, url, alt, is_primary)
VALUES (...);

-- Transaction commits
```

---

## Indexes & Performance

### What are Indexes?

Indexes make queries faster by creating a sorted lookup table.

**Without index:**
```sql
-- Slow: Must scan ALL rows
SELECT * FROM restaurants WHERE owner_id = 'abc123';
-- Scans: 1, 2, 3, 4, 5, ... 10000 rows
```

**With index:**
```sql
-- Fast: Jumps directly to matching rows
SELECT * FROM restaurants WHERE owner_id = 'abc123';
-- Uses index: Finds rows instantly
```

### Your Schema's Indexes

```prisma
model Restaurant {
  // ...

  @@index([regionId])    // Index on regionId for fast filtering
  @@index([ownerId])     // Index on ownerId for owner queries
  @@map("restaurants")
}

model RestaurantImage {
  // ...

  @@index([restaurantId])  // Index for fast restaurant→images lookup
  @@map("restaurant_images")
}

model EventSlot {
  // ...

  @@index([restaurantId, date])  // Composite index for restaurant + date
  @@index([date])                // Index for date-only queries
  @@map("event_slots")
}
```

### When Indexes are Used

**Indexed queries (fast):**

```typescript
// Uses regionId index
await prisma.restaurant.findMany({
  where: { regionId: "reg1" }
})

// Uses ownerId index
await prisma.restaurant.findMany({
  where: { ownerId: "abc123" }
})

// Uses restaurantId + date composite index
await prisma.eventSlot.findMany({
  where: {
    restaurantId: "rest1",
    date: { gte: new Date() }
  }
})
```

**Non-indexed queries (slower):**

```typescript
// No index on 'name' - must scan all rows
await prisma.restaurant.findMany({
  where: {
    name: { contains: "pizza" }
  }
})

// No index on 'capacity' - must scan all rows
await prisma.restaurant.findMany({
  where: {
    capacity: { gte: 100 }
  }
})
```

### When to Add Indexes

✅ **Add index if:**
- You frequently filter/search by this field
- It's a foreign key (usually auto-indexed)
- You sort by this field often

❌ **Don't add index if:**
- You rarely query this field
- Table has few rows (< 1000)
- Field has very few unique values (e.g., boolean)

---

## Common Patterns

### Pattern 1: Ownership Check

```typescript
// Verify user owns the restaurant before modification
const restaurant = await prisma.restaurant.findUnique({
  where: { id: restaurantId },
  select: { ownerId: true }
})

if (restaurant.ownerId !== session.user.id) {
  return { error: "Not authorized" }
}

// Now safe to update
await prisma.restaurant.update({
  where: { id: restaurantId },
  data: { ... }
})
```

### Pattern 2: Upsert (Update or Insert)

```typescript
// Update if exists, create if doesn't
const region = await prisma.region.upsert({
  where: { slug: "moscow" },
  update: {
    name: "Москва"  // Update if exists
  },
  create: {
    slug: "moscow",
    name: "Москва"  // Create if doesn't exist
  }
})
```

### Pattern 3: Transactions

```typescript
// Multiple operations - all or nothing
const [restaurant, slot] = await prisma.$transaction([
  prisma.restaurant.create({ data: restaurantData }),
  prisma.eventSlot.create({ data: slotData })
])

// If either fails, both are rolled back
```

### Pattern 4: Count Relations

```typescript
// Get restaurant with slot count
const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest1" },
  include: {
    _count: {
      select: {
        eventSlots: true,  // Count of slots
        images: true       // Count of images
      }
    }
  }
})

// Result:
{
  id: "rest1",
  name: "Restaurant",
  _count: {
    eventSlots: 15,
    images: 3
  }
}
```

### Pattern 5: Conditional Includes

```typescript
// Include owner info only if needed
const includeOwner = userRole === "ADMIN"

const restaurant = await prisma.restaurant.findUnique({
  where: { id: "rest1" },
  include: {
    ...(includeOwner && { owner: true }),  // Conditional include
    images: true
  }
})
```

---

## Troubleshooting

### Issue: "Foreign key constraint failed"

**Error:**
```
Prisma error: Foreign key constraint failed on the field: `owner_id`
```

**Cause:**
Trying to create/update record with invalid foreign key

**Solution:**
```typescript
// Bad: User doesn't exist
await prisma.restaurant.create({
  data: {
    ownerId: "nonexistent-id"  // ← Error!
  }
})

// Good: Use existing user ID
const user = await prisma.user.findUnique({ where: { email: "user@email.com" } })
await prisma.restaurant.create({
  data: {
    ownerId: user.id  // ← Valid ID
  }
})
```

### Issue: "Record not found"

**Error:**
```
Record to update not found.
```

**Solution:**
```typescript
// Check if exists first
const exists = await prisma.restaurant.findUnique({
  where: { id: restaurantId }
})

if (!exists) {
  return { error: "Restaurant not found" }
}

// Now safe to update
await prisma.restaurant.update({ ... })
```

### Issue: Slow queries

**Symptoms:**
- Queries take >1 second
- Database CPU high

**Debug:**
```typescript
// Add logging
const startTime = Date.now()
const result = await prisma.restaurant.findMany({ ... })
console.log(`Query took ${Date.now() - startTime}ms`)

// Check what's being queried
console.log(JSON.stringify(result, null, 2))
```

**Solutions:**
1. Add indexes on filtered fields
2. Use `select` instead of `include` (fetch less data)
3. Paginate large result sets
4. Avoid N+1 queries (use include instead of separate queries)

### Issue: Type errors after schema changes

**Error:**
```
Property 'newField' does not exist on type 'Restaurant'
```

**Solution:**
```bash
# Regenerate Prisma client after schema changes
npx prisma generate

# Restart TypeScript server in editor
```

---

## Summary

### Key Concepts

1. **Foreign Keys** - Columns that link tables together
2. **Relations** - One-to-many, many-to-one connections
3. **CASCADE** - Automatic cleanup when parent deleted
4. **Includes** - Fetch related data in one query
5. **Indexes** - Speed up queries on filtered fields

### Best Practices

✅ **Do:**
- Use `include` to fetch related data
- Add indexes on frequently filtered fields
- Use transactions for multi-step operations
- Check ownership before modifications
- Use `select` when you don't need all fields

❌ **Don't:**
- Expose password fields in queries
- Delete parent records manually (use CASCADE)
- Query relations in loops (N+1 problem)
- Forget to regenerate client after schema changes

### Quick Reference

```typescript
// Find with relations
findUnique({ where, include })

// Filter and search
findMany({ where, orderBy, skip, take })

// Create with nested data
create({ data: { field, relation: { create } } })

// Update with relation changes
update({ where, data: { field, relation: { deleteMany, create } } })

// Delete (cascade automatic)
delete({ where })

// Count
count({ where })

// Transactions
$transaction([query1, query2])
```

---

**For more:**
- Prisma Docs: https://www.prisma.io/docs
- Your schema: `prisma/schema.prisma`
- Generated types: `src/generated/prisma/`
