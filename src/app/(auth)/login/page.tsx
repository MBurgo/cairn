'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Field, Notice, Submit } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const form = new FormData(e.currentTarget)
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="instruction">Sign in</h1>
      {error ? <Notice>{error}</Notice> : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="current-password" />
        <Submit>{busy ? 'Signing in…' : 'Sign in'}</Submit>
      </form>
      <p className="text-sm text-ink-soft">
        No account yet?{' '}
        <Link href="/signup" className="font-medium text-accent underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
