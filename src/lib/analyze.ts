import type { CheckReport, RiskFlag, RiskLevel } from "./types"

type AnalyzeInput = {
  sourceText: string
  companyName?: string
  contact?: string
}

const RULES: Array<{
  id: string
  severity: RiskFlag["severity"]
  weight: number
  title: string
  detail: string
  test: (ctx: { text: string; company: string; contact: string }) => boolean
}> = [
  {
    id: "unpaid-trial",
    severity: "danger",
    weight: 28,
    title: "Unpaid trial / free test work",
    detail:
      "They ask you to produce real work before any payment. Common scam and scope-trap pattern.",
    test: ({ text }) =>
      /(unpaid|free)\s+(trial|test|sample|task)|test\s+project\s+unpaid|work\s+for\s+free|prova\s+gratis|gratis\s+test/i.test(
        text
      ),
  },
  {
    id: "pay-for-equipment",
    severity: "danger",
    weight: 34,
    title: "You must buy something first",
    detail:
      "Requests that you purchase software, equipment, gift cards, or crypto and get reimbursed later are classic advance-fee scams.",
    test: ({ text }) =>
      /(buy|purchase|order)\s+(a\s+)?(laptop|macbook|software|license|gift\s*card|crypto)|reimburse|send\s+you\s+a\s+check|köp\s+först|återbetal/i.test(
        text
      ),
  },
  {
    id: "crypto-or-gift-card",
    severity: "danger",
    weight: 30,
    title: "Crypto / gift card payment",
    detail:
      "Legitimate clients almost never pay freelancers in crypto or gift cards for normal project work.",
    test: ({ text }) =>
      /(bitcoin|btc|usdt|ethereum|crypto|gift\s*card|steam\s*card|paypal\s*friends)/i.test(
        text
      ),
  },
  {
    id: "urgency-secrecy",
    severity: "warn",
    weight: 16,
    title: "Pressure + secrecy",
    detail:
      "Extreme urgency paired with “don’t tell anyone / keep this confidential” is used to short-circuit judgment.",
    test: ({ text }) =>
      /(asap|urgent|immediately|today\s+only|within\s+\d+\s+hours).{0,80}(confidential|secret|don’t tell|dont tell|keep this between)|hemligt|brådskande/i.test(
        text
      ) ||
      (/(asap|urgent|immediately|brådskande)/i.test(text) &&
        /(confidential|secret|hemligt)/i.test(text)),
  },
  {
    id: "telegram-only",
    severity: "warn",
    weight: 14,
    title: "Moves you off-platform to Telegram/WhatsApp",
    detail:
      "Scammers push chat apps to avoid platform records and payment protection.",
    test: ({ text }) =>
      /(telegram|whatsapp|signal)\b.{0,40}(only|instead|chat|message)|message\s+me\s+on\s+(telegram|whatsapp)/i.test(
        text
      ),
  },
  {
    id: "dear-freelancer",
    severity: "warn",
    weight: 12,
    title: "Generic mass outreach",
    detail:
      "“Dear Freelancer” / copy-paste hiring blurbs with no project specifics usually means spray-and-pray or fraud.",
    test: ({ text }) =>
      /dear\s+(freelancer|developer|designer)|hoping\s+this\s+email\s+finds\s+you|we\s+came\s+across\s+your\s+profile/i.test(
        text
      ),
  },
  {
    id: "too-good-vague",
    severity: "warn",
    weight: 15,
    title: "High pay, almost no scope",
    detail:
      "Large weekly/monthly numbers with vague deliverables (“need a website guy, $4k/week”) is a common lure.",
    test: ({ text }) => {
      const rich =
        /(\$\s?\d{3,}|€\s?\d{3,}|\d{4,}\s*(usd|sek|kr|\/\s*week|\/\s*month|per\s+week))/i.test(
          text
        )
      const vague =
        text.trim().length < 420 &&
        !/(deliverable|scope|deadline|figma|repo|milestone|acceptance)/i.test(
          text
        )
      return rich && vague
    },
  },
  {
    id: "identity-docs",
    severity: "danger",
    weight: 22,
    title: "Asks for ID / bank login early",
    detail:
      "Passport scans, bank logins, or “verification fees” before a signed paid engagement are red flags.",
    test: ({ text }) =>
      /(passport|driver.?s?\s*license|bank\s*login|ssn|personnummer|verify\s+your\s+account\s+by\s+paying)/i.test(
        text
      ),
  },
  {
    id: "check-overpayment",
    severity: "danger",
    weight: 32,
    title: "Overpayment / fake check script",
    detail:
      "They “accidentally” overpay and ask you to refund the difference — the original payment later bounces.",
    test: ({ text }) =>
      /(overpay|over\s+pay|send\s+back\s+the\s+difference|cashier.?s?\s*check|postal\s*order)/i.test(
        text
      ),
  },
  {
    id: "consumer-email",
    severity: "info",
    weight: 8,
    title: "Consumer email as company contact",
    detail:
      "Gmail/Hotmail/Yahoo alone isn’t proof of fraud, but for a “company hiring” claim it weakens trust.",
    test: ({ contact, text }) =>
      /(gmail|hotmail|yahoo|outlook)\.com/i.test(contact) ||
      /(gmail|hotmail|yahoo)\.com/i.test(text),
  },
  {
    id: "no-company",
    severity: "info",
    weight: 6,
    title: "No company name given",
    detail:
      "You have nothing to verify against public records. Ask for legal entity name before you quote.",
    test: ({ company }) => company.trim().length === 0,
  },
  {
    id: "swedish-invoice-trap",
    severity: "warn",
    weight: 14,
    title: "Wants invoice before any deposit",
    detail:
      "Pushing a full invoice (or F-skatt details) before a deposit lands can be fishing for your org data.",
    test: ({ text }) =>
      /(send\s+(your\s+)?invoice\s+first|f-skatt|org\.?\s*nr|bankgiro).{0,60}(before|först)/i.test(
        text
      ),
  },
]

