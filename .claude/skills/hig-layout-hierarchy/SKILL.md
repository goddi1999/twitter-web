---
name: hig-layout-hierarchy
description: Give a screen one clear reading order — primary content first, related items grouped, secondary detail progressively disclosed. Use when laying out or reviewing a screen, card, settings page, or detail view that feels flat or crowded.
---

# HIG Layout Hierarchy

## What It Does

Stops screens where every element has the same weight and everything is shown at once. HIG Layout: the most important content is the largest/highest/most contrasted; related things are grouped by proximity and containers; detail the user doesn't need yet is disclosed on demand; content respects safe areas and readable widths.

## When to Reach for It

- Laying out a new screen or component with more than ~5 elements
- Reviewing a screen that "feels busy", flat, or where users miss the main action

Do **not** use for choosing which laws apply (**ux-laws**), navigation containers (**hig-navigation**), or notch/home-indicator CSS (**mobile-native**, safe areas).

## Prerequisites & Seams

- The screen's purpose in one sentence and its single primary action
- Design tokens for type scale, spacing, and colour in `src/index.css`

## Process

1. **Rank the content.** List every element on the screen and tag it **1 primary** (exactly one task/content focus), **2 supporting**, **3 secondary/rare**. Signal: one tag-1 item; tag-3 items listed.
2. **Express rank visually.** Tag 1: top of the reading order, largest type step or largest area, strongest contrast; the primary action is the only filled/prominent button. Tag 2: normal body weight. Tag 3: smaller, lower contrast, or moved (step 4). Use ≤ 3 type sizes and ≤ 2 weights on the screen. Signal: squint test — a blurred screenshot shows the tag-1 item first.
3. **Group by relationship.** Put related items in one group (section header, card, or inset list); spacing inside a group < spacing between groups (e.g. 8px vs 24px). Order groups by frequency of use. Signal: every element belongs to a named group; no orphan controls.
4. **Disclose progressively.** Move tag-3 items behind a disclosure: "Show more", an expandable row, a detail push, or a `⋯` menu. Keep defaults sensible so most users never open it. Signal: the default view shows only tag 1 and 2; tag 3 is reachable in one tap.
5. **Respect the edges.** Content inside safe areas (delegate CSS to **mobile-native**); readable line length 45–75 characters (cap text columns ~65ch on desktop); consistent side margins (16px phone, wider on larger); align to one grid. Signal: no text touches an edge, notch, or home indicator; text columns ≤ 75ch.
6. **Verify.** Screenshots at `375×812` and `1280×800`, plus 200% text zoom and dark mode. Signal: rank order and grouping survive every variant; nothing clips or overlaps.

## Rules & Constraints

- **Never** have two primary (filled) buttons on one screen.
- **Never** signal hierarchy by colour alone — pair with size, weight, or position.
- **Never** put a group in a card just to add decoration; a container must mean "these belong together".
- **Never** hide something the majority needs behind disclosure — only tag-3 items.
- **Never** nest cards inside cards.
- Use the spacing scale only (no one-off margins); align left edges within a group.
- Desktop shows more at once than phone, but the rank order stays the same.

## Deliverables

1. The ranked element list (1/2/3) with groups
2. Updated layout implementing rank, groups, and disclosure
3. Screenshots for the four step-6 variants
