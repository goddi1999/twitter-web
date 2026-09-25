# API

Vercel Edge functions for a Post / Comment / Like feed used by the Vite UI.

## What it does

HTTP handlers under `/api` create posts, list them, like them, and add or remove comments. Shared validation and DTOs live in `../lib`. Persistence is an in-memory `Map` (Edge-safe, no database) that resets on cold start.

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

### List posts

```bash
curl -s http://localhost:3000/api/posts
```

```json
{ "posts": [] }
```

### Create a post

```bash
curl -s -X POST http://localhost:3000/api/post \
  -H 'Content-Type: application/json' \
  -d '{"text":"Hallo Hochschule Reutlingen!"}'
```

```json
{
  "post": {
    "id": "<uuid>",
    "text": "Hallo Hochschule Reutlingen!",
    "likeCount": 0,
    "comments": [],
    "author": {
      "displayName": "HSRT Student",
      "handle": "hsrtstudent",
      "avatarUrl": "https://api.dicebear.com/9.x/thumbs/svg?seed=hsrt"
    },
    "createdAt": "<iso8601>"
  }
}
```

Optional author override:

```json
{
  "text": "Hallo!",
  "author": {
    "displayName": "Ada",
    "handle": "ada",
    "avatarUrl": "https://example.com/a.png"
  }
}
```

### Like a post

```bash
curl -s -X POST http://localhost:3000/api/post/like \
  -H 'Content-Type: application/json' \
  -d '{"postId":"<uuid>"}'
```

### Add a comment

```bash
curl -s -X POST http://localhost:3000/api/post/comment \
  -H 'Content-Type: application/json' \
  -d '{"postId":"<uuid>","text":"Cooler Beitrag!"}'
```

### Remove a comment

```bash
curl -s -X DELETE http://localhost:3000/api/post/comment \
  -H 'Content-Type: application/json' \
  -d '{"postId":"<uuid>","commentId":"<uuid>"}'
```

All routes also answer `OPTIONS` with CORS headers (`Access-Control-Allow-Origin: *`).

## Output layout

```text
vite-app/
├── api/
│   ├── posts.ts              # GET  /api/posts
│   └── post/
│       ├── index.ts          # POST /api/post
│       ├── like.ts           # POST /api/post/like
│       └── comment.ts        # POST|DELETE /api/post/comment
├── lib/
│   ├── http.ts               # json / error / options / readJson
│   ├── posts.ts              # validation, DTOs, domain ops
│   └── store.ts              # in-memory Map
├── tsconfig.api.json
└── vercel.json
```

## Pipeline / overview

```text
Client (Vite UI or curl)
        │
        ▼
  Vercel Function (Edge, fra1)
        │
        ├─ lib/http.ts     CORS + JSON helpers
        ├─ lib/posts.ts    validate text (≤280), author, like/comment
        └─ lib/store.ts    Map<id, PostDto>  ← resets on cold start
        │
        ▼
   JSON { post } | { posts } | { error }
```

## Configuration

| Setting | Where | Value |
| --- | --- | --- |
| Runtime | each `api/**/*.ts` `config` | `edge` |
| Region | same | `fra1` |
| Max text / comment length | `lib/posts.ts` `MAX_TEXT_LENGTH` | `280` |
| Default author | `lib/posts.ts` `DEFAULT_AUTHOR` | HSRT Student / hsrtstudent |
| SPA vs API routing | `vercel.json` `rewrites` | everything except `/api/*` → `index.html` |

No env vars are required for the current store.

## Design decisions

- **In-memory store on Edge** (`lib/store.ts`): keeps the student Post/Comment exercise runnable without a DB. Documented tradeoff: data does not survive cold starts or multiple instances.
- **German validation messages** (`Text darf nicht leer sein.`, `… maximal 280 Zeichen …`): match the Java exercise wording in `vercel_func.md`.
- **HTTP-shaped API around the model**: create / like / comment / remove-comment, plus `GET /api/posts` for the feed UI — not a dump of Java method signatures.

## Known limitations

- Store is ephemeral; likes, posts, and comments vanish after redeploy / cold start / another isolate.
- No auth; CORS allows any origin.
- No HSRT IP / Firewall gate in code yet (mentioned only as a future idea in `vercel_func.md`).
- `npm run dev` (Vite) does not serve these functions — use `vercel dev` (or a deployed URL).

## Development

```bash
# Typecheck api/ + lib/
npm run typecheck

# Add a route: new file under api/ matching the URL path
# (e.g. api/post/foo.ts → /api/post/foo), export GET/POST/… + config
```

Shared logic belongs in `lib/`, not duplicated in handlers. Keep `export const config = { runtime: 'edge', regions: ['fra1'] }` consistent with existing routes.
