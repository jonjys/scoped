import { promises as fs } from "fs"
import path from "path"
import type { Offer } from "./types"

const DATA_DIR = path.join(process.cwd(), ".data")
const OFFERS_FILE = path.join(DATA_DIR, "offers.json")

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(OFFERS_FILE)
  } catch {
    await fs.writeFile(OFFERS_FILE, "{}", "utf8")
  }
}

async function readAll(): Promise<Record<string, Offer>> {
  await ensureStore()
  const raw = await fs.readFile(OFFERS_FILE, "utf8")
  try {
    return JSON.parse(raw) as Record<string, Offer>
  } catch {
    return {}
  }
}

async function writeAll(data: Record<string, Offer>) {
  await ensureStore()
  await fs.writeFile(OFFERS_FILE, JSON.stringify(data, null, 2), "utf8")
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

export async function listOffers() {
  const all = await readAll()
  return Object.values(all).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  )
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

export function countActiveOffers(offers: Offer[]) {
  return offers.length
}
