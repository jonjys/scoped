import Link from "next/link"
import { BuyProButton } from "@/components/buy-pro-button"
import { isProUnlocked } from "@/lib/billing"
import { buttonVariants } from "@/components/ui/button"
import { getCheckoutMode } from "@/lib/stripe-mode"

export default async function ProPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  const isPro = await isProUnlocked()
  const mode = getCheckoutMode()

  if (isPro) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-5 py-16 sm:px-8">
        <h1 className="font-display text-4xl tracking-tight">Pro is unlocked</h1>
        <p className="text-[var(--muted-ink)]">
          Unlimited offers, no watermark. Go scope the next job.
        </p>
        <Link href="/new" className={buttonVariants({ size: "lg" })}>
          Scope a job
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-5 py-16 sm:px-8">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          One-time unlock
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Scoped Pro — $19
        </h1>
        <p className="max-w-lg text-lg text-[var(--muted-ink)]">
          Stop rationing your offer links. Unlock unlimited fixed-scope pages and
          keep collecting deposits until the hole is closed.
        </p>
      </div>

      <ul className="space-y-3 text-[var(--ink)]">
        {[
          "Unlimited live offers",
          "Remove the Scoped watermark",
          "Keep mock or Stripe deposit checkout on every page",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[var(--acid-deep)]">+</span>
            {item}
          </li>
        ))}
      </ul>

      {canceled === "1" && (
        <p className="text-sm text-[var(--danger)]">
          Checkout canceled. No charge — try again when ready.
        </p>
      )}

      <div className="space-y-2">
        <BuyProButton />
        <p className="text-sm text-[var(--muted-ink)]">
          Checkout mode:{" "}
          <span className="font-medium text-[var(--ink)]">{mode}</span>
          {mode === "mock"
            ? " — set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY for live Stripe."
            : " — live Stripe Checkout."}
        </p>
      </div>
    </div>
  )
}
