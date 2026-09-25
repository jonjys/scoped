import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { BuyProButton } from "@/components/buy-pro-button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
      <section className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden pt-6 sm:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[58%] md:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,245,66,0.35),transparent_45%),linear-gradient(145deg,#12352c_0%,#0b1f1a_55%,#163f34_100%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(243,246,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(243,246,241,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute inset-8 flex flex-col justify-end gap-4 p-6 text-[var(--paper)]">
            <p className="text-xs tracking-[0.2em] uppercase opacity-70">
              Client-facing offer
            </p>
            <p className="font-display text-4xl leading-none tracking-tight lg:text-5xl">
              Homepage redesign
              <br />
              Fixed scope
            </p>
            <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-4">
              <div>
                <p className="text-xs tracking-[0.16em] uppercase opacity-60">
                  Deposit due
                </p>
                <p className="font-display text-3xl">$720</p>
              </div>
              <div className="rounded-md bg-[var(--acid)] px-4 py-2 text-sm font-medium text-[var(--ink)]">
                Pay to start
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-xl space-y-8 pb-16">
          <p className="animate-rise font-display text-5xl leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Scoped
          </p>
          <div className="hero-rule h-1 w-28 bg-[var(--acid)]" />
          <h1 className="animate-rise-delay max-w-lg font-display text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Lock the scope. Collect the deposit. Start the work.
          </h1>
          <p className="animate-rise-delay-2 max-w-md text-lg leading-relaxed text-[var(--muted-ink)]">
            Freelancers lose days to vague briefs and unpaid “quick projects.”
            Scoped turns the mess into a fixed-price offer page your client can
            pay against.
          </p>
          <div className="animate-rise-delay-2 flex flex-wrap items-center gap-3">
            <Link
              href="/new"
              className={cn(buttonVariants({ size: "lg" }), "cta-pulse")}
            >
              Scope a job
            </Link>
            <Link
              href="/pro"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              See Pro — $19
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-t border-[var(--line)] py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="space-y-3">
          <h2 className="font-display text-3xl tracking-tight">The hole</h2>
          <p className="text-[var(--muted-ink)]">
            Clients send a Slack dump. You reply with a long email. Scope
            creeps. Payment waits until after delivery — if it comes at all.
          </p>
        </div>
        <ol className="space-y-5">
          {[
            "Paste the messy brief.",
            "Mark what’s in and what’s out.",
            "Publish a shareable offer with a deposit checkout.",
          ].map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="font-display text-2xl text-[var(--acid-deep)]">
                {i + 1}
              </span>
              <p className="pt-1 text-lg text-[var(--ink)]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-[var(--ink)] px-6 py-10 text-[var(--paper)] sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="font-display text-3xl tracking-tight">
              Scoped Pro — $19 once
            </h2>
            <p className="text-white/70">
              Unlimited offers, no watermark, keep collecting deposits. Mock
              checkout works locally; add Stripe keys for live payments.
            </p>
          </div>
          <BuyProButton label="Unlock Pro — $19" />
        </div>
      </section>
    </div>
  )
}
