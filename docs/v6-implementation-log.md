# V6 Implementation Log: Contentful to Decap CMS Migration

**Date:** January 4, 2026
**Branch:** nuxt-rebuild
**Participants:** Human Operator (Alf), Claude Code Assistant
**Status:** Phases 1-5 Complete, Phase 6 (Go-Live) Pending

---

## Executive Summary

The migration from Contentful CMS ($100/month) to Decap CMS (Git-based, zero cost) was successfully completed with the development environment fully functional. The implementation encountered several significant challenges that required collaborative problem-solving between the human operator and the AI assistant.

**Key Achievement:** The human operator's intuitive diagnosis that "the problem is in the code" proved critical in identifying the root cause of content rendering failures, leading to the discovery that @nuxt/content v3 was incompatible with our implementation.

---

## Challenges Encountered and Resolutions

### Challenge 1: Netlify Identity Email Redirects

**Problem:** When enabling Netlify Identity for CMS authentication, invitation and password reset emails were redirecting users to `alkamind.com` (the production domain) instead of the branch deploy URL (`nuxt-rebuild--gifted-pare-29ba8f.netlify.app`).

**Impact:** Users could not complete the authentication flow to access the CMS admin panel.

**Resolution Attempts:**
1. Tried modifying the email link URL manually (partial success)
2. Attempted to use the Netlify dashboard to set passwords directly
3. Changed registration from "Invite only" to "Open" temporarily

**Final Solution:** Discovered the branch-specific deploy URL format:
```
https://nuxt-rebuild--gifted-pare-29ba8f.netlify.app/admin/#recovery_token=xxxxx
```

This allowed authentication to complete on the correct deployment.

**Lesson Learned:** Netlify Identity uses the primary domain for all email links. For branch deploys, the branch-specific URL pattern `https://[branch]--[site-name].netlify.app` must be used manually.

---

### Challenge 2: CMS Content Not Appearing on Site

**Problem:** After successfully configuring Decap CMS, publishing content, and verifying Netlify deploys were completing successfully, content changes were not appearing on the preview site.

**Symptoms:**
- CMS showed "Published" status
- Netlify showed successful deploys with commit messages like "Update Pages 'home'"
- Git commits from CMS were visible in repository
- Content files (markdown) contained the correct updated content
- Preview site showed no changes

**Human Operator's Critical Insight:**
> "My money is that the code is where the problem is. What do you think?"

The human operator also noted a discrepancy between the navigation items and CMS collections, suspecting a deeper synchronization issue between the codebase and CMS configuration.

**Investigation:**
1. Verified CMS was committing to correct branch (nuxt-rebuild) ✓
2. Verified Netlify was deploying from correct branch ✓
3. Verified content files contained updated content ✓
4. Ran `npm run generate` locally to test build

**Root Cause Discovery:**
```
ERROR [unhandledRejection] queryContent is not defined
```

The `@nuxt/content` module was installed at version 3.x, which uses a different API than version 2.x. The `queryContent()` composable that our pages relied on was not available in v3.

**Resolution:**
```bash
npm uninstall @nuxt/content
npm install @nuxt/content@^2
```

Downgrading from @nuxt/content v3.10.0 to v2.x restored the `queryContent()` API and content began rendering correctly.

**Lesson Learned:** Always verify module API compatibility when using latest versions. The @nuxt/content v3 migration introduced breaking changes that weren't immediately apparent during installation.

---

### Challenge 3: Navigation/CMS Collection Mismatch

**Problem:** The site navigation included 6 pages, but the CMS only had 4 collections configured.

**Human Operator's Observation:**
> "The CMS has Pages 'home page', 'Our Story', 'About' and a 'Blog post' in the collections. The site also has AI Portals and Use Cases - which are not in the CMS. This leads me to suspect that we still have a mismatch between code and CMS!"

**Analysis:**

| NavBar Links | CMS Collections | Status |
|--------------|-----------------|--------|
| Home | Home Page | ✓ |
| Our Story | Our Story | ✓ |
| About Us | About | ✓ |
| Blog | Blog Posts | ✓ |
| AI Portals | — | ✗ Missing |
| Use Cases | — | ✗ Missing |

