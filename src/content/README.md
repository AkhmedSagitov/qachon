# Content Management System

All text content for the application is centralized in `text.content.ts` for easy management and future internationalization.

## Usage

### 1. Import the content object

```typescript
import { content } from "@/content/text.content";
```

### 2. Use content in your components

```typescript
// Simple text
<h1>{content.site.title}</h1>
<p>{content.auth.loading}</p>

// Functions for dynamic content
<span>{content.auth.greeting(user.email)}</span>
<span>{content.site.copyright(2025)}</span>

// Form validation messages
{errors.name && <span>{content.form.required}</span>}
{errors.password && <span>{content.form.minLength(8)}</span>}
```

### 3. Adding new content

Edit `text.content.ts` and add your content in the appropriate section:

```typescript
export const content = {
  // Your section
  mySection: {
    title: "My Title",
    description: "My Description",
    dynamicMessage: (name: string) => `Hello, ${name}!`,
  },
} as const;
```

## Structure

Content is organized by feature/domain:

- **site** - Site-wide information (title, description, etc.)
- **nav** - Navigation labels
- **auth** - Authentication related text
- **actions** - Common action buttons (create, edit, delete, etc.)
- **restaurant** - Restaurant-specific content
- **slot** - Event slot content
- **form** - Form validation messages
- **status** - Status messages (success, error, etc.)
- **errors** - Error messages
- **pagination** - Pagination labels
- **owner** - Owner/dashboard content
- **dateTime** - Date/time related text
- **roles** - User role labels
- **about** - About page content
- **home** - Home page content

## Benefits

1. **Easy Management** - All text in one place
2. **Consistency** - Reuse text across components
3. **Future i18n** - Easy to add translations later
4. **Type Safety** - TypeScript ensures you don't mistype keys
5. **Search & Replace** - Easy to find and update text

## Example: Converting existing component

**Before:**
```typescript
<Button>Создать</Button>
<span>Загрузка...</span>
```

**After:**
```typescript
import { content } from "@/content/text.content";

<Button>{content.actions.create}</Button>
<span>{content.auth.loading}</span>
```

## Future: Adding Internationalization

When you need multiple languages, you can extend this system:

```typescript
// content/text.content.ts
const translations = {
  ru: {
    site: {
      title: "Мероприятия",
    },
  },
  en: {
    site: {
      title: "Events",
    },
  },
};

export const content = translations[currentLanguage];
```
