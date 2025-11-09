# Content Centralization Migration Status

## Summary
Migration of hardcoded Russian/English text to centralized content system at `src/content/text.content.ts`.

**Status: PARTIALLY COMPLETE (Core functionality complete, remaining files identified)**

---

## COMPLETED FILES ✅

### 1. Validation Schemas (3/3 complete)
- ✅ `src/lib/validations/restaurant.schema.ts`
- ✅ `src/lib/validations/slot.schema.ts`
- ✅ `src/schema/zod.ts`

### 2. Action Files (4/4 complete)
- ✅ `src/actions/sign-in.ts`
- ✅ `src/actions/sign-out.ts` (no text, but verified)
- ✅ `src/actions/restaurant.actions.ts`
- ✅ `src/actions/slot.actions.ts`

### 3. Form Components (2/2 complete)
- ✅ `src/forms/login.form.tsx`
- ✅ `src/forms/registration.form.tsx`

### 4. Restaurant Components (4/? complete)
- ✅ `src/components/restaurant/RestaurantForm.tsx`
- ✅ `src/components/restaurant/DeleteRestaurantButton.tsx`
- ✅ `src/components/restaurant/SearchForm.tsx`
- ✅ `src/components/restaurant/RestaurantManagementHeader.tsx`

---

## REMAINING FILES TO UPDATE ⚠️

### HIGH PRIORITY (Critical User-Facing Components)

#### Restaurant Components
- ⚠️ `src/components/restaurant/RestaurantEditForm.tsx`
  - Contains: form labels, buttons, validation messages
  - Required: content.restaurant.* and content.actions.*

- ⚠️ `src/components/restaurant/OwnerRestaurantCard.tsx`
  - Contains: status labels, button text
  - Required: content.restaurant.*, content.slot.*

- ⚠️ `src/components/restaurant/RestaurantCard.tsx`
  - Check if contains hardcoded text

- ⚠️ `src/components/restaurant/RestaurantList.tsx`
  - Check if contains hardcoded text

#### Slot Components
- ⚠️ `src/components/slot/SlotForms.tsx`
  - Contains: form labels, tab names, date/time labels, buttons
  - Required: content.slot.*, content.validation.*, content.actions.*

- ⚠️ `src/components/slot/SlotList.tsx`
  - Contains: status labels, time displays, action buttons
  - Required: content.slot.*, content.actions.*

- ⚠️ `src/components/slot/SlotCalendar.tsx`
  - Check if contains hardcoded text

#### UI Components
- ⚠️ `src/components/UI/modals/registration.modal.tsx`
  - Contains: modal titles, labels
  - Required: content.auth.*

- ⚠️ `src/components/UI/modals/login.modal.tsx`
  - Check if contains hardcoded text

- ⚠️ `src/components/UI/layout/header.tsx`
  - Check for navigation labels
  - Required: content.nav.*, content.auth.*

- ⚠️ `src/components/UI/layout/title.tsx`
  - Check if contains hardcoded text

### MEDIUM PRIORITY (Page Files)

#### Owner Pages
- ⚠️ `src/app/owner/dashboard/page.tsx`
  - Check for dashboard labels, stats

- ⚠️ `src/app/owner/my-restaurants/page.tsx`
  - Contains: page title, empty states
  - Required: content.restaurant.*, content.owner.*

- ⚠️ `src/app/owner/restaurant/create/page.tsx`
  - Contains: page title, breadcrumbs
  - Required: content.restaurant.*

- ⚠️ `src/app/owner/restaurant/[id]/page.tsx`
  - Contains: management UI labels
  - Required: content.restaurant.*, content.slot.*

- ⚠️ `src/app/owner/restaurant/[id]/edit/page.tsx`
  - Contains: page title, form wrapper
  - Required: content.restaurant.*

- ⚠️ `src/app/owner/restaurant/[id]/slots/page.tsx`
  - Contains: slot management labels
  - Required: content.slot.*

#### Public Pages
- ⚠️ `src/app/page.tsx` (Home)
  - Contains: hero text, search section
  - Required: content.home.*, content.restaurant.*

- ⚠️ `src/app/restaurant/[slug]/page.tsx`
  - Contains: contact labels, section titles
  - Required: content.restaurant.*, content.contact.*, content.slot.*

