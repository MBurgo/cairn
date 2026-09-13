export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-display text-3xl text-accent">Cairn</p>
        {children}
      </div>
    </main>
  )
}
