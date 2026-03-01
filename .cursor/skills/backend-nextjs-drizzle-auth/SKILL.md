---
name: backend-nextjs-drizzle-auth
description: Implements Next.js backend flows with Better Auth, Drizzle, and role-based access controls. Use when creating server actions, route handlers, auth guards, and organization-scoped APIs.
---

# Backend Next.js + Drizzle + Better Auth

## Scope
- Route handlers in `src/app/api/**`
- Server actions in route pages/components
- Data layer in `src/lib/db*`, `src/lib/auth*`

## Core Rules
1. Enforce auth on every protected action/path.
2. Enforce app-level role checks for admin flows.
3. Enforce organization membership checks for org-scoped flows.
4. Validate all input with `zod`.
5. Return safe error messages to UI, keep sensitive details out of responses.

## Data Access Pattern
- Keep query logic close to domain helper functions.
- Use typed Drizzle queries only.
- Avoid duplicating authorization logic across handlers.

## Action Design
- Validate input first.
- Check authorization second.
- Perform mutation third.
- Revalidate and redirect/return last.

## Error Strategy
- Use explicit error branches for:
  - not authenticated
  - not authorized
  - validation failed
  - resource not found
  - conflict (duplicate slug/email)

## CRUD Minimums
- `create`: validate, check uniqueness, insert
- `read`: scoped read, pagination-ready shape
- `update`: scoped update, optimistic-safe
- `delete`: guard against destructive self-break flows
