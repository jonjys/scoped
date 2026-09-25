import { OfferBuilder } from "@/components/offer-builder"
import { isProUnlocked } from "@/lib/billing"

export default async function NewOfferPage() {
  const isPro = await isProUnlocked()
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
      <OfferBuilder isPro={isPro} />
    </div>
  )
}
