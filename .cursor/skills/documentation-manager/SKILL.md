---
name: documentation-manager
description: Maintains structured implementation documentation with command history, lessons learned, and case-grouped updates for admin, user, and organization flows. Use when setup steps are run, architecture changes, auth/database updates, or feature flows are implemented.
---

# Documentation Manager

## Purpose
Maintain a reliable, repeatable project memory for changes and operational steps.

## Workflow
1. Capture key commands executed for setup/migration/integration.
2. Write or update one command log file in `docs/documentation-manager/commands/`.
3. Record mistakes and fixes in `docs/documentation-manager/lessons-learned.md`.
4. Update relevant case docs:
   - `docs/documentation-manager/cases/admin/README.md`
   - `docs/documentation-manager/cases/user/README.md`
   - `docs/documentation-manager/cases/organization/README.md`
5. Ensure no secrets are written in docs.

## Output Format
- Keep logs concise and chronological.
- For each command include:
  - command
  - intent
  - result
- For each case include:
  - current behavior
  - key files/routes
  - known gaps
  - next actions

## Safety Rules
- Never document secret values from `.env`.
- Redact token-like values if command output includes them.
- Prefer implementation facts over assumptions.
