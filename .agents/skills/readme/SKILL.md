---
name: readme
description: Generate or audit a README with the open-source section skeleton. Use when writing or reviewing repository README docs.
---

# README

## What It Does

Stops front-matter bloat and API dumps. Forces a **workflow-first** README skeleton.

## When to Reach for It

- Generate, rewrite, or audit a project/package README

Use **shadcn-components** when building reusable UI; its `reference.md` covers MDX docs for those components.

## Prerequisites & Seams

- Target README path and the package it documents
- Facts from the repo (`package.json` scripts, `--help`, real paths) — never invent

## Process

1. **Choose mode:** write from scratch, or audit existing.
2. **Draft/reorder sections** in this exact order (omit only if N/A):
   1. Title + one-line what-it-**is**
   2. What it does (2–3 sentences)
   3. Setup (prereqs + copy-paste install; air-gap subsection if needed)
   4. Usage (day-one commands + real output)
   5. Output layout (tree)
   6. Pipeline/overview (mental model)
   7. Configuration / flags
   8. Design decisions (dated measurements)
   9. Known limitations
   10. Development (tests, how to extend)
3. **Audit extras:** add missing decisions/limitations/setup first; demote anything above the first useful command.
4. **Verify.** Every command is copy-pasteable from the repo; every flag exists; no invented benchmarks.

## Rules & Constraints

- **Never** put badges/philosophy above the first useful command.
- **Never** replace workflow with an API signature dump.
- **Never** claim “fast” without a dated measurement.
- Gather facts from code and scripts only.

## Deliverables

- README matching the skeleton
- Verified commands/flags
