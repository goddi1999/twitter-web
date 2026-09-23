---
name: pytest
description: Write WQ pytest that proves contracts, boundaries, and failure modes—not internals or live models. Use when adding or changing tests under *-worker/ app/tests.
---

# Pytest

## What It Does

Stops **implementation-coupled** and **probabilistic** worker tests. Pytest proves deterministic constraints (schemas, citations, permissions, transforms, failure modes); evals own model quality.

## When to Reach for It

- Adding/changing tests under `*-worker/**/app/tests`
- Reviewing a worker PR whose pytest mocks internals, hits Qwen/SGLang, or would flake in `workers-ci`

Use **python-clean-code** for the code under test. Use **supabase-schema** for RLS policies; this skill for proving isolation. Use **github-ci** only when editing `.github/workflows/workers-ci.yml`.

## Prerequisites & Seams

- **Failure mode:** Agents write pytest that fails to prove deterministic WQ contracts under CI.
- **Invocation:** Model-invoked (omit `disable-model-invocation`).
- **Feedback loop:** Targeted `uv run python -m pytest …` (or the matching `npm run worker:*:test`) is green; default run excludes `slow`/`integration`; no real LLM/network in the fast path.
- **Done state:** Tests under `app/tests/{unit,integration}/` (plus factories/fakes as needed); public-API assertions; CI entry point still fast.

Load [reference.md](reference.md) for the 20-rule cheat sheet, folder layout, marker config, and acceptance checklist.

## Process

1. **Name the invariant.** One sentence: what observable contract must hold? Reject tests whose only claim is “helper X was called.” Confirm: you can state the claim without naming a private method.
2. **Choose the layer.** Unit (pure, no infra) | integration (DB/RLS/pipeline with fakes or testcontainers) | defer to eval suite (Qwen quality, recall@k). Confirm: file path matches `app/tests/unit/` or `app/tests/integration/`.
3. **Mock only external boundaries.** Fake LLM/embed/HTTP/storage clients; never monkeypatch `_private` business helpers. Prefer small Fake classes over MagicMock webs. Confirm: patch target is a client/protocol, not domain internals.
4. **Write one behavioral claim.** Name `test_<condition>_<expected_behavior>`; Arrange → Act → Assert; factories for domain objects (`make_*(**overrides)`); parametrize rule tables with readable `id=`s. Confirm: a stranger can read the test in seconds.
5. **Cover the failure mode.** Empty, malformed, timeout, missing row, bad model JSON, wrong `institution_id`, cross-tenant denial. Confirm: at least one `pytest.raises` / negative assertion for the seam.
6. **Keep CI’s fast path.** Default `addopts` exclude `slow` and `integration`; mark heavy work; never call real Qwen/SGLang/VLM in unmarked tests. Confirm: `npm run worker:<name>:test` (what `workers-ci` runs) stays deterministic and fast.
7. **Verify.** From the worker dir: `uv run python -m pytest app/tests` (or the single-node filter). Ruff clean on edited test files. For RLS tests, prove institution A cannot read/update/delete institution B’s rows—not mere CRUD.

## Rules & Constraints

- **Never** add Playwright, browser, or app UI E2E tests under worker pytest — UI automation is deferred and lives outside `*-worker/**/app/tests`.
- **Never** call a real LLM, embedding service, or live SGLang endpoint in normal pytest CI.
- **Never** mock your own business logic (`_build_prompt`, `_choose_chunks`, `_validate_citations`).
- **Never** assert call counts on collaborators as the primary proof of correctness.
- **Never** put model-quality checks (`assert "Druck" in await qwen.generate(...)`) in pytest—those belong in the eval suite.
- **Never** write files into the repo tree from tests—use `tmp_path`.
- **Never** depend on test order, shared mutable fixtures, leftover env vars, or global caches.
- **Never** use SQLite to “simulate” RLS—Postgres (testcontainers) or no RLS claim.
- Prefer fakes over MagicMock; factories over 25-field fixture dumps; `pytest.approx` for floats.
- Prefer `asyncio_mode = "auto"`; never `asyncio.sleep` to wait for work—use events or timed polls.
- Tenant ID from LLM/tool args is hostile input: assert server-side override/ignore.
- Workflow YAML changes → **github-ci**; this skill only constrains what those jobs execute.

## Deliverables

- Test file(s) under `app/tests/unit/` and/or `app/tests/integration/`
- Boundary fakes + `make_*` factories where domain objects would otherwise bloat Arrange
- Fast-path green via the same command `workers-ci` invokes
- Explicit markers for anything slow/integration; no unmarked live-model calls
