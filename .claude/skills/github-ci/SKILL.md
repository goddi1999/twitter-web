---
name: github-ci
description: Author or edit WQ GitHub Actions CI with stable aggregator required checks (app-ci, libs-ci, workers-ci, sql-ci). Use when creating, changing, or reviewing `.github/workflows/*` CI gates.
disable-model-invocation: true
---

# GitHub CI

## What It Does

Keeps GitHub Actions as a **proof system** for merge targets: one workflow per domain, one stable aggregator job name per required check, path filters inside the workflow (never on `on:` for required workflows). Local scripts are the CI entry points.

## When to Reach for It

- Adding or rewriting `.github/workflows/*.yml` for Phase 1a+ CI
- Fixing skipped/pending required checks or path-filter false confidence
- Extending libs/workers/sql matrices without breaking branch protection

Use **implement** after tickets exist. Use **grilling** if aggregator names, triggers, or Phase 1a vs 1b/2/3 scope are still open. Deploy/GHCR/Hetzner belong in later tickets — not this skill’s default deliverable.

## Prerequisites & Seams

- **Failure mode:** Agents author GitHub Actions that break the stable required-check contract.
- **Invocation:** User-invoked (`/github-ci`).
- **Feedback loop:** Aggregator job `name:` matches ruleset string byte-for-byte; `if: always()` aggregator fails on any failed/cancelled dependency; steps invoke existing `package.json` / worker test scripts; no `on.*.paths` on required workflows.
- **Done state:** Workflow YAML under `.github/workflows/` plus a short checklist of required check names for rulesets (protection is applied outside the repo tree).

## Process

1. **Name the domain.** Pick exactly one: `app-ci` | `libs-ci` | `workers-ci` | `sql-ci`. One file per domain: `.github/workflows/<domain>.yml`. Never split lint/type-check/test/build into separate workflow files.

2. **Confirm the public API.** The aggregator job’s `name:` (and usually its job id) is exactly `app-ci`, `libs-ci`, `workers-ci`, or `sql-ci`. Matrix leaf job names are never required checks. Verify by grepping the YAML for `name: <domain>`.

3. **Wire the skeleton.** Every workflow gets:
   - `on.pull_request` + `on.push` to `develop` and `main` (no workflow-level `paths`)
   - `permissions: contents: read` (path-filter `changes` jobs add `pull-requests: read`)
   - `concurrency` group per workflow + PR number/ref; `cancel-in-progress` only when `github.event_name == 'pull_request'`
   - Zero secrets in Phase 1a CI

4. **Map steps to local entry points.** CI runs the same commands a developer runs (`npm ci`, `npm run type-check`, `npm run lint`, `npm test`, `npm run build`, `npm run lint:sql`, `npm run worker:*:test`). If a script or root Vitest config is missing, add it in-repo first — never invent CI-only magic. Confirm: grepping the step `run:` lines finds matching scripts in `package.json`.

5. **Path-filter inside the job graph (libs / workers / sql).** Job-level change detection → matrix (or single job) only for affected paths → always-run aggregator. Aggregator uses `if: always()`, `needs:` all prior jobs, and fails unless every needed job is `success` or intentionally `skipped`. Confirm: no `on.pull_request.paths` / `on.push.paths` on the required workflow.

6. **Pin runtimes; cache installs.** Use `.nvmrc` / documented Python version; `npm ci` (not `npm install`); `uv sync` where `uv.lock` exists, `pip` only where that worker still has no lock. Cache keys include the matrix leg id. Never cache `node_modules` as a substitute for install.

7. **Verify before claiming done.**
   - Required aggregator names present and unique
   - Aggregator cannot succeed if a needed job failed or cancelled
   - No `continue-on-error` on merge-blocking evidence
   - No deploy steps, production URLs, or repo secrets in the workflow
   - Print the four strings to paste into branch rulesets after the first green run

Deep rules, path ownership, aggregator result-check pattern, and Phase 67a→67d progression: [reference.md](reference.md).

## Rules & Constraints

- **Never** put `paths:` / `paths-ignore:` on `on:` for a required workflow.
- **Never** require matrix leaf check names in branch protection.
- **Never** rename aggregator jobs without a coordinated ruleset update.
- **Never** use `continue-on-error: true` on type-check, lint, unit tests, SQL validation, or build.
- **Never** add deploy, GHCR push, Docker build gates, Playwright, k6, edge-function CI, or production credentials to Phase 1a CI workflows.
- **Never** point CI at production Supabase, Storage, Hetzner, or live model endpoints.
- **Never** rely on default `GITHUB_TOKEN` permissions — declare `contents: read` in every workflow.
- **Never** run `dorny/paths-filter` on `pull_request` without `pull-requests: read` on that job (workflow-level `contents: read` alone 403s the PR files API and fails `changes`).
- **Never** treat a Vitest step as coverage without a root config that actually collects `src/` tests.
- Prefer action pins by full commit SHA when touching production CD (67d); tags are acceptable only as an explicit temporary tradeoff.

## Deliverables

1. `.github/workflows/<domain>-ci.yml` (or edits) with always-present aggregator job
2. Any missing local scripts/config the workflow invokes (e.g. root Vitest + `"test"`)
3. Checklist lines: required check names + “apply rulesets after first green” + secret scanning/push protection
4. Explicit note of deferred work (67b RLS/replay, 67c heavies, 67d GHCR/Hetzner) — do not implement them under this skill unless the user names that ticket
