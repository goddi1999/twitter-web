---
name: shadcn-components
description: Build reusable UI like shadcn/ui (primitives, composition, variants). Use when adding or refactoring components/ui or shared composables.
---

# Shadcn Components

## What It Does

Stops one-off, feature-coupled widgets in `components/ui`. Reusable pieces follow **shadcn composition**: Radix/primitives + `cn` + variants + `asChild`, thin and theme-aware.

## When to Reach for It

- Creating or reshaping a reusable component under `components/ui` or a shared composable meant for many features
- Deciding whether something belongs in `ui` vs `features/...`

Use **clean-code** for barrels/folders. Use **feature-layers** for feature data wiring. Use **readme** for package READMEs. Open `reference.md` only when authoring MDX docs _about_ a component.

## Prerequisites & Seams

- Existing `components/ui` patterns (`button`, `input`, …) and `@/lib/utils` `cn`
- Theme tokens / CSS variables already used by shadcn in this repo

## Process

1. **Confirm reuse.** Real cross-feature need → `components/ui` (primitive) or `components/shared` (composed). Single-feature → stay under `features/<domain>/`.
2. **Compose, don’t fork.** Prefer wrapping an existing primitive (or Radix) over copying markup. Forward refs; support `className` via `cn`.
3. **Variants at the leaf.** Use the repo’s variant pattern (e.g. CVA) for size/intent — not ad-hoc boolean class props sprawl.
4. **Slot / `asChild` when polymorphism is needed** (button-as-link). Do not hardcode `<button>` if the design system already supports slots.
5. **Keep it dumb.** No Supabase, no feature hooks, no domain types inside `components/ui`.
6. **Verify.** Type-check. Import only via barrels. Grep that the new file does not import `@/features/*` or `@/lib/supabase`.

## Rules & Constraints

- **Never** put feature/domain API calls inside `components/ui`.
- **Never** hardcode brand hex when a theme token / `ColorId` exists.
- **Never** invent a parallel button/input — extend or compose the existing one.
- Prefer accessibility props already provided by the primitive; do not strip them.
- Public export is named; wire `components/ui` / `shared` barrels when outside consumers need it.

## Deliverables

- Reusable component in the correct folder
- Barrel export if public
- No feature imports from `ui`
- Type-check clean
