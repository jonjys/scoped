import { NextResponse } from "next/server"
import { depositCents } from "@/lib/money"
import { getCheckoutMode } from "@/lib/stripe-mode"
import { getOffer, markDepositPaid } from "@/lib/store"

export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const offer = await getOffer(id)
  if (!offer) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 })
  }
  if (offer.paidDeposit) {
    return NextResponse.json({ offer, alreadyPaid: true })
  }

  const origin = new URL(request.url).origin
  const amount = depositCents(offer.priceCents, offer.depositPercent)
  const mode = getCheckoutMode()

  if (mode === "stripe") {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/o/${offer.id}?deposit=success`,
      cancel_url: `${origin}/o/${offer.id}?deposit=cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: offer.currency.toLowerCase(),
            unit_amount: amount,
            product_data: {
              name: `Deposit — ${offer.title}`,
              description: `Deposit for ${offer.clientName} · ${offer.freelancerName}`,
            },
          },
        },
      ],
      metadata: { offerId: offer.id, kind: "deposit" },
    })
    return NextResponse.json({ mode, url: session.url })
  }

  const updated = await markDepositPaid(offer.id)
  return NextResponse.json({
    mode: "mock",
    url: `${origin}/o/${offer.id}?deposit=success&mock=1`,
    offer: updated,
  })
}
