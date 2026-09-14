'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Field, Notice, Submit } from '@/components/ui'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    setBusy(true)
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    // With email confirmation on there's no session yet; with it off there is.
    if (data.session) {
      router.push('/setup')
      router.refresh()
      return
    }
    setSentTo(email)
    setBusy(false)
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="heading">Check your email</h1>
        <p className="text-sm text-ink-soft">
          We&apos;ve sent a confirmation link to <strong className="text-ink">{sentTo}</strong>.
          Click it and you&apos;ll be signed in.
        </p>
        <Link href="/login" className="text-sm font-medium text-rust underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="heading">Create an account</h1>
      {error ? <Notice>{error}</Notice> : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <Submit>{busy ? 'Creating…' : 'Create account'}</Submit>
      </form>
      <p className="text-sm text-ink-soft">
        Already have one?{' '}
        <Link href="/login" className="font-medium text-rust underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
