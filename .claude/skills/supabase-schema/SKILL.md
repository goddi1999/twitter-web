---
name: supabase-schema
description: Write Supabase SQL migrations with RLS, naming, and tenant isolation. Use when changing schema, policies, RPCs, or storage rules.
---

# Supabase Schema

## What It Does

Stops **app-side tenancy** and sloppy migrations. Postgres + RLS is the enforcement layer; migrations are the only schema path.

## When to Reach for It

- New/changed tables, enums, indexes, triggers, RPCs, RLS, storage policies

Use **audit-data** when the change touches audit payloads or triggers. Use **pytest** to prove tenant isolation in worker/DB tests. Use **feature-layers** for how the client talks to Supabase.

## Prerequisites & Seams

- Working tree under `supabase/migrations/`
- Tenant key: `institution_id` (never invent `tenant_id` as a second concept)
- Load `reference.md` when you need naming templates, policy patterns, or lifecycle rules

## Process

1. **One domain change per migration.** Name the file for that domain. Do not mix unrelated tables.
2. **Follow section order** (omit unused): types → tables → indexes/constraints → functions → triggers → RLS → grants/comments → data backfill (explicit only).
3. **Tenant tables:** `institution_id uuid not null`, enable RLS, **`FORCE ROW LEVEL SECURITY`**, policies via membership helpers — never `WHERE institution_id = <client value>` as the real check.
4. **Comments.** `COMMENT ON` every app-facing table/column you add.
5. **Verify.** `npm run check:sql` (or project SQL lint/format scripts). Apply locally and smoke the affected RPC/policy. If audit triggers changed, run the **audit-data** checklist.

## Rules & Constraints

- **Never** rely on the app filter for tenant isolation.
- **Never** put relational data in JSONB; JSONB is document payload only.
- **Never** log health data, passwords, tokens, or free-text PII in DB logs/audit (see **audit-data**).
- Prefer idempotent DDL (`IF NOT EXISTS` / guarded alters) except intentional one-shot backfills.
- Table owners bypass RLS unless `FORCE ROW LEVEL SECURITY` — always force on tenant tables.
- Keep Hetzner teardown tags on line 1 when required by existing migration policy.

## Deliverables

- New migration file(s) only for this domain change
- RLS + FORCE on new tenant tables
- SQL checks clean; local apply verified

Deep rules (naming, policy templates, delete/GDPR lifecycle, Hetzner ops) live in `reference.md` — open only when a step needs them.