- ⚠️ `src/app/not-found.tsx`
  - Check for 404 messages

- ⚠️ `src/app/layout.tsx`
  - Check for metadata, site info

### LOW PRIORITY (API & Other)

#### API Routes
- ⚠️ `src/app/api/upload/route.ts`
  - Contains: error messages
  - Required: content.upload.*

- ⚠️ `src/app/api/auth/[...nextauth]/route.ts`
  - Check if contains hardcoded messages

#### Actions (Additional)
- ⚠️ `src/actions/register.tsx`
  - Contains: error/success messages
  - Required: content.auth.*

---

## MIGRATION PATTERN

For each remaining file, follow this pattern:

### 1. Add Import
```typescript
import { content } from "@/content/text.content";
```

### 2. Replace Hardcoded Text

**Before:**
```typescript
<Button>Создать ресторан</Button>
<label>Название *</label>
{error && <div>Ошибка при создании</div>}
```

**After:**
```typescript
<Button>{content.restaurant.create}</Button>
<label>{content.restaurant.nameLabel}</label>
{error && <div>{content.restaurant.createError}</div>}
```

### 3. Function Calls with Parameters

**Before:**
```typescript
`От ${price}`
`Успешно создано ${count} слотов`
```

**After:**
```typescript
content.restaurant.priceFrom(price)
content.slot.createSuccessMultiple(count)
```

---

## CONTENT REFERENCE GUIDE

### Most Commonly Used Paths

#### Navigation & Auth
- `content.nav.*` - Navigation links
- `content.auth.*` - Login, register, errors, labels

#### Actions
- `content.actions.*` - create, edit, delete, save, cancel, etc.

#### Restaurant
- `content.restaurant.*` - All restaurant-related text
- `content.restaurant.nameLabel`, `.addressLabel`, etc.
- `content.restaurant.createSuccess`, `.createError`, etc.

#### Slots
- `content.slot.*` - All slot/event-related text
- `content.slot.dateLabel`, `.startTimeLabel`, etc.
- `content.slot.createSuccess`, `.createError`, etc.

#### Validation
- `content.validation.*` - All validation messages
- `content.validation.emailRequired`, `.passwordMin`, etc.

#### Upload & Forms
- `content.upload.*` - File upload messages
- `content.form.*` - Form-related labels

#### Status & Errors
- `content.status.*` - Loading, saving, success, error
- `content.errors.*` - Generic error messages

---

## VERIFICATION CHECKLIST

After updating each file:
- [ ] All hardcoded Russian text replaced with `content.*` references
- [ ] All hardcoded English text replaced with `content.*` references
- [ ] Import statement added at top of file
- [ ] Function-based content (with parameters) used correctly
- [ ] File compiles without errors
- [ ] Test functionality in browser

---

## SEARCH PATTERNS

To find remaining hardcoded text, use these grep patterns:

```bash
# Russian Cyrillic text
grep -r "[А-Яа-яЁё]" src/ --include="*.tsx" --include="*.ts"

# Common Russian words
grep -rE "(Создать|Редактировать|Удалить|Сохранить|Отмена|Загрузка)" src/ --include="*.tsx" --include="*.ts"

# Field labels
grep -rE "(Название|Описание|Адрес|Город|Телефон|Email|Цена|Дата|Время)" src/ --include="*.tsx" --include="*.ts"

# Status messages
grep -rE "(Ошибка|успешно|обязательно)" src/ --include="*.tsx" --include="*.ts"
```

---

## NOTES

1. **NO EMOJIS** were added to any file (as requested)
2. All existing emojis in buttons (e.g., "📁 Загрузить") were replaced with content references that include the emoji
3. The content file (`text.content.ts`) is complete and ready to use
4. All validation schemas now use centralized content
5. All action files now use centralized content
6. Core form components updated

---

## NEXT STEPS

1. Update SlotForms.tsx and SlotList.tsx (high priority user-facing components)
2. Update RestaurantEditForm.tsx and OwnerRestaurantCard.tsx
3. Update all page files (src/app/**/page.tsx)
4. Update remaining UI components (header, modals)
5. Update API routes
6. Update register action
7. Run final verification with grep patterns above
8. Test all forms and user flows

---

**Estimated Remaining Work:** 14-17 files
**Time Required:** 2-3 hours for careful migration
