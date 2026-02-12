# Alkamind Security Review - Final Report

**Date:** 2026-02-12
**Reviewer:** CC (Claude Code)
**Repository:** https://github.com/alf2rock/alkamind
**Deployed Site:** https://alkamind.com
**RFC:** vigilant-sentinel-harbor

---

## Executive Summary

Full security audit of the Alkamind marketing website covering 8 review areas from the security checklist (`docs/alkamind-security-review.md`). The site is a **static Nuxt 4 build** hosted on Netlify with Decap CMS for content management. It has no user authentication, no database, no API calls, and no payment processing — a minimal attack surface.

**Overall Risk Rating:** LOW (after remediation applied in this PR)

**Total Vulnerabilities Found:**
- CRITICAL: 2 (dependency - deferred, requires @nuxt/content v3 migration)
- HIGH: 3 (dependency - **FIXED**)
- MODERATE: 2 (dependency - **FIXED**; missing CSP - **FIXED**)
- LOW: 3 (dependency - **FIXED**; no Dependabot - **FIXED**; unpinned CMS script)
- INFO: 1 (no SRI on admin scripts)

**Comparison to AlkaPlay:**
- AlkaPlay: 2 CRITICAL, 3 HIGH, 2 MEDIUM (7 total) — HIGH overall risk
- Alkamind: 2 CRITICAL (deferred), 0 HIGH, 0 MEDIUM after fixes — LOW overall risk

---

## Section-by-Section Findings

### 1. API Key / Secret Exposure

**Status:** PASS

- **Contentful:** NOT USED. Site uses Decap CMS (Git-based), not Contentful
- **API keys in code:** None found. Zero matches for CFPAT-, Bearer, api_key, secret, token, password patterns
- **Environment variables:** No `process.env` or `import.meta.env` references in application code
- **.env files:** Properly gitignored (`.env`, `.env.*`); none committed to git history
- **nuxt.config.ts:** Clean — no credentials, only SEO meta tags and module configuration

**Vulnerabilities:** None

---

### 2. Serverless Functions Security

**Status:** PASS (N/A — No functions exist)

- `netlify/functions/` — does not exist
- `.netlify/functions/` — does not exist
- `functions/` — does not exist
- No serverless/lambda dependencies in package.json
- Build command is `npm run generate` (pure static output)

**Vulnerabilities:** None

---

### 3. Form Security

**Status:** PASS (N/A — No forms exist)

- Zero `<form>` elements in any Vue component or HTML file
- Zero `@submit` / `onSubmit` handlers
- Contact is via external links only: mailto, tel, LinkedIn, Calendly
- CMS admin (`/admin`) uses Netlify Identity (managed auth service)

**Vulnerabilities:** None

---

### 4. Build Process & Secrets

**Status:** PASS

- **netlify.toml:** Minimal — only `npm run generate`, `publish = "dist"`, `NODE_VERSION = "20"`
- **Build scripts:** All standard Nuxt commands (dev, build, generate, preview, postinstall)
- **.gitignore:** Properly configured:
  - `.env` / `.env.*` ignored
  - `node_modules/`, `.nuxt/`, `dist/`, `.output/` ignored
  - `.claude/` ignored
- **Git history:** No `.env` files ever committed
- **Hardcoded secrets:** None found

**Vulnerabilities:** None

---

### 5. Dependency Security

**Status:** PARTIAL PASS (6 of 8 vulnerabilities fixed)

**npm audit results before fix:** 8 vulnerabilities (2 critical, 3 high, 2 moderate, 1 low)

