"use client"

import { useState } from "react"
import { OfferPreview } from "@/components/offer-preview"
import type { Offer } from "@/lib/types"

export function OfferPageClient({
  offer: initial,
  showWatermark,
}: {
  offer: Offer
  showWatermark: boolean
}) {
  const [offer, setOffer] = useState(initial)
  return (
    <OfferPreview
      offer={offer}
      showWatermark={showWatermark}
      interactive
      onPaid={setOffer}
    />
  )
}
