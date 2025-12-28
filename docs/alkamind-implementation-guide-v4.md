# ALKAMIND.COM
## Website Rebuild Project

# DETAILED IMPLEMENTATION GUIDE
**Version 4.0 — Cloudflare Pages with Contentful CMS**

## OPTION C: SAFE DEVELOPMENT
*Original site stays live • Preview new version • Rollback anytime*

**December 2024**

---

## What Changed in Version 4.0

This guide reflects actual implementation experience. Key differences from version 3.0:

| Version 3.0 | Version 4.0 (This Guide) |
|-------------|--------------------------|
| Netlify for hosting | **Cloudflare Pages** (free env vars) |
| Node 18 compatible | **Node 20 required** (Nuxt 4) |
| Landing Page content type | **Home Page** content type |
| Generic field names | Actual field names used |
| Theoretical troubleshooting | Real issues encountered & solved |

### Why Cloudflare Pages?

During implementation, we discovered Netlify's free tier restricts environment variables. Cloudflare Pages:
- Free tier includes environment variables
- Already using Cloudflare for DNS (natural fit)
- Fast global CDN
- Easy domain connection

### Branch Strategy Overview

| Branch | Purpose | Status |
|--------|---------|--------|
| main | Current React site (LIVE) | Do not touch during dev |
| nuxt-rebuild | New Nuxt 4 development | All work happens here |
| v1-react-backup | Safety copy of React site | Created early for peace of mind |

---

## Phase 1: Development Environment Setup
**Estimated Time: 4-6 hours | Week 1**

### No Changes in Phase 1

This phase is identical to version 3.0. If you've already completed it, skip to Phase 2.

Phase 1 covers:
- 1.1 Install Visual Studio Code
- 1.2 Install Node.js **(Must be Node 20+)**
- 1.3 Install Git
- 1.4 Install VS Code Extensions
- 1.5 Clone Your GitHub Repository
- 1.6 Install Claude Code CLI

### Critical: Verify Node Version

```bash
node --version
```

**Must show v20.x.x or higher.** Nuxt 4 will NOT work with Node 18.

---

## Phase 2: Create Nuxt 4 Project
**Estimated Time: 6-8 hours | Week 2**

### OPTION C: SAFE DEVELOPMENT
*Your live site (main branch) remains untouched. All work happens in nuxt-rebuild branch.*

### 2.1-2.5 Summary

Complete these steps as documented in v3.0:
- 2.1 Capture your current site (screenshots, content)
- 2.2 Create development branch (nuxt-rebuild)
- 2.3 Initialize Nuxt 4 project
- 2.4 Build landing page with Claude Code
- 2.5 Commit your progress

---

### 2.6 Create Backup Branch (Peace of Mind)

Before configuring deployment, secure a backup of your current React site.

**Why Now?**
Creating the backup early means your original site is protected before you touch any deployment settings.

**Step 1: Switch to Main Branch**
```bash
git checkout main
```

**Step 2: Create Backup Branch**
```bash
git branch v1-react-backup
```

**Step 3: Push Backup to GitHub**
```bash
git push origin v1-react-backup
```

**Step 4: Switch Back to Development Branch**
```bash
git checkout nuxt-rebuild
```

**Step 5: Verify Branches**
```bash
git branch
```

You should see:
```
  main
* nuxt-rebuild
  v1-react-backup
```

**Checkpoint 2.6** — All three branches exist. Your React site is backed up and protected.

---

### 2.7 Set Up Cloudflare Pages

This is the key deployment platform. We use Cloudflare Pages instead of Netlify because the free tier includes environment variables.

#### Part A: Find Workers & Pages in Cloudflare

The Cloudflare dashboard can be confusing. Here's the exact path:

**Step 1: Go to Account Level**
- Log into https://dash.cloudflare.com
- If you're viewing a domain (alkamind.com), click your account name at the top to go back to account level

**Step 2: Navigate to Workers & Pages**
- In the left sidebar, find **Compute & AI**
- Click **Workers & Pages**

**Note:** If you only see domain-specific options, you're at the wrong level. Go back to account level.

