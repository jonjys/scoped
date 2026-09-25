import type { Metadata } from "next"
import { Syne, IBM_Plex_Sans } from "next/font/google"
import Link from "next/link"
import { isProUnlocked } from "@/lib/billing"
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
  title: "Scoped — Fixed-price offers with deposits",
  description:
    "Turn a messy client brief into a fixed-scope offer page and collect a deposit before you start.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isPro = await isProUnlocked()

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="font-body min-h-full flex flex-col text-[var(--ink)]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-display text-xl tracking-tight">
            Scoped
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/new"
              className="text-[var(--muted-ink)] transition hover:text-[var(--ink)]"
            >
              New offer
            </Link>
            {isPro ? (
              <span className="rounded-md bg-[var(--acid)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]">
                Pro
              </span>
            ) : (
              <Link
                href="/pro"
                className="rounded-md bg-[var(--ink)] px-3 py-1.5 text-[var(--paper)] transition hover:bg-[var(--ink)]/90"
              >
                Get Pro
              </Link>
            )}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-5 py-10 text-sm text-[var(--muted-ink)] sm:px-8">
          Scoped fills the hole between “sounds good” and a paid deposit.
        </footer>
      </body>
    </html>
  )
}