| Package | Severity | Issue | Status |
|---------|----------|-------|--------|
| @nuxtjs/mdc | CRITICAL | XSS in markdown anchor rendering (GHSA-j82m-pc2v-2484) | DEFERRED — requires @nuxt/content v3 migration |
| @nuxtjs/mdc | CRITICAL | XSS bypass in markdown HTML filtering (GHSA-cj6r-rrr9-fg82) | DEFERRED — requires @nuxt/content v3 migration |
| devalue | HIGH | DoS via memory/CPU exhaustion in parse (GHSA-g2pg-6438-jwpf) | **FIXED** |
| h3 | HIGH | HTTP Request Smuggling TE.TE (GHSA-mp2g-9vg9-f4cg) | **FIXED** |
| tar | HIGH | Arbitrary file overwrite, symlink poisoning (GHSA-8qq5-rm4j-mr97) | **FIXED** |
| lodash | MODERATE | Prototype Pollution in unset/omit (GHSA-xxjr-mmjv-4gpg) | **FIXED** |
| nanotar | MODERATE | Path traversal in parseTar (GHSA-92fh-27vv-894w) | **FIXED** |
| diff | LOW | DoS in applyPatch (GHSA-73rr-hh4g-fpgx) | **FIXED** |

**npm audit results after fix:** 2 vulnerabilities (both critical, both in @nuxtjs/mdc)

**Deferred Critical Vulnerabilities — @nuxtjs/mdc XSS:**
- Fix requires upgrading `@nuxt/content` from v2 to v3 (breaking change)
- v3 changes the `queryContent()` API, requiring updates to all 7 content pages
- **Mitigating factors:**
  - Content is authored by trusted users via Decap CMS (Git Gateway auth)
  - No public user input reaches the markdown renderer
  - Exploitation requires CMS admin access (Netlify Identity)
- **Recommendation:** Plan a separate `@nuxt/content` v3 migration sprint

**Automated updates:** Dependabot configured (NEW — `.github/dependabot.yml`)

---

### 6. Content Security Policy (CSP)

**Status:** FIXED (was FAIL)

**Before:** No security headers configured

**After (revised approach — updated 2026-02-12):**

CSP is delivered via a `<meta http-equiv="Content-Security-Policy">` tag in `nuxt.config.ts`, not via Netlify headers. This was necessary because Netlify merges headers from all matching `[[headers]]` rules — a `/admin/*` exemption could not override the `/*` wildcard. By using a Nuxt meta tag, the CSP is baked into every Nuxt-rendered public page but does **not** apply to the standalone `/admin/index.html` (Decap CMS).

**Public pages (all Nuxt-rendered HTML):**
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' https://identity.netlify.com https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.netlify.com https://calendly.com; frame-src https://calendly.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
```

**CMS admin (`/admin/index.html`):** No CSP. Decap CMS requires `unsafe-eval`, `blob:` URLs, and connections to multiple external services (Git Gateway, Cloudflare Insights, netlifystatus.com, unpkg source maps). Since `/admin` is protected by Netlify Identity authentication, a restrictive CSP adds no practical security value.

**Non-CSP security headers (netlify.toml, all paths including admin):**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-XSS-Protection = "1; mode=block"
```

**CSP Policy Breakdown (public pages):**
| Directive | Value | Reason |
|-----------|-------|--------|
| default-src | 'self' | Only load resources from same origin |
| script-src | 'self' 'unsafe-inline' identity.netlify.com unpkg.com | Nuxt inline scripts + Netlify Identity widget |
| style-src | 'self' 'unsafe-inline' | Tailwind CSS injects inline styles |
| img-src | 'self' data: https: | Allow images from any HTTPS source (blog content) |
| connect-src | 'self' api.netlify.com calendly.com | Netlify Identity API + Calendly |
| frame-src | calendly.com | Allow Calendly embed if used |
| frame-ancestors | 'none' | Prevent clickjacking (site cannot be iframed) |

**Lesson learned:** Netlify's `[[headers]]` rules merge rather than override. When two rules match the same path (`/*` and `/admin/*`), the browser receives both CSP headers and enforces the intersection (most restrictive). The only way to exempt a path from CSP on Netlify is to avoid using headers for CSP entirely and use a different delivery mechanism (meta tags, per-page injection) instead.

---

### 7. Third-Party Scripts

**Status:** PASS (with recommendations)

**Scripts found:**

| Script | Location | Purpose | SRI | Loading |
|--------|----------|---------|-----|---------|
| Netlify Identity Widget | /admin (only) | CMS authentication | No | Synchronous |
| Decap CMS | /admin (only) | Content management | No | Synchronous |

- **No analytics or tracking scripts** (Google Analytics, Facebook Pixel, etc.)
- Both third-party scripts are **admin-only** — not loaded on public pages
- Calendly is a link, not an embedded script

