# API

Vercel Edge functions for a Post / Comment / Like feed used by the Vite UI.

## What it does

HTTP handlers under `/api` **list** stored publishes and **append** a full post document. Shared validation and DTOs live in `../lib`. Persistence is an in-memory **append-only log** (Edge-safe, no database) that resets on cold start. **Supabase will replace this later.**

### Rules

1. **Full document every time** — after create / like / add or remove comment in the app, `POST /api/post` with the complete `post` (text, `likeCount`, all `comments`).
2. **Append only — never overwrite** — each request is a new publish entry. We do not update or delete previous rows.
3. **Never send author identity** — omit `displayName`, `handle`, and `avatarUrl` (any `author` on the request is ignored). The server picks a random `@wq-org/avatars` memoji and uses its `name` as `displayName`, a derived `handle`, and the CDN `avatarUrl`. On republish of the same post/comment `id`, that author is reused.

There are no like / comment mutation routes. The app owns that logic; we only store publishes.

## Setup

**Prerequisites:** Node.js, npm, and the [Vercel CLI](https://vercel.com/docs/cli) (needed to serve `api/` locally; `vite` alone does not).

```bash
cd vite-app
npm install
npx vercel link   # once per machine / project
npx vercel dev
```

Typecheck the API + lib sources (via `tsconfig.api.json`):

```bash
npm run typecheck
```

Deploy with the Vite app (see `../vercel.json`: framework `vite`, `outputDirectory` `dist`, SPA rewrite that leaves `/api/*` alone).

## Usage

With `vercel dev` running, base URL is typically `http://localhost:3000`.

### List publishes

```bash
curl -s http://localhost:3000/api/posts
```

```json
{ "posts": [] }
```

Returns the append log newest-first (every publish, not deduped).

### Publish a post (append)

Always send the whole post body fields. **Do not send `author` / `displayName` / `handle` / `avatarUrl`** — the server fills those from a random wq-avatar:

```bash
curl -s -X POST http://localhost:3000/api/post \
  -H 'Content-Type: application/json' \
  -d '{
    "post": {
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 0,
      "comments": []
    }
  }'
```

```json
{
  "post": {
    "id": "<uuid>",
    "text": "Hallo Hochschule Reutlingen!",
    "likeCount": 0,
    "comments": [],
    "author": {
      "displayName": "Ada",
      "handle": "ada",
      "avatarUrl": "https://cdn.jsdelivr.net/gh/wq-org/wq-avatars@main/..."
    },
    "createdAt": "<iso8601>"
  }
}
```

(`displayName` / `handle` / `avatarUrl` in the response come from the chosen memoji.)

Always **201** — a new log entry was appended.

After a like or comment change in the app, publish again with the updated full document (still no author fields). That adds another entry; it does not replace the previous one:

```bash
curl -s -X POST http://localhost:3000/api/post \
  -H 'Content-Type: application/json' \
  -d '{
    "post": {
      "id": "<uuid>",
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 1,
      "comments": [
        {
          "id": "<comment-uuid>",
          "text": "Cooler Beitrag!",
          "timestamp": "2026-09-26T12:00:00.000Z"
        }
      ],
      "createdAt": "2026-09-26T11:00:00.000Z"
    }
  }'
```

Optional fields: omit `id` / `createdAt` / comment `id` / comment `timestamp` and the server fills them. Comment authors are also server-assigned (random memoji, or reused if that comment `id` was published before).

All routes also answer `OPTIONS` with CORS headers (`Access-Control-Allow-Origin: *`).

## Output layout

```text
vite-app/
├── api/
│   ├── posts.ts              # GET  /api/posts
│   └── post/
│       └── index.ts          # POST /api/post  (append publish)
├── lib/
│   ├── http.ts               # json / error / options / readJson
│   ├── posts.ts              # validation, DTOs, random avatar, publish
│   └── store.ts              # append-only in-memory log
├── tsconfig.api.json
└── vercel.json
```

## Pipeline / overview

```text
Client app
  │  local like / comment / remove
  │  then POST full post (no author / avatarUrl)
  ▼
Vercel Edge (fra1)
  ├─ lib/http.ts
  ├─ lib/posts.ts   parse + randomAuthor (wq name/handle/url) + publishPost
  └─ lib/store.ts   append-only array  →  later: Supabase
  ▼
JSON { post } | { posts } | { error }
```

## Configuration

| Setting | Where | Value |
| --- | --- | --- |
| Runtime | each `api/**/*.ts` `config` | `edge` |
| Region | same | `fra1` |
| Max text / comment length | `lib/posts.ts` `MAX_TEXT_LENGTH` | `280` |
| Default name / handle | `lib/posts.ts` `randomAuthor` | from `@wq-org/avatars` memoji `name` |
| Avatars | same | CDN `imageUrl` (never from client) |
| Storage | `lib/store.ts` | append-only log (→ Supabase later) |
| SPA vs API routing | `vercel.json` `rewrites` | everything except `/api/*` → `index.html` |

No env vars are required for the current store.

## Design decisions

- **Append-only publishes**: no in-place update/delete. App sends a new full-document publish for every meaningful change; we only store.
- **Server-only author**: client `displayName` / `handle` / `avatarUrl` ignored; `randomAuthor()` uses the memoji’s `name` + CDN url; same post/comment `id` keeps that author on later publishes.
- **Ephemeral Edge log until Supabase**: fine for the exercise; not durable across cold starts or multiple isolates.
- **German validation messages**: match `vercel_func.md` wording.

## Known limitations

- Log resets on redeploy / cold start / another isolate.
- `GET /api/posts` returns every publish (duplicates of the same logical `id` are expected until you dedupe client-side or move to Supabase).
- No auth; CORS allows any origin.
- `npm run dev` (Vite) does not serve these functions — use `vercel dev`.

## Development

```bash
# Typecheck api/ + lib/
npm run typecheck
```

Shared logic belongs in `lib/`, not duplicated in handlers. Keep `export const config = { runtime: 'edge', regions: ['fra1'] }` consistent with existing routes.
