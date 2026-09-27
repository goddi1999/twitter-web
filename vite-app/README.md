# twitter-web (`vite-app`)

Vite + React + TypeScript feed UI with Vercel Functions and Supabase persistence.

**Live app:** https://twitter-web-inky.vercel.app  
**API docs (in app):** open the menu → **Docs**  
**API README:** [api/README.md](./api/README.md)

## Features

- **Home** — loads posts from `GET /api/posts` (Supabase `publishes`)
- **Create post** — `POST /api/post` with optional memoji `avatarId`
- **Docs** — official curl / Bash / Java examples against production
- **Theme** — light/dark toggle + accent colors (`data-accent`)

## Quick start

```bash
cd vite-app
npm install
npx vercel link
npx vercel env pull .env.local --yes
npx vercel dev          # UI + /api on http://localhost:3000
```

UI-only (no API): `npm run dev` → http://localhost:5173

```bash
npm run typecheck
npm run build
```

## API (official)

| Method | URL |
| --- | --- |
| `GET` | https://twitter-web-inky.vercel.app/api/posts |
| `POST` | https://twitter-web-inky.vercel.app/api/post |

Env on Vercel project **`vite-app`** (server-only, no `VITE_` prefix):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Redeploy after changing env vars.

### Example

```bash
curl -sS https://twitter-web-inky.vercel.app/api/posts -H 'Accept: application/json'

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

More examples: [api/client.http](./api/client.http) and the in-app Docs page.

## Deploy

Vercel **Root Directory** = `vite-app`. Framework Vite; SPA rewrite leaves `/api/*` to Functions.
