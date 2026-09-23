---
name: react-state
description: Use React hooks only for named problems; server data via useQuery, not hand-rolled fetch. Use when adding state, effects, custom hooks, or TanStack Query.
---

# React State

## What It Does

Stops **hook sprawl**: `useEffect` as a second render, memo-by-default, utils disguised as hooks, and **hand-rolled server-state caches** (`useState` + `useEffect` + `AbortController`) that no other feature can invalidate.

## When to Reach for It

- Adding `useState` / `useEffect` / `useMemo` / `useCallback` / a custom hook
- Fetching or mutating remote data (TanStack Query)
- Changing data-fetching conventions in this repo

Use **form-validation** for `useForm` + Zod. Use **feature-layers** for which layer owns the API call. Use **clean-code** for `useDisclosure` and placement.

## Prerequisites & Seams

- Component or hook file under `src/`
- Server data goes through feature `*Api.ts` as `queryFn` / `mutationFn` — never Supabase from the hook

## Process

1. **MD first.** If this change introduces or changes a data-fetching convention, update `SKILL.md` + `reference.md` **before** writing application code. Agents read these files as the standard; two competing conventions is worse than one outdated one.
2. **Name the problem** from the table. If none fits, do not add a hook.

   | Problem                                                     | Hook                                        |
   | ----------------------------------------------------------- | ------------------------------------------- |
   | Value changes over time in this component                   | `useState` / `useReducer`                   |
   | Remote / server data (load, cache, refetch, share)          | `useQuery` / `useMutation` (TanStack Query) |
   | Sync with outside world (DOM, storage, subscriptions)       | `useEffect` + cleanup                       |
   | Expensive calc proven hot, or referential identity required | `useMemo` / `useCallback`                   |
   | Reused React-specific logic (subscription/lifecycle)        | custom `use*`                               |
   | Boolean open/close UI                                       | `useDisclosure`                             |

3. **Prefer derive over store.** If it can be computed from props/state, do not put it in state.
4. **Effects only for sync.** Abort/unsubscribe in cleanup. Never mirror props into state — use the prop or remount with `key`. Never use `useEffect` to fetch server data — that is `useQuery`.
5. **Custom hook boundary.** Pure non-React logic stays a util; promote only when React-specific and reused. Server-state custom hooks wrap `useQuery` / `useMutation` and call the feature API.
6. **Verify.** Type-check. Confirm no new `useState`+`useEffect` fetch hooks. Confirm no `useEffect(() => setX(props.y), [props.y])`.

## Rules & Constraints

- **Never** add a **new** hand-rolled server-fetch hook (`useState` + `useEffect` + loading/error for remote data). Use TanStack Query (`useQuery` / `useMutation`). Existing manual hooks may remain until converted; do not copy that pattern.
- **Never** use unscoped query keys. Every key must live under `queryKeys.institution.root(institutionId)` (then feature segments), `queryKeys.admin.…`, or `queryKeys.user.…` from `@/lib/query`.
- On auth principal change (user id changes or becomes null — not same-user token refresh), call `clearQueryCache()` so cached tenant/user data cannot leak on a shared machine.- **Never** add `useMemo`/`useCallback` "just in case".
- **Never** put generic pure functions in `use*` wrappers.
- **Never** nest a second `useForm` inside a child that belongs to a parent form.
- Initialize expensive `useState` with a lazy function: `useState(() => …)`.
- Mutations that write once (publish, submit attempt) use `retry: 0` (global mutation default). Do not re-submit on flaky networks.

For extended examples, open `reference.md`.

## Deliverables

- Hooks that map 1:1 to named problems
- Server state via `useQuery` / `useMutation` calling feature API
- Type-check clean
