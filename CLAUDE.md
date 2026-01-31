# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Client**: Alkamind Consulting Inc.
**Purpose**: Marketing website for Change Management & Application Development consultancy

Alkamind website built with Nuxt 4 and Vue 3. This is a rebuild from a previous React-based site.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build for production
npm run generate  # Generate static site (for Netlify)
npm run preview   # Preview production build locally
```

## Architecture

This project uses Nuxt 4's app directory structure:

```
alkamind/
├── app/                           # Main Nuxt 4 application
│   ├── app.vue                    # Root component (Netlify Identity init + redirect to /admin on login)
│   ├── pages/                     # File-based routing
│   │   ├── index.vue              # Home page (hero, contact info, footer image)
│   │   ├── about.vue              # About Us (ContentRenderer from about.md)
│   │   ├── our-story.vue          # Our Story (ContentRenderer from our-story.md)
│   │   ├── use-cases.vue          # Use Cases (ContentRenderer from use-cases.md)
│   │   ├── ai-portals.vue         # AI Portals (ContentRenderer from ai-portals.md)
│   │   └── blog/
│   │       ├── index.vue          # Blog listing (sorted by date, newest first)
│   │       └── [...slug].vue      # Blog post detail (title, date, author, summary, content, attachments)
│   ├── components/
│   │   └── NavBar.vue             # Sticky responsive nav with hamburger menu on mobile
│   ├── composables/               # (none currently)
│   └── layouts/
│       └── default.vue            # Default layout: gradient bg, NavBar, Times New Roman font
├── content/                       # Markdown content (managed by Decap CMS)
│   ├── pages/
│   │   ├── home.md                # title, subtitle, ctaText, ctaLink
│   │   ├── about.md               # title, body
│   │   ├── our-story.md           # title, body
│   │   ├── use-cases.md           # title, body
│   │   └── ai-portals.md          # title, body (with inline images)
│   └── blog/
│       ├── ai-human-team.md       # AI-Human Collaboration post (2 attachments)
│       └── ai-portal-content-from-theatro.md  # Theatro AI Portal post
├── public/
│   ├── admin/
│   │   ├── index.html             # Decap CMS entry point (loads Netlify Identity + CMS CDN)
│   │   └── config.yml             # CMS collections & fields config
│   ├── uploads/                   # Media uploaded via CMS
│   └── images/                    # Static images
├── docs/                          # Project documentation & memos
├── nuxt.config.ts                 # Modules: @nuxtjs/tailwindcss, @nuxt/content
├── tailwind.config.ts             # Typography plugin only, minimal config
└── netlify.toml                   # Build: npm run generate → dist/
```

Nuxt auto-imports components, composables, and utilities - no manual imports needed.

### Key Dependencies

- `nuxt` ^4.2.2, `vue` ^3.5.25, `vue-router` ^4.6.4
- `@nuxt/content` ^2.13.4 — Markdown parsing & querying
- `@nuxtjs/tailwindcss` ^6.14.0 — Tailwind integration
- `@tailwindcss/typography` ^0.5.19 — Prose classes for rendered markdown
- `better-sqlite3` ^12.5.0 — SQLite (Nuxt Content internals)

### Common Page Pattern

All content pages follow the same pattern:

```typescript
const { data: page } = await useAsyncData('key', () =>
  queryContent('/pages/page-name').findOne()
)
useSeoMeta({ title: page.value?.title, description: '...' })
```

### Design Tokens

- **Font**: Times New Roman, Times, serif (set in default layout)
- **Colors**: Blue theme — blue-600, blue-700, blue-800, blue-900
- **Background**: Gradient from slate-50 to blue-50
- **Responsive**: Tailwind `md:` breakpoints, hamburger nav on mobile

### Nav Links (NavBar.vue)

Home | Our Story | About Us | Blog | AI Portals | Use Cases

## Branch Strategy

- `main` — Production (live site) — DO NOT push directly during development
- `nuxt-rebuild` — Development branch (all work happens here)
- `v1-react-backup` — Safety backup of original React site

## Integrations

- **Decap CMS** — Git-based headless CMS (content stored as markdown in repo)
- **Nuxt Content** — Markdown parsing and querying
- **Tailwind CSS** — Styling
- **Netlify** — Hosting with Git Gateway for CMS auth
- **Calendly** — Booking integration

## Decap CMS Integration

### How It Works

Decap CMS (formerly Netlify CMS) is a Git-based CMS. Content is stored as markdown files in the `content/` directory and committed to the repository. No external API or database required.

**Data flow:**
```
Decap Admin UI → Git commit → content/*.md → Nuxt Content → Vue pages
```

### Admin Interface

- **URL**: `/admin` (e.g., `http://localhost:3000/admin`)
- **Config**: `public/admin/config.yml`
- **Auth**: Netlify Identity (Git Gateway)

### Content Structure

```
content/
├── pages/
│   ├── home.md        # Home page content
│   ├── about.md       # About page
│   ├── our-story.md   # Our Story page
│   ├── use-cases.md   # Use Cases page
│   └── ai-portals.md  # AI Portals page
└── blog/
    └── (blog posts created via CMS)
```

### Page Fields

**Home Page** (`content/pages/home.md`):
- `title` - Main headline
- `subtitle` - Supporting text (markdown)
- `ctaText` - Call-to-action button label
- `ctaLink` - CTA button URL (Calendly link)

**Other Pages** (`about.md`, `our-story.md`, etc.):
- `title` - Page title
- `body` - Page content (markdown)

**Blog Posts** (`content/blog/*.md`):
- `title` - Post title
- `slug` - URL slug (also determines filename)
- `date` - Publication date
- `author` - Author name
- `summary` - Post summary/excerpt (NOTE: Do NOT use `excerpt` - it's reserved by Nuxt Content)
- `attachments` - List of file attachments (each has `label` and `file`)

### Querying Content in Vue Pages

Use Nuxt Content's `queryContent()` composable:

```vue
<script setup>
const { data: home } = await useAsyncData('home', () =>
  queryContent('/pages/home').findOne()
)
</script>

<template>
  <h1>{{ home.title }}</h1>
  <ContentRenderer :value="home" />
</template>
```

### Content Update Workflow

**Via Admin UI:**
1. Go to `/admin` and log in
2. Edit content and save
3. Changes are committed to Git automatically
4. Netlify rebuilds and deploys

**Via Direct Edit:**
1. Edit markdown files in `content/` directory
2. Commit and push to `nuxt-rebuild`
3. Netlify rebuilds automatically

### Editorial Workflow

The CMS has editorial workflow enabled (`publish_mode: editorial_workflow`), which means:
- New content starts as **Draft**
- Can be moved to **In Review**
- Then **Published** (merged to branch)

## Environment Variables

Required in Netlify settings (not needed locally for basic dev):

```
NODE_VERSION=20
```

For local Decap CMS testing with backend, you may need Netlify CLI or local Git Gateway setup.

## Design Requirements

- Clean, professional look
- Blue color scheme
- Times New Roman font family
- Mobile-responsive
- Fast loading (< 3 seconds)

## Quick Reference: How to Ask for Changes

### Styling Tweaks
- "Make it darker" / "Change the blue to navy"
- "Make the headline bigger" / "Add more padding"
- "Use a more modern font" / "Make it bolder"

### Layout Tweaks
- "Center this" / "Move it to the right"
- "Hide this on mobile" / "Make this full width"

### Content Tweaks
- Edit markdown files directly in `content/pages/`
- Or use the `/admin` interface

### Structure Tweaks
- "Create a new page for services"
- "Add a nav bar" / "Extract the footer into its own component"
- To add a new CMS-managed page: update `public/admin/config.yml`

## Known Issues & Gotchas

**IMPORTANT**: See `docs/memo-1-claude-code-decap-cms.md` for detailed troubleshooting guide.

### Reserved Field Names
- `excerpt` is reserved by Nuxt Content - use `summary` instead
- `description` is auto-generated from first paragraph
- Fields starting with `_` are internal Nuxt Content fields

### CMS Admin Caching
After changing `public/admin/config.yml`, users must hard refresh `/admin` (Ctrl+Shift+R) to see changes. Clearing site data in DevTools also works but logs out the user.

### Blog Post URLs
Nuxt Content uses the **filename** for URLs, not the `slug` frontmatter field. To change a post's URL, rename the markdown file.

### Editorial Workflow Branches
Drafts created before config changes won't have new fields. Either merge updates into the draft branch or recreate the draft.

### Git Push Conflicts
The CMS commits directly to the branch. If push fails, run `git pull --rebase` first.

## Reference Documentation

- `docs/memo-1-claude-code-decap-cms.md` - Troubleshooting guide for Decap CMS + Nuxt Content issues
- `docs/memo-2-blog-images.md` - Blog image implementation options (Option 1 selected: inline markdown images)
- `docs/project-cheat-sheet.md` - Quick reference for commands, branch strategy, file locations
- `docs/nuxt-rebuild-guide.md` - Original rebuild implementation guide (references Contentful — outdated, now uses Decap)
- `docs/nuxt-rebuild-version-history.md` - Version history of rebuilds
- `docs/v6-implementation-log.md` - Implementation log for v6
- `docs/change-governance-patterns.md` - Governance patterns documentation

## Public Assets

Key static files in `public/`:
- `logo Alkamind.jpg` — Site logo (used in NavBar)
- `Hypatia.jpg`, `Tomomi.jpg` — Portrait images (AI Portals)
- `stratified-governance-model.jpg` — Footer image on home page
- `favicon.ico` — Browser tab icon
- `uploads/` — CMS-uploaded media (PDFs, images)
- `images/` — Static reference images and diagrams
