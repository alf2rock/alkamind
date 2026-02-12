# Alkamind Security Review Checklist

**Repository:** https://github.com/alf2rock/alkamind  
**Site Type:** Nuxt 4 Static Site + Contentful CMS  
**Hosting:** Netlify  
**Review Date:** _____________  
**Reviewer:** CC (Claude Code)

---

## Executive Summary

This security review is tailored for a **static marketing site** with Contentful CMS integration. Unlike the AlkaPlay SaaS application (which required extensive security hardening), static sites have a much smaller attack surface. However, specific areas still require verification.

**Key Differences from AlkaPlay:**
- ✅ No user authentication (no auth vulnerabilities)
- ✅ No database (no SQL injection, no RLS concerns)
- ✅ No AI API calls (no prompt injection, no cost exhaustion)
- ✅ No payment processing (no financial exposure)
- ⚠️ Still need to verify: API key exposure, form security, build process

**Expected Outcome:** 0-2 LOW/MEDIUM findings (vs AlkaPlay's 7 vulnerabilities)

---

## Review Methodology

This checklist uses a **graduated risk assessment**:

1. **CRITICAL** - Immediate production risk, fix before next deploy
2. **HIGH** - Significant vulnerability, fix within 1 week
3. **MEDIUM** - Notable security gap, fix within 1 month
4. **LOW** - Best practice improvement, fix when convenient
5. **INFO** - Awareness item, no action required

For each section:
- ✅ Run the automated checks provided
- 📝 Document findings in the "Findings" section at the end
- 🔧 Provide remediation code where applicable
- ⏱️ Estimate time to fix

---

## SECTION 1: Contentful API Key Exposure

**Risk Level:** CRITICAL (if Management API exposed) / LOW (if only Delivery API)

### Context

Contentful provides two types of API access:
- **Delivery API (Read-Only)** - Safe for client-side use, can only read published content
- **Management API (Write-Enabled)** - MUST be server-side only, can modify/delete content

### Checks

#### 1.1 Identify Contentful Configuration

```bash
# Find where Contentful is configured
cat nuxt.config.ts | grep -i contentful -A 10 -B 2

# Check environment variables
cat .env 2>/dev/null
cat .env.local 2>/dev/null
cat .env.production 2>/dev/null

# Search entire codebase for Contentful references
grep -r "contentful" . --include="*.ts" --include="*.js" --include="*.vue" | head -20
```

**Document:**
- Which Contentful module/plugin is used?
- Where are API keys configured?
- Are keys in environment variables or hardcoded?

#### 1.2 Verify API Key Types

**Look for these key patterns:**

| Key Type | Pattern | Risk | Safe Location |
|----------|---------|------|---------------|
| Space ID | Alphanumeric, ~15 chars | ✅ Safe | Client-side OK |
| Delivery API Token | Starts with various chars | ✅ Safe | Client-side OK |
| Management API Token | Starts with `CFPAT-` | 🔴 CRITICAL | Server-side ONLY |
| Preview API Token | Similar to Delivery | ⚠️ MEDIUM | Server-side preferred |

```bash
# Search for Management API patterns
grep -r "CFPAT-" . --exclude-dir=node_modules
grep -r "management" . --include="*.ts" --include="*.js" | grep -i contentful

# Search for any hardcoded tokens
grep -r "Bearer" . --include="*.ts" --include="*.js" --exclude-dir=node_modules
```

**CRITICAL CHECK:**
```typescript
// ❌ CRITICAL VULNERABILITY if found in client code:
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN  // ← Management token!
})

// ✅ SAFE if found:
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN  // ← Delivery token (read-only)
})
```

#### 1.3 Verify Environment Variable Handling

```bash
# Check if .env files are gitignored
cat .gitignore | grep "\.env"

# Check if any .env files are committed
git log --all --full-history -- "**/.env*"

# Verify environment variables are runtime config (not build-time baked)
cat nuxt.config.ts | grep -i "runtimeConfig" -A 20
```

**Expected Safe Pattern:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      contentful: {
        space: process.env.CONTENTFUL_SPACE_ID,        // OK - public
        accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN  // OK - read-only
      }
    },
    // Private keys (server-side only) would go here without "public"
  }
})
```

### Findings Template

```markdown
## 1. Contentful API Key Exposure

**Status:** [ ] PASS / [ ] FAIL

