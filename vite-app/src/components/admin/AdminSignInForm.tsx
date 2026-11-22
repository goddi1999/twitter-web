import { useId, useState, type FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useAdminSession } from './use-admin-session'

const INPUT =
  'block h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none aria-invalid:border-destructive'

type AdminSignInFormProps = {
  className?: string
}

/** Pattern A (top-anchored): two fields, the error under them, the action directly below. */
export function AdminSignInForm({ className }: AdminSignInFormProps) {
  const { signIn } = useAdminSession()
  const id = useId()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await signIn(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className={cn(
        'w-full max-w-xl rounded-2xl border border-border/60 bg-card/40 p-4 text-left',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
          <LockKeyhole className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 leading-tight">
          <h2 className="text-base font-semibold text-foreground">Sign in to post</h2>
          <p className="text-sm text-muted-foreground">
            Only the admin can write and manage posts.
          </p>
        </div>
      </div>

      <label htmlFor={`${id}-user`} className="mt-5 mb-1.5 block text-sm font-medium">
        Username
      </label>
      <input
        id={`${id}-user`}
        name="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        aria-invalid={error !== null}
        className={INPUT}
      />

      <label htmlFor={`${id}-pass`} className="mt-4 mb-1.5 block text-sm font-medium">
        Password
      </label>
      <input
        id={`${id}-pass`}
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        enterKeyHint="go"
        aria-invalid={error !== null}
        aria-describedby={`${id}-error`}
        className={INPUT}
      />

      <p id={`${id}-error`} role="alert" className="mt-1.5 min-h-5 text-sm text-destructive">
        {error}
      </p>

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-11 w-full rounded-full">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
