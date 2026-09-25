import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PRO_COOKIE } from "@/lib/billing"
import { getCheckoutMode } from "@/lib/stripe-mode"
import { markDepositPaid } from "@/lib/store"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    sessionId?: string
    kind?: "pro" | "deposit"
    offerId?: string
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
    if (session.metadata?.kind === "pro" || body.kind === "pro") {
      const jar = await cookies()
      jar.set(PRO_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      })
      return NextResponse.json({ ok: true, kind: "pro" })
    }
    if (session.metadata?.offerId) {
      await markDepositPaid(session.metadata.offerId)
      return NextResponse.json({
        ok: true,
        kind: "deposit",
        offerId: session.metadata.offerId,
      })
    }
  }

  if (body.kind === "pro" && (mode === "mock" || body.mock)) {
    const jar = await cookies()
    jar.set(PRO_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
    return NextResponse.json({ ok: true, kind: "pro", mode: "mock" })
  }

  return NextResponse.json({ error: "Nothing to confirm." }, { status: 400 })
}
