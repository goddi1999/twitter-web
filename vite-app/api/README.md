# API

Vercel **Node** functions for a Post / Comment / Like feed used by the Vite UI.

**Official production base:** https://twitter-web-inky.vercel.app  
**In-app docs:** open **Docs** in the app menu (same site).

## What it does

HTTP handlers under `/api` **list** posts and **append** full post publishes. Shared validation and DTOs live in `../lib`. Persistence is Supabase table `publishes` (`post` jsonb, append-only).

### Env (Vercel project `vite-app`)

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key for select + insert |

Redeploy after changing env. Local: `npx vercel env pull .env.local --yes` then `npx vercel dev`.

### Rules

1. **`post.id` is required** — stable id so publishes of the same post can be grouped.
2. **Full document every time** — after create / like / add or remove comment, `POST /api/post` with the complete `post`.
3. **Append only — never overwrite** — each request is a new row. Newest row for an id = current snapshot.
4. **Author from avatar id** — optional `avatarId` or `author: { id }`. Server resolves `@wq-org/avatars`. Never send `displayName` / `handle` / `avatarUrl`.
5. **Comment `id` / `timestamp` optional** — timestamps are flexible ISO-ish strings; server fills gaps.

### Grouping (same `post.id` twice)

```text
Log (append):
  1) id=abc  likeCount=0  comments=[]
  2) id=abc  likeCount=1  comments=[…]   ← newest for abc
  3) id=xyz  likeCount=0  comments=[]

GET /api/posts →
  posts:      [ snapshot of abc (#2), snapshot of xyz (#3) ]
  publishes:  [ #3, #2, #1 ]
```

No like / comment mutation routes. The app owns that logic; we only store publishes.

## Setup

```bash
cd vite-app
npm install
npx vercel link
npx vercel env pull .env.local --yes
npx vercel dev
```

```bash
npm run typecheck   # tsc -b
```

**Vercel Root Directory must be `vite-app`.**

## Usage

### Production

```bash
curl -sS https://twitter-web-inky.vercel.app/api/posts \
  -H 'Accept: application/json'
```

```bash
curl -sS -X POST https://twitter-web-inky.vercel.app/api/post \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "post": {
      "id": "11111111-1111-1111-1111-111111111111",
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 0,
      "comments": [],
      "avatarId": "avatar_female_german_01"
    }
  }'
```

### Local

Base URL `http://localhost:3000` with the same paths (`vercel dev`).

- **`posts`**: one entry per `post.id` (latest) — feed  
- **`publishes`**: every append, newest first  

Always **201** on successful publish. Missing `post.id` → **400**.

HTTP examples: `api/client.http`.

## Layout

```text
vite-app/
├── api/
│   ├── posts.ts              # GET  /api/posts
│   ├── post/index.ts         # POST /api/post
│   ├── client.http
│   └── README.md
├── lib/
│   ├── http.ts
│   ├── posts.ts
│   ├── store.ts              # Supabase publishes
│   └── supabase.ts
└── vercel.json
```

## Pipeline

```text
Client / curl / Java
  │  POST full post (stable id)
  ▼
Vercel Function (nodejs, fra1)
  └─ insert into Supabase publishes
  ▼
GET /api/posts → posts = latest per id | publishes = full log
Home UI fetches GET on load (+ Refresh)
```

## Configuration

| Setting | Value |
| --- | --- |
| Runtime | `nodejs` |
| Region | `fra1` |
| Max text | 280 |
| Storage | Supabase `publishes` |
| Env | `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` |

## Known limitations

- Publishable key needs RLS/grants allowing `select` + `insert` on `publishes`.
- No auth; CORS `*`. Production `/api` may be VPN-restricted.
- `npm run dev` does not serve functions — use `vercel dev`.
