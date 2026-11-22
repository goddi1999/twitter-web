---
name: hig-search
description: Build search that answers while the user types — placement, suggestions, scopes, progressive filtering, and useful empty results. Use when adding or reviewing a search field, filter bar, or results list.
---

# HIG Search

## What It Does

Stops search from being a bare input plus a submit button and a "No results" page. HIG search is **progressive**: it shows something useful before typing (recents, suggestions), narrows results as each character lands, offers scopes/tokens instead of syntax, and turns an empty result into a next step.

## When to Reach for It

- Adding a search field, command palette, filterable list, or results screen
- Reviewing search that feels slow, strict, or dead-ends

Do **not** use for keyboard attributes and keyboard-open layout (**mobile-keyboard-layout**) or for general form submission (**form-validation**).

## Prerequisites & Seams

- What is searchable (fields, item types) and roughly how many items
- Whether filtering is local (in memory) or remote (needs debounce + cancellation)

## Process

1. **Place it where it is expected.** Searching the current list → field at the top of that list (scrolls with it or pinned). App-wide search → a Search tab (phone) or a field in the toolbar/sidebar top (desktop) with `⌘K`/`/` shortcut. Signal: placement named and matches one of those.
2. **Fill the pre-typing state.** On focus with empty query show recents (clearable) and/or suggestions or popular items. Signal: focused empty field never shows a blank panel.
3. **Filter progressively.** Results update per keystroke: local data immediately; remote debounced 150–250ms with the previous request aborted. Match case- and diacritic-insensitively, on prefix of any word; highlight the matched part. Signal: typing `ab` then `abc` shows narrowing results with no stale response overwriting a newer one.
4. **Offer scopes, not syntax.** If results span types (people, files, lessons), add a segmented scope or token chips; keep the query when scope changes. Signal: no instruction text asking users to type operators.
5. **Handle empty and error results.** Empty: echo the query, suggest a fix (spelling, broader scope, clear filter), offer a related action (create, browse). Error: say it, keep the query, offer retry. Signal: both states rendered and screenshotted.
6. **Verify.** Test with: empty, 1 char, a typo, a non-Latin string, a query with zero hits, slow network. Signal: each case shows a sensible state; Escape/clear button resets query and returns to step-2 state.

## Rules & Constraints

- **Never** require pressing Enter/Search to see results for local data.
- **Never** clear the query after showing results or after navigating to one and back.
- **Never** show "No results" alone.
- **Never** let an older response overwrite a newer query's results.
- Clear (×) button inside the field whenever it has text; Cancel on phone when search takes over the screen.
- Field `type="search"`, `enterKeyHint="search"`, ≥ 16px text.
- Persist recents locally; never store sensitive queries without a clear option.

## Deliverables

1. Search placement + pre-typing state + progressive results + empty/error states
2. Screenshots for the six step-6 cases
