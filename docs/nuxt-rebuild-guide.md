# Alkamind Nuxt Rebuild Guide v4

A step-by-step guide for rebuilding the Alkamind website with Nuxt 4, Contentful CMS, and Cloudflare Pages.

---

## Section 1: Project Setup

### 1.1 Prerequisites
- Node.js 20+ (required for Nuxt 4)
- npm
- Git
- VS Code (recommended)
- Contentful account (free tier)
- Cloudflare account (free tier)

### 1.2 Initial Setup
```bash
npx nuxi@latest init alkamind
cd alkamind
npm install
npm run dev
```

### 1.3 Branch Strategy
- `main` — Production (live site) - DO NOT push directly during development
- `nuxt-rebuild` — Development branch (all work happens here)
- `v1-react-backup` — Original React site backup

---

## Section 2: Project Structure

Nuxt 4 uses the `app/` directory structure:

```
alkamind/
├── app/
│   ├── app.vue              # Root component
│   ├── pages/               # File-based routing
│   ├── components/          # Auto-imported components
│   ├── layouts/             # Page layouts
│   └── composables/         # Auto-imported composables
│       └── useContentful.ts # Contentful API integration
├── public/                  # Static assets
├── nuxt.config.ts           # Nuxt configuration
├── .env                     # Environment variables (never commit!)
└── docs/                    # This guide
```

---

## Section 3: Contentful CMS Setup

### 3.1 Create/Access Contentful Account
1. Go to [contentful.com](https://www.contentful.com)
2. Sign up for a free account (or log into existing)
3. Use existing Space or create a new one

### 3.2 Content Model: Home Page

Create (or use existing) **Home Page** content type with these fields:

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| heroTitle | Short text | Yes | Main headline (set as Entry title) |
| heroSubtitle | Rich text | Yes | Supporting text/tagline |
| heroImage | Media | No | Logo or hero image |
| callToActionText | Short text | Yes | Button label (e.g., "Book a Conversation") |
| callToActionLink | Short text | Yes | Button URL (e.g., Calendly link) |
| metaTitle | Short text | No | SEO title for search engines |
| metaDescription | Long text | No | SEO description |

**To add a field:**
1. Go to Content model → Home Page
2. Click "Add field"
3. Select "Text" for short/long text fields
4. Choose "Short text" or "Long text" as needed

### 3.3 Create Home Page Content

1. Go to **Content** → **Add entry** → **Home Page**
2. Fill in the fields:
   - **heroTitle**: Alkamind Consulting
   - **heroSubtitle**: Your value proposition text
   - **heroImage**: Upload your logo
   - **callToActionText**: Book a Conversation
   - **callToActionLink**: https://calendly.com/alf-alkamind/coaching-session
   - **metaTitle**: Change Management & Solutions Development
   - **metaDescription**: Decades of experience bringing clarity to organizational and technology transformation.
3. Click **Publish**

### 3.4 Get API Keys

1. Go to **Settings** → **API keys**
2. Use existing API key or click **Add API key**
3. Copy these values:
   - **Space ID** (e.g., `86mkfcvuxwv3`)
   - **Content Delivery API - access token**
4. Create `.env` file in project root (never commit this!):

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

**Note:** Keep the Preview API token for later if you want draft preview functionality.

---

## Section 4: Integrating Contentful with Nuxt

### 4.1 Install Dependencies

```bash
npm install contentful @contentful/rich-text-html-renderer
```

### 4.2 Update nuxt.config.ts

Add runtime config for environment variables:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    }
  },
  app: {
    head: {
      title: 'Alkamind - Change Management & Application Development',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Alkamind Consulting - Change Management & Application Development consultancy' }
      ]
    }
  }
})
```

### 4.3 Create Contentful Composable

Create `app/composables/useContentful.ts`:

```typescript
import { createClient } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export const useContentful = () => {
  const config = useRuntimeConfig()

  const client = createClient({
    space: config.public.contentfulSpaceId,
    accessToken: config.public.contentfulAccessToken
  })

  const getHomePage = async () => {
    const entries = await client.getEntries({
      content_type: 'homePage',
      limit: 1
    })
    return entries.items[0]?.fields
  }

  return {
    client,
    getHomePage
  }
}

export const renderRichText = (richText: any): string => {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (richText.nodeType === 'document') {
    return documentToHtmlString(richText)
  }
  return String(richText)
}
```

### 4.4 Update app.vue

```vue
<script setup lang="ts">
const { getHomePage } = useContentful()
const { data: homepage } = await useAsyncData('homepage', () => getHomePage())
</script>

