# Nuxt Rebuild Version History

**Exported**: 2026-01-04
**Branch**: `nuxt-rebuild`
**Purpose**: Reference for CCh to plan Sanity CMS migration

---

## Context

The client has decided to switch from Contentful ($100/month) to Sanity CMS. This document provides the version history of the `nuxt-rebuild` branch to help plan the migration strategy.

---

## Version History (Chronological)

| Commit | Version | Description |
|--------|---------|-------------|
| `32604e5` | **v0.1** | Initial Nuxt 4 landing page rebuild — **PRE-CMS baseline** |
| `01a834b` | v0.1 | Force deploy to Netlify |
| `b999f3a` | v0.2 | Add Netlify config |
| `179d564` | v0.3 | Fix publish directory |
| `ff9919b` | **v0.4** | **Add Contentful CMS integration** — CMS layer begins |
| `f7cf52f` | — | Fix package-lock for Linux |
| `2c52094` | — | Sync package-lock |
| `922c09f` | v0.5 | Update guide with Cloudflare + Contentful |
| `0dd3c62` | v0.6 | Comprehensive implementation guide |
| `326bdff` | v0.7 | Implementation Guide v4 finalized |
| `c1bfaf3` | — | Rich text rendering with Tailwind |
| `d0fdf3d` | — | Remove outdated guide |
| `533bcac` | — | Add H4-H6 heading support |
| `a675ed2` | — | Trigger Cloudflare rebuild |
| `c3ad608` | — | Update CLAUDE.md with Contentful docs |
| `147e822` | — | **Add navigation + multi-page architecture** |
| `1e996ff` | — | Add change governance patterns doc |
| `bd51103` | — | Fix Our Story field names |
| `d9ad14f` | — | Fix blog field names **(current HEAD)** |

---

## Key Decision Points

### Option A: Start from Pre-CMS Baseline (`32604e5`)

**Pros:**
- Clean slate, no Contentful code to remove
- Simple starting point

**Cons:**
- Lose navigation component and multi-page architecture
- Must rebuild NavBar, layouts, and 7 pages from scratch

**What you get:**
- Basic Nuxt 4 landing page
- Tailwind CSS configured
- No CMS integration
- Single page (app.vue only)

---

### Option B: Start from Current HEAD (`d9ad14f`)

**Pros:**
- Keep navigation component (NavBar.vue)
- Keep default layout (default.vue)
- Keep all 7 pages structure
- Keep rich text rendering utilities

**Cons:**
- Must refactor `useContentful.ts` → `useSanity.ts`
- Must update all page components to use Sanity fetchers
- More surgical changes required

**What you get:**
- Full multi-page site with navigation
- 7 pages: Home, Our Story, About, Blog (listing + dynamic), AI Portals, Use Cases
- Rich text rendering (needs adaptation for Sanity's Portable Text)
- Contentful-specific code that needs replacing

---

## Current File Structure (HEAD)

```
app/
├── app.vue                    # Minimal: NuxtLayout + NuxtPage
├── components/
│   └── NavBar.vue             # Responsive nav with hamburger menu
├── layouts/
│   └── default.vue            # Layout with NavBar + global styles
├── pages/
│   ├── index.vue              # Home (/)
│   ├── our-story.vue          # /our-story
│   ├── about.vue              # /about
│   ├── ai-portals.vue         # /ai-portals
│   ├── use-cases.vue          # /use-cases
│   └── blog/
│       ├── index.vue          # /blog (listing)
│       └── [slug].vue         # /blog/:slug (dynamic)
└── composables/
    └── useContentful.ts       # Contentful fetchers (to be replaced)
```

---

## Contentful Content Models (for Sanity Schema Reference)

These are the content models currently configured in Contentful. Sanity schemas should mirror these:

### 1. Home Page (`homePage`)
- heroTitle: String
- heroSubtitle: Rich text
- heroImage: Image
- callToActionText: String
- callToActionLink: String
- metaTitle: String
- metaDescription: String

### 2. Our Story (`ourStory`)
- pageTitle: String
- subtitle: String
- bodyContent: Rich text
- ctaText: String
- ctaLink: String

### 3. About Page (`aboutPage`)
- title: String
- content: Rich text
- teamMembers: References (many)

### 4. Blog Post (`blogPost`)
- blogPost: String (title)
- slug: String
- author: String
- body: Rich text
- publishDate: Date
- image: Image
- excerpt: Rich text

### 5. AI Portal (`aiPortal`)
- title: String
- description: Long text
- link: String
- icon: Image

### 6. Use Case (`useCase`)
- title: String
- client: String
- challenge: Rich text
- solution: Rich text
- results: Rich text

---

## Contentful vs Sanity Key Differences

| Feature | Contentful | Sanity |
|---------|------------|--------|
| Rich Text | Document format | Portable Text |
| Query Language | REST API / GraphQL | GROQ |
| Pricing | $100+/month | Free tier generous |
| SDK | `contentful` | `@sanity/client` |
| Rich Text Renderer | `@contentful/rich-text-html-renderer` | `@portabletext/vue` |

---

## Recommended Branch Strategy

```
main                    # Production (unchanged)
nuxt-rebuild            # Current development (Contentful)
nuxt-contentful-demo    # Archive of Contentful version (NEW)
nuxt-sanity             # Sanity migration branch (NEW)
v1-react-backup         # Original React site (unchanged)
```

---

## Questions for CCh to Address

1. **Start point**: Option A (clean slate) or Option B (keep page structure)?
2. **Sanity Studio**: Host separately or embed in Nuxt app?
3. **Content migration**: Manual re-entry or scripted migration from Contentful?
4. **Rich text**: How to handle Portable Text rendering in Vue/Nuxt?
5. **Deployment**: Continue with Cloudflare Pages?

---

## Repository

- GitHub: https://github.com/alf2rock/alkamind
- Current branch: `nuxt-rebuild`
- Live site: Cloudflare Pages (auto-deploy on push)
