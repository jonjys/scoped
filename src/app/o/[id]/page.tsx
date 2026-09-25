import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { OfferPageClient } from "@/components/offer-page-client"
import { CopyLinkButton } from "@/components/copy-link-button"
import { isProUnlocked } from "@/lib/billing"
import { getOffer, markDepositPaid } from "@/lib/store"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ fresh?: string; deposit?: string }>
}

export default async function OfferPage({ params, searchParams }: Props) {
  const { id } = await params
  const query = await searchParams
  let offer = await getOffer(id)
  if (!offer) notFound()

  if (query.deposit === "success" && !offer.paidDeposit) {
    offer = (await markDepositPaid(id)) ?? offer
  }

  const isPro = await isProUnlocked()
  const hdrs = await headers()
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3847"
  const proto = hdrs.get("x-forwarded-proto") ?? "http"
  const url = `${proto}://${host}/o/${offer.id}`

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-5 pb-20 sm:px-8">
      {query.fresh === "1" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <div>
            <p className="font-medium text-[var(--ink)]">Offer is live</p>
            <p className="text-sm text-[var(--muted-ink)]">
              Send this link. Work starts after the deposit clears.
            </p>
          </div>
          <CopyLinkButton url={url} />
        </div>
      )}
      {query.deposit === "success" && (
        <div className="rounded-xl border border-[var(--acid-deep)]/30 bg-[var(--acid)]/30 px-4 py-3 text-sm text-[var(--ink)]">
          Deposit recorded. You&apos;re good to start.
        </div>
      )}
      <OfferPageClient offer={offer} showWatermark={!isPro} />
    </div>
  )
}
