import { createHmac, randomBytes, timingSafeEqual } from "crypto"

export type ApiKeyPayload = {
  sub: string
  plan: "free" | "pro"
  iat: number
}

function secret() {
  const value = process.env.SCOPED_SIGNING_SECRET
  if (!value) {
    // Local fallback so Connect works without env in pure offline demos.
    return "scoped-dev-signing-secret-change-me"
  }
  return value
}

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function fromB64url(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64")
}

function sign(body: string) {
  return b64url(createHmac("sha256", secret()).update(body).digest())
}

export function mintApiKey(plan: "free" | "pro" = "free"): {
  key: string
  payload: ApiKeyPayload
} {
  const payload: ApiKeyPayload = {
    sub: randomBytes(8).toString("hex"),
    plan,
    iat: Math.floor(Date.now() / 1000),
  }
  const body = b64url(JSON.stringify(payload))
  const key = `sk_scoped_${body}.${sign(body)}`
  return { key, payload }
}

export function verifyApiKey(key: string | null | undefined): ApiKeyPayload | null {
  if (!key) return null
  const raw = key.startsWith("Bearer ") ? key.slice(7).trim() : key.trim()
  if (!raw.startsWith("sk_scoped_")) return null
  const token = raw.slice("sk_scoped_".length)
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  const expected = sign(body)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as ApiKeyPayload
    if (!payload.sub || (payload.plan !== "free" && payload.plan !== "pro")) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function getBearer(request: Request) {
  return request.headers.get("authorization")
}
