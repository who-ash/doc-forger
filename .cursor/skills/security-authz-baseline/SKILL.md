---
name: security-authz-baseline
description: Applies secure defaults for authentication, authorization, input validation, and secret handling in Next.js + Better Auth + Drizzle workflows. Use when adding endpoints, actions, auth flows, or role checks.
---

# Security + Authorization Baseline

## Non-Negotiables
1. Validate all external input with `zod`.
2. Authenticate before any protected read or write.
3. Authorize by role/scope before mutation.
4. Never expose secrets/tokens in client responses or logs.
5. Keep error messages informative but non-sensitive.

## AuthZ Boundaries
- App-level role for admin routes.
- Org membership role for org-scoped routes.
- Deny by default when missing scope.

## Data Safety
- Avoid broad unscoped list endpoints.
- Prevent self-lockout/destructive edge cases where possible.
- Enforce uniqueness and conflict-safe inserts/updates.

## Operational Safety
- Keep `.env` values out of docs and commit history.
- Redact command output in documentation if sensitive.
- Prefer short-lived credentials for third-party API access.
