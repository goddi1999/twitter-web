---
name: mobile-keyboard-layout
description: Lay out mobile input screens so the open keyboard never hides the focused field, its error, or the next action. Use when building or reviewing any screen with a text input, form, search, composer, or answer field.
---

# Mobile Keyboard Layout

## What It Does

Stops input screens from being designed only in the keyboard-closed (desktop) state. On a phone the keyboard takes 40–50% of the screen, so every input screen has **two states** and both must work. Desktop always shows the whole layout; mobile does not.

## When to Reach for It

- Building or changing any screen with a text input: login, sign-up, search, form, quiz answer, chat/comment composer
- Reviewing a screen that "works on Android but not iPhone", or where the submit button or error disappears while typing

Do **not** use for display-only screens. Use **form-validation** for the validation stack, **mobile-native** for general touch/viewport polish. **ux-laws** calls this skill (its step 4) for any screen with a text input; return the pattern (A or B) to its Law Plan.

## Prerequisites & Seams

- Two terms: **layout viewport** (what CSS lays out) vs **visual viewport** (what is visible). On iOS Safari only the visual viewport shrinks, so `fixed; bottom: 0` lands **behind** the keyboard. Android Chrome resizes the layout. Details: [reference.md](reference.md#viewports).
- Browser pane or devices to check both states.

## Process

1. **Pick the pattern** before placing anything, and name it in your reply:
   - **A — Top-anchored form**: structured data (login, profile, search, one answer). Inputs start in the **top third** and flow down; the primary button sits **directly under** the last field.
   - **Sheets (drawers, dialogs) are Pattern A.** On phones every bottom sheet is a fixed **90dvh** tall with content anchored to the **top**: title, then fields, then the one action pill directly under the last field; the body scrolls inside the sheet. Never size a sheet to its content (`h-auto`): a short sheet sits in the bottom half, exactly where the keyboard lands. Keep vaul's `repositionInputs` off (the app's `Drawer` default) so the sheet doesn't lift and push its title off screen. Details: [reference.md](reference.md#sheets).
   - **B — Bottom-docked composer**: repeated sends with context above (chat, comments, quick reply). The input docks **on top of the keyboard** via `useKeyboardInset` ([reference.md](reference.md#keyboard-inset-hook)).
     Signal: one pattern named; the screen has exactly one focus zone.
2. **Draw the keyboard-open state.** Mark everything in the bottom ~50% as covered. Decorative content (hero image, illustration, footer links) may be covered, collapse it, or shrink it to a strip. Signal: list what gets covered; nothing in that list is required to finish the task.
3. **Apply the visible-zone rule.** With the keyboard open, these four must be visible together: **label/context of the focused field, the field, its error/hint, the next action** (button or the keyboard's Enter). Signal: all four fit above the keyboard at 375×400 (see step 6).
4. **Set the keyboard per field.** `type` + `inputMode` + `autoComplete` + `enterKeyHint` (`next` on every field but the last, `go`/`done`/`send`/`search` on the last). Codes/emails/usernames: `autoCapitalize="off"`, `autoCorrect="off"`, `spellCheck={false}`. Table: [reference.md](reference.md#keyboard-attributes). Signal: every input has `enterKeyHint`; Enter on the last field submits.
5. **Replace typing with taps** where the data allows (chips, stepper, sheet, native date) — table in [reference.md](reference.md#tap-instead-of-type). Signal: every remaining text input holds free text, email, password, code, or a search term.
6. **Verify both keyboard models** — they fail differently:
   - **Android (layout resizes):** browser pane at `375×400`, then landscape `812×300`. Focus each field; screenshot.
   - **iOS (layout does not resize):** browser pane at `375×812`; measure `getBoundingClientRect().bottom` of the focused field's error slot and the primary action. Both must be **≤ 432** (812 − 336 keyboard − 44 accessory bar). Resizing the pane alone never catches this — vertically centered forms pass at 375×400 and fail on iPhone.
     Signal: the visible-zone rule holds in every screenshot and both iOS measurements are ≤ 432. Before shipping, confirm on a real iPhone (Safari) **and** Android (Chrome).

## Rules & Constraints

- **Never** put the primary action at the end of a long page or in a fixed bottom bar on a Pattern A screen — the keyboard covers it.
- **Never** show field errors in a toast, top banner, or modal — directly **under the field** only.
- **Never** mix Pattern A and B on one screen.
- **Never** vertically center a Pattern A form on mobile (`items-center` on a full-height page) — on iPhone it pushes the primary action under the keyboard. Anchor to the top (`justify-start` + top padding) below `md`; centering is fine on desktop.
- **Never** use `100vh` for screen height — `100dvh` / `100svh`.
- **Never** ship an auto-height bottom sheet with an input on mobile — 90dvh, content at the top, action under the last field.
- **Never** set input `font-size` below **16px** — iOS zooms the page on focus.
- **Never** blur/dismiss the keyboard between fields, or lose typed text when it closes.
- **Never** validate on every keystroke — on blur or submit.
- **Never** set `autoComplete="off"` on password fields; keep `current-password` / `new-password`.
- One column, full width. Side-by-side only for tiny pairs (ZIP + city, date parts).
- Label above the field. Placeholder-only is allowed **only** when the field's meaning is self-evident and the form has ≤ 2 fields (e.g. Email + Password login).
- Touch targets ≥ 44×44 px, ≥ 8px between fields.
- Buttons are fully rounded (`rounded-full`): icon-only buttons are circles, text buttons are pills — including floating action buttons and selection/action bars. **Never** ship a square or `rounded-md` button on a mobile screen.
- 1–3 fields: one screen. 4–7: one screen with group headings. 8+ or several topics: steps with progress.
- Pattern B docked elements: position with the keyboard inset, never plain `bottom: 0`; treat `inset > 150` as keyboard open.

## Deliverables

1. The screen built on one named pattern (A or B)
2. Every input with `type`/`inputMode`/`autoComplete`/`enterKeyHint`, ≥16px text, error slot under the field
3. Screenshots (or a stated check) of keyboard-closed, keyboard-open, and landscape states passing the visible-zone rule
