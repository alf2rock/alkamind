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
npm run generate  # Generate static site (for Cloudflare Pages)
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
    - `useContentful.ts` - Contentful CMS integration & rich text rendering
- `nuxt.config.ts` - Nuxt configuration with Contentful runtime config
- `public/` - Static assets served at root

Nuxt auto-imports components, composables, and utilities - no manual imports needed.

## Branch Strategy

- `main` — Production (live site) — DO NOT push directly during development
- `nuxt-rebuild` — Development branch (all work happens here)
- `v1-react-backup` — Safety backup of original React site

## Integrations

- **Contentful CMS** — Headless content management
- **Tailwind CSS** — Styling
- **Cloudflare Pages** — Hosting with automatic deploys
- **Calendly** — Booking integration

## Contentful CMS Integration

### Content Types

| Content Type | API ID | Purpose |
|--------------|--------|---------|
| Home Page | `homePage` | Landing page content |

### Home Page Fields

| Field | Type | Description |
|-------|------|-------------|
| heroTitle | Short text | Main headline (plain text) |
| heroSubtitle | Rich text | Supporting text with formatting |
| heroImage | Media | Logo or hero image |
| callToActionText | Short text | Button label |
| callToActionLink | Short text | Button URL (Calendly) |
| metaTitle | Short text | SEO title |
| metaDescription | Long text | SEO description |

### Rich Text Rendering

The `useContentful.ts` composable includes a `renderRichText()` function that converts Contentful rich text to styled HTML.

**Supported elements with Tailwind styling:**
- Headings (H1-H6) - sized and bold
- Paragraphs - with bottom margin
- Lists (bulleted and numbered) - with indentation
- Blockquotes - blue left border, italic
- Hyperlinks - blue with hover underline
- Embedded images - responsive, rounded corners
- Horizontal rules - subtle divider

**Usage in Vue templates:**
```vue
<div v-html="renderRichText(homepage.heroSubtitle)" />
```

Note: Use `v-html` directive, not `{{ }}` interpolation, because `renderRichText` returns HTML strings.

### Content Update Workflow

1. Edit content in Contentful
2. Click **Publish** in Contentful
3. Go to Cloudflare Pages → Deployments → **Retry deployment**
4. Wait ~30 seconds for rebuild
5. Site shows new content

Optional: Set up a webhook in Contentful to auto-trigger Cloudflare rebuilds on publish.

## Environment Variables

Required in `.env` (local) and Cloudflare Pages settings:

```
CONTENTFUL_SPACE_ID=xxx
CONTENTFUL_ACCESS_TOKEN=xxx
NODE_VERSION=20
```

Never commit `.env` to git.

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
- "Change the headline to..." / "Update the phone number"
- "Remove the phone number" / "Add a tagline"

### Structure Tweaks
- "Create a new page for services"
- "Add a nav bar" / "Extract the footer into its own component"
