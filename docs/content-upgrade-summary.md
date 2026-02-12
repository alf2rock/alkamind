# Content System Upgrade Summary

**Date:** February 12, 2026
**Branch:** `content-v3-luminous-anchoring-tide`
**Related:** Security review (PR #22)

---

## What This Upgrade Does

The Alkamind website uses a content management system called Nuxt Content to turn the markdown files written in the CMS into the web pages visitors see. This upgrade moves that system from version 2 to version 3.

## Why It Was Needed

During the security review (PR #22), we found two critical vulnerabilities in the old version's markdown rendering engine. These flaws meant that specially crafted links hidden inside blog content could potentially run malicious code in a visitor's browser — a type of attack known as cross-site scripting (XSS).

While the real-world risk was low (only trusted administrators can write content), the vulnerabilities were rated "critical" by the security community and needed to be resolved. The only way to fix them was to upgrade to version 3 of the content system, which uses a newer, patched rendering engine.

## What Changed

**For website visitors:** Nothing. Every page looks and behaves exactly the same.

**Under the hood:**

- **Upgraded the content engine** from version 2.13.4 to version 3.11.2
- **Added a content configuration file** (`content.config.ts`) that explicitly defines two content collections: one for the main pages (Home, About, Our Story, Use Cases, AI Portals) and one for blog posts
- **Updated the way pages request content** across all seven page files. The old method (`queryContent`) was replaced with the new method (`queryCollection`), which is more structured and uses a database-backed approach for better reliability
- **Updated internal field names** — the system previously used `_path` (with an underscore) to refer to page URLs; the new version uses `path` (without the underscore)

## What Was Tested

- All seven content pages render correctly (Home, About, Our Story, Use Cases, AI Portals, Blog listing, individual blog posts)
- Blog posts display in the correct order (newest first)
- Blog post attachments (PDFs, images) still appear and link properly
- The full site builds successfully for production deployment
- Security audit now shows **zero vulnerabilities** (down from 8 at the start of the security review)

## Vulnerability Resolution

| Metric | Before Security Review | After First Fix (PR #22) | After This Upgrade |
|--------|----------------------|--------------------------|-------------------|
| Total vulnerabilities | 8 | 2 | **0** |
| Critical | 2 | 2 | **0** |
| High | 3 | 0 | 0 |
| Moderate | 2 | 0 | 0 |
| Low | 1 | 0 | 0 |

## What the Testing Team Should Verify

1. Visit each page and confirm content appears correctly
2. Check the blog listing page — posts should be sorted newest first
3. Click into a blog post and verify the full article, author, date, and attachments display
4. Check the AI Portals page specifically — it contains embedded images that should render properly
5. Test on mobile — responsive layout should be unchanged
6. Visit `/admin` — the CMS interface should still work for content editing
