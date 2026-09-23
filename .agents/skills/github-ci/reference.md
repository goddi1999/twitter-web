# GitHub CI — Reference

Load when a Process step needs path ownership, aggregator result logic, or Phase boundaries.

## Required-check public API

| Check        | Question                                             | Typical failure                          |
| ------------ | ---------------------------------------------------- | ---------------------------------------- |
| `app-ci`     | Can the WQ app compile and behave?                   | Type/lint/test/build break               |
| `libs-ci`    | Are affected deterministic domain libraries correct? | FSRS / PSCA / pin-containment regression |
| `workers-ci` | Are affected backend/AI workers correct?             | Python test/dep regression               |
| `sql-ci`     | Is the DB change structurally acceptable?            | SQLFluff or naming violation             |

Branch rulesets require **only** these four strings (job `name:`), never matrix leaves.

## Path ownership (repo layout)

Paths are repo-root folders (not `packages/` or `workers/` prefixes).

### libs-ci

- `fsrs-lib/**`
- `pin-containment-scoring-worker/**` (npm/vitest lib package)
- `psca-scoring-worker/**`
- `.github/workflows/libs-ci.yml`

### workers-ci

- `answer-generation-worker/**`
- `auto-scoring-a-worker/**`
- `auto-scoring-b-worker/**`
- `course-ingestion-worker/**`
- `document-ingestion-worker/**`
- `node-editor-agent-worker/**`
- `search-embed-worker/**`
- `visual-ingestion-worker/**`
- `.github/workflows/workers-ci.yml`

Install: `uv sync` when `uv.lock` exists; `pip install -r requirements.txt` for auto-scoring until locked. Prefer root scripts: `npm run worker:<name>:test`.

### sql-ci

- `supabase/migrations/**`
- `scripts/check_sql_naming.py`
- `.github/workflows/sql-ci.yml`

Local: `npm run lint:sql`. Edge functions under `supabase/functions/**` are **out** of Phase 1a sql-ci unless a later ticket adds a dedicated gate.

### app-ci

Always runs (no path skip of the workflow). Sequence:

`checkout → setup Node (.nvmrc) → npm ci → type-check → lint → test → build`

Root must collect `src/**` Vitest files; a green run with zero tests collected is a failed contract.

## Aggregator pattern (canonical)

```yaml
name: workers-ci

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

permissions:
  contents: read

concurrency:
  group: workers-ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  changes:
    # dorny/paths-filter (or equivalent) → outputs per worker
    runs-on: ubuntu-latest
    outputs:
      # e.g. any: ${{ steps.filter.outputs.any }}
    steps:
      - uses: actions/checkout@v4
      # filter step…

  test:
    needs: changes
    if: needs.changes.outputs.any == 'true'
    strategy:
      fail-fast: false # independent domain legs; fail-fast inside a leg via the job steps
      matrix:
        worker: […] # only include legs selected by changes, or gate each leg with if:
    runs-on: ubuntu-latest
    steps:
      # uv/pip + pytest via package.json script

  workers-ci:
    name: workers-ci
    if: always()
    needs: [changes, test]
    runs-on: ubuntu-latest
    steps:
      - name: Require success or intentional skip
        run: |
          # Fail if any needed job is failure/cancelled.
          # Succeed if test is success, or skipped because nothing matched.
```

Rules of thumb:

- Workflow always present → expensive work conditional.
- Aggregator examines `needs.*.result` ∈ {`success`, `skipped`} for allowed; anything else fails the job.
- `fail-fast: false` across matrix legs (independent evidence); do not continue-on-error inside a leg’s evidence steps.

## Local ↔ CI script map

| Gate       | Prefer invoking                                                              |
| ---------- | ---------------------------------------------------------------------------- |
| app-ci     | `npm ci`, `npm run type-check`, `npm run lint`, `npm test`, `npm run build`  |
| libs-ci    | per-package `npm test` / `npm run type-check` after root or package `npm ci` |
| workers-ci | `npm run worker:<slug>:test`                                                 |
| sql-ci     | `npm run lint:sql`                                                           |

## Concurrency

```yaml
concurrency:
  group: <domain>-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

Do not cancel post-merge push runs on `develop`/`main` just because a new push arrived milliseconds later unless you intentionally accept losing that signal.

## Security (Phase 1a)

- Zero secrets in CI workflows.
- `permissions: contents: read` in every file.
- Path-filter `changes` jobs also need job-level `pull-requests: read` — `dorny/paths-filter` uses the PR files API on `pull_request` events; without it the step fails with “Resource not accessible by integration” and the aggregator goes red in ~3s.
- Enable GitHub secret scanning + push protection in Settings (checklist item; not YAML).
- Later (67d): OIDC / short-lived deploy tokens over long-lived PATs; never CI → production DB.

## Node 20 deprecation notices

Annotations like “Node 20 is being deprecated… running with Node 24 by default” come from older action runtimes (`actions/checkout@v4`, etc.). They are warnings, not the merge blocker. Bump actions when convenient; do not chase them while `changes` is 403ing.

## Phase progression (do not collapse)

| Ticket | Proves                                      |
| ------ | ------------------------------------------- |
| 67a    | Compile + deterministic unit/lint/SQL gates |
| 67b    | Migration replay + two-JWT RLS isolation    |
| 67c    | Playwright / k6 / synthetic seed / GPU      |
| 67d    | GHCR digest build once → deploy that digest |

67b is the company-killer gate before Hetzner. Two `institution_id`s and two `auth.uid()` contexts from day one of RLS CI — a single JWT suite cannot catch cross-tenant leaks.

## Explicitly deferred past Phase 1a

Docker build gates, edge-function CI, OpenTofu/Ansible, preview envs, Trivy/SBOM/cosign, Faker seed, k6, Playwright, GPU sweep, Vercel deploy workflows, GHCR push.

## Branch protection (after first green)

Applied in GitHub Settings / rulesets, not the repo tree:

- `develop` + `main`: require `app-ci`, `libs-ci`, `workers-ci`, `sql-ci`; require up-to-date with base; no force-push; no direct push
- `main`: + 1 approving review (self-approve OK while solo)
- Secret scanning + push protection on

## Action pinning

Prefer full commit SHA for third-party actions before production CD. Tags (`@v4`) are a documented temporary tradeoff only.

## Replace legacy workflows

`fsrs-lib.yml` (workflow-level `paths:`) is the anti-pattern: required check can stay pending when skipped. Fold into `libs-ci.yml` matrix + aggregator; delete the old file in the same change that lands `libs-ci`.
