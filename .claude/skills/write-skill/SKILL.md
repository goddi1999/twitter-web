---
name: write-skill
description: Author or prune agent skills (one failure mode, progressive disclosure). Use when writing, reviewing, or splitting a skill.
---

# Write Skill

## What It Does

Turns engineering discipline into a portable, folder-based instruction set. A skill is not a prompt: a prompt asks for an outcome; a skill enforces a **process**. Output may differ every run — the process must not.

Closes **one** operational failure mode. If it closes two, it is two skills.

## When to Reach for It

- Writing a new skill from scratch
- An existing skill has grown past one responsibility and needs splitting
- An agent keeps failing the same way and no skill covers that failure
- Reviewing a skill for pruning and naming

**Do not** use this for project docs, ADRs, glossaries, or user stories — those are outputs a skill may produce, not skills.

## Prerequisites & Seams

Name these four in one sentence each before writing. If you cannot, stop.

1. **Failure mode** — what goes wrong today, concretely (no "and")
2. **Invocation mode** — user-invoked or model-invoked (see Rules)
3. **Feedback loop** — what proves each step succeeded (test, type-check, diff, browser)
4. **Done state** — which files or state exist when complete

## Process

1. **Name the failure mode** in one sentence. Reject anything that needs "and".
2. **Check overlap.** If an existing skill under `.agents/skills/` covers ~70%, extend that skill instead.
3. **Choose invocation mode.** Set frontmatter: user-invoked → `disable-model-invocation: true`; model-invoked → omit it.
4. **Write the description first.** Trigger only. Model-invoked descriptions are billed every turn — pay per word.
5. **Draft the workflow as a numbered loop.** Every step ends in a checkable signal.
6. **Write guardrails as prohibitions** ("Never X"). Include destructive commands the agent must never run.
7. **Push depth downward.** Anything not needed for the next action → `reference.md`. Project facts → `CONTEXT.md`, never inside a portable skill.
8. **Prune with the no-op test.** Delete any line that would not change model behaviour if removed.
9. **Create the folder** at `.agents/skills/<skill-name>/` (folder name = command). Required: `SKILL.md`. Optional: `reference.md`, `scripts/`, `agents/openai.yaml`.
10. **Register it** in `.agents/README.md` (All skills + Quick router if relevant).
11. **Verify.** SKILL.md has the seven body sections below; description is third-person WHAT+WHEN; no-op test passed; two real runs share the same process (different outputs OK).

### Required SKILL.md body sections

```markdown
## What It Does

## When to Reach for It

## Prerequisites & Seams

## Process

## Rules & Constraints

## Deliverables
```

(Plus YAML frontmatter: `name`, `description`; optional `disable-model-invocation`.)

## Rules & Constraints

- **Never** close two failure modes in one skill.
- **Never** add `disable-model-invocation` to a skill meant for automatic discovery.
- **Never** explain a concept the model already knows — name it (**Red-Green-Refactor**, **Tracer Bullet**, **Deep Modules**, **Design Tree**, **vertical slice**, **seam**).
- **Never** write a step without a way to verify it.
- **Never** let `SKILL.md` hold reference material a step does not need.
- Prefer "Never X" over "try to avoid X".
- Cap interview-style skills (questions per round).
- Folder name matches the command exactly.
- Model-invoked description = trigger only. User-invoked tax = human forgetting → keep the README router current.

| Dimension    | User-invoked                       | Model-invoked                         |
| ------------ | ---------------------------------- | ------------------------------------- |
| Invocation   | Explicit `/skill-name`             | Agent reaches when context fits       |
| Frontmatter  | `disable-model-invocation: true`   | Omitted                               |
| Context cost | Zero on ordinary turns             | Description in window every turn      |
| Primary job  | Orchestration, interview, commands | Reusable discipline, strict procedure |

## Deliverables

1. `.agents/skills/<skill-name>/SKILL.md` with valid frontmatter and the seven body sections
2. Optional `reference.md` / `scripts/` / `agents/openai.yaml`
3. Entry in `.agents/README.md` (and router row if useful)
4. New domain terms in `CONTEXT.md` if any
5. Evidence of two runs with a stable process

For catalogue examples, shared repo paths, and sources, read [reference.md](reference.md) only when needed.
