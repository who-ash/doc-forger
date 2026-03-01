---
name: design-quality-system
description: Applies consistent UI/UX patterns for tables, skeletons, empty states, dialogs, forms, and error pages using shadcn-friendly structures. Use when building or reviewing interface quality and consistency.
---

# Design Quality System

## Universal UI States
Every view must explicitly handle:
- loading
- empty
- success
- error
- permission denied (if protected)

## Structure Patterns

### Page Shell
- Title + short context line.
- Primary actions in predictable header area.
- Main content grouped by cards/sections.

### Tables
- Clear column titles.
- Row actions grouped and consistent.
- Empty row state with CTA.

### Skeletons
- Use realistic placeholders matching final layout.
- Do not show spinner-only for data-dense screens.

### Empty States
- Include reason and next best action.
- Avoid dead-end empty messages.

### Dialogs
- Use for confirmation and destructive actions.
- Include clear irreversible warning for deletes.

### Errors
- Route-level `error.tsx` where needed.
- Inline form errors for field-level issues.
- Fallback action: retry or return to safe route.

## Visual Rules
- Neutral token-based palette.
- Consistent spacing rhythm.
- Legible hierarchy (title, subtitle, body, meta).

## Accessibility
- Keyboard path for all actions.
- Proper labels and focus visibility.
- Semantic elements for table/form/dialog usage.
