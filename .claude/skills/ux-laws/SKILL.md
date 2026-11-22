---
name: ux-laws
description: Interviews the user in one round (max 4 questions), picks the 4–7 Laws of UX that matter for one screen, and turns them into checkable mobile and desktop decisions before building or reviewing it. Use via /ux-laws when designing or reviewing a screen.
disable-model-invocation: true
---

# UX Laws

## What It Does

Stops screens from being designed by taste alone. Out of 30 Laws of UX, it picks the few that decide **this** screen, writes them as a **Law Plan** (one concrete mobile rule and one desktop rule per law), then builds or reviews against that plan. Mobile and desktop are always decided separately: desktop shows everything at once, mobile has one thumb, one task, and a keyboard that takes half the screen.

## When to Reach for It

- `/ux-laws <screen or file>` before building a new screen, or to review an existing one
- A screen "feels off" and you need to say why in named, checkable terms

Do **not** use for code structure (**design-review**), validation wiring (**form-validation**), or motion (**animate**). Keyboard-open layout is delegated to **mobile-keyboard-layout** (step 4).

## Prerequisites & Seams

- The screen: a file path, a route, a screenshot, or a description
- [`UX-LAWS.md`](../../../UX-LAWS.md) at the repo root: the 30 laws with mobile/desktop rules and the Quick Selector. Read **only** the selected laws.
- Browser pane for step 6

## Process

1. **Read what exists.** Open the screen's file/route or screenshot. Note what you can already answer. Signal: you can name the screen type and its current primary action, or you know they are unknown.
2. **Ask one round, max 4 questions** with the AskUserQuestion tool. Skip any question step 1 already answered; never ask a second round. Pick from:
   - **Screen type** — form/input · navigation · list/catalog · task/learning flow · onboarding/empty state · dashboard (maps to the Quick Selector)
   - **Device lead** — mobile-first · desktop-first · both equal
   - **The one primary action** — what must the user do here? (offer the 2–3 candidates you saw in step 1)
   - **Build or review** — build new · review and fix · review only (report, no edits)
     Signal: every answer is recorded; total questions ≤ 4.
3. **Write the Law Plan.** Start from the Quick Selector row(s) at the end of [`UX-LAWS.md`](../../../UX-LAWS.md#quick-selector-for-the-skill) for the screen type, then always add **Fitts** and **Cognitive Load** when mobile matters. Keep **4–7 laws**; drop any law that does not change a decision on this screen. Output a table:

   | Law | Mobile decision | Desktop decision | Check |
   | --- | --------------- | ---------------- | ----- |

   Every row's **Check** must be measurable (a size in px, a count, a position, an element that exists or not). Signal: 4–7 rows; no row says only "follow X".

4. **Delegate the keyboard.** If the screen has a text input, run **mobile-keyboard-layout** (read `.claude/skills/mobile-keyboard-layout/SKILL.md` and follow its Process) and add its pattern (A or B) as a row in the Law Plan. Signal: the plan names Pattern A or B, or states there is no text input.
5. **Build or review against the plan**, per the step-2 answer. Review-only: list each row as pass/fail with the file and line. Build/fix: change code until every row passes. Signal: each row maps to a code location.
6. **Verify both devices.** Browser pane at `375×812` and `1280×800`. Screenshot each and tick every Check. Reset the pane to desktop afterwards. Signal: every row ticked on both sizes, or the failure is reported.

## Rules & Constraints

- **Never** ask more than 4 questions or more than one round. Unanswered → pick the default (mobile-first, the most visible action) and say so.
- **Never** apply all 30 laws, or more than 7 to one screen.
- **Never** cite a law without a measurable Check.
- **Never** use a law to justify a dark pattern (pre-ticked consent, hidden cancel, fake urgency) — Cognitive Bias row forbids it.
- **Never** make mobile a shrunk desktop: one primary action per mobile screen (Von Restorff, Hick), secondary actions ≤ 2 visible, the rest behind "⋯" or a sheet.
- **Never** design a mobile input screen without step 4.
- Mobile targets ≥ 44×44 px with ≥ 8px between; desktop targets ≥ 24px.
- When the user's request conflicts with a law (e.g. "no labels"), follow the user and note the trade-off in the plan.

## Deliverables

1. The Law Plan table (4–7 rows) in the reply
2. Code changes (build/fix) or a pass/fail list with file:line (review-only)
3. Mobile and desktop screenshots, or a stated check, with every row ticked
