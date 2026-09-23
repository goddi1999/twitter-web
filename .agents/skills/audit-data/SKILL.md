---
name: audit-data
description: Keep audit events on the DSGVO allowlist; no free-text PII. Use when writing audit triggers, payloads, retention, or audit UI.
---

# Audit Data (DSGVO)

## What It Does

Stops **forbidden fields** entering `audit.events` or the audit UI. Minimization by allowlist — not by hope.

## When to Reach for It

- Adding/changing audit triggers, RPCs, payload fields, retention, or audit screens

Use **supabase-schema** for general migration/RLS work.

## Prerequisites & Seams

- Read the allowlist/forbidden lists in `reference.md` before editing payload code
- Canonical logger: do not change `audit.log_event` signature without an explicit product decision

## Process

1. **List every field** the new trigger/UI will store or show.
2. **Check forbidden lists** in `reference.md` (§2): Art.9 special categories, credentials, free text, full row dumps, child-protection free text.
3. **Check allowlist** (`reference.md` §3–4) for the target table. Prefer enum/reason codes over prose.
4. **Apply role visibility** (`reference.md` §5). Security-only fields stay out of normal admin views.
5. **Verify.** Grep the migration/UI for `original_name`, message bodies, notes, DSR prose, wound/clinical free text — none may appear in audit payloads. Run SQL checks.

## Rules & Constraints

- **Never** store or display free-text notes, chat, task bodies, DSR narratives, or `cloud_files.original_name` in audit.
- **Never** dump whole rows into audit payloads.
- **Never** invent new envelope fields that bypass the canonical `audit.log_event` contract.
- Every event needs: `event_type`, `occurred_at`, `actor_user_id`, `institution_id`, `subject_type`, `subject_id`.
- Retention and pseudonymization follow `reference.md` §6 — do not hard-code ad-hoc TTLs in triggers.

## Deliverables

- Payload limited to allowlisted fields
- Checklist in `reference.md` §8 marked against the change
- SQL/UI review clean of forbidden keys
