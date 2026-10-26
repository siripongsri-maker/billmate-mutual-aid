# Login and admin visual polish implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. This is presentation-only work; the existing behavioral tests are the regression gate.

**Goal:** Polish `/login`, `/admin`, `/admin/messages`, `/admin/team`, and `/admin/log` in the existing คนละนิด visual language without changing behavior or copy.

**Architecture:** Keep the current React components, hooks, state, server calls, roles, and labels. Add scoped presentation classes and decorative, hidden-from-AT icons. Use the existing KlShell, StatusPill, `.kl` color tokens, Mali headings and Noto Sans Thai body text. Avoid new dependencies.

**Tech Stack:** TanStack Start, React, Tailwind v4, existing lucide-react.

**Spec:** User's task in this chat (26 October 2026): visual/UX polish only, named branch, unchanged Thai copy and semantics, 390px/1440px screenshots, full verification, PR without merge.

## Global constraints
- Work only on `design/login-admin-polish`; no main commits, force push, or merge.
- Never modify server functions, middleware, auth, SQL, generated integrations, route tree, public/konlanid, or legacy routes.
- Preserve every visible Thai string, aria-label and role. Do not add replacement copy.
- Body 15–16px, all text at least 13px, 4.5:1 text contrast, 44px tap targets, visible focus, reduced motion.
- Preserve pre-existing untracked `.claude/` and `.oil-ui/`.

## Review focus
- Long names, email addresses, IDs and messages wrap at 390px without page overflow.
- Mobile nav/filter buttons remain at least 44px and keep selected text visible.
- Login email/code/error/busy states retain exact messages, input semantics and cooldown behavior.
- Message save and team removal controls retain handlers, confirmation and error states.
- Loading, forbidden, empty, error and pagination states remain readable and semantically unchanged.

## Tasks
- [x] Capture baseline: real exported components in an isolated, uncommitted preview with fictional service fixtures; logged-out login and ready admin states at both requested widths. No live auth/data changes.
- [x] Polish login and admin layout: presentational classes, artwork, calm navigation, consistent controls and page spacing. Preserve control flow and text.
- [x] Polish overview, inbox, team and audit cards: hierarchy, readable counts, responsive grids and work areas. Preserve data/state logic.
- [x] Capture matching after screenshots and check overflow/targets/contrast. Independently review the final diff and screenshots. Verify copy and protected files against the base commit.
- [x] Run `npx vitest run`, `npx tsc --noEmit -p .`, `npx vite build`. Commit scoped changes and screenshot evidence; push named branch and create PR against main. Do not merge.

## Verification notes
Before/after admin screenshots use identical fictional data in a separate visual harness; they are not evidence of a production login or real API operation. No harness bypass is included in the app. Existing tests verify behavior using their own mocks.
