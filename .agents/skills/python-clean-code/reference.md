# Reference

# Skill Python Clean Code

**How to read this sheet:** design in this order — **pure function → module → class**. Reach for a class only when state, protocol, or dependency injection demands it. Sources: _A Philosophy of Software Design_ (Ousterhout) for complexity/design, `zedr/clean-code-python` for Python-level rules.

## Scope

1. Applies to WQ Python code: FastAPI endpoints, grading algorithms, workers, background jobs, CLI scripts, infrastructure helpers.
2. Applies together with uv (packaging and execution), Ruff, Black, mypy or Pyright, pytest, Docker Compose, Supabase RLS, and production logging.
3. Keep frontend and backend conventions aligned: thin boundaries, typed DTOs, domain-owned folders, explicit public APIs, zero hidden tenant assumptions.
4. Prefer boring, searchable, local-first code over clever abstraction.

## The one rule

> Python code in WQ optimizes for **traceability, testability, and tenant-safe correctness**.

A unit of code should reveal what it does from its name, take typed input, return typed output, hide no I/O, and keep security-sensitive decisions in one visible place.

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class GradingRequest:
    answer_text: str
    expected_terms: tuple[str, ...]
    max_score: int

@dataclass(frozen=True, slots=True)
class GradingResult:
    score: int
    matched_terms: tuple[str, ...]
    feedback_key: str

def grade_term_match(request: GradingRequest) -> GradingResult:
    """Score an answer by counting expected terms it contains.

    Pure: no I/O, no clock, no randomness. Same input -> same result.
    """
    matched_terms = tuple(
        term
        for term in request.expected_terms
        if term.lower() in request.answer_text.lower()
    )
    score = min(len(matched_terms), request.max_score)

    return GradingResult(
        score=score,
        matched_terms=matched_terms,
        feedback_key="grading.term_match.partial" if score else "grading.term_match.empty",
    )
```

## Design lens: complexity, not style

Complexity = **dependencies** (you cannot change this code alone) + **obscurity** (important information is not obvious). It accumulates in small increments, so apply zero tolerance per change.

Three symptoms to watch for in WQ code:

1. **Change amplification** — adding one question type touches routes, service, schemas, worker, and frontend.
2. **Cognitive load** — a caller must remember to normalize text, check tenant, and set algorithm version manually.
3. **Unknown unknowns** — nothing tells the next developer that a rubric change also requires a version bump.

⚖️

**Interface simplicity beats implementation simplicity.** Pull complexity downward: suffer once inside the module so every caller stops suffering.

## Functional-first design order

1. **Pure function** — deterministic logic: normalize, score, validate shape, build feedback. Default choice.
2. **Module** — a package that hides a decision behind a small public surface (`app/grading/domain/scoring.py`).
3. **Class** — only for state, a protocol with several implementations, or injected dependencies.

```python
# Deep function: simple interface, real functionality behind it.
def grade_answer(request: GradingRequest) -> GradingResult: ...

# Shallow wrapper: adds an interface, adds no value. Delete it.
def run_grading(request: GradingRequest) -> GradingResult:
    return grade_answer(request)
```

**Deep, not many.** Few modules with strong hidden logic beat many tiny pass-through layers. A file with mostly one-line delegations is a red flag.

## Functions

1. **One thing.** Parse, normalize, score, validate, persist, or render — never several at once.
2. **Two parameters or fewer.** Group related values into a frozen dataclass, `NamedTuple`, or Pydantic model.
3. **No flag arguments.** `include_feedback`, `dry_run`, `is_teacher_mode` hide two functions in one; split them.
4. **Return, don't mutate.** Mutate only when mutation is the documented purpose.
5. **Raise domain errors only where they can be translated** into an API response.
6. **Verb-first names.** `normalize_answer_text`, `calculate_score`, `build_feedback_items`.
7. **One level of abstraction.** A high-level function reads as a description of the operation, not as its implementation. Parsing, scoring, and persistence never share a body.
8. **Default arguments over `None`-checks.** Express the default in the signature instead of branching on `None` inside the body — it removes a branch instead of adding one.

```python
# Bad: the default is hidden in a branch.
def grade_answer(request: GradingRequest, timeout_seconds: int | None = None) -> GradingResult:
    if timeout_seconds is None:
        timeout_seconds = 30
    ...

