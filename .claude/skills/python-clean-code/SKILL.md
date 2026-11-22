---
name: python-clean-code
description: Prefer pure functions then modules then classes in WQ Python workers. Use when writing or reviewing FastAPI, workers, or scripts.
---

# Python Clean Code

## What It Does

Stops **class-first** and side-effect soup in workers. Design order: **pure function → module → class**. Complexity over style (Deep Modules).

## When to Reach for It

- Adding/changing Python under `*-worker/`, FastAPI apps, grading, CLI

Use **supabase-schema** for SQL/RPC contracts. Use **pytest** for worker tests. Use **clean-code** for TS/React.

## Prerequisites & Seams

- **uv** is the package manager: `uv sync` to install, `uv run <cmd>` to execute. Never `pip`, `venv`, or a bare `python -m pytest`
- Ruff/Black/pytest as configured in the package's `pyproject.toml`
- Open `reference.md` for layering folders, logging, and PR checklist detail

## Process

1. **State the seam.** Inputs/outputs as typed data; side effects only at edges (IO, HTTP, DB clients).
2. **Write the pure core first.** No hidden client/globals inside the transform.
3. **Promote only when earned.** Module for cohesive functions; class only for state, protocol, or DI boundary.
4. **Errors.** Prefer types/validation that make illegal states unrepresentable; raise typed domain errors at edges.
5. **Verify.** `uv run python -m pytest app/tests` in the worker directory; Ruff clean on edited files (`uv run ruff check`).

## Rules & Constraints

- **Never** run `pip install`, create a `.venv` by hand, or add a `requirements.txt` to a uv worker — dependencies go in `pyproject.toml` via `uv add`, and `uv.lock` is committed.
- **Never** put Supabase/HTTP calls inside pure transforms.
- **Never** invent a class for a single function with no state.
- **Never** log secrets, tokens, or clinical free text.
- Prefer explicit params over ambient context.
- Match existing worker folder layout; do not create parallel "utils" dumping grounds.

## Deliverables

- Pure core + thin edge adapters
- Tests green for the seam you touched, run through `uv run`
- `pyproject.toml` + `uv.lock` updated together when dependencies changed
