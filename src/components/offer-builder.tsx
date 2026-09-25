"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { splitLines } from "@/lib/money"
import { OfferPreview } from "@/components/offer-preview"

const defaults = {
  freelancerName: "Alex Rivera",
  clientName: "Northwind Co.",
  title: "Homepage redesign — fixed scope",
  brief:
    "Need a cleaner homepage by next month. Keep our brand colors. Mobile first. Slack dump from their marketing lead attached in spirit.",
  includedText:
    "Discovery call + written brief\nTwo design directions\nOne revision round\nHandoff files",
  excludedText:
    "Ongoing retainer work\nStock photography fees\nRush delivery under 48h",
  price: "1800",
  depositPercent: "40",
  deliveryDays: "10",
}

export function OfferBuilder({ isPro }: { isPro: boolean }) {
  const router = useRouter()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState<string | null>(null)
  const [needsPro, setNeedsPro] = useState(false)
  const [pending, setPending] = useState(false)

  const included = splitLines(form.includedText)
  const excluded = splitLines(form.excludedText)
  const priceCents = Math.round(Number(form.price) * 100) || 0
  const depositPercent = Number(form.depositPercent) || 40
  const deliveryDays = Number(form.deliveryDays) || 7

  function update<K extends keyof typeof defaults>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNeedsPro(false)
    setPending(true)
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerName: form.freelancerName,
          clientName: form.clientName,
          title: form.title,
          brief: form.brief,
          included,
          excluded,
          priceCents,
          depositPercent,
          deliveryDays,
          currency: "USD",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === "PRO_REQUIRED") setNeedsPro(true)
        setError(data.error ?? "Could not publish offer.")
        return
      }
      router.push(`/o/${data.offer.id}?fresh=1`)
    } catch {
      setError("Network error. Try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <form onSubmit={onSubmit} className="relative z-10 space-y-6">
        <div className="space-y-1">
          <p className="font-display text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
            Scope the job
          </p>
          <p className="max-w-md text-[var(--muted-ink)]">
            Paste the messy ask. Lock what&apos;s in, what&apos;s out, and the
            deposit. Send the link before you start.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" htmlFor="freelancerName">
            <Input
              id="freelancerName"
              required
              value={form.freelancerName}
              onChange={(e) => update("freelancerName", e.target.value)}
              placeholder="Alex Rivera"
            />
          </Field>
          <Field label="Client name" htmlFor="clientName">
            <Input
              id="clientName"
              required
              value={form.clientName}
              onChange={(e) => update("clientName", e.target.value)}
              placeholder="Northwind Co."
            />
          </Field>
        </div>

        <Field label="Project title" htmlFor="title">
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Homepage redesign — fixed scope"
          />
        </Field>

        <Field label="The messy brief" htmlFor="brief">
          <Textarea
            id="brief"
            required
            rows={5}
            value={form.brief}
            onChange={(e) => update("brief", e.target.value)}
            placeholder="Paste the Slack dump, email, or voice-note notes…"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Included (one per line)" htmlFor="included">
            <Textarea
              id="included"
              required
              rows={6}
              value={form.includedText}
              onChange={(e) => update("includedText", e.target.value)}
            />
          </Field>
          <Field label="Not included" htmlFor="excluded">
            <Textarea
              id="excluded"
              rows={6}
              value={form.excludedText}
              onChange={(e) => update("excludedText", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Fixed price (USD)" htmlFor="price">
            <Input
              id="price"
              type="number"
              min={1}
              step="1"
              required
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </Field>
          <Field label="Deposit %" htmlFor="deposit">
            <Input
              id="deposit"
              type="number"
              min={10}
              max={100}
              required
              value={form.depositPercent}
              onChange={(e) => update("depositPercent", e.target.value)}
            />
          </Field>
          <Field label="Delivery (days)" htmlFor="days">
            <Input
              id="days"
              type="number"
              min={1}
              required
              value={form.deliveryDays}
              onChange={(e) => update("deliveryDays", e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <div className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
            <p>{error}</p>
            {needsPro && (
              <Button
                type="button"
                className="mt-3"
                onClick={() => router.push("/pro")}
              >
                Unlock Scoped Pro — $19
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Publishing…" : "Publish offer link"}
          </Button>
          <p className="text-sm text-[var(--muted-ink)]">
            {isPro
              ? "Pro unlocked — unlimited offers."
              : "Free plan: one live offer (publishing again replaces it)."}
          </p>
        </div>
      </form>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          Client preview
        </p>
        <OfferPreview
          offer={{
            id: "preview",
            createdAt: new Date().toISOString(),
            freelancerName: form.freelancerName || "You",
            clientName: form.clientName || "Client",
            title: form.title || "Untitled scope",
            brief:
              form.brief ||
              "Your brief will land here once you paste the messy ask.",
            included: included.length ? included : ["Add what’s included"],
            excluded,
            priceCents: priceCents || 180000,
            depositPercent,
            deliveryDays,
            currency: "USD",
            paidDeposit: false,
          }}
          showWatermark={!isPro}
          interactive={false}
        />
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