# Good: the default is part of the contract.
def grade_answer(
    request: GradingRequest,
    timeout_seconds: int = DEFAULT_GRADING_TIMEOUT_SECONDS,
) -> GradingResult: ...
```

Two limits: **never a mutable default** (`list`, `dict`, `set` — use `None` plus a frozen empty value, or `field(default_factory=...)`), and defaults belong at the boundary (DTO, settings). Inside pure domain functions, keep grading-relevant inputs required, so nothing that influenced a score is implicit.

```python
# Bad: flag argument changes behavior and hides two responsibilities.
def write_report(path: str, temporary: bool) -> None: ...

# Good: two honest functions.
def write_report(path: Path) -> None: ...
def write_temp_report(name: str) -> None: ...
```

### Side effects live at the edges

Domain functions never touch Supabase, storage, HTTP, environment variables, the clock, or the filesystem. Pass values in; return values out.

```python
# Bad: hidden I/O inside domain logic.
def grade(job_id: str) -> int:
    answer = supabase.table("answers").select("*").eq("id", job_id).execute()
    ...

# Good: the boundary fetches, the domain decides.
def grade_answer(request: GradingRequest) -> GradingResult: ...
```

## Loops and iteration

1. Prefer **comprehensions** for shape changes and **generators** for streaming or large batches.
2. Never mutate shared state inside a loop; build a new value and return it.
3. Loop over meaningful names (`for answer in answers`), never `item`, `seq`, `x`.
4. Use `enumerate`, `zip`, and `itertools` instead of index arithmetic.
5. Split filter and transform into named steps when the condition needs explanation.

```python
from collections.abc import Iterable, Iterator

def submitted_answers(answers: Iterable[Answer]) -> Iterator[Answer]:
    """Yield only answers a learner actually submitted."""
    return (answer for answer in answers if answer.is_submitted)

def grade_batch(answers: Iterable[Answer]) -> tuple[GradingResult, ...]:
    return tuple(grade_answer(to_request(answer)) for answer in submitted_answers(answers))
```

🚩

A loop body longer than a screen usually contains two loops and one hidden function. Extract the subtask, not the syntax.

## Data and types

1. **API schemas** live in `schemas/` and use Pydantic.
2. **Domain models** live in `domain/models.py` and import no FastAPI, Supabase, or HTTP client.
3. Convert request DTO → domain model before grading; domain result → response DTO at the boundary.
4. Prefer `@dataclass(frozen=True, slots=True)` for immutable domain objects, `NamedTuple` for small return groups, `TypedDict` only for external JSON shapes.
5. Never tunnel raw nested dicts through layers.

```python
from pydantic import BaseModel, Field

class GradeAnswerRequestDTO(BaseModel):
    answer_text: str = Field(min_length=1, max_length=10_000)
    expected_terms: tuple[str, ...] = Field(min_length=1, max_length=100)
    max_score: int = Field(ge=0, le=100)

class GradeAnswerResponseDTO(BaseModel):
    score: int
    matched_terms: tuple[str, ...]
    feedback_key: str
```

### Security implication

Pydantic stops oversized and malformed payloads. It does not replace RLS, tenant membership checks, sanitization, or rate limiting. Never trust `tenant_id`, `role`, or `institution_id` from a client payload.

## Duplication and abstraction

1. **One source of truth for one piece of knowledge.** Duplicated rubric thresholds, question-type lists, or feedback-key formats mean a future change gets applied once and forgotten twice.
2. **Abstract only proven duplication.** Two call sites that merely look similar are not duplication; identical _knowledge_ in two places is.
3. **A bad abstraction is worse than duplication.** A shared function stitched together with flags and optional parameters couples unrelated features permanently — duplication stays local and deletable.
4. **If the shared code needs a mode flag to serve both callers, it was never shared logic.** Split it back and duplicate the three honest lines.

## Classes: when they earn their place

Use a class when it owns state, models a domain entity, or holds injected dependencies. Otherwise use a function.

```python
from typing import Protocol

