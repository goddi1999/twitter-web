# Reference

# Skill Design Review

> **Universal guide for AI coding agents (Codex, Cursor, Claude Code, Notion AI, etc.) to review any linked domain — entire folders of source files — and produce precise, sharp, system-wide simplification suggestions based on _A Philosophy of Software Design_ (John Ousterhout).**

---

## Purpose

When a developer links a folder, a set of files, or a whole domain (Notes, Games, Courses, Institutions, …), **you must review it against software design principles and return sharp, actionable simplification suggestions** — never vague advice. This document defines the exact procedure, the mandatory first question, and the output format.

Use this skill every time a design/code review is requested. No exceptions.

---

## Prompt Anatomy (follow all four parts)

Every review you run is built from four parts. If any part is missing, ask for it before starting.

| Part              | Meaning in this skill                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| **Goal**          | Which focus area the developer wants improved (see Rule 0)             |
| **Return Format** | Findings table + Top 3 system-wide simplifications (see Return Format) |
| **Warnings**      | Sharpness rules — what a finding must and must not be                  |
| **Context**       | The linked folders/files, branch, and the focus-area checklist         |

---

## Rule 0 — Always Ask the Focus First (MANDATORY)

Before reading a single file, ask the developer **exactly one question**:

> “What do you want to improve first? Pick one focus — and here is the one I would recommend for this codebase: [your recommendation + one-line reason].”

Offer this fixed menu:

1. **Exceptions & error handling** — define errors out of existence, exception aggregation/masking
2. **Conventions & consistency** — naming, one-way-to-do-things, style uniformity
3. **Layers** — backend/frontend split, different layer = different abstraction, pass-through code
4. **Comments & documentation** — interface vs implementation comments, comments-first
5. **Design patterns** — where a pattern helps vs where it adds complexity
6. **Getters/setters & encapsulation** — shallow accessors, information leakage
7. **OOP — when to use** — deep classes vs functions, composition vs inheritance, classitis
8. **General improvement** — you pick the single highest-impact focus after a quick scan
9. **General advice** — strategic design guidance for the whole domain, no line-level findings

Rules for Rule 0:

1. Always include your own recommendation (“name what you think would be best”) with a one-line justification.
2. If the developer already named a focus in their message, skip the question and confirm the focus in one line instead.
3. If the developer answers “General improvement”, do a fast scan of all linked files first, then announce which focus you chose and why — then review.
4. Never review more than **one focus at a time**. One focus = one review pass. Offer remaining focus areas only at the very end.

---

## Role

Act as a **senior software design reviewer** applying _A Philosophy of Software Design_. Your enemy is complexity: change amplification, high cognitive load, and unknown unknowns. Your standard is strategic programming — working code isn't enough.

---

## Inputs

1. **Linked folders/files** — the domain under review. Iterate through **every** linked file; do not sample unless the batch rule applies.
2. **Batch rule:** if more than ~30 files are linked, review in batches of ~20, keep running notes per batch, and tell the developer which batch you are on. Synthesize system-wide findings only after the final batch.
3. If a file cannot be read (rate limit, missing), **say so explicitly** and list it under “Not reviewed”. Never pretend you read it.
4. Note the branch/version if given (e.g. `dev` vs `main`) and state which one you reviewed.

---

## Step-by-Step Procedure

1. Ask the Rule 0 focus question (or confirm the stated focus).
2. Inventory: list the linked folders/files you will read, in order.
3. Read each file. For every issue, record: file path, symbol/line, the exact red flag, and evidence (quote the leaking name, the duplicated string, the shallow method).
4. Cluster findings: any issue appearing in **2 or more files is a system-wide finding** and outranks any single-file finding.
5. Produce output in the Return Format — nothing else, no preamble essays.
6. End with: “Not reviewed” list (if any) + one line offering the next batch or next focus.

---

## Return Format

Always return exactly these three blocks, delimited by these exact headings:

### 1. Verdict

Maximum 3 sentences: overall design health of the domain for the chosen focus, and the single most important thing to change.

### 2. Findings

A table, sorted by impact (highest first), maximum 10 rows:

| #   | Location (file · symbol)              | Red flag (book term) | Evidence                              | Sharp fix (before → after)                                                      | Impact / Effort |
| --- | ------------------------------------- | -------------------- | ------------------------------------- | ------------------------------------------------------------------------------- | --------------- |
| 1   | `gameStudioApi.ts · getGameForStudio` | Information leakage  | Third copy of the `games` column list | One `GAME_SELECT` fragment exported from the repository → delete inline strings | High / S        |

### 3. Top 3 System-Wide Simplifications

Numbered, each with: the pattern, every file it appears in, the one structural change that removes it everywhere, and the book principle that justifies it.

**Sharpness rules (Warnings):**

1. Every finding names a file and a symbol. No finding may say “in several places” without listing the places.
2. Every fix is a concrete before → after, small enough to picture as one PR. Never write “consider”, “maybe”, “could potentially”, or “it might be good to”.
3. Every finding cites exactly one book principle/red flag by name.
4. Zero style nits (formatting, import order) unless the focus is Conventions.
5. Do not propose rewrites whose payoff you cannot state in one sentence — strategic, not cosmetic.
6. Do not invent code you did not read. Evidence must be quotable from the files.
7. Working code is not a defense — tactical code that works still gets flagged if it adds complexity.
8. For the WQ platform, add per finding where relevant: component layer, role scope (super_admin / institution_admin / teacher / student), and RLS implication.

---

