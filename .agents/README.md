# Agents

Cursor/agent skills for this repo live in [`skills/`](./skills/). Each skill is one folder: `SKILL.md` (required), optional `reference.md` for depth.

Authoring rules: [`write-skill`](./skills/write-skill/SKILL.md) — one failure mode, short trigger descriptions, progressive disclosure.

Pinned upstream skills (hashes): [`../skills-lock.json`](../skills-lock.json).

## All skills

| Skill                                                                | What it does                                                                     | When to use                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`audit-data`](./skills/audit-data/SKILL.md)                         | Keeps audit events on the DSGVO allowlist; blocks free-text PII                  | Writing or changing audit triggers, payloads, retention, or audit UI |
| [`clean-code`](./skills/clean-code/SKILL.md)                         | Places and shapes React/TS under `src/` (folders, barrels, naming, JSX)          | Adding, moving, or refactoring modules/components                    |
| [`code-review`](./skills/code-review/SKILL.md)                       | Two-axis review of a diff: Standards vs Spec (parallel sub-agents)               | Reviewing a branch/PR/WIP — “review since \<fixed-point\>”           |
| [`commit-message`](./skills/commit-message/SKILL.md)                 | Writes WQ Problem/Decision/Changes/Impact commit messages                        | Creating commits or drafting commit messages                         |
| [`design-review`](./skills/design-review/SKILL.md)                   | Single-focus Deep Modules review with sharp simplifications                      | Architecture/design review of a linked folder or domain              |
| [`diagram-codebase`](./skills/diagram-codebase/SKILL.md)             | Evidence-backed Mermaid flowchart / sequence / state / ER from a folder          | Diagram, map, or explain architecture of a repo or service           |
| [`explain-simply`](./skills/explain-simply/SKILL.md)                 | Beginner-English breakdown: what / why / how / pros / cons                       | “Explain X”, “break down X”, “what is X”                             |
| [`feature-layers`](./skills/feature-layers/SKILL.md)                 | Enforces Component → Hook → API → types; no Supabase in UI                       | Structuring a feature or wiring data flow                            |
| [`form-validation`](./skills/form-validation/SKILL.md)               | Wires submit forms with RHF + Zod + resolvers                                    | Collecting and submitting validated input                            |
| [`github-ci`](./skills/github-ci/SKILL.md)                           | Authors WQ GitHub Actions with stable aggregator required checks                 | Creating/editing `.github/workflows` CI (app/libs/workers/sql)       |
| [`grilling`](./skills/grilling/SKILL.md)                             | Design-tree interview until assumptions are settled                              | Stress-testing a plan/decision (“grill me”) before coding            |
| [`hig-card-thumbnail-svg`](./skills/hig-card-thumbnail-svg/SKILL.md) | Builds an Apple-HIG 1024×576 card thumbnail SVG (lucide + WQ color)              | Generating game/card thumbnail SVGs                                  |
| [`react-state`](./skills/react-state/SKILL.md)                       | Named-problem hooks; server data via `useQuery`, not hand-rolled fetch; MD first | Adding state, effects, custom hooks, or TanStack Query               |
| [`implement`](./skills/implement/SKILL.md)                           | Implements work from a spec or tickets (user-invoked)                            | After a spec/tickets exist and you want code                         |
| [`lexical-technical`](./skills/lexical-technical/SKILL.md)           | Lexical + React/Vite/TS/Supabase editor guidance                                 | Building or changing rich-text editors, plugins, persistence         |
| [`pytest`](./skills/pytest/SKILL.md)                                 | Worker pytest for contracts, boundaries, failure modes (CI-safe, no live LLMs)   | Adding or changing `*-worker/**/app/tests`                           |
| [`python-clean-code`](./skills/python-clean-code/SKILL.md)           | Pure function → module → class in WQ Python workers                              | Writing or reviewing FastAPI, workers, or scripts                    |
| [`readme`](./skills/readme/SKILL.md)                                 | Generates/audits READMEs with a workflow-first skeleton                          | Writing or reviewing repository/package README docs                  |
| [`shadcn-components`](./skills/shadcn-components/SKILL.md)           | Builds reusable UI like shadcn (composition, variants, `cn`)                     | Adding/refactoring `components/ui` or shared composables             |
| [`supabase-schema`](./skills/supabase-schema/SKILL.md)               | Writes Supabase migrations with RLS and tenant isolation                         | Changing schema, policies, RPCs, or storage rules                    |
| [`teach`](./skills/teach/SKILL.md)                                   | Multi-session teaching with knowledge → practice → wisdom (user-invoked)         | User asks to learn a concept in this workspace                       |
| [`to-spec`](./skills/to-spec/SKILL.md)                               | Synthesizes the conversation into a tracker spec (user-invoked)                  | Conversation is ready to become a published spec — no interview      |
| [`to-tickets`](./skills/to-tickets/SKILL.md)                         | Breaks a plan/spec into tracer-bullet tickets with blockers (user-invoked)       | Slicing an agreed plan into implementable tickets                    |
| [`user-story`](./skills/user-story/SKILL.md)                         | Turns a vague idea into a 7-keyword developer-ready spec (user-invoked)          | Raw feature request before coding                                    |
| [`where-it-breaks`](./skills/where-it-breaks/SKILL.md)               | Lists concrete failure modes + fixes, then a surviving design                    | Critical failure-mode critique of an idea or folder                  |
| [`write-skill`](./skills/write-skill/SKILL.md)                       | Authors or prunes agent skills (one failure mode, progressive disclosure)        | Writing, reviewing, or splitting a skill                             |

## Quick router

| Situation                        | Prefer                                 |
| -------------------------------- | -------------------------------------- |
| Vague idea, need structure       | `user-story` → optional `grilling`     |
| Decisions still open             | `grilling`                             |
| Publish / slice work             | `to-spec` → `to-tickets` → `implement` |
| Feature data flow                | `feature-layers`                       |
| Where a file goes / naming       | `clean-code`                           |
| Reusable button/input/etc.       | `shadcn-components`                    |
| Forms                            | `form-validation`                      |
| Hooks misuse / hand-rolled fetch | `react-state`                          |
| SQL / RLS                        | `supabase-schema`                      |
| Audit payloads                   | `audit-data`                           |
| Python workers                   | `python-clean-code`                    |
| Worker pytest / CI-safe tests    | `pytest`                               |
| Diff review                      | `code-review`                          |
| GitHub Actions / required checks | `github-ci`                            |
| Folder architecture              | `design-review`                        |
| Diagram / visualize a folder     | `diagram-codebase`                     |
| Understand a concept / term      | `explain-simply`                       |
| Will this design die?            | `where-it-breaks`                      |
| Commit text                      | `commit-message`                       |
| Package README                   | `readme`                               |
| Writing / splitting a skill      | `write-skill`                          |
