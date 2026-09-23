---
name: explain-simply
description: Explain a concept, schema, or technical term in plain beginner English — what it is, why it exists, how it works, pros, cons. Use when the user asks to break down or understand something.
---

# Explain Simply

## What It Does

Turns any concept — a schema, an algorithm, a pattern, a tool, an error — into an explanation a complete beginner follows on the first read. Closes one failure mode: **explanations written in expert shorthand that leave the beginner behind.**

The topic changes every run. The six-section skeleton does not.

## When to Reach for It

- User pastes a concept, schema, diagram, or technical term and wants to understand it
- Any phrasing of “explain X”, “break down X”, “what is X”, “walk me through X”

Use **teach** for a multi-session curriculum with practice. Use **diagram-codebase** when the answer is a diagram of this repo. Use **readme** for package documentation.

## Prerequisites & Seams

- The topic, or enough context to name it unambiguously
- The real artifact when the topic lives in this workspace or a linked page — explain that, never a generic stand-in

## Process

1. **Restate** the topic in one plain sentence. Cannot? Read the source first — never explain from memory.
2. **Disambiguate** when the term has two real meanings: ask exactly one question, then wait.
3. **What** — define it in one or two sentences, every unavoidable term defined inline at first use. Name and kill the common beginner misconception here.
4. **Why we need it** — the problem it solves, in a concrete everyday scenario. The reader feels the pain before meeting the cure.
5. **What happens** — the mechanism as a story, step by step. Carry one tiny worked example with real numbers through the steps.
6. **Pros**, then **Cons** — honestly scoped, no cheerleading.
7. **Takeaway** — one sentence to remember.
8. **Self-check** — re-read every sentence and ask: could a smart 15-year-old follow this with no outside help? Rewrite each sentence that fails, then answer.

## Rules & Constraints

- **Never** use a technical term without defining it at first use.
- **Never** open with history, trivia, or “it depends” — open with what it is.
- **Never** skip Cons; every concept has trade-offs.
- **Never** draw an analogy from another technical domain — use kitchen, school, money, or games.
- **Never** smooth over uncertainty; name which parts are unverified.
- **Never** answer in a language other than the question’s (German question → German explanation).
- **Never** expand into code steps, implementation, or a tutorial unless asked.
- Short sentences, one idea each. Six headers, no walls of text.

## Deliverables

One explanation, exactly this structure:

```
**What it is** — …

**Why we need it** — …

**What happens**
1. …
2. …
3. …

**Pros** — …

**Cons** — …

**Takeaway:** …
```
