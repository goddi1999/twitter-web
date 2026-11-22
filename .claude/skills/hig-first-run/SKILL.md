---
name: hig-first-run
description: Get users from launch to real content without gates — no upfront sign-up, tutorial carousel, or blank spinner. Use when building or reviewing app launch, first-run, onboarding, or loading states.
---

# HIG First Run

## What It Does

Stops the first seconds of an app from blocking the user. Agents default to a splash → sign-up wall → 4-slide tutorial → full-screen spinner. Apple HIG (Onboarding, Launching, Loading) says the opposite: launch straight into the real interface, teach in context, ask for an account only when a feature needs one, and show structure while data loads.

## When to Reach for It

- Building the app entry route, a first-run flow, an onboarding sequence, or any loading state
- Reviewing why "the app takes forever to get useful"

Do **not** use for in-flow sheets and alerts (**hig-modality**), or for permission/rating prompt timing (**hig-feedback-prompts**).

## Prerequisites & Seams

- The entry route and the first screen with real content
- The list of features that genuinely require an account
- Browser pane with network throttling (Slow 4G) for step 5

## Process

1. **Count taps to value.** From cold launch, count taps/screens until the user sees or does the app's core thing. Signal: a number. Target **0** (content on first screen); **≤ 1** if a single choice is required to personalise.
2. **Remove the account gate.** Move sign-up/sign-in to the moment a feature needs it (save, sync, share, purchase). Keep a guest path; carry guest state into the new account. Signal: every gated action is listed with the feature that triggers sign-in; the first screen has none.
3. **Replace tutorials with in-context teaching.** Delete carousels that explain the UI. Teach with an empty state that names the first action, a one-time inline hint at the control, or a sample item. Onboarding that remains: ≤ 3 screens, each skippable, each asking for a decision or giving value (not describing buttons). Signal: no screen whose only content is an explanation of UI.
4. **Make launch look like the app.** The launch/first paint is the app's chrome (header, tab bar, layout) with no logo splash, no "Welcome", no ads. Signal: the first paint and the loaded screen share the same layout boxes (no layout jump > 0 in CLS).
5. **Show structure while loading.** Content areas use skeletons matching final layout; long operations (> 2s) show determinate progress where the total is known; the rest of the UI stays usable. Never a full-screen spinner for partial data. Signal: under Slow 4G, a screenshot at 500ms shows chrome + skeletons, not a blank or spinner-only screen.
6. **Verify.** Clear storage, cold-load at `375×812`, record the sequence of screens. Signal: step-1 count met; steps 2–5 signals all hold.

## Rules & Constraints

- **Never** require an account before showing content unless the app has no value without one (e.g. a bank) — then say so explicitly.
- **Never** ship a splash screen with a logo, tagline, or timer.
- **Never** show permission requests (notifications, location, camera) on launch — ask when the feature is first used, with context.
- **Never** show a skippable tutorial without a visible Skip on every screen.
- **Never** block the whole UI with a spinner when only one region is loading.
- **Never** fake progress (bars that loop or stall at 99%).
- Spinners only for waits < 2s with unknown length; delay showing them ~300ms so fast loads show nothing.
- Respect `prefers-reduced-motion` on skeleton shimmer.

## Deliverables

1. Taps-to-value count before → after
2. The gated-action list (action → feature that triggers sign-in)
3. Entry route + loading states changed; Slow-4G cold-load screenshots at 0.5s and loaded
