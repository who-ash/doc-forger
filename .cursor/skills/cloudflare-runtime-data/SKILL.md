---
name: cloudflare-runtime-data
description: Aligns app architecture with Cloudflare-first runtime and data patterns (D1, HTTP migrations, edge-safe practices). Use when configuring database, runtime constraints, and Cloudflare deployment paths.
---

# Cloudflare Runtime + Data

## Scope
- D1 configuration and migrations
- Runtime-safe data access from Next.js server code
- Future compatibility for AI Search/RAG/Gateway and trigger workflows

## Current Baseline
- Drizzle config uses `d1-http`.
- Runtime DB access should avoid local sqlite assumptions.
- Secrets come from environment variables only.

## Rules
1. Prefer Cloudflare-compatible libraries and APIs.
2. Keep data access abstraction stable (`src/lib/db.ts`).
3. Keep migration workflow deterministic (`db:generate`, `db:migrate`).
4. Avoid storing third-party long-lived tokens when short-lived token exchange is available.

## Future-Ready Notes
- Leave extension points for:
  - webhook ingestion
  - async processing workers
  - vector/search indexing steps
  - audit/event records

## Validation Checklist
- Config contains no hardcoded account or token values.
- Migrations are generated from schema, not hand-edited first.
- Role boundaries are enforced before mutation queries.
