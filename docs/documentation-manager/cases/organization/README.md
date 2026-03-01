# Organization Case

## Current Behavior
- Organization onboarding creates:
  - `organizations` row
  - `organization_members` row with `owner` role for creator
- Organization members page (`/organization/[slug]`) supports:
  - add member by email
  - update member role
  - remove member
- Role check for management actions: `owner` or `admin`.

## Key Files
- `src/app/onboarding/organization/page.tsx`
- `src/app/organization/[slug]/page.tsx`
- `src/lib/auth-guards.ts`
- `src/lib/slugs.ts`

## Data/Role Dependencies
- `organizations`
- `organization_members` (`owner`/`admin`/`member`)
- `user` lookup by email for member add flow

## Known Gaps
- Invitation flow and acceptance tokens are not yet implemented.
- No dedicated audit trail for membership changes.

## Next Actions
- Add invite-based onboarding for org members.
- Add membership action audit records.