#### Part B: Create Pages Project

**Step 1: Start Project Creation**
- Click **Create**
- Look for **"Looking to deploy Pages? Get started"** link
- Or click the **Pages** tab (not Workers)

**Step 2: Import Repository**
- Select **"Import an existing Git repository"**
- Connect your GitHub account (if not already connected)
- Authorize Cloudflare to access your alkamind repository
- Select **alkamind** repository

**Step 3: Configure Build Settings**

| Setting | Value |
|---------|-------|
| Project name | alkamind |
| Production branch | nuxt-rebuild |
| Build command | npm run generate |
| Build output directory | dist |

**Step 4: Add Environment Variables (CRITICAL)**

Expand "Environment variables" and add ALL of these:

| Variable | Value |
|----------|-------|
| NODE_VERSION | 20 |
| CONTENTFUL_SPACE_ID | (add later in Phase 3) |
| CONTENTFUL_ACCESS_TOKEN | (add later in Phase 3) |

**CRITICAL: NODE_VERSION=20**
Without this, Cloudflare uses Node 18, and Nuxt 4 will fail with errors like:
```
npm WARN EBADENGINE required: { node: '^20.19.0' }
```

**Step 5: Deploy**
- Click **Save and Deploy**
- First build takes 1-2 minutes

Your preview site will be available at: `https://alkamind.pages.dev`

#### Part C: Troubleshooting Build Failures

| Error | Solution |
|-------|----------|
| "Internal error occurred" | Change Build system version to V2 in Settings |
| Node version warnings | Add NODE_VERSION=20 environment variable |
| package-lock.json sync error | See Part D below |
| Build never starts | Check "Automatic deployments" is enabled |

#### Part D: Fixing package-lock.json Errors

If you see:
```
npm error Invalid: lock file's commander@11.1.0 does not satisfy commander@13.1.0
```

