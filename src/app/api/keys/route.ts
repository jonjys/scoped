import { NextResponse } from "next/server"
import { mintApiKey } from "@/lib/api-keys"
import { isProUnlocked } from "@/lib/billing"

export const runtime = "nodejs"

export async function POST() {
  const pro = await isProUnlocked()
  const { key, payload } = mintApiKey(pro ? "pro" : "free")
  return NextResponse.json({
    key,
    plan: payload.plan,
    ownerId: payload.sub,
    hint: "Store this key now. Scoped does not show it again.",
  })
}
