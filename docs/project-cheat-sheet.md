# A
lkamind Project Cheat Sheet

Quick reference for common commands and settings.

---

## Claude Code Permission Modes

| Mode | Description |
|------|-------------|
| `default` | Tight leash - prompts for approval on each tool |
| `acceptEdits` | Unleashed - auto-accepts file edits |
| `plan` | Read-only - can explore but not modify |

### Toggle During Session
Press **Shift+Tab** to cycle through modes

### Start Session in Specific Mode
```bash
claude --permission-mode plan        # Safe analysis / read-only
claude --permission-mode acceptEdits # Unleashed / auto-accept
```

---

## Git Commands

```bash
git status                    # Check for changes
git pull --rebase             # Sync with remote
git add . && git commit -m "" # Stage and commit
git push                      # Push to remote
git branch -a -vv             # List all branches with status
```

### Branch Strategy
- `main` — Production (DO NOT push directly)
- `nuxt-rebuild` — Development (all work here)
- `v1-react-backup` — Original React site backup

---

## Dev Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Build for production
npm run generate  # Generate static site (for Netlify)
npm run preview   # Preview production build
```

---

## Decap CMS

- **Admin URL**: `/admin` (e.g., http://localhost:3000/admin)
- **Config**: `public/admin/config.yml`
- **Content**: `content/pages/` and `content/blog/`
- **Media**: `public/uploads/`

### After Config Changes
Hard refresh admin: **Ctrl+Shift+R**

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions for Claude Code |
| `nuxt.config.ts` | Nuxt configuration |
| `public/admin/config.yml` | CMS field definitions |
| `app/pages/` | Route pages |
| `content/` | Markdown content |

---

## Docs Reference

| File | Topic |
|------|-------|
| `memo-1-claude-code-decap-cms.md` | CMS troubleshooting |
| `memo-2-blog-images.md` | Image embedding options |
| `nuxt-rebuild-guide.md` | Full implementation guide |

---

*Last updated: January 2026*