**Fix locally:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix: Sync package-lock.json"
git push origin nuxt-rebuild
```

Then retry deployment in Cloudflare.

**Checkpoint 2.7** — Your Nuxt site is live at alkamind.pages.dev while alkamind.com still shows React.

---

### Phase 2 Summary

- [ ] Current site screenshots and content captured
- [ ] nuxt-rebuild branch created (main untouched)
- [ ] Nuxt 4 project initialized in branch
- [ ] Landing page built with Claude Code assistance
- [ ] v1-react-backup branch created (peace of mind)
- [ ] Cloudflare Pages project created
- [ ] NODE_VERSION=20 environment variable set
- [ ] Preview URL shows Nuxt site
- [ ] Live site (alkamind.com) still shows React

**SAFETY STATUS:**
Your live site is UNTOUCHED • Backup branch secured • Preview available at pages.dev URL

---

## Phase 3: Contentful CMS Integration
**Estimated Time: 6-8 hours | Week 3**

### Branch Reminder
Make sure you're on the nuxt-rebuild branch:
```bash
git checkout nuxt-rebuild
```

---

### 3.1 Create/Access Contentful Account

**Step 1: Sign Up or Log In**
- Go to: https://app.contentful.com
- Sign up with email or log into existing account
- Verify your email address

**Step 2: Access Your Space**
- Free tier includes 1 space
- Use existing space if you have one, or create new
- Name: 'Alkamind Website'

**If You Have Existing Content:**
- Keep content that's relevant
- **Unpublish** (don't delete) demo/template content
- You can delete unpublished content later when confident

**Checkpoint 3.1** — You're logged into Contentful and see your space.

---

### 3.2 Content Model: Home Page

A content model defines what types of content you can create.

**Step 1: Go to Content Model**
- Click 'Content model' in the top navigation

**Step 2: Create or Use 'Home Page' Content Type**
- If it exists, verify it has the fields below
- If not, click 'Add content type'
- Name: 'Home Page'
- API Identifier: 'homePage' (auto-generated)

**Step 3: Add/Verify Fields**

Click 'Add field' for each. Select "Text" then choose Short or Long text:

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| heroTitle | Short text | Yes | Main headline (set as Entry title) |
| heroSubtitle | Rich text | Yes | Supporting text/value proposition |
| heroImage | Media | No | Logo or hero image |
| callToActionText | Short text | Yes | Button label |
| callToActionLink | Short text | Yes | Calendly URL |
| metaTitle | Short text | No | SEO title |
| metaDescription | Long text | No | SEO description |

**How to Add a Text Field:**
1. Click "Add field"
2. Select "Text" (this gives you short/long text options)
3. Choose "Short text" or "Long text"
4. Enter field name (e.g., heroTitle)
5. Save

**Step 4: Save Content Type**
- Click 'Save' in the top right corner

**Checkpoint 3.2** — Home Page content type exists with 7 fields.

---

### 3.3 Add Your Content Entry

**Step 1: Go to Content Section**
- Click 'Content' in the top navigation

**Step 2: Create Home Page Entry**
- Click 'Add entry' → Select 'Home Page'
- Fill in the fields:

| Field | Example Value |
|-------|---------------|
| heroTitle | Alkamind Consulting |
| heroSubtitle | Your value proposition text (can include formatting) |
| heroImage | Upload your logo |
| callToActionText | Book a Conversation |
| callToActionLink | https://calendly.com/alf-alkamind/coaching-session |
| metaTitle | Change Management & Solutions Development |
| metaDescription | Decades of experience bringing clarity to organizational transformation. |

**Step 3: Publish the Entry**
- Click **Publish** in the top right corner
- **Important:** Draft content won't appear on your site!

**Checkpoint 3.3** — Home Page entry is published in Contentful.

---

### 3.4 Get Contentful API Keys

**Step 1: Go to Settings → API keys**
- Click 'Settings' in the top navigation
- Click 'API keys'

**Step 2: Use Existing or Create API Key**
- If you have an existing key, use it
- Otherwise: Click 'Add API key'
- Name: 'Nuxt Website'
- Click 'Save'

**Step 3: Copy Your Keys**
Copy these values:
- **Space ID** (e.g., `86mkfcvuxwv3`)
- **Content Delivery API - access token** (long string)

Save them temporarily — you'll need them for both local development and Cloudflare.

**Keep Keys Secret!**
Never commit API keys to GitHub. We'll store them in environment variables.

**Checkpoint 3.4** — You have your Space ID and Content Delivery API token.

---

### 3.5 Connect Nuxt to Contentful

**Step 1: Verify You're on nuxt-rebuild Branch**
```bash
git branch
```
Should show: `* nuxt-rebuild`

**Step 2: Install Contentful Packages**
```bash
npm install contentful @contentful/rich-text-html-renderer
```

**Step 3: Create Local Environment File**
Create `.env` in project root:
```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

**Step 4: Verify .env is in .gitignore**
Open `.gitignore` and confirm it includes:
```
.env
.env.*
```

**Step 5: Update nuxt.config.ts**

