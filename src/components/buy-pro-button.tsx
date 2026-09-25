"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function BuyProButton({
  label = "Unlock Scoped Pro — $19",
  className,
}: {
  label?: string
  className?: string
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buy() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout/pro", { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout unavailable.")
        return
      }
      window.location.href = data.url
    } catch {
      setError("Network error.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={className}>
      <Button size="lg" disabled={pending} onClick={buy}>
        {pending ? "Starting checkout…" : label}
      </Button>
      {error && <p className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  )
}