<template>
  <div>
    <h1>{{ homepage?.heroTitle || 'Default Title' }}</h1>
    <div v-if="homepage?.heroSubtitle" v-html="renderRichText(homepage.heroSubtitle)"></div>
    <a :href="homepage?.callToActionLink || '#'">
      {{ homepage?.callToActionText || 'Contact Us' }}
    </a>
  </div>
</template>
```

### 4.5 Test Locally

```bash
npm run dev
```

Open http://localhost:3000 - you should see content from Contentful.

---

## Section 5: Deployment to Cloudflare Pages

### 5.1 Why Cloudflare Pages?
- Free tier includes environment variables
- Fast global CDN
- Easy integration if already using Cloudflare DNS
- Automatic HTTPS

### 5.2 Connect GitHub to Cloudflare

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Compute & AI** → **Workers & Pages**
3. Click **Create**
4. Click **"Looking to deploy Pages? Get started"** (if shown)
5. Select **"Import an existing Git repository"**
6. Connect your GitHub account
7. Select the **alkamind** repository

### 5.3 Configure Build Settings

| Setting | Value |
|---------|-------|
| Project name | `alkamind` |
| Production branch | `nuxt-rebuild` |
| Build command | `npm run generate` |
| Build output directory | `dist` |

### 5.4 Add Environment Variables

In the same setup screen (or Settings → Variables and Secrets):

| Variable Name | Value |
|---------------|-------|
| `NODE_VERSION` | `20` |
| `CONTENTFUL_SPACE_ID` | Your space ID |
| `CONTENTFUL_ACCESS_TOKEN` | Your access token |

**Important:** `NODE_VERSION=20` is required - Nuxt 4 doesn't work with Node 18.

### 5.5 Deploy

Click **Save and Deploy**. Build takes ~30-60 seconds.

Your site will be available at: `https://alkamind.pages.dev`

---

## Section 6: Content Update Workflow

### 6.1 Making Content Changes

1. **Edit in Contentful:**
   - Go to Content → select your entry
   - Make changes
   - Click **Publish**

2. **Trigger Rebuild:**
   - Go to Cloudflare Pages → alkamind → Deployments
   - Click on latest deployment → **Manage deployment** → **Retry deployment**

3. **View Changes:**
   - Wait ~30 seconds for build
   - Hard refresh browser (`Ctrl+Shift+R`) to bypass cache
   - View at https://alkamind.pages.dev

### 6.2 Automatic Deploys (Optional)

To auto-deploy when content changes, set up a Contentful webhook:

1. In Cloudflare Pages: Settings → Deploy Hooks → Create hook
2. Copy the webhook URL
3. In Contentful: Settings → Webhooks → Add webhook
4. Paste URL, trigger on "Publish" events

---

## Section 7: Connecting Custom Domain

### 7.1 Add Domain in Cloudflare Pages

1. Go to alkamind project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `alkamind.com`
4. Cloudflare will auto-configure DNS (since you're already using Cloudflare DNS)

### 7.2 Verify

- Wait for DNS propagation (usually instant with Cloudflare)
- Visit https://alkamind.com

---

## Quick Reference

### Commands
```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Build for production
npm run generate  # Generate static site
npm run preview   # Preview production build
```

### Content Types in Use

| Content Type | Purpose | Status |
|--------------|---------|--------|
| Home Page | Main landing page | Active |
| Page | Generic pages | Available |
| BlogPost | Blog articles | Available |

### Key Files

| File | Purpose |
|------|---------|
| `app/app.vue` | Main page component |
| `app/composables/useContentful.ts` | Contentful API integration |
| `nuxt.config.ts` | Nuxt configuration |
| `.env` | Local environment variables |

---

## Troubleshooting

### Content not appearing on site
- Verify content is **Published** in Contentful (not draft)
- Hard refresh browser: `Ctrl+Shift+R`
- Try incognito/private window
- Check Cloudflare deployment completed successfully

### Build fails with Node version error
- Ensure `NODE_VERSION=20` is set in Cloudflare environment variables
- Nuxt 4 requires Node 20+, Cloudflare defaults to Node 18

### Build fails with package-lock.json error
- Locally: `rm -rf node_modules package-lock.json && npm install`
- Commit and push the new package-lock.json
- Retry deployment

### "Internal error" in Cloudflare
- Try Build system version 2 (Settings → Build configuration)
- Wait a few minutes and retry
- Check Cloudflare status page for outages

### Changes not showing after deploy
- Content is baked in at build time
- Must redeploy after Contentful changes
- Use Manage deployment → Retry deployment

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v4 | Dec 2024 | Switched to Cloudflare Pages, updated for Nuxt 4/Node 20 |
| v3 | Dec 2024 | Added Contentful integration |
| v2 | Dec 2024 | Initial Nuxt setup |

---

*Last updated: December 28, 2024*