Add runtimeConfig section:
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
```

**Step 6: Create Contentful Composable**

Create file: `app/composables/useContentful.ts`

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

**Step 7: Update app.vue**

Add script section at the top of `app/app.vue`:

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

**Step 8: Test Locally**
```bash
npm run dev
```

Open http://localhost:3000 — content should come from Contentful!

**Troubleshooting:**
- Content not showing? Check it's **Published** in Contentful
- API error? Double-check `.env` values
- Wrong content type? ID is `homePage` (camelCase)

**Checkpoint 3.5** — Your page displays content from Contentful locally.

---

### 3.6 Configure Cloudflare Environment Variables

**Step 1: Go to Cloudflare Pages Settings**
- Log into dash.cloudflare.com
- Compute & AI → Workers & Pages
- Click on your alkamind project
- Go to: Settings → Variables and Secrets

**Step 2: Add/Update Variables**

Ensure these are all set:

| Variable | Value |
|----------|-------|
| NODE_VERSION | 20 |
| CONTENTFUL_SPACE_ID | your_space_id |
| CONTENTFUL_ACCESS_TOKEN | your_access_token |

**Step 3: Commit and Push**
```bash
git add .
git commit -m "Add Contentful integration"
git push origin nuxt-rebuild
```

Cloudflare will automatically build the nuxt-rebuild branch.

**Checkpoint 3.6** — Preview URL shows Contentful content.

---

### 3.7 Content Update Workflow

Your site is statically generated — content is baked in at build time. Here's how to update content:

**Step 1: Edit in Contentful**
- Go to Content → select your entry
- Make changes
- Click **Publish**

**Step 2: Trigger Rebuild**
- Go to Cloudflare Pages → alkamind → Deployments
- Click on latest deployment
- **Manage deployment** → **Retry deployment**

**Step 3: View Changes**
- Wait ~30 seconds for build
- Hard refresh browser: `Ctrl+Shift+R`
- Or try incognito window

**Optional: Set Up Auto-Rebuild Webhook**

To automatically rebuild when content changes:

1. In Cloudflare: Settings → Deploy Hooks → Create hook
2. Copy the webhook URL
3. In Contentful: Settings → Webhooks → Add webhook
4. Paste URL, trigger on "Publish" events

**Checkpoint 3.7** — You can update content and see changes on preview site.

---

### Phase 3 Summary

- [ ] Contentful account accessed (free tier)
- [ ] Home Page content type with 7 fields
- [ ] Content entry created and published
- [ ] API keys obtained
- [ ] Environment variables configured locally (.env)
- [ ] Nuxt connected to Contentful (composable created)
- [ ] Local site displays Contentful content
- [ ] Cloudflare environment variables configured
- [ ] Preview site updates when rebuilt

| Site | Status After Phase 3 |
|------|---------------------|
| alkamind.com (main) | Still React — UNTOUCHED |
| alkamind.pages.dev (nuxt-rebuild) | Nuxt + Contentful — Ready for review |

**Ready for Client Review:**
Share the preview URL with your client. They can see the new site without affecting the live version.

---

## Phase 4: Validation & Client Review
**Estimated Time: 4 hours | Week 4**

### 4.1 End-to-End Testing

Test on the Preview URL (alkamind.pages.dev):

- [ ] Preview site loads correctly
- [ ] Content from Contentful displays properly
- [ ] Calendly button opens booking page
- [ ] Site looks correct on desktop browser
- [ ] Site looks correct on mobile (use browser DevTools)
- [ ] Change content in Contentful → Publish → Rebuild → Content updates
- [ ] Meta title appears correctly in browser tab
- [ ] Site loads quickly (under 3 seconds)

### 4.2 Client Review

Share the preview URL with your client for approval:

```
EMAIL TEMPLATE FOR CLIENT REVIEW:

Subject: Website Rebuild Preview Ready for Review

Hi [Client],

The new website is ready for your review. You can preview it here:

https://alkamind.pages.dev

Your current live site at alkamind.com is unchanged and will remain
live until you approve the new version.

Please review and let me know if you'd like any changes, or if
you're ready to go live.