**Findings:**
- API keys used: [List key types found]
- Configuration location: [Where keys are defined]
- Client-side exposure: [Yes/No - what's exposed]

**Vulnerabilities:**
- [ ] None found
- [ ] Management API token exposed client-side (CRITICAL)
- [ ] Preview API token exposed client-side (MEDIUM)
- [ ] API keys hardcoded in source (HIGH)
- [ ] .env files committed to git (MEDIUM)

**Remediation:**
[If vulnerabilities found, provide fix]

**Time to Fix:** [Estimate]
```

---

## SECTION 2: Serverless Functions Security

**Risk Level:** HIGH (if functions exist) / N/A (if no functions)

### Context

Netlify Functions are serverless endpoints that can:
- Process form submissions
- Make API calls
- Handle webhooks
- Execute server-side logic

If functions exist, they need the same security rigor as AlkaPlay's API endpoints.

### Checks

#### 2.1 Detect Serverless Functions

```bash
# Check for Netlify Functions directories
ls -la netlify/functions/ 2>/dev/null
ls -la .netlify/functions/ 2>/dev/null
ls -la functions/ 2>/dev/null

# Check netlify.toml for function config
cat netlify.toml | grep -i "functions" -A 5

# Check package.json for function-related dependencies
cat package.json | grep -i "netlify\|lambda\|serverless"
```

#### 2.2 If Functions Exist - Review Each Function

For EACH function found, check:

**A. Input Validation**
```javascript
// ❌ VULNERABLE - No validation
exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  // Use email directly without validation
}

// ✅ SAFE - Proper validation
exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  
  if (!email || typeof email !== 'string') {
    return { statusCode: 400, body: 'Invalid email' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { statusCode: 400, body: 'Invalid email format' };
  }
  
  // Safe to use email
}
```

**B. Rate Limiting**
```javascript
// ❌ VULNERABLE - No rate limiting
// Can be spammed endlessly

// ✅ SAFE - Rate limited (if implemented)
// Check for rate limiting logic or Netlify rate limit config
```

**C. CORS Configuration**
```javascript
// ❌ VULNERABLE - Overly permissive CORS
headers: {
  'Access-Control-Allow-Origin': '*'  // Allows any site to call
}

// ✅ SAFE - Restricted CORS
headers: {
  'Access-Control-Allow-Origin': 'https://alkamind.com'
}
```

**D. Error Handling**
```javascript
// ❌ VULNERABLE - Exposes stack traces
catch (error) {
  return { 
    statusCode: 500, 
    body: JSON.stringify({ error: error.stack })  // Leaks implementation details
  };
}

// ✅ SAFE - Generic error messages
catch (error) {
  console.error('Function error:', error);  // Log server-side
  return { 
    statusCode: 500, 
    body: JSON.stringify({ error: 'Internal server error' })
  };
}
```

**E. Secret Management**
```javascript
// ❌ VULNERABLE - Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';

// ✅ SAFE - Environment variables
const API_KEY = process.env.API_KEY;
```

#### 2.3 Check Netlify Function Configuration

```bash
# Check netlify.toml for security settings
cat netlify.toml
```

**Look for:**
- Rate limiting configuration
- Function timeouts (should be reasonable, not too long)
- Environment variable usage

### Findings Template

```markdown
## 2. Serverless Functions Security

**Status:** [ ] N/A (No functions) / [ ] PASS / [ ] FAIL

**Functions Found:** [List functions]

**Findings:**
[For each function, document security posture]

**Vulnerabilities:**
- [ ] No functions exist (skip this section)
- [ ] Input validation missing (HIGH)
- [ ] No rate limiting (MEDIUM)
- [ ] Overly permissive CORS (MEDIUM)
- [ ] Error messages leak information (LOW)
- [ ] Hardcoded secrets (CRITICAL)

**Remediation:**
[If vulnerabilities found, provide fix]

**Time to Fix:** [Estimate]
```

---

## SECTION 3: Form Security

**Risk Level:** MEDIUM (if forms exist) / N/A (if no forms)

### Context

Contact forms are common attack vectors for:
- Spam/bot submissions
- Email injection attacks
- DDoS via form spam
- Phishing (if form sends emails)

### Checks

#### 3.1 Detect Forms

```bash
# Search for form elements in Vue components
grep -r "<form" . --include="*.vue" --exclude-dir=node_modules