**Additional Discovery:** The `ai-portals.vue` and `use-cases.vue` page components were still using old placeholder code with hardcoded empty arrays, not the `queryContent()` API.

**Resolution:**
1. Added AI Portals and Use Cases to `public/admin/config.yml`
2. Created content files: `content/pages/ai-portals.md` and `use-cases.md`
3. Updated both Vue pages to use `queryContent()` and `ContentRenderer`

---

### Challenge 4: Markdown Heading Styling (H1 Rendering)

**Problem:** Markdown headings (H1, H2, etc.) were rendering as plain text without proper styling.

**Cause:** The `@tailwindcss/typography` plugin was not installed, so the `prose` CSS classes had no effect.

**Resolution:**
```bash
npm install @tailwindcss/typography
```

Created `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
```

---

### Challenge 5: Git Push Conflicts from CMS Commits

**Problem:** Multiple push attempts failed because the CMS was simultaneously committing content changes to the remote branch.

**Error:**
```
! [rejected] nuxt-rebuild -> nuxt-rebuild (fetch first)
error: failed to push some refs
```

**Resolution:** Used rebase strategy to incorporate CMS commits:
```bash
git pull origin nuxt-rebuild --rebase
git push origin nuxt-rebuild
```

**Lesson Learned:** When working with a Git-based CMS, expect concurrent commits. Always pull with rebase before pushing code changes.

---

## Recognition: Human Operator's Contributions

The successful resolution of Challenge 2 (the most critical blocker) was directly attributable to the human operator's intuition and systematic thinking:

1. **Pattern Recognition:** While the AI assistant was focused on caching and CDN issues, the human operator recognized that the symptoms pointed to a code-level problem rather than an infrastructure issue.

2. **Holistic Analysis:** The operator's observation about the Nav/CMS mismatch demonstrated an understanding of system architecture that helped identify multiple related issues simultaneously.

3. **Collaborative Debugging:** Rather than accepting surface-level explanations, the operator pushed for deeper investigation, which ultimately revealed the @nuxt/content version incompatibility.

**Quote for the record:**
> "My money is that the code is where the problem is."

This insight redirected the troubleshooting effort and led directly to discovering the `queryContent is not defined` error.

---

## Final State

### Completed
- [x] Phase 1: Prerequisites verified
- [x] Phase 2: Contentful dependencies removed
- [x] Phase 3: Decap CMS installed and configured
- [x] Phase 4: Deployed to Netlify with Identity authentication
- [x] Phase 5: Content migration infrastructure ready

### Working URLs
- **Preview Site:** `https://nuxt-rebuild--gifted-pare-29ba8f.netlify.app/`
- **CMS Admin:** `https://nuxt-rebuild--gifted-pare-29ba8f.netlify.app/admin/`

### Pending
- [ ] Phase 6: Go-Live (merge to main, DNS cutover)

---

## Technical Artifacts

### Key Commits
1. `be7380d` - Migrate from Contentful to Decap CMS (Git-based)
2. `abd3e8e` - Fix: Downgrade @nuxt/content to v2 for queryContent support
3. `90fcb56` - Add AI Portals and Use Cases to CMS, fix markdown styling

### Files Modified/Created
- `public/admin/index.html` - Decap CMS entry point
- `public/admin/config.yml` - CMS collections configuration
- `content/pages/*.md` - Content markdown files
- `tailwind.config.ts` - Typography plugin configuration
- `app/pages/*.vue` - Updated to use queryContent API

---

## Recommendations for Future Implementations

1. **Pin module versions:** Specify exact versions in package.json to avoid unexpected API changes
2. **Test locally first:** Run `npm run generate` locally before pushing to catch build errors
3. **Document branch deploy URLs:** Netlify's branch URL pattern should be documented for team reference
4. **CMS/Code sync check:** Before deployment, verify all navigation items have corresponding CMS collections

---

*Log prepared by Claude Code Assistant*
*January 4, 2026*