Best regards
```

### 4.3 Decision Point

| If Client Says... | Action |
|-------------------|--------|
| "I love it, let's go live!" | Proceed to Phase 5: Go-Live |
| "I want some changes" | Make changes, push, rebuild preview |
| "I don't like it, revert" | No action needed — live site unchanged |

**The Safety Net:**
If the client rejects the new site entirely, simply delete the Cloudflare Pages project. The live site was never affected.

---

## Phase 5: Go-Live Cutover
**Estimated Time: 1-2 hours | After Client Approval**

### Pre-Flight Check
Confirm you have:
1. Written client approval
2. All content finalized in Contentful
3. All changes pushed to nuxt-rebuild branch

---

### 5.1 Verify Backup Branch Exists

```bash
git branch -a
```

Confirm you see: `v1-react-backup`

**Checkpoint 5.1** — v1-react-backup branch exists.

---

### 5.2 Connect Custom Domain

Since you're using Cloudflare Pages and already have Cloudflare DNS:

**Step 1: Add Custom Domain**
- Go to Cloudflare Pages → alkamind → Custom domains
- Click **Set up a custom domain**
- Enter: `alkamind.com`

**Step 2: DNS Auto-Configuration**
- Cloudflare will automatically configure DNS records
- Usually instant since you're already using Cloudflare DNS

**Step 3: Verify**
- Visit https://alkamind.com
- Should show your Nuxt site!

**Checkpoint 5.2** — alkamind.com now shows the Nuxt site!

---

### 5.3 Update Production Branch (Optional)

If you want `main` branch to trigger production deploys:

**Step 1: Merge nuxt-rebuild to main**
```bash
git checkout main
git pull
git merge nuxt-rebuild --strategy-option theirs -m "Merge Nuxt rebuild to main"
git push
```

**Step 2: Update Cloudflare Production Branch**
- Settings → Build configuration
- Change Production branch to: `main`

**Checkpoint 5.3** — Production now deploys from main branch.

---

## Phase 6: Rollback Procedure (If Needed)

Keep this section for reference. Use only if you need to revert to the React site after go-live.

### EMERGENCY ROLLBACK PROCEDURE

**Step 1: In Cloudflare Pages**
- Go to Custom domains
- Remove alkamind.com from Cloudflare Pages

**Step 2: Restore DNS**
- Point alkamind.com back to previous hosting (Netlify/other)
- Or set up the React site on a new host

**Step 3: If Using Git Reset**
```bash
git checkout main
git reset --hard v1-react-backup
git push -f origin main
```

**Time to Rollback:** ~5-10 minutes

---

### 6.1 Cleanup (After Stabilization)

After 30-90 days of stable operation:

**Delete nuxt-rebuild branch (merged into main):**
```bash
git branch -d nuxt-rebuild
git push origin --delete nuxt-rebuild
```

**Delete v1-react-backup (only after client sign-off):**
```bash
git branch -d v1-react-backup
git push origin --delete v1-react-backup
```

**Keep Backup Until Sign-Off!**
Do not delete v1-react-backup until you have written confirmation from the client.

---

## Appendix: Quick Reference

### A. Key URLs

| Service | URL |
|---------|-----|
| Live Site | alkamind.com |
| Preview Site | alkamind.pages.dev |
| Contentful Dashboard | app.contentful.com |
| Cloudflare Dashboard | dash.cloudflare.com |
| GitHub Repository | github.com/alf2rock/alkamind |
| Local Dev Server | localhost:3000 |

### B. Environment Variables (Cloudflare)

| Variable | Value | Purpose |
|----------|-------|---------|
| NODE_VERSION | 20 | Required for Nuxt 4 |
| CONTENTFUL_SPACE_ID | your_id | Contentful space |
| CONTENTFUL_ACCESS_TOKEN | your_token | API access |

### C. Common Commands

| Command | What It Does |
|---------|--------------|
| `git branch` | Show current branch (* = active) |
| `git checkout [branch]` | Switch to a branch |
| `npm run dev` | Start local development server |
| `npm run generate` | Build static site |
| `git add . && git commit -m "msg" && git push` | Save and upload all changes |

### D. Content Update Workflow

1. **Edit** in Contentful
2. **Publish** the entry
3. **Rebuild** in Cloudflare (Manage deployment → Retry)
4. **Hard refresh** browser (Ctrl+Shift+R)

### E. Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Build fails with Node error | Add NODE_VERSION=20 to Cloudflare env vars |
| package-lock.json sync error | Delete node_modules & package-lock.json, run npm install, push |
| Content not showing | Check content is Published in Contentful |
| Changes not appearing | Hard refresh (Ctrl+Shift+R) or try incognito |
| "Internal error" in Cloudflare | Switch to Build system version 2 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v4.0 | Dec 28, 2024 | Switched to Cloudflare Pages, Nuxt 4/Node 20, actual field names |
| v3.0 | Dec 2024 | Netlify with branch deploys, backup branch early |
| v2.0 | Earlier | Initial Netlify setup |

---

**— End of Implementation Guide v4.0 —**

*Cloudflare Pages with Contentful CMS*
*December 2024*

Questions? Start a new Claude Code session with the context of this guide.