class ObjectStorageClient(Protocol):
    def create_signed_url(self, path: str, expires_in_seconds: int) -> str: ...

class GradingService:
    """Orchestrates one grading job: fetch input, grade, publish result."""

    def __init__(self, storage_client: ObjectStorageClient) -> None:
        self._storage_client = storage_client
```

### SOLID, condensed for Python

1. **SRP — one reason to change.** Pull `get_version()`-style helpers out of rendering classes; a class that both computes and renders has two futures.
2. **OCP — extend, don't modify.** Give subclasses one designed override point (`render_body`), not a rewritten `get`. Mixins are fine for composable, single-purpose behavior; keep them before the target class.
3. **LSP — keep signatures compatible.** A subclass that adds a required parameter to an overridden method breaks every caller; let mypy enforce this.
4. **ISP — small interfaces.** Split fat ABCs (`Loadable`, `Saveable`) so a read-only `PDFDocument` need not fake `save()`.
5. **DIP — depend on abstractions.** Depend on “an object with `.write()`” or a `Protocol`, not on a concrete Supabase or storage class.

🧩

Prefer **composition and Protocols** over implementation inheritance. Inheritance leaks state between parent and child and forces you to read the whole hierarchy to change one class.

## Naming

1. **Modules and packages:** `grading_service.py`, `term_matcher.py`, `feedback_builder.py`.
2. **Classes:** PascalCase nouns — `GradingRequest`, `RubricRule`, `SupabaseStorageClient`.
3. **Functions:** verb-first snake_case — `normalize_answer_text`, `calculate_score`.
4. **Booleans:** predicates — `is_valid`, `has_required_terms`, `can_retry`, `should_publish_result`.
5. **Constants:** searchable uppercase — `MAX_FEEDBACK_ITEMS`, `DEFAULT_GRADING_TIMEOUT_SECONDS`.
6. **One vocabulary per concept.** Do not mix `student`, `learner`, and `user` for the same entity.
7. **No redundant context.** Inside `class Answer`, use `text`, not `answer_text`.
8. Short names (`i`, `n`) are acceptable only when declaration and use are visible together.
9. **Use explanatory variables.** Break a compound condition or expression into named intermediates; the name carries the reason the condition exists.
10. **Role suffixes are intentional.** `...DTO`, `_service.py`, and `_routes.py` encode architectural role, not Python type, so they do not violate the “don't encode the type in the name” rule. Encoding an actual type (`terms_list`, `score_int`) still does.

```python
TERM_MATCH_THRESHOLD = 0.82
MIN_REQUIRED_MATCHES = 2

def has_confident_term_match(similarity_score: float) -> bool:
    return similarity_score >= TERM_MATCH_THRESHOLD

def qualifies_for_partial_credit(result: GradingResult, similarity_score: float) -> bool:
    """Explanatory variables name the reason each condition exists."""
    is_confident = has_confident_term_match(similarity_score)
    has_enough_matches = len(result.matched_terms) >= MIN_REQUIRED_MATCHES

    return is_confident and has_enough_matches
```

🚩

If a precise name is hard to find, the abstraction is wrong — not the vocabulary. Re-split the thing you are naming.

## Errors: define them out of existence

Order of preference:

1. **Define away.** Redefine semantics so the case is normal: an empty selection, a clamped range, an idempotent delete, an empty match tuple instead of `TermNotFoundError`.
2. **Mask low.** Retry transient storage or network failures inside the infrastructure layer; callers never see them.
3. **Aggregate high.** One handler at the FastAPI boundary translates every `GradingError` into a response using a stable machine-readable code.
4. **Crash fast.** Missing required secrets or a corrupt internal invariant should fail at boot or fail the job loudly — not be patched over.

```python
class GradingError(Exception):
    error_code = "grading.error"

class UnsupportedQuestionTypeError(GradingError):
    error_code = "grading.unsupported_question_type"

SUPPORTED_QUESTION_TYPES = frozenset({"term_match", "pin_mark", "line_select"})

def ensure_supported_question_type(question_type: str) -> None:
    if question_type not in SUPPORTED_QUESTION_TYPES:
        raise UnsupportedQuestionTypeError(question_type)
