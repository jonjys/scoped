import { NextResponse } from "next/server"
import { getReport } from "@/lib/store"
import { toPublicReport } from "@/lib/public-report"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const report = await getReport(id)
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 })
  }
  return NextResponse.json({ report: toPublicReport(report) })
}
