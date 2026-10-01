import { notFound } from "next/navigation"
import { getReport } from "@/lib/store"
import { toPublicReport } from "@/lib/public-report"
import { ReportView } from "@/components/report-view"

export const runtime = "nodejs"

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ paid?: string; session_id?: string; mock?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const report = await getReport(id)
  if (!report) notFound()

  return (
    <ReportView
      initial={toPublicReport(report)}
      paid={query.paid === "1"}
      sessionId={query.session_id}
      mock={query.mock === "1"}
    />
  )
}