function levelForScore(score: number): RiskLevel {
  if (score >= 70) return "critical"
  if (score >= 45) return "high"
  if (score >= 22) return "medium"
  return "low"
}

function summaryFor(level: RiskLevel, flagCount: number) {
  switch (level) {
    case "critical":
      return `Hard stop. ${flagCount} serious patterns match known freelance/client scam scripts. Do not start work or send money.`
    case "high":
      return `High risk. Several patterns look wrong. Demand a deposit and verify the company before you reply with availability.`
    case "medium":
      return `Proceed carefully. Some warning signs showed up. Tighten scope and collect a deposit before any work.`
    default:
      return `No strong scam signatures in the text. Still confirm the company and take a deposit on larger jobs.`
  }
}

function actionsFor(level: RiskLevel, flags: RiskFlag[]) {
  const actions = [
    "Reply with a fixed scope and a deposit link before calendar invites or free discovery calls.",
    "Verify the company legal name in a public registry (Bolagsverket / Companies House / equivalent).",
  ]
  if (flags.some((f) => f.id === "telegram-only")) {
    actions.push("Keep the thread on email or the original platform until a deposit clears.")
  }
  if (flags.some((f) => f.severity === "danger")) {
    actions.push("Do not purchase equipment, gift cards, or licenses on their behalf.")
  }
  if (level === "low") {
    actions.push("If the job is over ~10k SEK / $1k, still take 30–50% upfront.")
  } else {
    actions.push("If they refuse any deposit, walk away.")
  }
  return actions
}

function replyTemplate(level: RiskLevel) {
  if (level === "critical" || level === "high") {
    return `Thanks for reaching out. Before I start or hold time, I need (1) the legal company name, and (2) a deposit against a fixed written scope. I don’t do unpaid trials or purchase software/equipment on a client’s behalf. If that works, I’ll send a one-page scope + payment link.`
  }
  return `Thanks — happy to help. I’ll send a short fixed-scope outline with what’s in/out and a deposit link to lock the start date. Once the deposit clears, I begin.`
}

export function analyzeInbound(input: AnalyzeInput): Omit<
  CheckReport,
  "id" | "createdAt" | "unlocked" | "paidAt" | "stripeSessionId"
> {
  const sourceText = input.sourceText.trim()
  const companyName = (input.companyName ?? "").trim()
  const contact = (input.contact ?? "").trim()
  const ctx = {
    text: sourceText,
    company: companyName,
    contact,
  }

  const flags = RULES.filter((rule) => rule.test(ctx)).map(
    ({ id, severity, title, detail }) => ({ id, severity, title, detail })
  )

  const score = Math.min(
    100,
    RULES.filter((rule) => rule.test(ctx)).reduce((sum, rule) => sum + rule.weight, 0)
  )
  const level = levelForScore(score)

  return {
    sourceText,
    companyName,
    contact,
    score,
    level,
    summary: summaryFor(level, flags.length),
    flags,
    actions: actionsFor(level, flags),
    replyTemplate: replyTemplate(level),
  }
}

export function teaserFlags(flags: RiskFlag[]) {
  return flags.slice(0, 2)
}
