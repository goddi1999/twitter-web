-- Admin moderation for the course feed: an append-only log, newest action per post wins.
-- RLS is on with NO policies: the public (publishable) key — shipped inside the students'
-- Java client — can neither read nor write this table. Only the server's service role can.

create table if not exists public.moderation_actions (
  id bigint generated always as identity primary key,
  post_id text not null,
  action text not null check (action in ('hide', 'unhide', 'delete')),
  created_at timestamptz not null default now()
);

create index if not exists moderation_actions_post_id_created_at_idx
  on public.moderation_actions (post_id, created_at desc);

alter table public.moderation_actions enable row level security;

comment on table public.moderation_actions is
  'Append-only admin moderation (hide/unhide/delete) for publishes.post->>id; service role only.';