```

Rules: never catch broad `Exception` without re-raising or translating; never leak tracebacks, signed URLs, learner answers, patient data, or tenant internals to the frontend.

### Security implication

Safe error translation supports GDPR Art. 32 confidentiality expectations by keeping logs and API responses from becoming a second data leak.

### UX recommendation

Expose stable states — `queued`, `processing`, `completed`, `failed`, `needs_review` — plus localized feedback keys, so the UI can show skeletons, partial-credit explanations, and precise retry messages without guessing.

## Comments and docstrings

1. **Write the interface comment first.** It is a design tool: if the docstring is long and full of internals, the abstraction is too shallow.
2. Describe what is **not obvious from the code** — units, inclusivity of bounds, invariants, ownership of resources, why a workaround exists.
3. Separate **interface docs** (what a caller needs) from **implementation comments** (how it works internally). Implementation details never belong in a public docstring.
4. Never restate the signature. `"""Grade the answer."""` above `grade_answer` adds nothing.
5. Keep comments next to the code they describe; document cross-module decisions once, in a `designNotes` section, and reference it.

```python
def find_matched_terms(normalized_answer: str, expected_terms: tuple[str, ...]) -> tuple[str, ...]:
    """Return expected terms present in the answer.

    Matching is case-insensitive substring matching on already-normalized text;
    duplicates in `expected_terms` are returned once each, in input order.
    """
```

## Layering and folder standard

```
app/grading/domain/scoring.py            # pure logic, no I/O
app/grading/services/grading_service.py  # orchestration
app/grading/infrastructure/storage.py    # Supabase, HTTP, queues, logs
app/grading/schemas/requests.py          # Pydantic in
app/grading/schemas/responses.py         # Pydantic out
app/grading/errors.py                    # domain errors
app/grading/routes/grading_routes.py     # FastAPI wiring only
app/tests/unit/grading/test_scoring.py
app/tests/integration/grading/test_grading_routes.py
```

1. Singular names for bounded contexts (`grading`, `auth`, `courses`); plural for same-kind folders (`schemas`, `services`, `clients`, `tests`).
2. Suffix by role: `_routes.py`, `_service.py`; prefix tests with `test_`.
3. Absolute imports inside the app package: `from app.grading.domain.scoring import calculate_score`.
4. Keep `__init__.py` explicit; export only the stable public surface.
5. Domain never imports infrastructure. Break cycles by moving shared types into `domain/models.py`.

```python
# app/grading/__init__.py
from app.grading.services.grading_service import GradingService

__all__ = ["GradingService"]
```

## Configuration and runtime

1. Parse environment once at startup into a typed settings object; never read env vars deep inside domain functions.
2. Validate required secrets at boot so misconfigured workers fail fast.
3. Avoid new configuration parameters when a sensible value can be computed — a tuning knob is complexity pushed onto operators.
4. Dedicated `grading-worker/Dockerfile`, non-root user, pinned Python and dependency versions (`.python-version` plus a committed `uv.lock`), health endpoint plus container health check.
5. Supabase RLS stays the enforcement boundary; workers stay stateless and operate on payloads or short-lived signed URLs. Elevated credentials are privileged infrastructure and must be audited.
6. Automated backups with tested restores; idempotent grading jobs so retries never duplicate results.

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str
    supabase_anon_key: str
    grading_timeout_seconds: int = 30
```

## Logging and observability

1. Structured JSON logs in production, with correlation IDs, job IDs, and tenant-safe identifiers.
2. Never log wound images, raw learner answers, patient data, signed URLs, JWTs, service keys, or full prompt payloads.
3. Emit metrics for latency, queue depth, success rate, validation failures, retry count; trace external calls.

```python
logger.info(
    "grading_completed",
    extra={
        "job_id": job_id,
        "question_type": question_type,
        "duration_ms": duration_ms,
        "score": result.score,
    },
)
```

## Testing

1. Unit-test domain functions with no FastAPI, Supabase, network, or filesystem — pure functions make this trivial.
2. Integration-test routes, validation, dependency wiring, and adapters; use fake clients built from `Protocol`.
3. Write the failing test **before** fixing a bug; that is the only proof the fix matters.
4. Boundary cases: empty answers, oversized input, duplicate terms, multilingual text, unsupported question types.
5. Store rubric and algorithm version beside results; version them explicitly.

