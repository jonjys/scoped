import { promises as fs } from "fs"
import path from "path"
import { get, list, put } from "@vercel/blob"
import type { CheckReport } from "./types"

const DATA_DIR = path.join(process.cwd(), ".data")
const REPORTS_FILE = path.join(DATA_DIR, "reports.json")
const BLOB_PATHNAME = "clientproof/reports.json"

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function ensureFileStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(REPORTS_FILE)
  } catch {
    await fs.writeFile(REPORTS_FILE, "{}", "utf8")
  }
}

async function readAll(): Promise<Record<string, CheckReport>> {
  if (useBlob()) {
    try {
      const result = await list({ prefix: BLOB_PATHNAME, limit: 1 })
      const match = result.blobs.find((b) => b.pathname === BLOB_PATHNAME)
      if (!match) return {}
      const blob = await get(BLOB_PATHNAME, {
        access: "private",
        useCache: false,
      })
      if (!blob || blob.statusCode !== 200 || !blob.stream) return {}
      const text = await new Response(blob.stream).text()
      return JSON.parse(text) as Record<string, CheckReport>
    } catch {
      return {}
    }
  }

  await ensureFileStore()
  const raw = await fs.readFile(REPORTS_FILE, "utf8")
  try {
    return JSON.parse(raw) as Record<string, CheckReport>
  } catch {
    return {}
  }
}

async function writeAll(data: Record<string, CheckReport>) {
  const body = JSON.stringify(data, null, 2)
  if (useBlob()) {
    await put(BLOB_PATHNAME, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    })
    return
  }
  await ensureFileStore()
  await fs.writeFile(REPORTS_FILE, body, "utf8")
}

export async function saveReport(report: CheckReport) {
  const all = await readAll()
  all[report.id] = report
  await writeAll(all)
  return report
}

export async function getReport(id: string) {
  const all = await readAll()
  return all[id] ?? null
}

export async function unlockReport(id: string, stripeSessionId?: string) {
  const all = await readAll()
  const report = all[id]
  if (!report) return null
  report.unlocked = true
  report.paidAt = new Date().toISOString()
  report.stripeSessionId = stripeSessionId ?? report.stripeSessionId
  all[id] = report
  await writeAll(all)
  return report
}
