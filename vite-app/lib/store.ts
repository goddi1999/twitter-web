import type { PostDto } from './posts.js'
import { getSupabase } from './supabase.js'

type PublishRow = {
  id: string
  post: PostDto
  created_at: string
}

function asPostDto(value: unknown): PostDto | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  if (typeof raw.id !== 'string' || typeof raw.text !== 'string') return null
  return value as PostDto
}

/** Full append log, newest first. */
export async function getAllPublishes(): Promise<PostDto[]> {
  const { data, error } = await getSupabase()
    .from('publishes')
    .select('post, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Supabase lesen fehlgeschlagen: ${error.message}`)
  }

  const rows = (data ?? []) as PublishRow[]
  return rows
    .map((row) => asPostDto(row.post))
    .filter((post): post is PostDto => post !== null)
}

/**
 * One row per `post.id` — the latest publish for that id.
 * Order: most recently published post first.
 */
export async function getLatestPostsById(): Promise<PostDto[]> {
  const publishes = await getAllPublishes()
  const seen = new Set<string>()
  const latest: PostDto[] = []

  for (const entry of publishes) {
    if (seen.has(entry.id)) continue
    seen.add(entry.id)
    latest.push(entry)
  }

  return latest
}

/** Latest publish for a logical post id, or undefined. */
export async function getLatestPublish(
  postId: string,
): Promise<PostDto | undefined> {
  const { data, error } = await getSupabase()
    .from('publishes')
    .select('post, created_at')
    .eq('post->>id', postId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(`Supabase lesen fehlgeschlagen: ${error.message}`)
  }

  const row = (data?.[0] ?? null) as PublishRow | null
  return row ? (asPostDto(row.post) ?? undefined) : undefined
}

/** Append only — never replaces an existing entry. */
export async function appendPublish(post: PostDto): Promise<PostDto> {
  const { error } = await getSupabase().from('publishes').insert({ post })

  if (error) {
    throw new Error(`Supabase schreiben fehlgeschlagen: ${error.message}`)
  }

  return post
}
