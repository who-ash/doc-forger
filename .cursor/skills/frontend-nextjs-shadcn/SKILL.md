---
name: frontend-nextjs-shadcn
description: Builds and refactors Next.js App Router frontend using shadcn/ui and neutral token-based design patterns. Use when creating pages, layouts, tables, dialogs, forms, skeletons, empty states, and error states.
---

# Frontend Next.js + shadcn

## Scope
- Next.js App Router UI in `src/app/**`
- shadcn components in `src/components/ui/**`
- Neutral theme and token-based styling from `src/app/globals.css`

## Build Checklist
1. Use server components by default; switch to client only when interactivity is required.
2. Compose UI from shadcn primitives first, custom UI second.
3. Use semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`).
4. Add all states: loading, empty, error, success, disabled.
5. Keep route-level fallback pages present (`not-found`, `error`) for new route groups where needed.

## UI Pattern Requirements

### Tables
- Use `table` component for structured lists with actionable rows.
- Include no-data row with clear next action.
- Add column labels that map to user decisions, not internal IDs.

### Skeletons
- Show skeletons for slow server data and route transitions.
- Match skeleton shape to final content structure.

### Empty States
- Always include:
  - short title
  - why empty
  - primary action
  - optional secondary action

### Dialogs
- Use `dialog` for destructive or multi-step actions.
- Provide confirm/cancel actions and explicit destructive labeling.

### Forms
- Validate both client and server.
- Show inline field errors and form-level error summary.

### Error Handling
- User-safe messages in UI.
- Detailed logs only in server code.

## Accessibility
- Keyboard-operable controls.
- Dialog focus trap and escape-close behavior.
- Inputs with labels and error text associations.
- Color contrast relies on theme tokens and defaults.

## Output Expectations
- Keep components small and composable.
- Prefer predictable layout spacing patterns.
- Avoid hardcoded brand colors unless explicitly requested.
