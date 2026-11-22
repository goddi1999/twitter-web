---
name: hig-feedback-prompts
description: Time rating, review, feedback, and permission requests so they never interrupt a task. Use when adding a "rate us", review prompt, feedback form, survey, or permission request.
---

# HIG Feedback Prompts

## What It Does

Stops agents from firing a rating or feedback popup on launch, mid-task, or on a timer. HIG: ask only after the user has experienced value, at a natural pause, rarely, and never in exchange for anything. The same timing discipline applies to permission prompts.

## When to Reach for It

- Adding a rating/review request, NPS or feedback survey, "send feedback" entry, or permission request
- Reviewing a prompt users complain about

Do **not** use for first-run gating in general (**hig-first-run**) or for the dialog/sheet choice itself (**hig-modality**).

## Prerequisites & Seams

- The app's **value moment** (e.g. finished a lesson, completed a streak, exported a file)
- A place to persist prompt history per user (last shown, count, dismissed)

## Process

1. **Name the trigger event.** Pick a completion moment after a success the user caused. Signal: one named event; it fires at the end of a task, not the start or middle.
2. **Gate eligibility.** Show only if: user has had the value moment ≥ 3 times across ≥ 2 sessions, the last action succeeded (no error this session), and no prompt shown in the last ~120 days or after a dismissal; max 3 per year. Signal: eligibility is one pure function with tests for each condition.
3. **Use the lightest surface.** Rating: platform review API on native/PWA wrappers; on web, a small inline or toast-style card — never a blocking modal. Permissions: a pre-prompt explaining the benefit in context, right before the feature needs it. Signal: the prompt can be ignored without a tap.
4. **Keep a permanent manual entry.** "Rate the app" / "Send feedback" lives in Settings or About, always available. Signal: entry exists and works when the automatic prompt is ineligible.
5. **Verify.** Unit-test eligibility; manually run: first session (no prompt), after trigger with history met (prompt), dismiss then trigger again (no prompt), mid-task (no prompt). Signal: all four outcomes as stated.

## Rules & Constraints

- **Never** prompt on launch, on a timer, during a task, or right after an error.
- **Never** offer rewards, unlocks, or gate features behind rating.
- **Never** pre-screen ("Do you like us?" → only happy users go to the store) — ask everyone the same way.
- **Never** re-prompt after an explicit dismissal within the cool-down.
- **Never** request OS permissions without first showing why, at the moment of use.
- Feedback forms: one question first (optional text after); always skippable.

## Deliverables

1. Named trigger event + eligibility function with tests
2. Prompt UI on the lightest surface + permanent Settings entry
3. The four step-5 outcomes confirmed
