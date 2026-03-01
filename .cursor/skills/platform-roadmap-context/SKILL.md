---
name: platform-roadmap-context
description: Tracks current implementation state vs planned next phases across frontend, backend, cloudflare, and vercel concerns. Use when planning tasks, sequencing work, or checking whether a requested feature is in-scope now or later.
---

# Platform Roadmap Context

## Current (Now)
- Auth foundation with Better Auth.
- Role model: app role + organization role.
- Onboarding, admin dashboard, user home placeholder, org member management.
- Drizzle schema and D1 migration workflow.
- Neutral shadcn baseline.

## Next (Later)
- Add Project flow implementation.
- GitHub App install + webhook processing.
- Ingestion triggers and automated update jobs.
- AI search/RAG integration and retrieval UX.
- Harder test automation and audit/event trails.

## Planning Rule
- If a request is “later phase”, implement stubs/interfaces first.
- Avoid over-building deferred features.
- Keep docs updated with what moved from later -> current.
