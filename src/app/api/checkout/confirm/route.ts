import { NextResponse } from "next/server"
import { getCheckoutMode } from "@/lib/stripe-mode"
import { unlockReport } from "@/lib/store"
import { toPublicReport } from "@/lib/public-report"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    sessionId?: string
    reportId?: string
    mock?: boolean
  }

  const mode = getCheckoutMode()

  if (mode === "stripe" && body.sessionId) {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(body.sessionId)
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment incomplete." }, { status: 400 })
    }
    const reportId = session.metadata?.reportId ?? body.reportId
    if (!reportId) {
      return NextResponse.json({ error: "Missing report id." }, { status: 400 })
    }
    const report = await unlockReport(reportId, session.id)
    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 })
    }
    return NextResponse.json({ ok: true, report: toPublicReport(report) })
  }

  if (body.mock && body.reportId) {
    const report = await unlockReport(body.reportId, "mock")
    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 })
    }
    return NextResponse.json({ ok: true, report: toPublicReport(report), mode: "mock" })
  }

  return NextResponse.json({ error: "Nothing to confirm." }, { status: 400 })
}
