# User story — Admin login and post moderation

**Intent:** The tutor (admin) signs in so that only they can write posts from the web app and keep the shared course feed clean by hiding or deleting posts.

## Goal

**Several goals** — sign-in, gated writing and moderation each have value on their own.

- **G1** Admin can sign in and out of the web app ("block with a login").
- **G2** Create post in the web app is only available while signed in ("only when i login i can create post").
- **G3** Signed-in admin can hide a post and unhide it again ("manage … hide").
- **G4** Signed-in admin can delete a post, confirmed first ("manage … delete").
- **G5** Hidden and deleted posts disappear from the public feed (inferred — what "hide" means to viewers).
- **G6** Signed in, the admin sees every post (hidden ones included) below the composer, split by a separator, and can manage any of them — not only their own ("see all the posts … beneath that use separator").

## Description

The feed is public and the Java publish-client (students) posts to `POST /api/post` without any login. That endpoint stays open: the gate is on the web app's Create post screen only.

Credentials live in server env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) — never in the frontend bundle. A successful login returns a signed token (12 h). Moderation calls send it as `Authorization: Bearer …`.

Posts are an append-only log (`publishes`). Moderation is a second append-only log, `moderation_actions` (`hide` · `unhide` · `delete`), written with the Supabase service-role key and closed to anonymous access, so nobody holding the public key can forge or undo it. The latest action per post wins; `delete` is final in the UI but recoverable in the database.

**Out of scope:** multiple admin accounts, password reset, editing other people's posts, gating the public API.

## User Action 1 — Sign in [G1, G2]
On Create post, a signed-out visitor sees a sign-in form (username, password) instead of the composer.

## User Action 2 — Sign out [G1]
The signed-in admin taps "Sign out" and the composer is replaced by the sign-in form again.

## User Action 3 — Hide / unhide [G3, G5]
On any post the admin opens the ⋯ menu (popover) and picks Hide or Unhide.

## User Action 4 — Delete [G4, G5]
In the ⋯ menu the admin picks Delete; a drawer asks for confirmation.

## User Action 5 — Manage from Create post [G6, G3, G4]
Signed in on Create post, the admin scrolls past the separator to "All posts" and uses ⋯ on any row.

## Initial State
- Signed out. The feed shows every post that is not hidden or deleted. No ⋯ menus.

## Sample Interaction
1. Visitor opens Create post → sees "Sign in to post" with username + password. [G1, G2]
2. Enters a wrong password → "Wrong username or password." under the form; nothing else changes. [G1]
3. Enters `admin` + the right password → composer appears with "Signed in as admin · Sign out". [G1, G2]
4. Goes to For You → every card shows ⋯. Opens ⋯ on a post → Hide. The card dims and shows "Hidden". [G3]
5. A signed-out viewer reloads For You → that post is gone. [G5]
6. Admin opens ⋯ on the hidden post → Unhide → it is normal again for everyone. [G3, G5]
7. Admin opens ⋯ → Delete → drawer: "Delete this post?" → Delete. The card disappears for everyone. [G4, G5]
8. On Create post, below the separator, "All posts" lists every post including the hidden one; publishing a new post keeps the admin on the page and puts it at the top. [G6]
9. Admin signs out → Create post shows the sign-in form; ⋯ menus are gone. [G1, G2]

## Detailed Requirements
- R1 Login checks username + password on the server; constant-time compare; same error for wrong user or wrong password. [G1]
- R2 Token = signed (HMAC-SHA256) `{ sub, exp }`, 12 h; expired or tampered tokens are rejected with 401. [G1]
- R3 The token is kept in the browser until it expires or the admin signs out; an expired token signs the admin out. [G1]
- R4 Signed out, Create post renders only the sign-in form; no composer, no Post button. [G2]
- R5 `POST /api/admin/moderate { postId, action }` requires a valid token; `action ∈ hide | unhide | delete`. [G3, G4]
- R6 `GET /api/posts` leaves out hidden and deleted posts; with a valid admin token it also returns hidden posts marked `moderation: "hidden"`. Deleted posts are never returned. [G3, G5]
- R7 Delete needs a second, explicit confirmation in a drawer; the confirm button names the action ("Delete post"). [G4]
- R8 Every failure shows a readable message where it happened (form, menu, drawer); the app never crashes. [G1–G4]
- R10 Signed in, Create post shows the composer, then a separator, then "All posts": every post newest first, hidden ones marked, each with ⋯ (any author). Publishing refreshes this list in place. [G6]
- R9 Mobile: inputs ≥ 16 px, targets ≥ 44 px, the sign-in button directly under the last field. [G1]

## Subtasks
- S1 `lib/admin-auth.ts` (credentials, token sign/verify) + `POST /api/admin/login`. [G1]
- S2 Migration `moderation_actions` + `lib/moderation.ts` (service-role client). [G3, G4, G5]
- S3 `POST /api/admin/moderate`; filter in `GET /api/posts`. [G3, G4, G5]
- S4 `useAdminSession` + sign-in form; gate Create post. [G1, G2]
- S5 ⋯ popover + delete drawer on post cards; hidden styling. [G3, G4]
- S6 `useFeed` shared by the feed and `AdminPostList` under the composer. [G6]

## Questions
- Q1 ~~Apply the migration to production?~~ Confirmed by the user on 2026-11-22.
- Q2 Add `ADMIN_*` and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel project env (Production + Preview)?
- Q3 Should students' republish of a deleted post (same id) stay deleted? Current answer: yes — moderation wins over new publishes.

## Goal coverage

| Goal | Actions | Requirements | Subtasks |
| --- | --- | --- | --- |
| G1 | UA1, UA2 | R1, R2, R3, R8, R9 | S1, S4 |
| G2 | UA1 | R4 | S4 |
| G3 | UA3 | R5, R6, R8 | S2, S3, S5 |
| G4 | UA4 | R5, R7, R8 | S2, S3, S5 |
| G5 | UA3, UA4 | R6 | S2, S3 |
| G6 | UA5 | R10 | S6 |
