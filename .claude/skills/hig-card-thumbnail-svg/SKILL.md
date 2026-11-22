---
name: hig-card-thumbnail-svg
description: 'Generate an Apple-HIG-style 1024×576 card thumbnail SVG from a lucide icon name plus one of the 11 WQ colors, written into src/assets/svgs/hig-card-thumbnails-svg/. Use whenever the user names a lucide icon and a color and wants a thumbnail, card, or cover SVG.'
---

## What you get

One `.svg` file per call: a full-bleed 3-stop diagonal gradient in the named color, with the lucide icon centered on top in a very pale tint of the same hue, under a soft drop shadow. Same chrome as the nine cards already in `src/assets/svgs/hig-card-thumbnails-svg/` — a new card must be indistinguishable in weight and treatment from `foundations-accessibility.svg`.

## Input

The user says an icon and a color: `user green`, `"make me a blue book-open card"`, a lucide URL like `https://lucide.dev/icons/circle-alert`.

- **Icon** — a lucide icon name in kebab-case (`user`, `book-open`, `circle-alert`). The last path segment of a lucide.dev URL is exactly this name.
- **Color** — one of the 11 names in the table below. Nothing else is a valid color; if the user names something outside the table, ask which of the 11 they mean rather than inventing a palette.
- **Filename** (optional) — defaults to the icon name (`user` → `user.svg`). If the user names a slug ("call it foundations-profiles"), use that instead. Never overwrite one of the nine existing cards.

## Step 1 — get the icon geometry

Read the icon out of the installed lucide, never from memory and never from the network:

```bash
cat node_modules/lucide-react/dist/esm/icons/<icon-name>.mjs
```

That file holds an `__iconNode` array — the exact geometry the app renders (lucide-react 1.17.0):

```js
const __iconNode = [
  ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
  ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
]
```

Each entry becomes one SVG element: the tag name verbatim, every attribute verbatim, **minus `key`**. Copy the numbers exactly — never redraw, round, simplify, or "improve" path data.

If the file does not exist, the icon name is wrong. Find the real one instead of guessing:

```bash
ls node_modules/lucide-react/dist/esm/icons/ | grep -i <fragment>
```

Some icons carry their own `fill` — if an attribute value is `currentColor`, replace it with the glyph hex; leave every other attribute alone.

## Step 2 — get the colors

Every card's palette is derived from one `--oklch-*` token in `src/index.css`. The values are precomputed here — use the table, do not recompute:

| color    | stop 0    | stop 1    | stop 2    | glyph     |
| -------- | --------- | --------- | --------- | --------- |
| `violet` | `#9A66EF` | `#B571F8` | `#D17DFF` | `#F9EAFF` |
| `indigo` | `#597BE5` | `#7686F5` | `#9391FF` | `#E7F0FF` |
| `blue`   | `#009AE1` | `#36A6F7` | `#5EB2FF` | `#D7F6FF` |
| `cyan`   | `#00ACC3` | `#00BADC` | `#00C7F5` | `#CDFBFF` |
| `teal`   | `#00AC8F` | `#00BCAB` | `#00CBC7` | `#CDFDF6` |
| `green`  | `#46AF44` | `#38C265` | `#24D485` | `#DBFCE0` |
| `lime`   | `#98B000` | `#95C500` | `#8FDA3E` | `#EAF8D4` |
| `orange` | `#F46E04` | `#FF8400` | `#FF9A00` | `#FFEAD3` |
| `pink`   | `#ED598A` | `#FF698A` | `#FF7A89` | `#FFE5EA` |
| `red`    | `#D00015` | `#E40000` | `#F60000` | `#FFE6E0` |
| `yellow` | `#DA9800` | `#DEAF00` | `#E0C600` | `#FCF2CD` |

The rule behind the table, for adding a twelfth color later. Given `--oklch-<name>: L C H`:

- stop 0 = `oklch(L−0.13, C×1.1, H−7)` · stop 1 = `oklch(L−0.08, C×1.1, H)` · stop 2 = `oklch(L−0.03, C×1.1, H+7)`
- glyph = `oklch(0.96, 0.05, H)`

The −0.08 shift exists because the raw tokens are pastel: at token lightness a pale glyph on `yellow` or `lime` washes out. Deepening the card keeps every hue at ΔL ≥ 0.19 against its glyph, which is the contrast the existing nine cards carry.

## Step 3 — fill the template

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 576" width="1024" height="576">
  <defs>
    <linearGradient id="bg" gradientUnits="userSpaceOnUse" x1="0" y1="576" x2="1024" y2="0">
      <stop offset="0" stop-color="STOP_0"/>
      <stop offset="0.5" stop-color="STOP_1"/>
      <stop offset="1" stop-color="STOP_2"/>
    </linearGradient>
    <filter id="ds" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1024" height="576" fill="url(#bg)"/>
  <g filter="url(#ds)">
    <g transform="translate(320 96) scale(16)" fill="none" stroke="GLYPH" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ICON_ELEMENTS
    </g>
  </g>
</svg>
```

Fixed decisions baked into the template — do not vary them per card:

- **Canvas** 1024×576 with matching `width`/`height`, so the file drops into an `<img>` without extra sizing.
- **Gradient runs bottom-left → top-right** (`y1="576"` → `y2="0"`). Light reads as coming from above, which agrees with the `dy="5"` shadow. The three `platforms-*` cards run the other way; they are the older family — do not copy them.
- **`translate(320 96) scale(16)`** maps the 24×24 lucide box to 384×384 centered on (512, 288).
- **`stroke-width="2"` lives inside the scaled group**, so it renders at 32px — the weight the existing cards use (30–42).
- **The filter sits on the outer `<g>`, the transform on the inner one.** This is the one real trap: put `filter` on the scaled group and `stdDeviation="9"` is interpreted in icon space, blurring at 9×16 = 144px and smearing the card. Two groups, always.
- Two-space indent, no trailing newline drama, no `<title>`, no comments — match the existing files byte-for-byte in style.

## Step 4 — write and verify

Write to `src/assets/svgs/hig-card-thumbnails-svg/<name>.svg`, then check:

```bash
python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1]); print('valid')" src/assets/svgs/hig-card-thumbnails-svg/<name>.svg
```

Then confirm, by reading the file back:

1. Exactly three `<stop>` elements, and the hexes match the table row for the requested color.
2. Every `__iconNode` entry made it in, with no `key` attributes left behind.
3. `filter="url(#ds)"` is on the outer group, `transform=` on the inner one.
4. Nothing else in `hig-card-thumbnails-svg/` changed.

Report the path and the color used. If you can render, show the user the card; otherwise say plainly that it was not visually checked.

## Worked example — `user` + `green`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 576" width="1024" height="576">
  <defs>
    <linearGradient id="bg" gradientUnits="userSpaceOnUse" x1="0" y1="576" x2="1024" y2="0">
      <stop offset="0" stop-color="#46AF44"/>
      <stop offset="0.5" stop-color="#38C265"/>
      <stop offset="1" stop-color="#24D485"/>
    </linearGradient>
    <filter id="ds" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1024" height="576" fill="url(#bg)"/>
  <g filter="url(#ds)">
    <g transform="translate(320 96) scale(16)" fill="none" stroke="#DBFCE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </g>
  </g>
</svg>
```

## Out of scope

Registering the card anywhere. These SVGs are plain assets — nothing in `src/` imports the folder today. Generate the file, report the path, stop there unless the user asks for wiring.
