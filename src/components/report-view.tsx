"use client"

import { useEffect, useState, useEffectEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { PublicReport } from "@/lib/public-report"
import { REPORT_PRICE_LABEL } from "@/lib/types"

const levelLabel = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  critical: "Critical — do not start",
} as const

export function ReportView({
  initial,
  paid,
  sessionId,
  mock,
}: {
  initial: PublicReport
  paid?: boolean
  sessionId?: string
  mock?: boolean
}) {
  const router = useRouter()
  const [report, setReport] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [confirming, setConfirming] = useState(Boolean(paid && !initial.unlocked))

  const confirmPayment = useEffectEvent(async () => {
    if (!paid || report.unlocked) return
    setConfirming(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          reportId: report.id,
          mock: mock || undefined,
        }),
      })
      const data = (await res.json()) as {
        report?: PublicReport
        error?: string
      }
      if (!res.ok || !data.report) {
        setError(data.error ?? "Could not confirm payment.")
        return
      }
      setReport(data.report)
      router.replace(`/r/${report.id}`)
    } catch {
      setError("Could not confirm payment.")
    } finally {
      setConfirming(false)
    }
  })

  useEffect(() => {
    void confirmPayment()
  }, [paid, sessionId, mock])

  async function unlock() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/checks/${report.id}/unlock`, {
        method: "POST",
      })
      const data = (await res.json()) as {
        url?: string
        error?: string
        report?: PublicReport
      }
      if (!res.ok) {
        setError(data.error ?? "Checkout failed.")
        return
      }
      if (data.report?.unlocked) {
        setReport(data.report)
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError("Checkout failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-5 pb-20 sm:px-8">
      <div className="animate-rise space-y-3">
        <p className="text-xs font-medium tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          Risk report
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {levelLabel[report.level]}
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted-ink)]">{report.summary}</p>
      </div>

      <div className="hero-panel relative overflow-hidden rounded-2xl bg-[var(--ink)] p-6 text-[var(--paper)] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--paper)]/55 uppercase">
              Risk score
            </p>
            <p className="font-display deposit-tick text-6xl tabular-nums">
              {report.score}
            </p>
          </div>
          <div className="text-sm text-[var(--paper)]/70">
            {report.companyName ? <p>Company: {report.companyName}</p> : null}
            {report.contact ? <p>Contact: {report.contact}</p> : null}
            <p className="mt-1 max-w-sm text-[var(--paper)]/45">
              Preview: {report.sourcePreview}
              {report.sourcePreview.length >= 160 ? "…" : ""}
            </p>
          </div>
        </div>
      </div>

      <section className="animate-rise-delay space-y-4">
        <h2 className="font-display text-2xl">Flags</h2>
        <ul className="space-y-3">
          {report.flags.length === 0 ? (
            <li className="rounded-xl border border-[var(--line)] bg-white/70 p-4 text-[var(--muted-ink)]">
              No strong scam signatures matched the paste.
            </li>
          ) : (
            report.flags.map((flag) => (
              <li
                key={flag.id}
                className="rounded-xl border border-[var(--line)] bg-white/70 p-4"
              >
                <p className="text-xs font-medium tracking-wide text-[var(--muted-ink)] uppercase">
                  {flag.severity}
                </p>
                <p className="mt-1 font-medium">{flag.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">{flag.detail}</p>
              </li>
            ))
          )}
        </ul>
        {!report.unlocked && report.hiddenFlagCount > 0 ? (
          <p className="text-sm text-[var(--muted-ink)]">
            +{report.hiddenFlagCount} more flag
            {report.hiddenFlagCount === 1 ? "" : "s"} sealed in the full report.
          </p>
        ) : null}
      </section>

      {report.unlocked ? (
        <>
          <section className="animate-rise-delay-2 space-y-3">
            <h2 className="font-display text-2xl">What to do next</h2>
            <ol className="list-decimal space-y-2 pl-5 text-[var(--muted-ink)]">
              {report.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
          </section>
          {report.replyTemplate ? (
            <section className="space-y-3">
              <h2 className="font-display text-2xl">Copy-paste reply</h2>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-[var(--ink)] p-5 text-sm leading-relaxed text-[var(--paper)]">
                {report.replyTemplate}
              </pre>
            </section>
          ) : null}
        </>
      ) : (
        <section className="animate-rise-delay-2 space-y-4 rounded-2xl border border-[var(--line)] bg-white/80 p-6">
          <h2 className="font-display text-2xl">Unlock sealed report</h2>
          <p className="text-[var(--muted-ink)]">
            Get every flag explained, a clear go/no-go action list, and a reply
            script you can send in under a minute. One payment. No account.
          </p>
          <p className="font-display text-3xl">{REPORT_PRICE_LABEL}</p>
          <Button size="lg" onClick={unlock} disabled={pending || confirming}>
            {confirming
              ? "Confirming payment…"
              : pending
                ? "Redirecting…"
                : `Unlock full report — ${REPORT_PRICE_LABEL}`}
          </Button>
          {error ? (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      )}
    </div>
  )
}
