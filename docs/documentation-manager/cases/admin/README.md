# Admin Case

## Current Behavior
- App-level `admin` users are redirected to `/admin`.
- Admin dashboard includes:
  - organization count card
  - user count card
  - user management controls (create/edit role/delete)
  - organization management controls (create/delete)

## Key Files
- `src/app/admin/page.tsx`
- `src/lib/auth-guards.ts`
- `src/lib/db/schema.ts`

## Data/Role Dependencies
- Uses `user.appRole` (`admin`/`user`) for app-level access.
- Uses `organizations` and `user` tables for counts and CRUD.

## Known Gaps
- CRUD currently server-action driven in one page; can be split into dedicated APIs/services.
- More granular audit logging is not yet implemented.

## Next Actions
- Extract admin actions into service modules.
- Add confirmation/modals for destructive actions.
- Add pagination/search for user/org lists.
