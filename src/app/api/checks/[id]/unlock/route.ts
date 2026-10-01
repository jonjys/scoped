import { NextResponse } from "next/server"
import { getReport, unlockReport } from "@/lib/store"
import { getCheckoutMode } from "@/lib/stripe-mode"
import { toPublicReport } from "@/lib/public-report"
import { REPORT_CURRENCY, REPORT_PRICE_ORE } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const report = await getReport(id)
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 })
  }
  if (report.unlocked) {
    return NextResponse.json({ report: toPublicReport(report), already: true })
  }

  const origin = new URL(request.url).origin
  const mode = getCheckoutMode()

  if (mode === "stripe") {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/r/${id}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/r/${id}?canceled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: REPORT_CURRENCY,
            unit_amount: REPORT_PRICE_ORE,
            product_data: {
              name: "ClientProof sealed risk report",
              description: `Full go/no-go report ${id}`,
            },
          },
        },
      ],
      metadata: {
        kind: "report",
        reportId: id,
      },
    })
    return NextResponse.json({ url: session.url, mode: "stripe" })
  }

  const unlocked = await unlockReport(id, "mock")
  return NextResponse.json({
    url: `${origin}/r/${id}?paid=1&mock=1`,
    mode: "mock",
    report: unlocked ? toPublicReport(unlocked) : null,
  })
}
