import { NextResponse } from "next/server"
import { getBearer, verifyApiKey } from "@/lib/api-keys"
import { createOffer, offerPublicUrl } from "@/lib/offers"
import { listOffers } from "@/lib/store"

export const runtime = "nodejs"

function unauthorized() {
  return NextResponse.json(
    { error: "Missing or invalid API key. Use Authorization: Bearer sk_scoped_..." },
    { status: 401 }
  )
}

export async function GET(request: Request) {
  const auth = verifyApiKey(getBearer(request))
  if (!auth) return unauthorized()
  const offers = await listOffers(auth.sub)
  return NextResponse.json({ offers, plan: auth.plan })
}

export async function POST(request: Request) {
  const auth = verifyApiKey(getBearer(request))
  if (!auth) return unauthorized()

  const body = await request.json()
  const result = await createOffer({
    ...body,
    ownerId: auth.sub,
    plan: auth.plan,
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status: result.status }
    )
  }

  const origin = new URL(request.url).origin
  return NextResponse.json(
    {
      offer: result.offer,
      url: offerPublicUrl(origin, result.offer.id),
    },
    { status: 201 }
  )
}
