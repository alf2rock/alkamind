# Alkamind Website Implementation Guide v4

**A Real-World Guide to Building with Nuxt 4, Contentful CMS, and Cloudflare Pages**

*Based on actual implementation experience - December 28, 2024*

---

## Overview

This guide documents the complete journey of rebuilding the Alkamind website, including all the challenges encountered and solutions discovered. Unlike theoretical guides, this reflects real implementation experience.

**Tech Stack:**
- **Frontend:** Nuxt 4 (Vue 3)
- **CMS:** Contentful (free tier)
- **Hosting:** Cloudflare Pages (free tier)
- **Styling:** Tailwind CSS
- **DNS:** Cloudflare

**What You'll Build:**
- A CMS-driven marketing website
- Content editable without code changes
- Automatic deployments from Git
- Fast, globally distributed hosting

---

## Part 1: Prerequisites

### Required Accounts (All Free Tier)

1. **GitHub** - https://github.com
   - For source code repository

2. **Contentful** - https://www.contentful.com
   - For content management

3. **Cloudflare** - https://cloudflare.com
   - For hosting and DNS

### Required Software

- **Node.js 20+** (Critical - Nuxt 4 requires Node 20, not 18)
- **npm** (comes with Node.js)
- **Git**
- **VS Code** (recommended)
- **Claude Code CLI** (optional but helpful)

### Verify Node Version
```bash
node --version
# Should show v20.x.x or higher
```

If you have Node 18, upgrade before proceeding.

---

## Part 2: Project Setup

### 2.1 Create Nuxt Project

```bash
npx nuxi@latest init alkamind
cd alkamind
npm install
```

### 2.2 Add Tailwind CSS

```bash
npm install -D @nuxtjs/tailwindcss
```

Update `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss']
})
```

### 2.3 Test Locally

```bash
npm run dev
```

Open http://localhost:3000 - you should see the Nuxt welcome page.

### 2.4 Git Setup

```bash
git init
git add .
git commit -m "v0.1: Initial Nuxt 4 setup"
```

