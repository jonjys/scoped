import type { CheckoutMode } from "./types"

export function getCheckoutMode(): CheckoutMode {
  if (
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ) {
    return "stripe"
  }
  return "mock"
}