```python
def test_calculate_term_score_caps_at_max_score() -> None:
    matched_terms = ("infection", "granulation", "exudate")

    score = calculate_term_score(matched_terms=matched_terms, max_score=2)

    assert score == 2
```

## Tooling baseline

```toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM", "C4", "PL"]
ignore = ["PLR0913"]

[tool.pytest.ini_options]
testpaths = ["app/tests"]
python_files = ["test_*.py"]
```

Ruff for lint and import order, Black formatting, mypy or Pyright for static types, `from __future__ import annotations` where it helps. Treat `# type: ignore` as temporary and documented.

### uv is the package manager

Every WQ worker is a uv project: dependencies live in `pyproject.toml`, the resolved set in a committed `uv.lock`, and the interpreter is pinned by `.python-version`. uv creates and owns `.venv` — never build one by hand.

```bash
uv sync                                  # install/refresh from uv.lock
uv add "chonkie[tokenizers]==1.6.8"      # add a dependency and relock
uv run python -m pytest app/tests        # run inside the project env
uv run ruff check .
```

Wire each worker into `package.json` so it is reachable from the repo root:

```json
"worker:<name>:setup": "cd <name>-worker && uv sync",
"worker:<name>:test":  "cd <name>-worker && uv run python -m pytest app/tests"
```

`pip install`, hand-rolled `python -m venv`, and `requirements.txt` are legacy: the auto-scoring workers still use them and are not a template for new work.

## Red flags

| Red flag                    | What it means                                               | Fix                                                         |
| --------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Shallow module              | Interface nearly as complex as implementation               | Merge, or delete the layer                                  |
| Pass-through function       | Only forwards arguments                                     | Call the real function directly                             |
| Temporal decomposition      | `read_x.py`, `parse_x.py`, `write_x.py` all know the format | One module owns the format                                  |
| Information leakage         | Same knowledge encoded in two places                        | Move it into one module                                     |
| Repetition                  | Same logic must be edited in several places                 | One source of truth — unless the abstraction would be worse |
| Flag-driven shared helper   | Bad abstraction forced two callers together                 | Split it; accept local duplication                          |
| Dictionary tunneling        | Raw nested dicts crossing layers                            | Typed DTO or dataclass                                      |
| Hidden I/O                  | Domain function calls storage, env, clock                   | Inject the value                                            |
| Boolean mode flag           | One function, two behaviors                                 | Split into named functions                                  |
| Special-general mixture     | UI-specific logic inside generic scoring                    | Push special case upward                                    |
| God service                 | One file validates, downloads, scores, persists, formats    | Split by layer                                              |
| Hard-to-name thing          | Abstraction is wrong                                        | Re-split it                                                 |
| Docstring repeats signature | No information added                                        | Document units, bounds, invariants                          |
| Leaky error                 | Traceback, signed URL, or answer text in response           | Translate at boundary                                       |

## Default decision rules

1. Pure and domain-specific → `app/grading/domain/`.
2. Orchestrates a workflow → `app/grading/services/`.
3. Talks to Supabase, storage, HTTP, queues, or logs → `app/grading/infrastructure/`.
4. Validates API input or output → `app/grading/schemas/`.
5. Reused across workers but not domain-specific → shared package, but only after real reuse exists.
6. Unsure between function and class → write the function.

## Pull request checklist

1. Does every new module have exactly one reason to change?
2. Is the domain logic pure and unit-tested without network?
3. Are request DTOs, domain models, and response DTOs separated?
4. Did I remove a special case rather than add a branch?
5. Are tenant, role, secret, and signed-URL risks handled explicitly and visibly?
6. Are frontend-visible states and feedback keys stable?
7. Did I leave the design at least slightly cleaner than I found it?

## Final standard

WQ Python code should read as the backend counterpart of the frontend architecture: **functional at the core, typed at the boundaries, layered by responsibility, secure by default**, with grading correctness, auditability, tenant isolation, and learner feedback all visible in one place per concern.
