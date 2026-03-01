# User Case

## Current Behavior
- Non-admin users are redirected into onboarding/home flow.
- If user has no organization membership, user is redirected to `/onboarding/organization`.
- Sign-in and sign-up flows now show toast-based success/error feedback.
- Home page (`/home`) shows:
  - onboarding complete state
  - disabled `Add Project` button placeholder
  - user organizations with link to member management

## Key Files
- `src/app/page.tsx`
- `src/app/home/page.tsx`
- `src/app/onboarding/organization/page.tsx`
- `src/app/sign-in/page.tsx`
- `src/components/ui/sonner.tsx`
- `src/lib/icons.tsx`

## Data/Role Dependencies
- App-level role from `user.appRole`.
- Organization membership from `organization_members`.

## Known Gaps
- Add Project flow intentionally deferred.
- User profile management is not yet implemented.

## Next Actions
- Build project onboarding flow in next stage.
- Add basic user profile settings page.
