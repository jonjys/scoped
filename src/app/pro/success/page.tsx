import { Suspense } from "react"
import { ProSuccessClient } from "@/components/pro-success-client"

export default function ProSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-5 py-16 sm:px-8">
          <p className="text-[var(--muted-ink)]">Confirming payment…</p>
        </div>
      }
    >
      <ProSuccessClient />
    </Suspense>
  )
}
