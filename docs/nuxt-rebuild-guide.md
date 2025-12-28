# Alkamind Nuxt Rebuild Guide

A step-by-step guide for rebuilding the Alkamind website with Nuxt 4 and Contentful.

---

## Section 1: Project Setup

### 1.1 Prerequisites
- Node.js 18+
- npm or pnpm
- Git
- VS Code (recommended)

### 1.2 Initial Setup
```bash
npx nuxi@latest init alkamind
cd alkamind
npm install
npm run dev
```

### 1.3 Branch Strategy
- `main` — Production (live site)
- `nuxt-rebuild` — Development branch
- `v1-react-backup` — Original React site backup

---

## Section 2: Project Structure

Nuxt 4 uses the `app/` directory structure:

```
alkamind/
├── app/
│   ├── app.vue          # Root component
│   ├── pages/           # File-based routing
│   ├── components/      # Auto-imported components
│   ├── layouts/         # Page layouts
│   └── composables/     # Auto-imported composables
├── public/              # Static assets
├── nuxt.config.ts       # Nuxt configuration
└── docs/                # This guide
```

---

## Section 3: Contentful CMS Setup

### 3.1 Create Contentful Account
1. Go to [contentful.com](https://www.contentful.com)
2. Sign up for a free account
3. Create a new Space (or use existing)

### 3.2 Content Model: Home Page

Create a **Home Page** content type with these fields:

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| heroTitle | Short text | Yes | Main headline (Entry title) |
| heroSubtitle | Rich text | Yes | Supporting text/tagline |
| heroImage | Media | No | Hero background or logo |
| callToActionText | Short text | Yes | Button label |
| callToActionLink | Short text | Yes | Button URL (Calendly) |
| metaTitle | Short text | No | SEO title |
| metaDescription | Long text | No | SEO description |

### 3.3 Create Home Page Content

1. Go to **Content** → **Add entry** → **Home Page**
2. Fill in the fields:
   - **heroTitle**: Alkamind Consulting
   - **heroSubtitle**: Your value proposition
   - **heroImage**: Upload logo/hero image
   - **callToActionText**: Book a Conversation
   - **callToActionLink**: https://calendly.com/your-link
   - **metaTitle**: Change Management & Solutions Development
   - **metaDescription**: SEO description for search engines
3. Click **Publish**

### 3.4 Get API Keys

1. Go to **Settings** → **API keys**
2. Click **Add API key**
3. Copy these values:
   - **Space ID**
   - **Content Delivery API - access token**
4. Add to `.env` file (never commit this):

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### 3.5 Install Contentful SDK

```bash
npm install contentful
```

### 3.6 Create Contentful Composable

Create `app/composables/useContentful.ts`:

```typescript
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || ''
})

export const useContentful = () => {
  const getHomePage = async () => {
    const entries = await client.getEntries({
      content_type: 'homePage',
      limit: 1
    })
    return entries.items[0]?.fields
  }

  return {
    getHomePage
  }
}
```

---

## Section 4: Connecting Nuxt to Contentful

### 4.1 Environment Variables

Add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  }
})
```

### 4.2 Fetch Content in Pages

In `app/pages/index.vue`:

```vue
<script setup>
const { getHomePage } = useContentful()
const homepage = await getHomePage()
</script>

<template>
  <div>
    <h1>{{ homepage.heroTitle }}</h1>
    <p>{{ homepage.heroSubtitle }}</p>
    <a :href="homepage.callToActionLink">
      {{ homepage.callToActionText }}
    </a>
  </div>
</template>
```

---

## Section 5: Styling with Tailwind

### 5.1 Install Tailwind

```bash
npm install -D @nuxtjs/tailwindcss
```

Add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss']
})
```

---

## Section 6: Deployment to Netlify

### 6.1 Netlify Configuration

`netlify.toml`:

```toml
[build]
  command = "npm run generate"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

### 6.2 Environment Variables in Netlify

1. Go to Site settings → Environment variables
2. Add:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`

---

## Quick Reference: Content Types

| Content Type | Purpose | Status |
|--------------|---------|--------|
| Home Page | Main landing page | Active |
| Page | Generic pages | Available |
| BlogPost | Blog articles | Available |

---

## Troubleshooting

### Content not appearing
- Check API keys are correct in `.env`
- Verify content is **Published** in Contentful
- Check content type ID matches code (`homePage`)

### Build errors
- Run `npm run dev` locally first
- Check Netlify build logs
- Verify environment variables are set

---

*Last updated: December 2024*
