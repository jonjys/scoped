import { NextResponse } from "next/server"
import { getBearer, verifyApiKey } from "@/lib/api-keys"
import { offerPublicUrl } from "@/lib/offers"
import { getOffer } from "@/lib/store"

export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const auth = verifyApiKey(getBearer(request))
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const offer = await getOffer(id)
  if (!offer || offer.ownerId !== auth.sub) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 })
  }

  const origin = new URL(request.url).origin
  return NextResponse.json({
    offer,
    url: offerPublicUrl(origin, offer.id),
  })
}
