import type { Metadata, Viewport } from 'next'
import { Newsreader, Archivo, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({ variable: '--font-newsreader', subsets: ['latin'], display: 'swap' })
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'], display: 'swap' })
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cairn',
  description: 'A ten-year plan for raising sons on purpose.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9ebe6' },
    { media: '(prefers-color-scheme: dark)', color: '#121917' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      className={`${newsreader.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
