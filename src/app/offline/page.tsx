export const metadata = { title: 'Offline · Cairn' }

export default function OfflinePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-5 py-16">
      <p className="eyebrow">No connection</p>
      <h1 className="heading">Cairn needs the internet for this bit.</h1>
      <p className="max-w-prose text-ink-soft">
        Your sons&apos; details and everything you&apos;ve recorded are safe. Reconnect and pull
        down to refresh.
      </p>
    </main>
  )
}
