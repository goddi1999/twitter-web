---
name: hig-navigation
description: Pick the navigation container — tab bar, navigation stack, or sidebar/split view — from the app's information structure, and keep users oriented. Use when adding top-level sections, routes, a tab bar, sidebar, back button, or breadcrumbs.
---

# HIG Navigation

## What It Does

Stops agents mixing navigation models (tabs inside drawers, hamburger menus hiding primary sections, back buttons that jump sideways). HIG maps structure to container: **flat** peers → tab bar; **hierarchical** drill-down → navigation stack with back; **wide screens with many sections** → sidebar + split view. The user must always be able to answer "where am I, and how do I get back?"

## When to Reach for It

- Adding a top-level section or route, a tab bar, sidebar, header with back, or breadcrumbs
- Reviewing an app where users get lost or the back button misbehaves

Do **not** use for sheets/dialogs (**hig-modality**) or in-screen hierarchy (**hig-layout-hierarchy**).

## Prerequisites & Seams

- The route tree (`src/pages`, router config) and the list of top-level sections
- Browser pane at `375×812` and `1280×800`

## Process

1. **Draw the structure.** List routes as a tree: top-level sections, then drill-down levels. Signal: a tree in the reply; every route has one parent.
2. **Choose the container per size.** Signal: one model named per breakpoint.
   - Phone: 2–5 flat top-level sections → **bottom tab bar**. > 5 → 4 tabs + a `More` tab, or merge sections. Only 1 section → no tab bar, just a stack.
   - Tablet/desktop: same sections become a **sidebar** (collapsible); list → detail becomes a **split view** (list column + detail column) when width ≥ ~1024px.
   - Inside each section: a **navigation stack** (header with title + back to parent).
3. **Make tabs stable.** Tabs are always visible at top level, never change order, never act as actions (no "+" tab that opens a modal unless it is the app's single primary create action), and each tab keeps its own stack and scroll position. Re-tapping the active tab pops to its root. Signal: switch tab → drill down → switch away → switch back restores the same depth and scroll.
4. **Make back honest.** Back always goes to the hierarchical parent within the current section; label it with the parent's title (or chevron only on phone if long). The browser/OS back matches the in-app back. Signal: for every route, in-app back and browser back land on the same screen.
5. **Show location.** Header title = current screen; active tab/sidebar item highlighted (not by colour alone); deep hierarchies on desktop may add breadcrumbs. Signal: on any screen a screenshot alone tells which section and level you are in.
6. **Verify.** Walk every top-level section to its deepest route on both sizes, using back, browser back, deep link reload, and tab re-tap. Signal: no dead ends; deep-link reload shows the correct tab/sidebar selection and a working back.

## Rules & Constraints

- **Never** hide primary top-level sections behind a hamburger menu on phone when ≤ 5 exist.
- **Never** use a tab bar for actions, filters, or in-page segments — use a segmented control for those.
- **Never** hide the tab bar on drill-down screens except for immersive/full-screen tasks.
- **Never** let back jump across sections or reset another tab's stack.
- **Never** nest a tab bar inside a tab bar.
- Tab items: icon + short label (1 word), ≥ 44×44 hit area, safe-area bottom padding.
- Sidebar items and tab items map 1:1 to the same sections across breakpoints.

## Deliverables

1. Route tree + container choice per breakpoint
2. Navigation implemented with per-tab stacks and honest back
3. Step-6 walk-through results on `375×812` and `1280×800`
