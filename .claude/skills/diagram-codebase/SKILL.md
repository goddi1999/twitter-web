---
name: diagram-codebase
description: Build Mermaid flowchart, sequence, state, and ER diagrams from a folder. Use when asked to diagram, map, visualize, or explain architecture of a repo or service.
---

# Diagram Codebase

## What It Does

Turns a folder into an evidence-backed architecture map. Walk the tree, read entry points, follow one Tracer Bullet end to end, then draw. Every node and arrow must cite a file and line. Always the same four diagrams:

| Diagram                     | Question it answers                                      |
| --------------------------- | -------------------------------------------------------- |
| `flowchart` with `subgraph` | What components exist and where are the boundaries?      |
| `sequenceDiagram`           | Who calls whom, in what order, for the primary workflow? |
| `stateDiagram-v2`           | What states does the central entity move through?        |
| `erDiagram`                 | How are the persisted entities related?                  |

Output may differ per repository. The process must not.

## When to Reach for It

- A folder, repo, service, or subsystem must be explained visually
- Onboarding docs, an ADR, or a README needs an architecture section
- An existing diagram is suspected of drifting from the code

**Do not** use for architecture quality review, refactoring, or designing a system that does not exist yet. Use **design-review** / **where-it-breaks** for those.

## Prerequisites & Seams

Name these in one sentence each before step 1. If unknown, resolve by reading — never by guessing.

1. **Root path** — absolute folder to scan
2. **Entry point(s)** — `main`, server bootstrap, CLI, route table, worker loop
3. **Primary workflow** — one user-visible operation as verb + object
4. **Central stateful entity** — job, order, ingestion, session, etc.
5. **Persistence layer** — migrations/ORM models, or the explicit fact that none exist

## Process

Each step ends in a checkable signal. Do not advance until the signal is observed.

1. **Inventory the tree.** List directories to depth 3, excluding `node_modules`, `.git`, `dist`, `build`, `.venv`, `target`.
   _Signal:_ a printed tree exists.
2. **Detect the stack.** Read manifests: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `docker-compose.yml`, `*.tf`.
   _Signal:_ language, framework, and external services are named from file contents.
3. **Locate entry points.** Grep for bootstrap markers (`if __name__`, `app.listen`, `func main`, route registration, queue consumers).
   _Signal:_ every entry point is quoted with its file path.
4. **Fire one tracer bullet.** Follow the primary workflow from entry point to persistence, opening each file on the path.
   _Signal:_ an ordered list of file:symbol hops exists, with no "probably".
5. **Map the boundaries.** Group modules into client, API, workers, storage, third parties.
   _Signal:_ every top-level directory is assigned to exactly one group or explicitly excluded.
6. **Harvest the schema.** Read migrations or models. For each FK, record more than the target:
   - **Cardinality + optionality** from nullability and uniqueness — not a default `||--o{`. `NOT NULL` → mandatory (`|`); nullable → optional (`o`); `UNIQUE` on the FK → 1:1 (`||--||` / `||--o|`), not 1:N. Syntax table in [reference.md](reference.md).
   - **N:M as a visible entity.** If a table's PK is a composite of two FKs, draw it as its own entity with two edges. Extra attributes (grade, timestamp, role) → Assoziationsklasse; never collapse into one `}o--o{` line.
   - **Ownership from referential actions.** `ON DELETE CASCADE` → label `owns` (Komposition); `ON DELETE SET NULL` / `RESTRICT` / no cascade → label `references` (Aggregation).
   - **Prune derived edges.** If A→B→C is proven and A→C adds no information, delete A→C.
     Document/graph stores: harvest joins from the query layer instead of constraints. Weak entities, roles/recursion, and anomaly lint → [reference.md](reference.md) only when those patterns appear.
     _Signal:_ each edge cites FK + nullability/UNIQUE/delete-rule evidence; no derived A→C shortcuts remain.
7. **Harvest the states.** Grep for status enums, string literals in status columns, and the transitions that write them.
   _Signal:_ each transition cites the code that performs it.
8. **Draw the four diagrams** in fixed order, using only evidence from steps 3–7. Templates in [reference.md](reference.md).
9. **Render-check every diagram.** Validate Mermaid syntax before delivery.
   _Signal:_ a clean parse for all four; a failing diagram is fixed, never shipped with a caveat.
10. **Run the orphan check.** Every node has ≥1 edge; every arrow has a source file; unverified items go to an **Unverified** list.
    _Signal:_ the orphan list is empty or explicitly enumerated.

## Rules & Constraints

- **Never** invent a component, arrow, table, or state that no file supports.
- **Never** diagram from filenames alone; a file must be read before it becomes a node.
- **Never** skip the tracer bullet, even for a folder that looks obvious.
- **Never** ship Mermaid that has not been render-checked.
- **Never** exceed 15 nodes in the system flowchart; collapse into a subgraph or a second diagram.
- **Never** use spaces or punctuation in Mermaid node IDs; use `Id[Human Label]`.
- **Never** default every ER edge to `||--o{` — prove min/max from nullability and UNIQUE.
- **Never** collapse a junction table that has a composite PK (or extra attributes) into a single `}o--o{`.
- **Never** leave a derived A→C edge when A→B→C already encodes it.
- **Never** mutate, format, or commit anything in the scanned folder — read-only.
- **Never** modify `.env` files or print secret values found during the scan.
- Assumptions go in the **Unverified** list, never inside a diagram.

## Deliverables

1. **Overview** — 3–5 sentences: purpose, stack, boundaries
2. **Four Mermaid diagrams**, render-checked, in fixed order
3. **Evidence table** — one row per node: node, file path, what proves it
4. **Unverified list** — every assumption that did not survive step 10
5. Optional `docs/architecture.md` written to the scanned repo _only on explicit request_