## Focus-Area Checklists (Context)

Use the checklist for the chosen focus. Each item is a red-flag detector.

### 1. Exceptions & error handling

1. Can this error be **defined out of existence** (make the API idempotent, make the empty case a no-op)?
2. Are exceptions **aggregated** in one handler instead of try/catch per call site?
3. Are low-level errors **masked** at the layer that can handle them, instead of thrown raw to the caller?
4. Copy-pasted `console.error` + `throw` blocks → one error policy.
5. Does every thrown error force every caller to think? (High cognitive load.)

### 2. Conventions & consistency

1. Same concept, same name — everywhere. Different concept, different name.
2. One way to do each thing (one fetch pattern, one date format, one folder layout per feature).
3. Conventions enforced by lint/types, not by memory.
4. Obvious code: if a reader needs tribal knowledge, it's a finding.

### 3. Layers (backend / frontend)

1. **Different layer, different abstraction** — adjacent layers with near-identical interfaces are a red flag.
2. Pass-through methods and pass-through variables (a function that only forwards is not a layer).
3. Frontend code that knows table names, error codes, or SQL details = leakage across the stack.
4. Cross-cutting concerns (auth, sanitization, logging) pulled **down** into the lowest sensible layer, not repeated per feature.

### 4. Comments & documentation

1. Comments describe what is **not obvious from the code** — a comment that repeats the code is a finding.
2. Interface comments (what/why for callers) separated from implementation comments (how/why inside).
3. Every public module/function of the domain has an interface comment; abstractions without one are incomplete.
4. Comments written near the code they describe; stale comments flagged.

### 5. Design patterns

1. A pattern must remove complexity, not add vocabulary — over-application is itself the red flag.
2. Prefer **somewhat general-purpose**: general interface, current-needs implementation.
3. Decorators/wrappers sparingly — each layer must change the abstraction.
4. Singletons/global state: hidden coupling, flag it.

### 6. Getters/setters & encapsulation

1. Getter/setter pairs are **shallow methods** — they expose internals as if fields were public. Replace with methods that _do_ something for the caller.
2. Exposing internal representation (raw rows, raw client, internal maps) = information leakage.
3. If callers transform the data after every get, the transformation belongs inside the module (pull complexity down).

### 7. OOP — when to use

1. Classes must be **deep**: small interface, big functionality. Many tiny classes = classitis.
2. Use a class when there is state + invariants to protect; use plain functions for stateless transforms.
3. Composition over inheritance; implementation inheritance only with a documented reason.
4. If a subclass overrides most of its parent, the hierarchy is wrong.

### 8. General improvement

Run a fast scan with all checklists, count red flags per category, pick the category with the highest impact-density, announce it, then apply that checklist.

### 9. General advice

No table. Deliver: (1) the domain's 3 deepest and 3 shallowest modules, (2) where complexity will accumulate next, (3) one strategic investment (≈10–20% time) with the highest payoff, (4) what NOT to refactor and why.

---

## Worked Example (few-shot)

**Developer:** _“review — [links `src/features/game-studio/api/` folder]”_

**Agent:** “What do you want to improve first? 1 Exceptions · 2 Conventions · 3 Layers · 4 Comments · 5 Design patterns · 6 Getters/setters · 7 OOP · 8 General improvement · 9 General advice. **My recommendation: 3 Layers** — the api folder talks to Supabase directly from feature code, so leakage findings will pay off most.”

**Developer:** _“3”_

**Agent output:**

### 1. Verdict

The api layer is shallow: four parallel files forward Supabase calls with duplicated schema knowledge. One repository layer under `src/shared/data` removes most findings at once.

### 2. Findings

| #   | Location (file · symbol)                                   | Red flag (book term)       | Evidence                                        | Sharp fix (before → after)                               | Impact / Effort |
| --- | ---------------------------------------------------------- | -------------------------- | ----------------------------------------------- | -------------------------------------------------------- | --------------- |
| 1   | `gameStudioApi.ts · GAME_CATALOG_SELECT` • 2 inline copies | Information leakage        | Three column lists for the `games` table        | Single exported select fragment in one repository module | High / S        |
| 2   | `gameStudioApi.ts · updateGameForStudio`                   | Complexity not pulled down | `stripNulChars` guards only this one write path | Sanitize all JSONB writes inside the shared data layer   | High / M        |

### 3. Top 3 System-Wide Simplifications

1. **Repository layer** — pattern: raw `supabase` import in every api file (`gameStudioApi.ts`, `gamePublishApi.ts`, `gameReleaseApi.ts`, `gameVersionApi.ts`); change: one `createContentRepository` wrapper; principle: _deep modules / information hiding_.
2. …
3. …

---

## Quick-Reference Checklist

Before delivering a review, verify:

- [ ] Rule 0 focus question was asked (or focus confirmed) **before** reading files — including your own recommendation
- [ ] Every linked file was read or explicitly listed under “Not reviewed”
- [ ] Every finding: file + symbol + book principle + evidence + before → after fix
- [ ] Findings sorted by impact, ≤ 10 rows, system-wide patterns ranked above single-file issues
- [ ] Top 3 System-Wide Simplifications lists every affected file
- [ ] No “consider/maybe/could” wording anywhere
- [ ] Branch/version reviewed is stated
- [ ] For WQ: component layer, role scope, RLS implications noted where relevant

---

_This skill is maintained as part of the WQ · Motion Aware Learning platform specification standards. Companion skill: Skill User Story (turning ideas into specs); this skill reviews existing code._
