# Lessons Learned

## 2026-03-01

### 1) Use official CLIs when requested
- Issue: initial iteration manually scaffolded some pieces.
- Correction: reset and re-ran setup with Better Auth CLI + shadcn CLI.
- Prevention: default to CLI-generated foundations when user requests official setup.

### 2) Keep architecture aligned to target platform
- Issue: Better Auth CLI default used local sqlite package.
- Correction: moved to Drizzle + Cloudflare D1 runtime/migration configuration.
- Prevention: remove non-target DB dependencies early and validate target stack before wiring.

### 3) Make changes traceable
- Issue: setup steps can be hard to reconstruct later.
- Correction: introduced command log + case-based docs + persistent rule/skill.
- Prevention: update documentation-manager files after each meaningful implementation step.

### 4) Prefer controlled self-improvement loops
- Issue: automatic silent skill rewrites can create drift and overfitting.
- Correction: enforce loopback documentation always, but gate skill rewrites behind user confirmation.
- Prevention: propose focused updates when repeated patterns appear; apply after approval.

### 5) D1 + sqlite-proxy adapters need strict response shape
- Issue: login failed because D1 query payload and sqlite-proxy response format were mismatched for Drizzle expectations.
- Correction: sent D1 `/query` body as `{ sql, params }` and serialized proxy `rows` as array values (`get` as single row array).
- Prevention: validate proxy response contract when using `drizzle-orm/sqlite-proxy`, especially for `returning` flows used by auth.