# Search for form submissions
grep -r "submit\|@submit\|onSubmit" . --include="*.vue" --include="*.ts" --exclude-dir=node_modules

# Check for Netlify Forms config
grep -r "netlify-form\|data-netlify" . --include="*.vue" --include="*.html"
```

#### 3.2 If Forms Exist - Review Security

**A. Spam Protection**
```vue
<!-- ❌ VULNERABLE - No spam protection -->
<form method="POST">
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</form>

<!-- ✅ SAFE - reCAPTCHA or honeypot -->
<form method="POST" data-netlify="true" data-netlify-recaptcha="true">
  <input type="email" name="email" />
  <div data-netlify-recaptcha="true"></div>
  <button type="submit">Submit</button>
</form>

<!-- ✅ ALTERNATIVE - Honeypot field -->
<form method="POST">
  <input type="email" name="email" />
  <input type="text" name="bot-field" style="display:none" />
  <button type="submit">Submit</button>
</form>
```

**B. Client-Side Validation**
```vue
<!-- ✅ GOOD - Client-side validation -->
<script setup>
const email = ref('')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = () => {
  return emailRegex.test(email.value)
}
</script>
```

**C. Server-Side Validation**
```javascript
// If using Netlify Functions or custom backend
// ✅ CRITICAL - Must validate server-side too
exports.handler = async (event) => {
  // Re-validate on server (don't trust client)
}
```

**D. Rate Limiting**
```javascript
// Check if form submissions are rate-limited
// Netlify Forms have built-in rate limiting (100/month free tier)
// Custom forms need manual rate limiting
```

#### 3.3 Check Form Submission Endpoint

```bash
# If forms POST to external service
grep -r "action=\"http" . --include="*.vue" --include="*.html"

# Check what happens on form submit
grep -r "onSubmit\|handleSubmit" . --include="*.vue" --include="*.ts" -A 10
```

**Look for:**
- Where does form data go? (Netlify Forms, external API, serverless function)
- Is submission over HTTPS?
- Are email addresses validated before sending?

### Findings Template

```markdown
## 3. Form Security

**Status:** [ ] N/A (No forms) / [ ] PASS / [ ] FAIL

**Forms Found:** [List forms and their purposes]

**Findings:**
- Form type: [Netlify Forms / Custom / Third-party]
- Spam protection: [reCAPTCHA / Honeypot / None]
- Validation: [Client-side / Server-side / Both]

**Vulnerabilities:**
- [ ] No forms exist (skip this section)
- [ ] No spam protection (MEDIUM)
- [ ] Client-side validation only (MEDIUM)
- [ ] No rate limiting (LOW)
- [ ] Form submits over HTTP (HIGH)

**Remediation:**
[If vulnerabilities found, provide fix]

**Time to Fix:** [Estimate]
```

---

## SECTION 4: Build Process & Secrets

**Risk Level:** MEDIUM

### Context

Build logs and build-time secrets can leak sensitive information if not properly handled.

### Checks

#### 4.1 Review Build Configuration

```bash
# Check netlify.toml build settings
cat netlify.toml

# Check package.json build scripts
cat package.json | grep -A 5 "\"scripts\""

# Check nuxt.config.ts for build-time config
cat nuxt.config.ts | grep -i "build\|generate" -A 10
```

**Look for:**
- Are any secrets echoed/printed in build commands?
- Are environment variables properly scoped (public vs private)?

#### 4.2 Verify .gitignore

```bash
# Check what's gitignored
cat .gitignore

# Verify sensitive files aren't committed
git log --all --full-history -- "**/.env*"
git log --all --full-history -- "**/node_modules"
git log --all --full-history -- "**/.nuxt"
```

**Critical Files That MUST Be Gitignored:**
```
.env
.env.local
.env.production
.env.*.local
node_modules/
.nuxt/
dist/
.output/
```

#### 4.3 Check for Hardcoded Secrets

```bash
# Search for common secret patterns
grep -r "api[_-]key\s*=\s*['\"]" . --exclude-dir=node_modules --exclude-dir=.nuxt
grep -r "password\s*=\s*['\"]" . --exclude-dir=node_modules --exclude-dir=.nuxt
grep -r "secret\s*=\s*['\"]" . --exclude-dir=node_modules --exclude-dir=.nuxt
grep -r "token\s*=\s*['\"]" . --exclude-dir=node_modules --exclude-dir=.nuxt

