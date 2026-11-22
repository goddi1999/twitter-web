---
name: design-review
description: Review a linked folder for Deep Modules / complexity and return sharp simplifications. Use when the user asks for an architecture or design review.
---

# Design Review

## What It Does

Runs a **single-focus** design review (Ousterhout: change amplification, cognitive load, unknown unknowns). Output is actionable simplification — not praise.

## When to Reach for It

- User links a domain/folder for architecture/design review

Use **where-it-breaks** for failure-mode critique of an idea. Use **code-review** for diff vs standards/spec. Use **grilling** before large design choices.

## Prerequisites & Seams

- Linked paths readable in the workspace
- Focus menu (ask unless user already picked). Detail checklist in `reference.md`

## Process

1. **Ask one focus** (or confirm theirs). Recommend one. Menu: exceptions, conventions, layers, comments, patterns, encapsulation, OOP-vs-functions, general-improvement, general-advice.
2. **Inventory files.** Batch ~20 if >30 files; state which batch you are on.
3. **Read every listed file** for that focus. Record path, symbol, red flag (book term), evidence quote.
4. **Cluster.** Issues in ≥2 files outrank one-offs.
5. **Return exactly:** Verdict (≤3 sentences) → Findings table (≤10) → Top 3 system-wide simplifications. List “Not reviewed”. Offer next focus — do not start it.

## Rules & Constraints

- **Never** review more than one focus per pass.
- **Never** invent findings for unread files — list them under Not reviewed.
- **Never** rewrite the domain into a full spec or large patch unless asked after the review.
- Findings need before→after sharp fixes; vague “improve naming” is invalid.

## Deliverables

- Verdict + findings table + top 3 simplifications
- Not-reviewed list when applicable
