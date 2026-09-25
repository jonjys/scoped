import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import { isProUnlocked } from "@/lib/billing"
import { listOffers, saveOffer } from "@/lib/store"
import type { Offer } from "@/lib/types"

export const runtime = "nodejs"

type CreateBody = {
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
}

export async function GET() {
  const offers = await listOffers()
  return NextResponse.json({ offers })
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateBody
  const freelancerName = body.freelancerName?.trim()
  const clientName = body.clientName?.trim()
  const title = body.title?.trim()
  const brief = body.brief?.trim()
  const included = (body.included ?? []).map((s) => s.trim()).filter(Boolean)
  const excluded = (body.excluded ?? []).map((s) => s.trim()).filter(Boolean)
  const priceCents = Number(body.priceCents)
  const depositPercent = Number(body.depositPercent ?? 40)
  const deliveryDays = Number(body.deliveryDays ?? 7)
  const currency = (body.currency ?? "USD").toUpperCase()

  if (!freelancerName || !clientName || !title || !brief) {
    return NextResponse.json(
      { error: "Name, client, title, and brief are required." },
      { status: 400 }
    )
  }
  if (!included.length) {
    return NextResponse.json(
      { error: "Add at least one included item." },
      { status: 400 }
    )
  }
  if (!Number.isFinite(priceCents) || priceCents < 100) {
    return NextResponse.json(
      { error: "Price must be at least $1." },
      { status: 400 }
    )
  }
  if (depositPercent < 10 || depositPercent > 100) {
    return NextResponse.json(
      { error: "Deposit must be between 10% and 100%." },
      { status: 400 }
    )
  }

  const unlocked = await isProUnlocked()
  const existing = await listOffers()
  if (!unlocked && existing.length >= 1) {
    return NextResponse.json(
      {
        error: "Free plan allows one live offer. Unlock Scoped Pro for unlimited.",
        code: "PRO_REQUIRED",
      },
      { status: 402 }
    )
  }

  const offer: Offer = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
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

  const jar = await cookies()
  jar.set("scoped_last_offer", offer.id, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  })

  return NextResponse.json({ offer }, { status: 201 })
}