# Search for AWS/API key patterns
grep -r "AKIA[0-9A-Z]{16}" . --exclude-dir=node_modules  # AWS Access Key
grep -r "sk-[a-zA-Z0-9]{32,}" . --exclude-dir=node_modules  # Anthropic/OpenAI keys
```

#### 4.4 Review Netlify Deploy Settings

**Manual Check Required:**
1. Log into Netlify dashboard
2. Go to Site Settings → Build & Deploy → Environment
3. Verify:
   - ✅ Secrets are in Environment Variables (not in code)
   - ✅ "Deploy log visibility" is set to "Private" (not public)
   - ✅ No secrets appear in recent deploy logs

### Findings Template

```markdown
## 4. Build Process & Secrets

**Status:** [ ] PASS / [ ] FAIL

**Findings:**
- Build configuration: [Netlify / Custom / Other]
- Environment variables: [Properly scoped / Needs review]
- Deploy logs: [Private / Public]

**Vulnerabilities:**
- [ ] Secrets in source code (CRITICAL)
- [ ] .env files committed to git (HIGH)
- [ ] Secrets in build commands (HIGH)
- [ ] Public deploy logs with secrets (MEDIUM)
- [ ] Missing .gitignore entries (LOW)

**Remediation:**
[If vulnerabilities found, provide fix]

**Time to Fix:** [Estimate]
```

---

## SECTION 5: Dependency Security

**Risk Level:** MEDIUM

### Context

Outdated dependencies can contain known vulnerabilities.

### Checks

#### 5.1 Run npm audit

```bash
# Check for known vulnerabilities
npm audit

# Get detailed report
npm audit --json > npm-audit-report.json

# Check for outdated packages
npm outdated
```

#### 5.2 Review Critical Dependencies

```bash
# Check versions of critical packages
cat package.json | grep -E "nuxt|@nuxt|contentful|vue" -A 1

# Check for deprecated packages
npm ls --depth=0 | grep "DEPRECATED"
```

#### 5.3 Automated Dependency Updates

```bash
# Check if Dependabot or Renovate is configured
cat .github/dependabot.yml 2>/dev/null
cat renovate.json 2>/dev/null
```

### Findings Template

```markdown
## 5. Dependency Security

**Status:** [ ] PASS / [ ] FAIL

**Findings:**
- npm audit results: [No vulnerabilities / X vulnerabilities found]
- Outdated packages: [List critical ones]
- Auto-update configured: [Yes/No]

**Vulnerabilities:**
- [ ] No vulnerabilities found
- [ ] CRITICAL vulnerabilities in dependencies (CRITICAL)
- [ ] HIGH vulnerabilities in dependencies (HIGH)
- [ ] Outdated Nuxt version (MEDIUM)
- [ ] No automated dependency updates (LOW)

**Remediation:**
```bash
# Fix vulnerabilities
npm audit fix

# Update specific packages
npm update nuxt @nuxt/content contentful

# Or update all
npm update
```

**Time to Fix:** [Estimate]
```

---

## SECTION 6: Content Security Policy (CSP)

**Risk Level:** LOW-MEDIUM

### Context

CSP headers prevent XSS attacks by controlling which resources can be loaded.

### Checks

#### 6.1 Check for CSP Configuration

```bash
# Check netlify.toml for headers
cat netlify.toml | grep -i "Content-Security-Policy" -B 2 -A 10

# Check nuxt.config.ts for security headers
cat nuxt.config.ts | grep -i "headers\|security" -A 10

# Check for Nuxt security module
cat package.json | grep "@nuxtjs/security\|nuxt-security"
```

#### 6.2 Test Current CSP (Manual)

**Visit the deployed site and check headers:**
1. Open DevTools → Network tab
2. Load the homepage
3. Click on the main document request
4. Check Response Headers for `Content-Security-Policy`

#### 6.3 Recommended CSP

```toml
# netlify.toml - Example CSP
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://cdn.contentful.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    """
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Findings Template

```markdown
## 6. Content Security Policy

**Status:** [ ] PASS / [ ] FAIL

**Findings:**
- CSP configured: [Yes/No]
- Current policy: [List if exists]
- Other security headers: [X-Frame-Options, etc.]

**Vulnerabilities:**
- [ ] CSP properly configured
- [ ] No CSP configured (MEDIUM)
- [ ] Overly permissive CSP (LOW)
- [ ] Missing security headers (LOW)

**Remediation:**
[Provide recommended CSP configuration]

**Time to Fix:** [Estimate]
```

