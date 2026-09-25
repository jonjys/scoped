"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { depositCents, formatMoney } from "@/lib/money"
import type { Offer } from "@/lib/types"

type Props = {
  offer: Offer
  showWatermark?: boolean
  interactive?: boolean
  onPaid?: (offer: Offer) => void
}

export function OfferPreview({
  offer,
  showWatermark = false,
  interactive = false,
  onPaid,
}: Props) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const deposit = depositCents(offer.priceCents, offer.depositPercent)

  async function payDeposit() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/offers/${offer.id}/deposit`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Payment failed.")
        return
      }
      if (data.offer) onPaid?.(data.offer)
      if (data.url) window.location.href = data.url
    } catch {
      setError("Network error.")
    } finally {
      setPending(false)
    }
  }

  return (
    <article className="offer-sheet relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_30px_80px_-40px_rgba(11,31,26,0.55)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[var(--acid)]" />
      <div className="space-y-8 p-6 sm:p-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-md bg-[var(--ink)]/5 text-[var(--ink)]"
            >
              Fixed scope
            </Badge>
            {offer.paidDeposit ? (
              <Badge className="rounded-md bg-[var(--acid)] text-[var(--ink)]">
                Deposit paid
              </Badge>
            ) : null}
          </div>
          <div>
            <p className="text-sm text-[var(--muted-ink)]">
              Prepared for {offer.clientName} by {offer.freelancerName}
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
              {offer.title}
            </h1>
          </div>
        </header>

        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-[0.16em] text-[var(--muted-ink)] uppercase">
            Brief as received
          </h2>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--ink)]/90">
            {offer.brief}
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <ListBlock title="In scope" items={offer.included} tone="in" />
          <ListBlock
            title="Out of scope"
            items={
              offer.excluded.length
                ? offer.excluded
                : ["Nothing listed — ask before adding work."]
            }
            tone="out"
          />
        </div>

        <Separator className="bg-[var(--line)]" />

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Stat
              label="Fixed price"
              value={formatMoney(offer.priceCents, offer.currency)}
            />
            <Stat
              label="Deposit due now"
              value={formatMoney(deposit, offer.currency)}
            />
            <Stat label="Delivery" value={`${offer.deliveryDays} days`} />
          </dl>

          {interactive ? (
            <div className="space-y-2">
              {offer.paidDeposit ? (
                <p className="text-sm font-medium text-[var(--ink)]">
                  You&apos;re booked. Work starts on confirmation.
                </p>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 sm:w-auto"
                  disabled={pending}
                  onClick={payDeposit}
                >
                  {pending
                    ? "Opening checkout…"
                    : `Pay ${formatMoney(deposit, offer.currency)} deposit`}
                </Button>
              )}
              {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            </div>
          ) : null}
        </div>

        {showWatermark ? (
          <p className="text-center text-xs tracking-[0.14em] text-[var(--muted-ink)] uppercase">
            Made with Scoped
          </p>
        ) : null}
      </div>
    </article>
  )
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "in" | "out"
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium tracking-[0.16em] text-[var(--muted-ink)] uppercase">
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[15px] leading-snug text-[var(--ink)]"
          >
            <span
              aria-hidden
              className={
                tone === "in" ? "text-[var(--acid-deep)]" : "text-[var(--danger)]"
              }
            >
              {tone === "in" ? "+" : "–"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.14em] text-[var(--muted-ink)] uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl tracking-tight text-[var(--ink)]">
        {value}
      </dd>
    </div>
  )
}
