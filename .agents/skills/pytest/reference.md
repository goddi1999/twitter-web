# Pytest — Reference

Load when a Process step needs depth. The one-liner:

> Pytest proves the deterministic system correctly constrains the probabilistic system.

## Pyramid (workers)

```
Model evals            — small / slow (not pytest CI)
Integration / DB / RLS — some (marked)
pytest unit            — MANY, FAST, DETERMINISTIC
```

Most worker tests live at the bottom. UI / Playwright is out of scope for this skill and for worker pytest — it arrives later with the app UI, never under `*-worker/**/app/tests`.

## Folder layout

Match existing workers (`answer-generation-worker` is the template):

```
<worker>/
├── app/
│   ├── domain/
│   ├── service.py
│   └── clients/
└── app/tests/
    ├── unit/
    │   ├── test_language.py
    │   ├── test_citations.py
    │   └── test_service.py
    ├── integration/          # when DB/pipeline seams exist
    │   └── test_repository.py
    ├── factories/            # optional make_* builders
    └── conftest.py           # narrow shared infra only
```

One `conftest.py` per package boundary when fixtures diverge (ingestion vs scoring vs rag)—not one giant root dump.

Wire from repo root (already true for most workers):

```json
"worker:<name>:test": "cd <name>-worker && uv run python -m pytest app/tests"
```

`workers-ci.yml` invokes those scripts. Default pytest must stay green and fast under that command.

## Config baseline

Add to the worker’s `pyproject.toml` when introducing marked tests:

```toml
[tool.pytest.ini_options]
testpaths = ["app/tests"]
python_files = ["test_*.py"]
asyncio_mode = "auto"
markers = [
  "slow: retrieval evals, real embedding calls",
  "integration: requires testcontainers Postgres",
  "model_version(name): documents which model a golden file was computed against",
]
addopts = "-m 'not slow and not integration' --strict-markers"
```

Run heavies explicitly: `uv run python -m pytest -m integration` (or a future dedicated CI job via **github-ci**). Do not widen the default `workers-ci` fast path without an explicit ticket.

## Twenty rules (compressed)

### Behavior

1. **Arrange → Act → Assert** — readable in seconds.
2. **One test = one behavioral claim** — failure names the broken invariant.
3. **Name** `test_<condition>_<expected_behavior>`.
4. **Public API only** — not `_private` helpers; no “called helper N times.”
5. **Pure logic → pure unit tests** — citations, language vote, thresholds, schema, bbox math, FSRS, scoring rules.
6. **Mock boundaries, not business logic** — `monkeypatch` the client; never the orchestrator’s private steps.
7. **Fakes over MagicMock webs** — `FakeModel.generate` returning a fixed dict.
8. **No real LLM in pytest CI** — predetermined responses only.
9. **pytest ≠ evals** — schemas/citations/permissions/transforms vs recall/quality/edit distance.
10. **Parametrize rule tables**; give `pytest.param(..., id="partial-evidence")`.

### Data & isolation

11. **Factories** `make_chunk(**overrides)` — highlight only what matters.
12. **Fixtures = infra or meaningful shared state** — not a 180-line `everything`.
13. **Narrow scope** — default function; `session` only for expensive immutable resources.
14. **Independent tests** — single-node selection and random order must pass.
15. **`tmp_path`** for filesystem/Pillow/PyMuPDF — never write into the repo.
16. **Test errors explicitly** — `pytest.raises(DomainError, match=...)`.
17. **Invariants over anecdotes** — “every citation indexes existing evidence,” not one lucky sentence.
18. **`pytest.approx`** for floats (gain, Cohen’s d, similarity, ranking).
19. **DB tests prove isolation** — institution A must not SELECT/UPDATE/DELETE institution B’s rows (67b).
20. **Freeze time** for status/duration assertions (`time-machine` / freezegun) when clocks would flake.

### Async, mocks, tenancy (extras)

- `pytest-asyncio` with `asyncio_mode = "auto"`; skip `anyio` unless trio is required.
- Assert safety bounds: semaphore caps, ReAct `max_iterations` exit—not only happy convergence.
- Never `asyncio.sleep` to wait; use `asyncio.Event` or poll-with-timeout.
- Patch client methods (`SGLangClient.generate`), not raw `httpx` transport, so contract drift breaks loudly.
- Seeded vectors for embedding fakes: `np.random.default_rng(42)`.
- Golden-file tool schemas and hybrid scoring outputs; pin `@pytest.mark.model_version("...")` when scores depend on a model.
- `bbox` → crop: known image size + percentage → exact pixel box.
- Prompt-injection payloads in OCR/VLM fakes must be stripped before LLM context.
- Two-tenant fixture is mandatory for any RLS-adjacent test; SQLite cannot stand in for Postgres RLS.
- Reject/override `institution_id` arriving from tool/LLM args.

## RAG boundary map

Test each deterministic seam; fake Qwen:

```
query → retrieval → evidence pack     → correct chunks?
                 → prompt assembly    → numbering/contract?
                 → FakeModel
                 → structured parse   → schema valid?
                 → citation validate  → refs exist?
                 → API response       → public contract?
```

Failure localization: retrieval red → don’t touch the model; citation red → don’t tune retrieval.

## Strong vs weak

**Strong** — fake model returns a bad citation; public `generate` raises `InvalidCitationError`. Proves the validator constrains the LLM.

**Weak** — `mock_model.generate.assert_called_once()` and friends. Proves the wiring graph, not user-visible correctness.

## Acceptance checklist

Before keeping a test:

- [ ] What behavior does this prove?
- [ ] Runs without Qwen/SGLang?
- [ ] Runs independently / single-node?
- [ ] Failure names the broken invariant?
- [ ] Only external boundaries mocked?
- [ ] Failure case covered?
- [ ] No shared mutable state?
- [ ] Minimal Arrange data?
- [ ] Assertion strong enough?
- [ ] Protects a real WQ invariant?

If the first or last box is empty, delete or redesign.

## Deferred (intentionally)

Hypothesis/`evalPred` property testing, `mutmut` on scoring weights, live SGLang contract suites. Do not block the fast-path gate on these. Tenant isolation (rules 16–19 / 67b) must not slip.

## Sibling skills

| Concern                        | Skill               |
| ------------------------------ | ------------------- |
| Pure core / uv / layering      | `python-clean-code` |
| RLS policy authoring           | `supabase-schema`   |
| Workflow aggregator / matrices | `github-ci`         |
| Audit payload allowlist        | `audit-data`        |
