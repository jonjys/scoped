import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { analyzeInbound } from "@/lib/analyze"
import { saveReport } from "@/lib/store"
import { toPublicReport } from "@/lib/public-report"
import type { CheckReport } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    sourceText?: string
    companyName?: string
    contact?: string
  }

  const sourceText = (body.sourceText ?? "").trim()
  if (sourceText.length < 40) {
    return NextResponse.json(
      { error: "Paste the full message — at least a few sentences." },
      { status: 400 }
    )
  }
  if (sourceText.length > 12000) {
    return NextResponse.json(
      { error: "Keep the paste under 12,000 characters." },
      { status: 400 }
    )
  }

  const analyzed = analyzeInbound({
    sourceText,
    companyName: body.companyName,
    contact: body.contact,
  })

  const report: CheckReport = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    unlocked: false,
    paidAt: null,
    stripeSessionId: null,
    ...analyzed,
  }

  await saveReport(report)
  return NextResponse.json({ report: toPublicReport(report) })
}
