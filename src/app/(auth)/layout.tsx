export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-10 text-center font-display text-3xl text-ink">Cairn</p>
        {children}
      </div>
    </main>
  )
}
