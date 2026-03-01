---
name: vercel-deployment-compat
description: Keeps the project deployable on Vercel while preserving Cloudflare-first data patterns. Use when adjusting runtime APIs, environment setup, and deployment behavior for multi-platform readiness.
---

# Vercel Deployment Compatibility

## Scope
- Next.js runtime and build compatibility
- Environment variable hygiene
- Deployment-safe server behavior

## Rules
1. Keep runtime-specific logic isolated behind small adapters.
2. Avoid assumptions tied to local filesystem persistence.
3. Do not leak secrets in logs, UI, or docs.
4. Ensure route handlers and server actions remain framework-native and portable.

## Environment Expectations
- Use explicit required env keys for auth and db connectivity.
- Provide `.env.example` patterns when onboarding new contributors.

## Deploy Checklist
- Build succeeds with strict types.
- Auth callback URLs match deployment host.
- Error pages are user-safe and actionable.
- Feature flags guard platform-specific integrations.
