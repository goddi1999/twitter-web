# Write Skill — Reference

Deep context for authoring skills the Matt Pocock way. Load only when a Process step needs it.

## Shared repository seams

| Path                           | Role                                                   |
| ------------------------------ | ------------------------------------------------------ |
| `docs/agents/issue-tracker.md` | Where issues live — GitHub, Linear, or local Markdown  |
| `CONTEXT.md`                   | Project domain glossary; kills agent verbosity         |
| `docs/adr/`                    | Architecture Decision Records, updated during grilling |
| `.agents/README.md`            | Router / index of every skill in this repo             |
| `.agents/skills/<name>/`       | One skill, one folder; folder name is the command      |

## Directory layout

```
.agents/skills/
└── <skill-name>/           # MUST match the invoked command
    ├── SKILL.md            # REQUIRED — entry point
    ├── reference.md        # OPTIONAL — heavy rules, loaded on demand
    ├── agents/openai.yaml  # OPTIONAL — display metadata
    └── scripts/            # OPTIONAL — wizards, bash tooling
```

## Progressive disclosure (three layers)

1. `SKILL.md` — execution steps and guardrails only
2. `reference.md` — deep context, loaded when the step demands it
3. `CONTEXT.md` and `docs/adr/` — project inputs, reached by pointer

If a paragraph is not needed to take the next action, it belongs in a lower layer.

## Process determinism over output rigidness

Determinism comes from **mandatory feedback loops**, never from prescribing exact wording.

- ❌ "Write a clear summary of the change."
- ✅ "Run the type check. Do not proceed until it passes."
- ✅ "Write the failing test first. Show the failure output before implementing."

## Scope boundaries — one skill, one failure mode

Matt's catalogue as granularity reference:

| Failure mode                 | Skill                            | Mechanism                                                                                   |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| Misalignment and scope drift | `/grill-me`, `/grill-with-docs`  | Round-based interview mapping a design tree until every assumption resolves — _before_ code |
| Agent verbosity              | `CONTEXT.md` integration         | Shared glossary; one domain term instead of twenty words                                    |
| Flaky or untested code       | `/tdd`                           | Vertical slices; test must fail Red before implementation turns it Green                    |
| Architectural entropy        | `/improve-codebase-architecture` | Scan for shallow modules, deepen interfaces                                                 |

None of these is "write good code." Each names a specific way agents reliably fail.

## The five authoring rules (detail)

### Rule 1 — Manage context load against cognitive load

Model-invoked descriptions are permanently resident: compress them to the trigger. User-invoked skills are free at rest but invisible: index them in the README router.

### Rule 2 — Anchor with leading words

Use dense terms the model already knows from pretraining. One established term replaces a page of explanation. Invent a term only when none exists — then define it once in `CONTEXT.md`.

### Rule 3 — Enforce progressive disclosure

See three layers above.

### Rule 4 — Process determinism over output rigidness

See feedback-loop examples above.

### Rule 5 — Pass the no-op test

Read sentence by sentence: _if I delete this line, does model behaviour change?_ If no, delete it. Prompt sprawl dilutes the lines that matter.

## Self-check before shipping

- [ ] The failure mode fits in one sentence with no "and"
- [ ] Invocation mode is deliberate, and the frontmatter matches it
- [ ] A model-invoked description is trigger-only and short
- [ ] Folder name equals the command
- [ ] Every workflow step ends in a checkable signal
- [ ] Guardrails are written as prohibitions
- [ ] Leading words carry the weight instead of explanation
- [ ] Nothing in `SKILL.md` survives that fails the no-op test
- [ ] Deep material sits in `reference.md`, project facts in `CONTEXT.md`
- [ ] Two real runs produced the same process
- [ ] Skill is listed in `.agents/README.md`

## Sources

- `github.com/mattpocock/skills` — the skill catalogue and open folder standard
- `aihero.dev/skills-grill-me` — the grilling workflow and design-tree method
- Matt's internal meta-skill `writing-for-agents` / `writing-great-skills` — origin of the five rules
