# 2026-03-01 Login Fix + Toast + Icons Log

## Scope
- Fix Better Auth login/sign-up failure.
- Add toast-based error feedback on sign-in page.
- Centralize app and user icon imports for one-place updates.

## Commands Run (Key)

1) Reproduce and inspect login failure
- `curl` to `/api/auth/sign-up/email` and terminal log inspection.
- Result: D1 HTTP 400 and later NOT NULL constraint failures observed.

2) Reference generation and diagnostics
- `pnpm dlx auth@latest generate --config src/lib/auth.ts --adapter drizzle --dialect sqlite --output /tmp/better-auth-schema.ts -y`
- Result: generated schema reference used to cross-check adapter expectations.

3) D1 direct DB checks
- Queried D1 REST API for `user` and `account` counts.
- Result: confirmed user insert existed while account insert was failing before proxy serialization fix.

4) shadcn toast install
- `pnpm dlx shadcn@latest add sonner -y -o --src-dir`
- Result: `src/components/ui/sonner.tsx` added.

5) Quality validation
- `pnpm lint && pnpm exec tsc --noEmit`
- Result: clean lint and type check.

## Implementation Outcomes
- Fixed D1 query payload shape to object format.
- Improved D1 error messages with response-body context.
- Corrected sqlite-proxy row serialization for Drizzle (`get` + non-`get` behavior).
- Sign-up now succeeds and account records persist.
- Sign-in page now uses toast errors/success notices.
- Added centralized icon registry and updated key usage points.
