import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { BuyProButton } from "@/components/buy-pro-button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
      <section className="relative grid min-h-[calc(100vh-7.5rem)] items-center gap-10 overflow-hidden pt-6 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-8">
        <div className="relative z-10 max-w-xl space-y-7">
          <p className="animate-rise inline-flex items-center gap-2 rounded-md border border-[var(--ink)]/10 bg-white/60 px-3 py-1.5 text-xs font-medium tracking-[0.16em] text-[var(--ink)] uppercase">
            <span className="live-dot" aria-hidden />
            First payment in one link
          </p>
          <p className="animate-rise font-display text-5xl leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Scoped
          </p>
          <div className="hero-rule h-1 w-28 bg-[var(--acid)]" />
          <h1 className="animate-rise-delay max-w-lg font-display text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Lock the scope. Collect the deposit. Start the work.
          </h1>
          <p className="animate-rise-delay-2 max-w-md text-lg leading-relaxed text-[var(--muted-ink)]">
            Stop bleeding hours on vague Slack dumps. Ship a fixed-price offer
            your client pays against — before you open Figma.
          </p>
          <div className="animate-rise-delay-2 relative z-10 flex flex-wrap items-center gap-3">
            <Link
              href="/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "cta-pulse min-h-11 px-5"
              )}
            >
              Scope a job
            </Link>
            <Link
              href="/connect"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "min-h-11 bg-white/70 px-5"
              )}
            >
              Connect your AI
            </Link>
          </div>
        </div>

        <div
          aria-hidden
          className="hero-panel relative mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] lg:mx-0 lg:max-w-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(200,245,66,0.38),transparent_42%),linear-gradient(155deg,#12352c_0%,#0b1f1a_52%,#1a4a3c_100%)]" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(243,246,241,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(243,246,241,0.09)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="hero-sheen pointer-events-none absolute inset-0" />

          <div className="relative flex min-h-[22rem] flex-col justify-between gap-8 p-6 text-[var(--paper)] sm:min-h-[26rem] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-70">
                Client-facing offer
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--acid)]/15 px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] text-[var(--acid)] uppercase">
                <span className="live-dot live-dot-acid" />
                Live link
              </span>
            </div>

            <div className="space-y-3">
              <p className="font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl">
                Homepage redesign
                <br />
                Fixed scope
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-white/65">
                In: discovery, two directions, one revision. Out: retainer &amp;
                rush.
              </p>
            </div>

            <div className="space-y-3 border-t border-white/15 pt-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.16em] uppercase opacity-60">
                    Deposit due
                  </p>
                  <p className="font-display text-4xl tracking-tight">
                    <span className="deposit-tick">$720</span>
                  </p>
                </div>
                <div className="pay-chip shrink-0 rounded-md bg-[var(--acid)] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-[var(--ink)]">
                  Pay to start
                </div>
              </div>
              <p className="text-xs tracking-[0.12em] text-white/45 uppercase">
                Work starts when the deposit clears
              </p>
            </div>
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
              Unlimited offers, no watermark, live Stripe deposits on every
              client link.
            </p>
          </div>
          <BuyProButton label="Unlock Pro — $19" />
        </div>
      </section>
    </div>
  )
}
