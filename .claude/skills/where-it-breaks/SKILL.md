---
name: where-it-breaks
description: List concrete failure modes of an idea or folder, each with a fix, then a surviving final version. Use for critical design critique.
---

# Where It Breaks

## What It Does

Adversarial review: find cracks under real users/load/time. No praise. Every problem gets a smallest fix, then one surviving design.

## When to Reach for It

- User wants failure-mode analysis of an idea, feature, or linked folder

Use **design-review** for Ousterhout simplification of existing code. Use **grilling** to decide among options. Use **code-review** for a diff.

## Prerequisites & Seams

- Idea in chat and/or linked paths

## Process

1. **Read** linked files before judging.
2. **Restate intent** in one sentence.
3. **List likely problems** in parallel — each: Failure (concrete scenario), Cause, Fix (smallest change).
4. **Propose final version** as bullets that survive after those fixes.
5. **List unknowns** you could not verify.

## Rules & Constraints

- **Never** say “it won’t scale” without a scenario/number.
- **Never** list a problem without a fix.
- **Never** invent problems for sound parts.
- **Never** walk incremental rewrite versions — one final version after the list.
- **Never** expand into full implementation or a full spec unless asked.
- Check facts in the repo; do not guess.

## Deliverables

Exact structure:

```
**Intent (as I understood it):** …

**Likely problems**
1. …
   - Failure: …
   - Cause: …
   - Fix: …

**Final version**
- …

**Unknowns / needs confirmation**
- …
```
