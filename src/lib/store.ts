import { promises as fs } from "fs"
import path from "path"
import { get, list, put } from "@vercel/blob"
import type { Offer } from "./types"

const DATA_DIR = path.join(process.cwd(), ".data")
const OFFERS_FILE = path.join(DATA_DIR, "offers.json")
const BLOB_PATHNAME = "scoped/offers.json"

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function ensureFileStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(OFFERS_FILE)
  } catch {
    await fs.writeFile(OFFERS_FILE, "{}", "utf8")
  }
}

async function readAll(): Promise<Record<string, Offer>> {
  if (useBlob()) {
    try {
      const result = await list({ prefix: BLOB_PATHNAME, limit: 1 })
      const match = result.blobs.find((b) => b.pathname === BLOB_PATHNAME)
      if (!match) return {}
      const blob = await get(BLOB_PATHNAME, { access: "private" })
      if (!blob || blob.statusCode !== 200 || !blob.stream) return {}
      const text = await new Response(blob.stream).text()
      return JSON.parse(text) as Record<string, Offer>
    } catch {
      return {}
    }
  }

  await ensureFileStore()
  const raw = await fs.readFile(OFFERS_FILE, "utf8")
  try {
    return JSON.parse(raw) as Record<string, Offer>
  } catch {
    return {}
  }
}

async function writeAll(data: Record<string, Offer>) {
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
  await fs.writeFile(OFFERS_FILE, body, "utf8")
}

export async function saveOffer(offer: Offer) {
  const all = await readAll()
  all[offer.id] = offer
  await writeAll(all)
  return offer
}

export async function getOffer(id: string) {
  const all = await readAll()
  return all[id] ?? null
}

export async function deleteOffer(id: string) {
  const all = await readAll()
  if (!(id in all)) return false
  delete all[id]
  await writeAll(all)
  return true
}

export async function listOffers(ownerId?: string) {
  const all = await readAll()
  const values = Object.values(all).filter((offer) =>
    ownerId ? offer.ownerId === ownerId : true
  )
  return values.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function markDepositPaid(id: string) {
  const all = await readAll()
  const offer = all[id]
  if (!offer) return null
  offer.paidDeposit = true
  offer.paidAt = new Date().toISOString()
  all[id] = offer
  await writeAll(all)
  return offer
}
