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

- `app/` - Main application code (Nuxt 4 convention)
  - `app.vue` - Root application component
  - `pages/` - File-based routing (create files here to add routes)
  - `components/` - Auto-imported Vue components
  - `layouts/` - Page layouts
  - `composables/` - Auto-imported composables
- `content/` - Markdown content files (managed by Decap CMS)
  - `pages/` - Static page content (home, about, our-story, etc.)
  - `blog/` - Blog posts
- `public/admin/` - Decap CMS admin interface
- `nuxt.config.ts` - Nuxt configuration
- `netlify.toml` - Netlify deployment config

Nuxt auto-imports components, composables, and utilities - no manual imports needed.

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
- `title`, `slug`, `date`, `author`, `excerpt`, `body`

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
