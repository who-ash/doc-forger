---
name: testing-quality-gates
description: Enforces practical test planning and verification for auth, role checks, org flows, and UI states. Use when implementing features, fixing bugs, or preparing release-ready changes.
---

# Testing Quality Gates

## Minimum Verification
1. Lint clean.
2. Type check clean.
3. Manual flow checks for touched features.
4. Regression check for auth and role routes.

## Test Case Design

### Auth
- unauthenticated route access redirects
- sign-in success and failure paths
- sign-out path returns to safe route

### Role-Based Access
- admin can access admin routes
- user cannot access admin routes
- org member role gates enforced

### Organization Flows
- onboarding creates org + owner membership
- duplicate slug prevented
- member add/edit/delete roles correctly enforced

### UI States
- loading/skeleton path visible
- empty state has action
- error state has recovery action

## Bug Fix Rule
- Reproduce issue first.
- Add a deterministic verification checklist for the fix.
- Record verification steps in documentation-manager command logs.
