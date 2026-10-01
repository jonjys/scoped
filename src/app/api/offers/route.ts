import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { isProUnlocked } from "@/lib/billing"
import { createOffer } from "@/lib/offers"
import { listOffers } from "@/lib/store"

export const runtime = "nodejs"

export async function GET() {
  const offers = await listOffers()
  return NextResponse.json({ offers })
}

export async function POST(request: Request) {
  const body = await request.json()
  const unlocked = await isProUnlocked()
  const result = await createOffer({
    ...body,
    ownerId: "web",
    plan: unlocked ? "pro" : "free",
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status: result.status }
    )
  }

  const jar = await cookies()
  jar.set("scoped_last_offer", result.offer.id, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  })

  return NextResponse.json({ offer: result.offer }, { status: 201 })
}
