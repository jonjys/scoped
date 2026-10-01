import { CheckForm } from "@/components/check-form"
import { REPORT_PRICE_LABEL } from "@/lib/types"

export default function HomePage() {
  return (
    <div className="relative">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-8 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-10">
        <div className="space-y-6">
          <p className="animate-rise text-xs font-medium tracking-[0.2em] text-[var(--signal)] uppercase">
            Before you start work
          </p>
          <h1 className="animate-rise-delay font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            ClientProof
          </h1>
          <div className="hero-rule h-1 w-24 bg-[var(--signal)]" />
          <p className="animate-rise-delay-2 max-w-xl text-xl text-[var(--muted-ink)] sm:text-2xl">
            Paste the inbound message. Get a go/no-go before you quote, book a
            call, or open Figma.
          </p>
          <p className="max-w-xl text-[var(--muted-ink)]">
            Built for the moment your stomach drops — fake hiring managers,
            unpaid “trials”, equipment reimbursement scams, and pressure scripts.
            You have the pain right now. No account. No audience to build.
          </p>
        </div>

        <div
          id="check"
          className="hero-panel hero-sheen relative rounded-2xl border border-[var(--line)] bg-white/75 p-5 sm:p-7"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.16em] text-[var(--muted-ink)] uppercase">
            Free scan → pay only if you need the seal
          </p>
          <CheckForm />
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Why this exists
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted-ink)]">
          Freelancers lose weeks to clients who were never real. ClientProof is
          the 30-second check you run while the email is still open — not another
          CRM you have to market.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Acute pain",
              body: "You already received the weird message. That’s the whole funnel.",
            },
            {
              title: "You pay, not them",
              body: `${REPORT_PRICE_LABEL} for the sealed report when the free score isn’t enough.`,
            },
            {
              title: "Actionable",
              body: "Flags, next steps, and a reply script — not a dashboard.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="text-[var(--muted-ink)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
