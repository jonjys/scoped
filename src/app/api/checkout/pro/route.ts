import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PRO_COOKIE } from "@/lib/billing"
import { getCheckoutMode } from "@/lib/stripe-mode"
import { PRO_PRICE_CENTS, PRO_PRODUCT_NAME } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const origin = new URL(request.url).origin
  const mode = getCheckoutMode()

  if (mode === "stripe") {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pro?canceled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PRO_PRICE_CENTS,
            product_data: {
              name: PRO_PRODUCT_NAME,
              description:
                "Unlimited scoped offers, no watermark, custom deposit splits.",
            },
          },
        },
      ],
      metadata: { kind: "pro" },
    })
    return NextResponse.json({ mode, url: session.url })
  }

  const jar = await cookies()
  jar.set(PRO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })

  return NextResponse.json({
    mode: "mock",
    url: `${origin}/pro/success?mock=1`,
  })
}