**Branch Strategy:**
- `main` - Production (don't push here during development)
- `nuxt-rebuild` - Development branch (work here)

```bash
git checkout -b nuxt-rebuild
```

---

## Part 3: Contentful CMS Setup

### 3.1 Access Contentful

1. Go to https://www.contentful.com
2. Sign up or log in
3. You'll have one free Space

**If you have existing content from a previous attempt:**
- Keep content that's relevant to your site
- Unpublish (don't delete) template/demo content
- You can delete unpublished content later when confident

### 3.2 Understanding Content Types vs Content

- **Content Type** = The template/structure (like a database table)
- **Content** = The actual entries (like database rows)

### 3.3 Create "Home Page" Content Type

Go to **Content model** → **Add content type** → Name it "Home Page"

Add these fields (click "Add field" → select "Text"):

| Field Name | Type | Notes |
|------------|------|-------|
| heroTitle | Short text | Set as "Entry title" |
| heroSubtitle | Rich text | For formatted text |
| heroImage | Media | For logo/hero image |
| callToActionText | Short text | Button label |
| callToActionLink | Short text | Button URL |
| metaTitle | Short text | SEO title |
| metaDescription | Long text | SEO description |

**How to add a text field:**
1. Click "Add field"
2. Select "Text" (not Rich text for short text)
3. Choose "Short text" or "Long text"
4. Enter the field name
5. Save

### 3.4 Create Home Page Content

1. Go to **Content** → **Add entry** → **Home Page**
2. Fill in your content:

| Field | Example Value |
|-------|---------------|
| heroTitle | Alkamind Consulting |
| heroSubtitle | Your value proposition... |
| heroImage | Upload your logo |
| callToActionText | Book a Conversation |
| callToActionLink | https://calendly.com/your-link |
| metaTitle | Change Management & Solutions Development |
| metaDescription | Your SEO description... |

3. Click **Publish** (important - draft content won't appear!)

### 3.5 Get API Credentials

1. Go to **Settings** → **API keys**
2. Use existing key or create new one
3. Note these values:
   - **Space ID** (e.g., `86mkfcvuxwv3`)
   - **Content Delivery API - access token**

### 3.6 Create Local Environment File

Create `.env` in your project root:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

**IMPORTANT:** Never commit `.env` to Git! It should already be in `.gitignore`.

---

## Part 4: Connect Nuxt to Contentful

### 4.1 Install Contentful Packages

```bash
npm install contentful @contentful/rich-text-html-renderer
```

### 4.2 Update nuxt.config.ts

```typescript
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
        { name: 'description', content: 'Your site description' }
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
      content_type: 'homePage',  // This must match your content type ID
      limit: 1
    })
    return entries.items[0]?.fields
  }

  return {
    client,
    getHomePage
  }
}

// Helper to render Contentful rich text as HTML
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

Add script section at the top of `app/app.vue`:

```vue
<script setup lang="ts">
const { getHomePage } = useContentful()
const { data: homepage } = await useAsyncData('homepage', () => getHomePage())
</script>

<template>
  <div>
    <h1>{{ homepage?.heroTitle || 'Default Title' }}</h1>

    <div v-if="homepage?.heroSubtitle"
         v-html="renderRichText(homepage.heroSubtitle)">
    </div>

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

You should see your Contentful content at http://localhost:3000

**Troubleshooting:**
- Content not showing? Check that it's **Published** in Contentful
- Error about content type? The ID is `homePage` (camelCase of "Home Page")
- API error? Double-check your `.env` values

### 4.6 Commit Your Progress

```bash
git add .
git commit -m "v0.4 Add Contentful CMS integration"
git push origin nuxt-rebuild
```

---

## Part 5: Deploy to Cloudflare Pages

### 5.1 Why Cloudflare Pages (Not Netlify)

We originally planned to use Netlify, but discovered:
- Netlify's free tier restricts environment variables
- Cloudflare Pages free tier includes everything we need
- Since Alkamind already uses Cloudflare for DNS, it's a natural fit

### 5.2 Find Workers & Pages in Cloudflare

The Cloudflare dashboard can be confusing. Here's the path:

1. Log into https://dash.cloudflare.com
2. Click your account name (top left) to go to account level
3. In left sidebar, find **Compute & AI**
4. Click **Workers & Pages**

**Note:** If you're in a domain view (showing alkamind.com settings), you need to go back to the account level first.

### 5.3 Create Pages Project

1. Click **Create**
2. Look for "Pages" option (not Workers)
   - You might see "Looking to deploy Pages? Get started" - click that
3. Select **"Import an existing Git repository"**
4. Connect your GitHub account
5. Authorize Cloudflare to access your repository
6. Select the **alkamind** repository

### 5.4 Configure Build Settings

| Setting | Value |
|---------|-------|
| Project name | alkamind |
| Production branch | nuxt-rebuild |
| Build command | npm run generate |
| Build output directory | dist |

### 5.5 Add Environment Variables (Critical!)

Expand "Environment variables" section and add:

| Variable | Value |
|----------|-------|
| NODE_VERSION | 20 |
| CONTENTFUL_SPACE_ID | your_space_id |
| CONTENTFUL_ACCESS_TOKEN | your_access_token |

**CRITICAL: NODE_VERSION=20 is required!**

Nuxt 4 requires Node 20+. Cloudflare defaults to Node 18, which will cause build failures with errors like:
```
npm WARN EBADENGINE required: { node: '^20.19.0' }
```

### 5.6 Deploy

Click **Save and Deploy**

First build takes 1-2 minutes. Watch the build log for:
- "Installing nodejs 20.x.x" (confirms Node version)
- "Success: Your site was deployed!"

Your site is now live at: `https://alkamind.pages.dev`

---

## Part 6: Troubleshooting Deployment Issues

### Issue: "Internal error occurred"

**Symptom:** Build fails immediately after cloning with no useful error.

**Solution:**
1. Go to Settings → Build configuration
2. Change "Build system version" from V3 to V2
3. Retry deployment

### Issue: Node version errors

**Symptom:** Build log shows warnings about unsupported engine, requires Node 20.

**Solution:**
1. Go to Settings → Variables and Secrets
2. Add variable: `NODE_VERSION` = `20`
3. Retry deployment

### Issue: package-lock.json sync errors

**Symptom:**
```
npm error Invalid: lock file's commander@11.1.0 does not satisfy commander@13.1.0
```

**Solution:**
```bash
# Locally, run:
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix: Sync package-lock.json"
git push
```

Then retry deployment in Cloudflare.

### Issue: Native binding errors (oxc-parser)

**Symptom:**
```
Cannot find module '@oxc-parser/binding-linux-x64-gnu'
```

**Solution:** Same as above - regenerate package-lock.json. The lock file was created on Windows but needs Linux bindings for Cloudflare's build environment.

### Issue: Deployment shows "Skipped"

**Symptom:** New commits show as "Skipped" instead of building.

**Solution:**
1. Check if "Automatic deployments" is paused
2. Manually trigger: Deployments → Create deployment → Select branch

---

## Part 7: Content Update Workflow

### How Static Site Generation Works

Your site is **statically generated** - content is baked in at build time. This means:
- **Pros:** Fast, secure, cheap to host
- **Cons:** Content changes require a rebuild

### Updating Content

**Step 1: Edit in Contentful**
1. Go to Content → select your entry
2. Make changes
3. Click **Publish** (not just Save!)

**Step 2: Trigger Rebuild**
1. Go to Cloudflare Pages → alkamind
2. Click latest deployment
3. **Manage deployment** → **Retry deployment**

**Step 3: Verify**
1. Wait ~30 seconds for build to complete
2. Hard refresh browser: `Ctrl+Shift+R`
3. Or try incognito window (bypasses cache)

### Future Enhancement: Automatic Deploys

You can set up a webhook so Contentful automatically triggers Cloudflare builds:

1. **In Cloudflare:** Settings → Deploy Hooks → Create hook
2. **In Contentful:** Settings → Webhooks → Add webhook with the Cloudflare URL
3. Set trigger to "Publish" events

---

## Part 8: Connecting Custom Domain

When ready to go live with alkamind.com:

### 8.1 Add Custom Domain

1. In Cloudflare Pages → alkamind → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `alkamind.com`

### 8.2 DNS Configuration

Since you're already using Cloudflare DNS:
- Cloudflare auto-configures the DNS records
- Usually instant propagation

### 8.3 Verify

Visit https://alkamind.com - should show your Cloudflare Pages site.

---

## Quick Reference Card

### Local Development
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run generate  # Generate static site
npm run preview   # Preview production build
```

### Git Workflow
```bash
git add .
git commit -m "Your message"
git push origin nuxt-rebuild
```

### Content Update Cycle
1. Edit in Contentful → Publish
2. Cloudflare → Retry deployment
3. Hard refresh browser

### Key URLs
- **Local dev:** http://localhost:3000
- **Staging:** https://alkamind.pages.dev
- **Contentful:** https://app.contentful.com
- **Cloudflare:** https://dash.cloudflare.com

### Key Files
| File | Purpose |
|------|---------|
| app/app.vue | Main page component |
| app/composables/useContentful.ts | CMS connection |
| nuxt.config.ts | Nuxt configuration |
| .env | Local secrets (don't commit!) |

### Environment Variables (Cloudflare)
| Variable | Purpose |
|----------|---------|
| NODE_VERSION | Must be "20" for Nuxt 4 |
| CONTENTFUL_SPACE_ID | Your Contentful space |
| CONTENTFUL_ACCESS_TOKEN | API access token |

---

## Lessons Learned

### 1. Node Version Matters
Nuxt 4 requires Node 20+. Always set `NODE_VERSION=20` in your hosting environment.

### 2. package-lock.json Platform Issues
If you develop on Windows but deploy on Linux, you may need to regenerate package-lock.json when adding native dependencies.

### 3. Content Must Be Published
Draft content in Contentful won't appear. Always click **Publish**, not just Save.

### 4. Static Sites Need Rebuilds
Content changes require a deployment. This is a feature (fast, secure) not a bug.

### 5. Check the Right Dashboard Level
Cloudflare has domain-level and account-level dashboards. Workers & Pages is at the account level.

### 6. Keep Template Content (Unpublished)
Don't delete Contentful template content immediately. Unpublish it - you might want to reference it later.

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v4 | Dec 28, 2024 | Alf + Claude | Complete rewrite based on actual implementation. Switched to Cloudflare Pages. |
| v3 | Dec 2024 | - | Contentful integration |
| v2 | Dec 2024 | - | Initial Nuxt setup |
| v1.1 | Earlier | - | Original planning document |

---

## Next Steps

When you're ready to continue:

1. **Add more pages** - Create Services, About pages
2. **Set up webhook** - Auto-deploy on content changes
3. **Connect domain** - Point alkamind.com to Cloudflare Pages
4. **Add blog** - Use the BlogPost content type
5. **Enhance styling** - Refine the Tailwind CSS design

---

*This guide reflects real implementation experience. Your mileage may vary, but the troubleshooting section should help with common issues.*

*Questions? Start a new Claude Code session with the context of this guide.*
