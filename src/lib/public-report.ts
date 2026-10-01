import type { CheckReport } from "./types"
import { teaserFlags } from "./analyze"

/** Strip paid fields until unlocked. */
export function toPublicReport(report: CheckReport) {
  if (report.unlocked) {
    return {
      id: report.id,
      createdAt: report.createdAt,
      companyName: report.companyName,
      contact: report.contact,
      score: report.score,
      level: report.level,
      summary: report.summary,
      flags: report.flags,
      actions: report.actions,
      replyTemplate: report.replyTemplate,
      unlocked: true as const,
      hiddenFlagCount: 0,
      sourcePreview: report.sourceText.slice(0, 280),
    }
  }

  return {
    id: report.id,
    createdAt: report.createdAt,
    companyName: report.companyName,
    contact: report.contact,
    score: report.score,
    level: report.level,
    summary: report.summary,
    flags: teaserFlags(report.flags).map((f) => ({
      id: f.id,
      severity: f.severity,
      title: f.title,
      detail: "Unlock the sealed report to read the full explanation.",
    })),
    hiddenFlagCount: Math.max(0, report.flags.length - 2),
    actions: [] as string[],
    replyTemplate: null as string | null,
    unlocked: false as const,
    sourcePreview: report.sourceText.slice(0, 160),
  }
}

export type PublicReport = ReturnType<typeof toPublicReport>
