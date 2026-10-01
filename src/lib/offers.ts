import { nanoid } from "nanoid"
import { deleteOffer, listOffers, saveOffer } from "@/lib/store"
import type { Offer } from "@/lib/types"

export type CreateOfferInput = {
  freelancerName?: string
  clientName?: string
  title?: string
  brief?: string
  included?: string[]
  excluded?: string[]
  priceCents?: number
  depositPercent?: number
  deliveryDays?: number
  currency?: string
  ownerId?: string
  plan?: "free" | "pro"
}

export type CreateOfferResult =
  | { ok: true; offer: Offer }
  | { ok: false; status: number; error: string; code?: string }

export async function createOffer(
  input: CreateOfferInput
): Promise<CreateOfferResult> {
  const freelancerName = input.freelancerName?.trim()
  const clientName = input.clientName?.trim()
  const title = input.title?.trim()
  const brief = input.brief?.trim()
  const included = (input.included ?? []).map((s) => s.trim()).filter(Boolean)
  const excluded = (input.excluded ?? []).map((s) => s.trim()).filter(Boolean)
  const priceCents = Number(input.priceCents)
  const depositPercent = Number(input.depositPercent ?? 40)
  const deliveryDays = Number(input.deliveryDays ?? 7)
  const currency = (input.currency ?? "USD").toUpperCase()
  const ownerId = input.ownerId
  const plan = input.plan ?? "free"

  if (!freelancerName || !clientName || !title || !brief) {
    return {
      ok: false,
      status: 400,
      error: "Name, client, title, and brief are required.",
    }
  }
  if (!included.length) {
    return {
      ok: false,
      status: 400,
      error: "Add at least one included item.",
    }
  }
  if (!Number.isFinite(priceCents) || priceCents < 100) {
    return {
      ok: false,
      status: 400,
      error: "Price must be at least $1.",
    }
  }
  if (depositPercent < 10 || depositPercent > 100) {
    return {
      ok: false,
      status: 400,
      error: "Deposit must be between 10% and 100%.",
    }
  }

  if (plan === "free") {
    const existing = await listOffers(ownerId)
    for (const prior of existing) {
      await deleteOffer(prior.id)
    }
  }

  const offer: Offer = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    ownerId,
    freelancerName,
    clientName,
    title,
    brief,
    included,
    excluded,
    priceCents,
    depositPercent,
    deliveryDays,
    currency,
    paidDeposit: false,
  }

  await saveOffer(offer)
  return { ok: true, offer }
}

export function offerPublicUrl(origin: string, id: string) {
  return `${origin}/o/${id}`
}
