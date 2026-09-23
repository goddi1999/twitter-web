---
name: clean-code
description: Place and shape React/TS code under src/ (folders, barrels, naming, JSX). Use when adding, moving, or refactoring modules.
---

# Clean Code

## What It Does

Stops agents from dumping code in the wrong folder, deep-importing internals, or writing JSX soup. Enforces **local-first**, **named exports**, and **boring structure**.

## When to Reach for It

- Adding or moving a file under `src/`
- Refactoring a component's readability
- Deciding shared vs feature ownership

Use **feature-layers** for Component → Hook → API layering. Use **react-state** for hook anti-patterns. Use **form-validation** for RHF/Zod. Use **shadcn-components** for reusable `components/ui`.

## Prerequisites & Seams

- Target path under `src/`
- Existing feature barrels (`features/<name>/index.ts`, `components/shared`)

## Process

1. **Name the change reason.** Ask: what would force this file to change? Place it with that responsibility.
2. **Pick the folder** using the table in Rules. Prefer an existing module over a new one.
3. **Wire the public API.** If anything outside the folder imports it, update/add that folder's `index.ts` and the parent barrel. Consumers import top barrels only.
4. **Shape the module.** Named export; compute before `return`; minimum state; derive the rest.
5. **Verify.** `npm run type-check` must pass. Grep for `export default` and deep imports you may have introduced — remove them.

## Rules & Constraints

- **Never** `export default` in app `src/` (wrap at `React.lazy` call sites only).
- **Never** deep-import another feature's internals — use `@/features/<name>` or `@/components/shared`.
- **Never** put fallbacks (`??` / `||`) that hide invalid data; only UI-boundary display defaults.
- Prefer `type` over `interface` unless declaration merging is required.
- Props callbacks: `onSave`. Local handlers: `handleSave`.
- Color props: `ColorId` / theme ids from `@/lib/themes` — never raw hex strings.
- Boolean toggle UI: prefer `useDisclosure` from `@/hooks`.
- `useMemo` / `useCallback` only with measured cost or required stable identity.

| Location             | Put here                             |
| -------------------- | ------------------------------------ |
| `components/ui`      | Primitives (Button, Input)           |
| `components/shared`  | Cross-feature composed UI            |
| `components/layout`  | App-wide shell only                  |
| `features/<domain>/` | Domain pages, hooks, api, types, UI  |
| `src/hooks`          | Generic hooks reused across features |

## Deliverables

- File(s) in the correct folder with named exports
- Barrels updated if the public surface changed
- Type-check clean

For barrel wiring detail, read `reference.md` only if step 3 is unclear.
