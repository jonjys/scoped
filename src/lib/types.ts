export type Offer = {
  id: string
  createdAt: string
  ownerId?: string
  freelancerName: string
  clientName: string
  title: string
  brief: string
  included: string[]
  excluded: string[]
  priceCents: number
  depositPercent: number
  deliveryDays: number
  currency: string
  paidDeposit: boolean
  paidAt?: string
}

export type CheckoutMode = "stripe" | "mock"

export const PRO_PRICE_CENTS = 1900
export const PRO_PRODUCT_NAME = "Scoped Pro"
