# Mobile Keyboard Layout — reference

Read a section only when a step in `SKILL.md` points here.

## Viewports

- **Layout viewport** — the area CSS lays out against.
- **Visual viewport** — what the user can see right now.

| Browser        | Keyboard opens →                                           | Consequence                                              |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| iOS Safari     | Only the visual viewport shrinks; layout stays full height | `position: fixed; bottom: 0` ends up behind the keyboard |
| Android Chrome | Layout viewport resizes (default)                          | Fixed bottom bars ride up on the keyboard                |

Make Chromium resize the layout explicitly:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
/>
```

iOS Safari ignores `interactive-widget`, so Pattern B still needs the inset hook below.

## Keyboard attributes

| Data             | `type`     | `inputMode` | `autoComplete`                        | `enterKeyHint` | Extra                                                           |
| ---------------- | ---------- | ----------- | ------------------------------------- | -------------- | --------------------------------------------------------------- |
| Email            | `email`    | `email`     | `email`                               | `next` / `go`  | `autoCapitalize="off"` `autoCorrect="off"` `spellCheck={false}` |
| Password (login) | `password` | —           | `current-password`                    | `go`           | —                                                               |
| Password (new)   | `password` | —           | `new-password`                        | `done` / `go`  | —                                                               |
| One-time code    | `text`     | `numeric`   | `one-time-code`                       | `done`         | `pattern="[0-9]*"`, no autocorrect                              |
| Phone            | `tel`      | `tel`       | `tel`                                 | `next`         | —                                                               |
| Name             | `text`     | `text`      | `given-name` / `family-name` / `name` | `next`         | keep autocapitalize                                             |
| Amount           | `text`     | `decimal`   | `off`                                 | `done`         | —                                                               |
| Search           | `search`   | `search`    | `off`                                 | `search`       | —                                                               |
| URL              | `url`      | `url`       | `url`                                 | `go`           | no autocapitalize                                               |
| Chat message     | `text`     | `text`      | `off`                                 | `send`         | —                                                               |

Order fields by keyboard type (all text, then all numbers) so the keyboard does not flip layouts on every field.

## Tap instead of type

| Data               | Use instead of a text field |
| ------------------ | --------------------------- |
| 2–5 options        | Segmented control or chips  |
| 6–15 options       | Radio list or bottom sheet  |
| 15+ options        | Searchable list (typing OK) |
| Small number range | Stepper (− / +)             |
| Continuous value   | Slider + value label        |
| Date               | Native `type="date"`        |

## Keyboard inset hook

For Pattern B on iOS. No dependency. Throttle with `requestAnimationFrame` if re-renders show up.

```tsx
import { useEffect, useState } from 'react'

/** Keyboard height in px; 0 when closed. Treat > 150 as open (smaller = browser toolbar). */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    function update() {
      const covered = window.innerHeight - viewport!.height - viewport!.offsetTop
      setInset(Math.max(0, Math.round(covered)))
    }

    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    update()
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}

// Pattern B composer:
// <div className="fixed inset-x-0" style={{ bottom: inset }}>…</div>
```

Focused field below the fold: after ~300 ms (keyboard animation), `el.scrollIntoView({ block: 'center' })`.

## Worked examples

**Pattern A — one-question answer (Mentimeter word cloud).** Keyboard closed: logo, question, field (with character counter inside), hint "You may submit multiple responses", Submit button, then decorative footer (heart, share code, links). Keyboard open: question, field, hint and Submit all stay above the keyboard because they live in the top half; only the decorative footer is covered. The visible-zone rule passes without any JS.

**Pattern A — login.** Email + Password + primary button directly under the last field; secondary links (sign up, forgot password) below the button may be covered. Errors render as one line under the button, not as a toast.

**Pattern B — answer task with an image (serious game).** Keyboard closed: large image on top, question, answer field. Keyboard open: image collapses to a thumbnail strip (tap to enlarge), question stays visible, answer field docks on the keyboard via `useKeyboardInset`, `enterKeyHint="send"` submits. Feedback shows inline under the field, never in a modal over the keyboard area.

## Test matrix

| Device                       | Portrait closed | Portrait open                                              | Landscape open    |
| ---------------------------- | --------------- | ---------------------------------------------------------- | ----------------- |
| Browser pane (Android model) | 375×812         | 375×400                                                    | 812×300           |
| Browser pane (iOS model)     | —               | at 375×812: field error slot + primary action bottom ≤ 432 | at 812×375: ≤ 160 |
| Real iPhone (Safari)         | ✓               | ✓                                                          | ✓                 |
| Real Android (Chrome)        | ✓               | ✓                                                          | ✓                 |

Each open cell: focus every field in turn; the label/context, field, error/hint, and next action are all visible.

## Sheets

Every `Dialog` in this app renders as a vaul bottom drawer, so one rule covers both.

| Decision                  | Value                                                               | Why                                                                                        |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Height on phones (`< md`) | `h-[90dvh]` on bottom `DrawerContent`                               | Same size for every sheet; the top 10% shows the page behind, so it still reads as a sheet |
| Content position          | Top-anchored (`flex-col`, no centering, no `mt-auto` on the action) | The keyboard covers the bottom ~50%; fields and the action live in the top half            |
| Primary action            | Pill directly under the last field                                  | Visible with the keyboard open; no fixed footer                                            |
| Overflow                  | Body `overflow-y-auto overscroll-contain` inside the sheet          | Long sheets scroll inside; the page behind never moves                                     |
| `repositionInputs`        | `false` (app default in `src/components/ui/drawer.tsx`)             | vaul would lift the tall sheet by the keyboard height and hide its title and first field   |
| Desktop (`≥ md`)          | Content height, `max-h-[90dvh]`                                     | No keyboard; a short sheet stays short                                                     |

Check: open the sheet at `375×812`, focus the first and last field, and measure `getBoundingClientRect().bottom` of the field and the action pill — both **≤ 432**.
