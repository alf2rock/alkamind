# Change Governance Patterns — Alkamind Project

**Exported**: 2026-01-03
**Project**: Alkamind Website Rebuild (Nuxt 4)
**Context**: Patterns observed during AI-assisted development with Claude Code

---

## Overview

This document captures the change management patterns and discipline applied during the Alkamind website rebuild. These patterns emerged from collaborative development between a human stakeholder and AI assistant, establishing a governance model suitable for AI-assisted software delivery.

---

## 1. Branch Isolation Strategy

| Branch | Purpose | Protection Level |
|--------|---------|------------------|
| `main` | Production (live site) | No direct commits |
| `nuxt-rebuild` | Active development | All work happens here |
| `v1-react-backup` | Rollback safety net | Read-only archive |

**Principle**: Development is isolated from production. Rollback is always possible.

---

## 2. Plan-Before-Execute Discipline

### Trigger Conditions
- Multi-file changes
- Architectural decisions
- Unclear or ambiguous requirements
- Multiple valid implementation approaches

### Process
1. Enter planning mode (read-only exploration)
2. Analyze existing codebase patterns
3. Document implementation approach
4. Present plan for human approval
5. Exit planning mode only after approval
6. Execute approved plan

**Principle**: No significant implementation without explicit approval of the approach.

---

## 3. Task Decomposition & Tracking

### Structure
- Large initiatives decomposed into discrete tasks
- Each task has clear completion criteria
- Progress tracked visibly throughout execution

### States
| State | Meaning |
|-------|---------|
| `pending` | Not yet started |
| `in_progress` | Currently being worked (limit: 1 at a time) |
| `completed` | Finished and verified |

**Principle**: Work is visible, measurable, and traceable.

---

## 4. Verification Gates

### Pre-Commit Verification
- [ ] Development server runs without errors
- [ ] All affected routes return HTTP 200
- [ ] No regressions in existing functionality
- [ ] Errors discovered during testing are fixed before commit

### Verification Methods
- Local server testing (`npm run dev`)
- HTTP status checks on all routes
- Visual inspection where applicable

**Principle**: No commit without verification. "Commit and hope" is not acceptable.

---

## 5. Atomic Commits

### Commit Characteristics
- Represents a complete, working state
- Single logical change (not batched unrelated changes)
- Revertible without breaking other functionality

### Commit Message Format
```
<summary line — what changed>

<body — why it changed, context>

Co-Authored-By: <attribution>
```

**Principle**: Each commit is a safe checkpoint that can be deployed or rolled back independently.

---

## 6. Human Approval Checkpoints

| Checkpoint | Gate Type | Who Approves |
|------------|-----------|--------------|
| Implementation plan | Approval required | Human stakeholder |
| Commit creation | Explicit request | Human stakeholder |
| Push to remote | Explicit request | Human stakeholder |
| Deploy to production | Manual trigger | Human stakeholder |

**Principle**: Humans control all irreversible or high-impact actions.

---

## 7. Living Documentation

### Documentation Artifacts
| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `CLAUDE.md` | Project context, commands, patterns | Per significant change |
| Implementation Guide | Checkpoints, milestones | Per phase completion |
| Content Model Specs | CMS structure reference | When models change |

**Principle**: Documentation evolves with the codebase. Stale docs are a liability.

---

## 8. Rollback Safety

### Rollback Vectors
1. **Git revert**: Undo specific commits
2. **Branch switch**: Return to backup branch
3. **Cloudflare rollback**: Revert to previous deployment
4. **Contentful versioning**: Content history preserved

### Recovery Time Objective
- Code rollback: < 5 minutes
- Deployment rollback: < 2 minutes (Cloudflare)

**Principle**: Every change is reversible. Speed of recovery is a design constraint.

---

## Change Lifecycle Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHANGE LIFECYCLE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   REQUEST                                                       │
│      │                                                          │
│      ▼                                                          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │  PLAN    │───▶│ APPROVE  │───▶│ IMPLEMENT│                 │
│   │          │    │          │    │          │                 │
│   └──────────┘    └──────────┘    └──────────┘                 │
│                        │               │                        │
│                        │               ▼                        │
│                        │         ┌──────────┐                   │
│                        │         │  VERIFY  │                   │
│                        │         │          │                   │
│                        │         └──────────┘                   │
│                        │               │                        │
│                   [if rejected]        ▼                        │
│                        │         ┌──────────┐    ┌──────────┐  │
│                        └─────────│  COMMIT  │───▶│   PUSH   │  │
│                                  │          │    │          │  │
│                                  └──────────┘    └──────────┘  │
│                                                       │         │
│                                                       ▼         │
│                                                 ┌──────────┐    │
│                                                 │  DEPLOY  │    │
│                                                 │          │    │
│                                                 └──────────┘    │
│                                                                 │
│   HUMAN GATES: Approve, Commit, Push, Deploy                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Applicability

These patterns are suitable for:
- AI-assisted development workflows
- Small team or solo projects with AI collaboration
- Projects requiring audit trail and governance
- Regulated environments needing change control

---

## References

- Project: https://github.com/alf2rock/alkamind
- Branch: `nuxt-rebuild`
- Implementation Guide: CCh 4.x series
