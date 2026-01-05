# Memo 1 to Claude Code: Refining Decap CMS with Nuxt Content

**Purpose**: This memo captures lessons learned from implementing Decap CMS with Nuxt Content. Feed this to Claude Code at the start of a session to help identify and resolve common issues quickly.

---

## Issue 1: Reserved Field Names in Nuxt Content

**Problem**: The field `excerpt` does not appear in Nuxt Content API responses, even though it's correctly defined in frontmatter.

**Root Cause**: `excerpt` is a reserved/special field name in Nuxt Content. The module handles it internally and strips it from custom frontmatter.

**Solution**: Use `summary` instead of `excerpt` for blog post summaries.

```yaml
# Don't use this:
excerpt: "My blog post summary..."

# Use this instead:
summary: "My blog post summary..."
```

**Files to update**:
- `public/admin/config.yml` - Change field name from `excerpt` to `summary`
- Blog templates - Change `post.excerpt` to `post.summary`

---

## Issue 2: Decap CMS Admin Caching

**Problem**: After updating `public/admin/config.yml`, changes don't appear in the CMS admin interface.

**Root Cause**: Browsers aggressively cache `config.yml`. The CMS loads this file once and caches it.

**Solution**:
1. Hard refresh the `/admin` page (Ctrl+Shift+R or Cmd+Shift+R)
2. Or clear site data: DevTools → Application → Storage → Clear site data
3. Or open in incognito window

**Note**: After clearing site data, user will need to log in again (Netlify Identity session is cleared).

---

## Issue 3: Blog Post URLs Use Filename, Not Slug Field

**Problem**: Blog post URL doesn't match the `slug` field in frontmatter.

**Root Cause**: Nuxt Content routes by *file path*, not the `slug` frontmatter field. If the file is `my-old-name.md`, the URL will be `/blog/my-old-name` regardless of what `slug` says.

**Solution**: Rename the markdown file to match the desired URL slug.

```bash
# Rename the file
git mv content/blog/old-name.md content/blog/desired-slug.md
```

**Note**: The Decap CMS config has `slug: "{{slug}}"` which should name new files based on the slug field, but existing files need manual renaming.

---

## Issue 4: Single vs Multiple Attachments

**Problem**: Blog posts need multiple file attachments, but the `file` widget only allows one.

**Solution**: Use a `list` widget with nested fields:

```yaml
# In public/admin/config.yml
- name: attachments
  label: Attachments
  widget: list
  required: false
  fields:
    - { name: label, label: Label, widget: string }
    - { name: file, label: File, widget: file }
```

**Template code**:
```vue
<div v-if="post.attachments && post.attachments.length > 0">
  <ul>
    <li v-for="(attachment, index) in post.attachments" :key="index">
      <a :href="attachment.file" target="_blank">
        {{ attachment.label }}
      </a>
    </li>
  </ul>
</div>
```

---

## Issue 5: Editorial Workflow Branch Isolation

**Problem**: CMS config changes don't affect existing drafts.

**Root Cause**: Editorial workflow (`publish_mode: editorial_workflow`) creates separate Git branches for each draft. These branches contain the config.yml from when the draft was created.

**Solution**:
- For new content: Changes apply automatically
- For existing drafts: Either merge main branch into draft branch, or delete and recreate the draft

---

## Issue 6: Git Push Rejection

**Problem**: `git push` fails with "Updates were rejected because the remote contains work that you do not have locally."

**Root Cause**: Decap CMS commits directly to the branch when content is saved/published. Your local branch falls behind.

**Solution**:
```bash
git pull --rebase
git push
```

---

## Issue 7: Windows Line Endings

**Problem**: YAML parsing issues or fields not appearing correctly.

**Possible Cause**: Windows CRLF line endings can sometimes cause parsing issues.

**Solution**:
```bash
# Convert to Unix line endings
sed -i 's/\r$//' content/blog/filename.md
```

---

## Quick Debugging Checklist

When a frontmatter field isn't appearing:

1. **Check if it's a reserved name**: Try renaming the field (e.g., `excerpt` → `summary`)
2. **Verify YAML syntax**: Use a YAML linter
3. **Check the API response**: `curl http://localhost:3000/api/_content/query`
4. **Clear Nuxt cache**: `rm -rf .nuxt .output .data`
5. **Restart dev server**: Kill and restart `npm run dev`
6. **Check line endings**: Look for `^M` with `cat -A filename.md`

---

## Key File Locations

| File | Purpose |
|------|---------|
| `public/admin/config.yml` | Decap CMS configuration |
| `public/admin/index.html` | CMS admin entry point |
| `content/blog/*.md` | Blog post content |
| `content/pages/*.md` | Static page content |
| `app/pages/blog/[...slug].vue` | Blog post template |
| `app/pages/blog/index.vue` | Blog listing template |

---

## Nuxt Content Reserved/Special Fields

These field names have special behavior in Nuxt Content - avoid using them for custom data:

- `excerpt` - Auto-generated or specially handled
- `description` - Auto-generated from first paragraph
- `body` - The markdown content
- `_path`, `_dir`, `_draft`, `_partial`, `_locale` - Internal fields

---

*Generated from Alkamind website build session, January 2026*
