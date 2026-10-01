import type { Metadata } from "next"
import { Syne, IBM_Plex_Sans } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "ClientProof — Check a client before you start",
  description:
    "Paste an inbound hiring message or brief. Get a go/no-go risk report before you quote or start work. 49 kr sealed report. No account.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="font-body min-h-full flex flex-col text-[var(--ink)]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-display text-xl tracking-tight">
            ClientProof
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#how"
              className="text-[var(--muted-ink)] transition hover:text-[var(--ink)]"
            >
              How it works
            </a>
            <Link
              href="/#check"
              className="rounded-md bg-[var(--ink)] px-3 py-1.5 text-[var(--paper)] transition hover:bg-[var(--ink)]/90"
            >
              Run a check
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-5 py-10 text-sm text-[var(--muted-ink)] sm:px-8">
          ClientProof — Nytto Labs. Pay once when the free score isn’t enough.
        </footer>
      </body>
    </html>
  )
}
