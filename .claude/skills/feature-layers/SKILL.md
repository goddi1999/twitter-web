---
name: feature-layers
description: Enforce feature layers Component→Hook→API→types; never call Supabase from UI. Use when structuring a feature or wiring data flow.
---

# Feature Layers

## What It Does

Stops **layer skipping**: components calling Supabase, hooks owning queries, raw DB rows leaking into UI. One vertical slice shape per feature.

## When to Reach for It

- Creating or reshaping a `features/<domain>/` slice
- Debugging "wrong data" (which layer owns the bug)

Use **clean-code** for folders/barrels/JSX. Use **react-state** for hook discipline. Use **form-validation** for submit forms. Use **supabase-schema** for RLS/migrations. Use **shadcn-components** for reusable UI primitives.

## Prerequisites & Seams

- Feature folder under `src/features/`
- Shared client only at `lib/supabase.ts`

## Process

1. **Draw the five layers** for the change (or confirm they already exist):

   | Layer     | File              | Owns                                                       |
   | --------- | ----------------- | ---------------------------------------------------------- |
   | Component | `*.tsx`           | Render + events; calls one hook                            |
   | Hook      | `use*.ts`         | Calls API via `useQuery` / `useMutation`; exposes UI state |
   | API       | `*Api.ts`         | All Supabase/HTTP; maps Row → Model                        |
   | Types     | `*.types.ts`      | `Row`, `Model`, `FormValues`                               |
   | Client    | `lib/supabase.ts` | Imported **only** by API modules                           |

2. **Implement top-down.** Component → hook → API → types. Never invert.
3. **Map at the boundary.** `toFeature(row)` is the only Row→Model transform. Rows never leave the API module.
4. **Verify.** Grep the feature: no `from '@/lib/supabase'` outside `api/`. No `.select('*')`. Type-check passes.

## Rules & Constraints

- **Never** import `lib/supabase` from components or hooks.
- **Never** `.select('*')` — list columns explicitly.
- **Never** pass `institution_id` from the client as authorization; RLS enforces tenancy.
- Always check Supabase `error` before using `data`.
- Always return **Model**, not **Row**.
- Workers (FastAPI) stay stateless toward the DB unless a designed RPC path says otherwise — prefer signed URLs + JSON.

For longer examples (lesson slice, context patterns), open `reference.md`.

## Deliverables

- Layer files in place with correct import direction
- Grep-clean supabase imports
- Type-check clean
