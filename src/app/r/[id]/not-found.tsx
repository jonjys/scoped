import Link from "next/link"

export default function ReportNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-start justify-center gap-4 px-5">
      <h1 className="font-display text-3xl">Report not found</h1>
      <p className="text-[var(--muted-ink)]">
        That check link is missing or expired. Run a new scan from the home page.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--ink)] px-4 py-2.5 text-sm text-[var(--paper)]"
      >
        New check
      </Link>
    </div>
  )
}
