'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

/** Registers the service worker. Nothing rendered. */
export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])
  return null
}

interface InstallEvent extends Event {
  prompt: () => Promise<void>
}

const DISMISSED = 'cairn.install.dismissed'

const subscribeNever = () => () => {}

/** True once hydrated, false during SSR — so we can read `window` while rendering. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED) !== null
  } catch {
    // Private browsing can throw on access; treat it as not dismissed.
    return false
  }
}

/**
 * Prompts for home-screen install.
 *
 * This matters more than it looks: on iPhone, notifications only work once the
 * app has been added to the home screen. Safari will not send them to a tab.
 * Since the weekly nudge is the whole retention mechanic, the install is
 * load-bearing rather than a nicety — so iOS gets explicit instructions
 * instead of a button, because Safari offers no programmatic prompt.
 */
export function InstallPrompt() {
  const hydrated = useHydrated()
  const [deferred, setDeferred] = useState<InstallEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as InstallEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  // Derived rather than stored, so nothing is set from inside an effect.
  if (!hydrated) return null
  if (dismissed || wasDismissed() || isStandalone()) return null

  const isIos = /iPad|iPhone|iPod/.test(window.navigator.userAgent)
  if (!isIos && !deferred) return null

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED, '1')
    } catch {
      // Nothing to do — it will simply ask again next time.
    }
  }

  return (
    <div className="border-b border-rule bg-bone">
      <div className="mx-auto flex max-w-2xl flex-col gap-2 px-5 py-3">
        <p className="text-sm text-ink">
          {isIos ? (
            <>
              <strong className="font-semibold">Put Cairn on your home screen.</strong> Tap the
              Share button, then <strong className="font-semibold">Add to Home Screen</strong>.
              It&apos;s the only way reminders can reach you on an iPhone.
            </>
          ) : (
            <>
              <strong className="font-semibold">Install Cairn</strong> so it opens like an app and
              can remind you each week.
            </>
          )}
        </p>
        <div className="flex items-center gap-4">
          {!isIos && deferred ? (
            <button
              onClick={async () => {
                await deferred.prompt()
                dismiss()
              }}
              className="rounded-sm bg-card px-4 py-2 text-sm font-semibold text-card-ink"
            >
              Install
            </button>
          ) : null}
          <button onClick={dismiss} className="text-sm text-ink-faint hover:text-ink">
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
