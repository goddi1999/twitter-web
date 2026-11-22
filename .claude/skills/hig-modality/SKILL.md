---
name: hig-modality
description: Choose between navigation push, sheet, alert, popover, and full-screen modal by the task, not by habit. Use when adding a dialog, drawer, sheet, popup, confirmation, or new screen to a flow.
---

# HIG Modality

## What It Does

Stops agents reaching for a modal dialog by default. A modal interrupts and traps the user; HIG reserves it for a **self-contained task** the user must finish or abandon. Everything else is a navigation push (part of the hierarchy) or a non-modal surface. This skill picks the right container for each new surface and makes its exit unambiguous.

## When to Reach for It

- Adding any overlay, drawer, dialog, confirmation, popover, or detail screen
- Reviewing a flow with stacked modals, dead-end dialogs, or "where am I?" moments

Do **not** use for keyboard placement inside a sheet (**mobile-keyboard-layout**) or for choosing tabs vs sidebar (**hig-navigation**).

## Prerequisites & Seams

- The flow the new surface sits in, and the user's task on it
- Existing primitives in `src/components/ui` (Dialog, Drawer, Popover, AlertDialog)

## Process

1. **Classify the surface** with this decision list; stop at the first yes. Signal: one container named per surface, with the question that chose it.
   1. Is it more detail about an item in a hierarchy the user browses? → **navigation push** (route; back works)
   2. Is it a critical, short decision with ≤ 2 actions, about something that just happened or is destructive? → **alert**
   3. Is it a few quick options tied to one control (desktop/tablet)? → **popover / menu** (on phone: menu or small sheet)
   4. Is it a self-contained task (compose, edit, create, filter) the user finishes or cancels? → **sheet** (partial height if the context behind helps; large if not)
   5. Is it immersive or multi-step and context behind is irrelevant (media, camera, long create flow)? → **full-screen modal**
   6. Otherwise → it is not modal; show inline.
2. **Give it one clear exit.** Sheets/full-screen: Cancel (or close) leading, confirm action trailing, named by verb (`Save`, `Send`), not `OK`. Swipe-down/Escape/backdrop dismiss allowed **only** when nothing would be lost; otherwise confirm discard. Signal: each modal lists its exits and what happens to unsaved input on each.
3. **Keep modality shallow.** No modal opened from a modal, except an alert confirming that modal's action, or a push **inside** a sheet's own nav stack. Signal: max modal depth = 1 (+ alert).
4. **Write alerts properly.** Title says what happened/asks the question; body optional; destructive button styled destructive and never default; Cancel always present for destructive actions. Prefer undo over confirm for reversible actions. Signal: no alert whose only button is `OK` for information that could be inline or a toast.
5. **Verify.** Walk the flow at `375×812` and `1280×800` with keyboard and back button/gesture. Signal: back/Escape never leaves the user on an unexpected screen; focus returns to the trigger on close; URL reflects pushes but not sheets.

## Rules & Constraints

- **Never** use a modal for content the user browses (lists, detail pages) — push it.
- **Never** stack sheets on sheets.
- **Never** show an alert for success or info messages — inline state or a toast.
- **Never** use alerts on launch or without user action.
- **Never** let backdrop/swipe dismiss discard typed input silently.
- **Never** label buttons `Yes`/`No`/`OK` when a verb fits.
- Every modal traps focus and restores it on close; Escape closes when safe.
- One primary action per modal.

## Deliverables

1. Surface → container table with the deciding question
2. Exit list per modal (incl. unsaved-input behaviour)
3. Implementation using existing `components/ui` primitives; verified walk-through on both sizes
