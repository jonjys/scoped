"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

export function ProSuccessClient() {
  const params = useSearchParams()
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending")

  useEffect(() => {
    const sessionId = params.get("session_id")
    const mock = params.get("mock")
    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "pro",
        sessionId: sessionId ?? undefined,
        mock: mock === "1",
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("confirm failed")
        setStatus("ok")
      })
      .catch(() => setStatus("error"))
  }, [params])

  if (status === "pending") {
    return (
      <div className="mx-auto max-w-xl space-y-3 px-5 py-16 sm:px-8">
        <h1 className="font-display text-3xl tracking-tight">Confirming payment…</h1>
        <p className="text-[var(--muted-ink)]">Unlocking Scoped Pro.</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-5 py-16 sm:px-8">
        <h1 className="font-display text-3xl tracking-tight">Could not confirm</h1>
        <p className="text-[var(--muted-ink)]">
          Payment may still have gone through. Try Get Pro again or refresh.
        </p>
        <Link href="/pro" className={buttonVariants({ size: "lg" })}>
          Back to Pro
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 px-5 py-16 sm:px-8">
      <p className="text-xs font-medium tracking-[0.18em] text-[var(--acid-deep)] uppercase">
        First payment done
      </p>
      <h1 className="font-display text-4xl tracking-tight">Pro unlocked</h1>
      <p className="text-lg text-[var(--muted-ink)]">
        Unlimited offers are live. Publish the next scope and send the deposit
        link.
      </p>
      <Link href="/new" className={buttonVariants({ size: "lg" })}>
        Scope the next job
      </Link>
    </div>
  )
}
