# API

Vercel Edge functions for a Post / Comment / Like feed used by the Vite UI.

## What it does

HTTP handlers under `/api` **list** posts and **append** full post publishes. Shared validation and DTOs live in `../lib`. Persistence is an in-memory **append-only log** (Edge-safe, no database) that resets on cold start. **Supabase will replace this later.**

### Rules

1. **`post.id` is required** — the client always sends a stable id so we can group publishes of the same post.
2. **Full document every time** — after create / like / add or remove comment, `POST /api/post` with the complete `post` (same `id`, updated `likeCount` / `comments`).
3. **Append only — never overwrite** — each request is a new log entry. Two publishes with the same `id` = two rows; the **newest** is the current snapshot.
4. **Never send author identity** — omit `displayName` / `handle` / `avatarUrl`. Server assigns a random `@wq-org/avatars` memoji; same `post.id` / `comment.id` reuses that author.

### Grouping (same `post.id` twice)

```text
Log (append):
  1) id=abc  likeCount=0  comments=[]
  2) id=abc  likeCount=1  comments=[…]   ← newest for abc
  3) id=xyz  likeCount=0  comments=[]

GET /api/posts →
  posts:      [ snapshot of abc (#2), snapshot of xyz (#3) ]  // grouped for feed
  publishes:  [ #3, #2, #1 ]                                  // full history
```

No like / comment mutation routes. The app owns that logic; we only store publishes.

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

**Vercel Root Directory must be `vite-app`** (the folder that contains `package.json`). If Root Directory is the repo root, install is skipped and the build fails with `vite: command not found`.

## Usage

With `vercel dev` running, base URL is typically `http://localhost:3000`.

### List posts (grouped) + publish history

```bash
curl -s http://localhost:3000/api/posts
```

```json
{
  "posts": [],
  "publishes": []
}
```

- **`posts`**: one entry per `post.id` (latest publish) — use this for the feed  
- **`publishes`**: every append, newest first — history / debugging  

### Publish a post (append)

**`id` is required.** Do not send author fields:

```bash
curl -s -X POST http://localhost:3000/api/post \
  -H 'Content-Type: application/json' \
  -d '{
    "post": {
      "id": "11111111-1111-1111-1111-111111111111",
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 0,
      "comments": []
    }
  }'
```

Always **201** — a new log entry was appended.

After a like or comment, publish again with the **same** `id` and the updated document:

```bash
curl -s -X POST http://localhost:3000/api/post \
  -H 'Content-Type: application/json' \
  -d '{
    "post": {
      "id": "11111111-1111-1111-1111-111111111111",
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 1,
      "comments": [
        {
          "id": "22222222-2222-2222-2222-222222222222",
          "text": "Cooler Beitrag!",
          "timestamp": "2026-09-26T12:00:00.000Z"
        }
      ],
      "createdAt": "2026-09-26T11:00:00.000Z"
    }
  }'
```

Optional on the client: `createdAt`, comment `id` / `timestamp` (server fills if omitted). Comment authors are server-assigned (reused when the same comment `id` was published before).

Missing `post.id` → **400** `post.id ist erforderlich.`

All routes also answer `OPTIONS` with CORS headers (`Access-Control-Allow-Origin: *`).

## Output layout

```text
vite-app/
├── api/
│   ├── posts.ts              # GET  /api/posts  (posts + publishes)
│   └── post/
│       └── index.ts          # POST /api/post  (append; id required)
├── lib/
│   ├── http.ts
│   ├── posts.ts
│   └── store.ts              # append-only log + group-by-id
├── tsconfig.api.json
└── vercel.json
```

## Pipeline / overview

```text
Client app
  │  always sends post.id
  │  local like/comment → POST full post again (same id)
  ▼
Vercel Edge (fra1)
  └─ append log  →  later: Supabase
  ▼
GET: posts = latest per id | publishes = full log
```

## Configuration

| Setting | Where | Value |
| --- | --- | --- |
| Runtime | each `api/**/*.ts` `config` | `edge` |
| Region | same | `fra1` |
| Max text / comment length | `lib/posts.ts` `MAX_TEXT_LENGTH` | `280` |
| Author | `randomAuthor()` | from `@wq-org/avatars` (never from client) |
| Storage | `lib/store.ts` | append-only log, group by `id` (→ Supabase later) |

## Design decisions

- **Required `post.id`**: client owns the stable key for grouping / later Supabase rows.
- **Append + group**: history stays in the log; feed uses latest-per-id.
- **Server-only author**: ignored from client; stable across republishes of the same id.
- **German validation messages**: match `vercel_func.md`.

## Known limitations

- Log resets on redeploy / cold start / another isolate.
- No auth; CORS allows any origin.
- `npm run dev` (Vite) does not serve these functions — use `vercel dev`.

## Development

```bash
npm run typecheck
```

Shared logic belongs in `lib/`. Keep `export const config = { runtime: 'edge', regions: ['fra1'] }` on routes.
