---
name: add-nav-link
description: Add a new navigation link to the admin main-nav component
user_invocable: true
arguments:
  - name: resource
    description: "Resource name in singular form (e.g. 'tag', 'material')"
    required: true
  - name: label
    description: "Display label for the nav link. Defaults to the pluralized, capitalized resource name"
    required: false
  - name: position
    description: "Where to insert: 'before:Settings' or 'after:Products'. Defaults to before Settings"
    required: false
---

# Add Navigation Link

Add a new route to the main navigation bar in `admin/components/main-nav.tsx`.

## Inputs

- `$ARGUMENTS.resource` — singular resource name (e.g. `tag`)
- `$ARGUMENTS.label` — display label (default: pluralized capitalized name, e.g. `Tags`)
- `$ARGUMENTS.position` — insertion position (default: before Settings)

## File to Edit

`admin/components/main-nav.tsx`

## Pattern

The `routes` array in `main-nav.tsx` contains objects like:

```typescript
{
    href: `/${params.storeId}/resources`,
    label: 'Resources',
    active: pathname === `/${params.storeId}/resources`
}
```

## Instructions

1. Read `admin/components/main-nav.tsx`.
2. Find the `routes` array.
3. Add a new entry using the pattern above, inserting it at the specified position (default: before the Settings entry).
4. Replace `resources`/`Resources` with the actual plural resource name and label.
5. Save the file.

## Example

For resource `tag` with label `Tags`:

```typescript
{
    href: `/${params.storeId}/tags`,
    label: 'Tags',
    active: pathname === `/${params.storeId}/tags`
}
```
