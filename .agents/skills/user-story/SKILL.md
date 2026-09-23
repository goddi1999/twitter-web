---
name: user-story
description: Turn a vague idea into a 7-keyword developer-ready spec before coding. Use when the user gives a raw feature request.
disable-model-invocation: true
---

# User Story

## What It Does

Stops coding from vibes. Turns a raw idea into a fixed **7-keyword** spec.

## When to Reach for It

- User dumps a vague feature/task and wants structure before implementation

Use **grilling** to resolve product decisions first. Use **to-spec** to publish a conversation to the issue tracker. Use **to-tickets** to slice an agreed spec.

## Prerequisites & Seams

- Raw idea in the conversation (and any linked files)
- Template details/examples in `reference.md` if needed

## Process

1. **Restate the goal** in one sentence; ask only if a blocker fact is missing (prefer looking it up).
2. **Fill all seven keywords in order** (omit a section only if genuinely N/A):
   1. `Goal`
   2. `Description` (context, scope, constraints)
   3. `User Action N` (trigger → outcome; repeat)
   4. `Initial State`
   5. `Sample Interaction` (concrete walkthrough)
   6. `Detailed Requirements` (atomic, testable)
   7. `Question N` / `Subtask N` (deliverables + acceptance)

3. **Mark unknowns** as questions — do not invent product answers.
4. **Stop.** Do not implement until the user accepts the spec (or points you at **implement** / **to-tickets**).

## Rules & Constraints

- **Never** start coding in the same turn as drafting the first spec unless the user explicitly says to.
- **Never** skip Sample Interaction — it proves the requirements.
- Requirements say **what**, not framework soup.
- Keep acceptance criteria testable and atomic.

## Deliverables

- Spec using the seven keywords
- Explicit open questions list
