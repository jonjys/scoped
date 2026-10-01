export type RiskLevel = "low" | "medium" | "high" | "critical"

export type FlagSeverity = "info" | "warn" | "danger"

export type RiskFlag = {
  id: string
  severity: FlagSeverity
  title: string
  detail: string
}

export type CheckReport = {
  id: string
  createdAt: string
  sourceText: string
  companyName: string
  contact: string
  score: number
  level: RiskLevel
  summary: string
  flags: RiskFlag[]
  actions: string[]
  replyTemplate: string
  unlocked: boolean
  paidAt: string | null
  stripeSessionId: string | null
}

export type CheckoutMode = "stripe" | "mock"

export const REPORT_PRICE_ORE = 4900
export const REPORT_CURRENCY = "sek"