---

## SECTION 7: Third-Party Scripts

**Risk Level:** LOW

### Context

Third-party scripts (analytics, tracking) can be vectors for attacks if compromised.

### Checks

#### 7.1 Identify Third-Party Scripts

```bash
# Search for external script sources
grep -r "script src=\"http" . --include="*.vue" --include="*.html" --exclude-dir=node_modules

# Search for analytics/tracking
grep -r "gtag\|analytics\|google-tag\|facebook\|meta" . --include="*.vue" --include="*.ts" --include="*.html"

# Check nuxt.config.ts for script config
cat nuxt.config.ts | grep -i "script\|head" -A 10
```

#### 7.2 Review Each Script

For each third-party script, document:
- **Purpose:** What does it do?
- **Source:** Where is it loaded from?
- **Integrity:** Does it use SRI (Subresource Integrity)?
- **Loading:** async/defer attributes set?

**Example Review:**

```vue
<!-- ❌ SUBOPTIMAL - No integrity check -->
<script src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXX"></script>

<!-- ✅ BETTER - With integrity check (when possible) -->
<script 
  src="https://cdn.example.com/analytics.js" 
  integrity="sha384-..." 
  crossorigin="anonymous"
></script>
```

### Findings Template

```markdown
## 7. Third-Party Scripts

**Status:** [ ] PASS / [ ] FAIL

**Scripts Found:**
| Script | Purpose | Integrity Check | Loading |
|--------|---------|----------------|---------|
| Google Analytics | Analytics | No | async |
| [Add more] | | | |

**Vulnerabilities:**
- [ ] All scripts properly configured
- [ ] Scripts loaded over HTTP (HIGH)
- [ ] No SRI for external scripts (LOW)
- [ ] Scripts loaded synchronously (LOW)

**Remediation:**
[If issues found, provide fix]

**Time to Fix:** [Estimate]
```

---

## SECTION 8: HTTPS & Domain Security

**Risk Level:** LOW

### Context

Ensure site is served over HTTPS and domain is properly secured.

### Checks

#### 8.1 HTTPS Configuration

```bash
# Check netlify.toml for HTTPS redirect
cat netlify.toml | grep -i "https\|force_ssl\|redirect"
```

**Expected configuration:**
```toml
[[redirects]]
  from = "http://alkamind.com/*"
  to = "https://alkamind.com/:splat"
  status = 301
  force = true
```

#### 8.2 Manual Domain Checks

**Visit the site and verify:**
1. HTTP redirects to HTTPS ✓
2. www redirects to non-www (or vice versa) ✓
3. SSL certificate is valid ✓
4. No mixed content warnings ✓

#### 8.3 DNS Security (Manual Check Required)

**Check DNS settings for:**
- CAA records (restricts which CAs can issue certificates)
- DNSSEC (if available/needed)

### Findings Template

```markdown
## 8. HTTPS & Domain Security

**Status:** [ ] PASS / [ ] FAIL

**Findings:**
- HTTPS redirect: [Configured / Not configured]
- SSL certificate: [Valid / Issues]
- Mixed content: [None / Found]

**Vulnerabilities:**
- [ ] All HTTPS configured properly
- [ ] No HTTPS redirect (HIGH)
- [ ] Invalid SSL certificate (CRITICAL)
- [ ] Mixed content warnings (MEDIUM)
- [ ] No CAA records (LOW)

**Remediation:**
[If issues found, provide fix]

**Time to Fix:** [Estimate]
```

---

## FINAL REPORT TEMPLATE

