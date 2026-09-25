import { NextResponse } from "next/server"
import { getOffer } from "@/lib/store"

export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const offer = await getOffer(id)
  if (!offer) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 })
  }
  return NextResponse.json({ offer })
}