**Recommendations:**
- Pin Decap CMS to exact version instead of `@^3.0.0`
- Add SRI hashes when feasible (challenging with CDN-served scripts)

---

### 8. HTTPS & Domain Security

**Status:** PASS

- **HTTPS:** Enforced by Netlify automatically (all Netlify sites force HTTPS)
- **SSL Certificate:** Managed by Netlify (auto-renewed Let's Encrypt)
- **Mixed content:** None — all external references use HTTPS
- **External links:** All use `target="_blank"` with proper origin isolation

**Note:** Explicit HTTP→HTTPS redirect not needed in netlify.toml as Netlify handles this at the infrastructure level.

---

### Additional Checks (Not in Original Checklist)

**XSS Prevention:** PASS
- No `v-html` directives found
- No `innerHTML` or `eval()` usage
- Content rendered safely via `<ContentRenderer>` component

**Client-Side Storage:** PASS
- No localStorage, sessionStorage, or cookie manipulation

**Privacy:** PASS
- No analytics or tracking scripts
- No third-party data collection on public pages

---

## Remediation Applied in This PR

### Fix 1: Dependency Updates (`npm audit fix`)
- **Files changed:** `package.json`, `package-lock.json`
- **Vulnerabilities fixed:** 6 (devalue, h3, tar, lodash, nanotar, diff)
- **Breaking changes:** None

### Fix 2: Security Headers (`netlify.toml`)
- Added Content-Security-Policy
- Added X-Frame-Options: DENY
- Added X-Content-Type-Options: nosniff
- Added Referrer-Policy: strict-origin-when-cross-origin
- Added X-XSS-Protection: 1; mode=block

### Fix 3: Dependabot Configuration (`.github/dependabot.yml`)
- Weekly npm dependency update PRs
- Limited to 5 open PRs
- Monday schedule

---

## Deferred Items

### @nuxt/content v3 Migration (Separate Sprint)

The 2 remaining CRITICAL vulnerabilities in `@nuxtjs/mdc` require upgrading `@nuxt/content` from v2 to v3. This is a **breaking change** that affects:

- `queryContent()` API changes across all content pages
- `<ContentRenderer>` component API changes
- Content directory structure may need updates
- Collection configuration required

**Files requiring updates:**
- `app/pages/index.vue`
- `app/pages/about.vue`
- `app/pages/our-story.vue`
- `app/pages/use-cases.vue`
- `app/pages/ai-portals.vue`
- `app/pages/blog/index.vue`
- `app/pages/blog/[...slug].vue`

**Risk assessment:** LOW immediate risk since markdown content is authored only by trusted CMS admins via Netlify Identity.

---

## Verification Checklist

- [x] `npm audit fix` applied — 6 vulnerabilities resolved
- [x] `npm run generate` — builds successfully (27 routes prerendered)
- [x] No hardcoded secrets in codebase
- [x] .env files properly gitignored
- [x] No serverless functions to secure
- [x] No public forms to protect
- [x] Security headers added to netlify.toml
- [x] Dependabot configured for ongoing maintenance
- [ ] **Post-deploy:** Verify security headers in browser DevTools
- [ ] **Post-deploy:** Verify CSP doesn't break CMS admin at /admin
- [ ] **Future:** @nuxt/content v3 migration to fix remaining 2 CRITICAL

---

## Recommendations

### Immediate (This PR)
1. ~~Fix 6 dependency vulnerabilities~~ DONE
2. ~~Add security headers~~ DONE
3. ~~Enable Dependabot~~ DONE

### Short-Term (Next Sprint)
4. Plan @nuxt/content v2 → v3 migration
5. Pin Decap CMS to exact version in `/admin/index.html`

### Ongoing
6. Review Dependabot PRs weekly
7. Re-run security audit quarterly (next: 2026-05-12)
8. Monitor Netlify security advisories

---

## Sign-Off

**Reviewed By:** CC (Claude Code)
**Date:** 2026-02-12
**Status:** APPROVED FOR PRODUCTION (with deferred items noted)
**Next Review:** 2026-05-12
