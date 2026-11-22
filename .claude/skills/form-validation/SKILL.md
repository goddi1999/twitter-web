---
name: form-validation
description: Wire submit forms with react-hook-form + zod + resolvers. Use when collecting and submitting validated input.
---

# Form Validation

## What It Does

Stops agents from hand-rolling submit validation or putting Zod in the wrong layer. One stack: **engine / rulebook / bridge**.

## When to Reach for It

- Building or changing a form that collects input and submits it

Do **not** use for display-only UI, one-off search filters, or UI primitives. Use **react-state** for non-form state. Use **feature-layers** for API submit placement.

## Prerequisites & Seams

- Feature owns the data being written (`features/<domain>/`)
- Packages: `react-hook-form`, `zod`, `@hookform/resolvers`

## Process

1. **Confirm it is a real form** (collect + validate + submit). Otherwise stop and use local state.
2. **Schema first.** Define Zod in `features/<domain>/schemas/` (or colocated if single-use). Infer types with `z.infer<typeof schema>` — do not hand-duplicate.
3. **Wire `useForm`** with `zodResolver(schema)`. Field components stay controlled via RHF; no parallel `useState` for the same fields.
4. **Submit through the feature hook/API** (per **feature-layers**). Map server errors back to fields when the API returns them.
5. **Verify.** Invalid input cannot submit (resolver errors). Type-check passes. Happy-path submit hits the API module once.

## Rules & Constraints

- **Never** nest `useForm` inside a child of an existing form.
- **Never** put Zod schemas inside `components/ui` primitives.
- **Never** re-declare FormValues by hand when `z.infer` exists.
- Name forms by intent (`InstitutionForm`), schemas by domain (`institutionSchema`).

For field-level patterns and anti-patterns, open `reference.md`.

## Deliverables

- Schema + form component + typed submit path
- Type-check clean