```markdown
# Alkamind Security Review - Final Report

**Date:** [Date]
**Reviewer:** CC (Claude Code)
**Repository:** https://github.com/alf2rock/alkamind
**Deployed Site:** https://alkamind.com

---

## Executive Summary

[Brief overview of review scope and overall security posture]

**Overall Risk Rating:** [ ] LOW / [ ] MEDIUM / [ ] HIGH / [ ] CRITICAL

**Total Vulnerabilities Found:**
- CRITICAL: X
- HIGH: X
- MEDIUM: X
- LOW: X
- INFO: X

**Comparison to AlkaPlay:**
- AlkaPlay: 2 CRITICAL, 3 HIGH, 2 MEDIUM (7 total)
- Alkamind: [Your findings]

---

## Detailed Findings

### CRITICAL Issues
[List with remediation]

### HIGH Issues
[List with remediation]

### MEDIUM Issues
[List with remediation]

### LOW Issues
[List with remediation]

### INFO Items
[List for awareness]

---

## Remediation Plan

### Immediate Actions (This Week)
- [ ] [Fix CRITICAL issue 1]
- [ ] [Fix CRITICAL issue 2]

### Short-Term Actions (This Month)
- [ ] [Fix HIGH issue 1]
- [ ] [Fix MEDIUM issue 1]

### Long-Term Actions (Next Quarter)
- [ ] [Fix LOW issue 1]
- [ ] [Implement best practice 1]

---

## Implementation Code

[Provide actual code fixes for vulnerabilities found]

### Fix 1: [Title]
```typescript
// Before (vulnerable)
[Old code]

// After (secure)
[New code]
```

### Fix 2: [Title]
```bash
# Commands to run
[Fix commands]
```

---

## Verification Testing

[Provide test commands to verify fixes]

```bash
# Test 1: Verify API keys not exposed
[Test command]

# Test 2: Verify forms have spam protection
[Test command]
```

---

## Recommendations

### Security Best Practices to Implement:
1. [Recommendation 1]
2. [Recommendation 2]

### Monitoring & Ongoing Security:
1. Set up Dependabot for automated dependency updates
2. Enable Netlify deploy notifications
3. Review Netlify analytics monthly for unusual traffic

---

## Sign-Off

**Reviewed By:** CC (Claude Code)  
**Date:** [Date]  
**Status:** [ ] APPROVED FOR PRODUCTION / [ ] FIXES REQUIRED  

**Next Review:** [Recommend date - typically 6 months for static sites]
```

---

## Appendix: Automated Security Scan Script

Save this as `security-scan.sh` for future use:

```bash
#!/bin/bash

echo "=== Alkamind Security Scan ==="
echo "Date: $(date)"
echo ""

echo "1. Checking for Contentful API keys..."
grep -r "CFPAT-" . --exclude-dir=node_modules || echo "✓ No Management API tokens found"
echo ""

echo "2. Checking for hardcoded secrets..."
grep -r "api[_-]key\s*=\s*['\"]" . --exclude-dir=node_modules --exclude-dir=.nuxt | head -5 || echo "✓ No hardcoded keys found"
echo ""

echo "3. Checking for serverless functions..."
ls -la netlify/functions/ 2>/dev/null || echo "✓ No Netlify functions directory"
ls -la .netlify/functions/ 2>/dev/null || echo "✓ No .netlify functions directory"
echo ""

echo "4. Checking .gitignore configuration..."
cat .gitignore | grep "\.env" || echo "⚠ .env not in .gitignore"
echo ""

echo "5. Running npm audit..."
npm audit --json > npm-audit-temp.json 2>/dev/null
VULNERABILITIES=$(cat npm-audit-temp.json | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Vulnerabilities found: $VULNERABILITIES"
rm npm-audit-temp.json
echo ""

echo "6. Checking for forms..."
grep -r "<form" . --include="*.vue" --exclude-dir=node_modules | wc -l | xargs echo "Forms found:"
echo ""

echo "=== Scan Complete ==="
echo "Review detailed findings in sections above."
```

Make it executable:
```bash
chmod +x security-scan.sh
./security-scan.sh
```

---

## Notes for CC

**Execution Strategy:**

1. **Start with automated checks** - Run all bash commands provided
2. **Document as you go** - Fill in findings templates immediately
3. **Prioritize CRITICAL/HIGH** - Focus on real risks first
4. **Provide actual fixes** - Don't just identify issues, provide code to fix them
5. **Test your fixes** - Verify remediation works before reporting

**Expected Timeline:**
- Initial automated scan: 15-30 minutes
- Detailed manual review: 1-2 hours
- Writing report & remediation code: 30-60 minutes
- **Total: 2-4 hours** (much less than AlkaPlay's 8-12 hours)

**When to Escalate:**
- If you find Management API tokens in client code → STOP and report immediately
- If you find CRITICAL vulnerabilities → Prioritize those first
- If unclear about severity → Ask Chris or CCh for guidance

**Remember:**
This is a static site, so expect LOW overall risk. The goal is verification, not hunting for problems that don't exist.

Good luck! 🔍🛡️
```
