import { NextResponse } from "next/server"
import { getBearer, verifyApiKey } from "@/lib/api-keys"
import { createOffer, offerPublicUrl } from "@/lib/offers"
import { getOffer, listOffers } from "@/lib/store"

export const runtime = "nodejs"

type JsonRpcId = string | number | null
type JsonRpcRequest = {
  jsonrpc?: "2.0"
  id?: JsonRpcId
  method?: string
  params?: Record<string, unknown>
}

const SERVER_INFO = {
  name: "scoped",
  version: "1.0.0",
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}

const TOOLS = [
  {
    name: "create_scoped_offer",
    description:
      "Create a fixed-scope freelance offer page with deposit checkout from a messy client brief. Returns the public client URL.",
    inputSchema: {
      type: "object",
      properties: {
        freelancerName: { type: "string", description: "Your name / studio" },
        clientName: { type: "string", description: "Client or company name" },
        title: { type: "string", description: "Short project title" },
        brief: {
          type: "string",
          description: "The messy brief as received from the client",
        },
        included: {
          type: "array",
          items: { type: "string" },
          description: "What is in scope",
        },
        excluded: {
          type: "array",
          items: { type: "string" },
          description: "What is out of scope",
        },
        priceCents: {
          type: "number",
          description: "Fixed price in cents (e.g. 180000 for $1800)",
        },
        depositPercent: {
          type: "number",
          description: "Deposit percent due now (10-100). Default 40.",
        },
        deliveryDays: {
          type: "number",
          description: "Delivery time in days. Default 7.",
        },
        currency: { type: "string", description: "Currency code. Default USD." },
      },
      required: [
        "freelancerName",
        "clientName",
        "title",
        "brief",
        "included",
        "priceCents",
      ],
    },
  },
  {
    name: "get_scoped_offer",
    description: "Fetch one Scoped offer by id for the authenticated API key.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Offer id" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_scoped_offers",
    description: "List Scoped offers owned by the authenticated API key.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
]

function rpcResult(id: JsonRpcId | undefined, result: unknown) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, result },
    { headers: corsHeaders }
  )
}

function rpcError(
  id: JsonRpcId | undefined,
  code: number,
  message: string,
  status = 200
) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    { status, headers: corsHeaders }
  )
}

function textContent(data: unknown) {
  return {
    content: [
      {
        type: "text",
        text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  }
}

async function callTool(
  name: string,
  args: Record<string, unknown>,
  origin: string,
  ownerId: string,
  plan: "free" | "pro"
) {
  if (name === "create_scoped_offer") {
    const result = await createOffer({
      freelancerName: String(args.freelancerName ?? ""),
      clientName: String(args.clientName ?? ""),
      title: String(args.title ?? ""),
      brief: String(args.brief ?? ""),
      included: Array.isArray(args.included)
        ? args.included.map(String)
        : [],
      excluded: Array.isArray(args.excluded)
        ? args.excluded.map(String)
        : [],
      priceCents: Number(args.priceCents),
      depositPercent:
        args.depositPercent === undefined
          ? undefined
          : Number(args.depositPercent),
      deliveryDays:
        args.deliveryDays === undefined
          ? undefined
          : Number(args.deliveryDays),
      currency:
        args.currency === undefined ? undefined : String(args.currency),
      ownerId,
      plan,
    })
    if (!result.ok) {
      return textContent({ error: result.error })
    }
    return textContent({
      offer: result.offer,
      url: offerPublicUrl(origin, result.offer.id),
      message: "Offer published. Send the url to the client to collect deposit.",
    })
  }

  if (name === "get_scoped_offer") {
    const id = String(args.id ?? "")
    const offer = await getOffer(id)
    if (!offer || offer.ownerId !== ownerId) {
      return textContent({ error: "Offer not found." })
    }
    return textContent({
      offer,
      url: offerPublicUrl(origin, offer.id),
    })
  }

  if (name === "list_scoped_offers") {
    const offers = await listOffers(ownerId)
    return textContent({
      offers: offers.map((offer) => ({
        ...offer,
        url: offerPublicUrl(origin, offer.id),
      })),
    })
  }

  return textContent({ error: `Unknown tool: ${name}` })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET() {
  return NextResponse.json(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocol: "mcp",
      transport: "streamable-http",
      auth: "Bearer sk_scoped_...",
      tools: TOOLS.map((t) => t.name),
    },
    { headers: corsHeaders }
  )
}

export async function POST(request: Request) {
  const auth = verifyApiKey(getBearer(request))
  if (!auth) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Create a key at /connect and send Authorization: Bearer <key>.",
      },
      { status: 401, headers: corsHeaders }
    )
  }

  let body: JsonRpcRequest
  try {
    body = (await request.json()) as JsonRpcRequest
  } catch {
    return rpcError(null, -32700, "Parse error", 400)
  }

  const method = body.method
  const id = body.id
  const origin = new URL(request.url).origin

  if (method === "initialize") {
    return rpcResult(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: SERVER_INFO,
    })
  }

  if (method === "notifications/initialized" || method === "initialized") {
    return new NextResponse(null, { status: 202 })
  }

  if (method === "ping") {
    return rpcResult(id, {})
  }

  if (method === "tools/list") {
    return rpcResult(id, { tools: TOOLS })
  }

  if (method === "tools/call") {
    const params = body.params ?? {}
    const name = String(params.name ?? "")
    const args = (params.arguments ?? {}) as Record<string, unknown>
    const result = await callTool(name, args, origin, auth.sub, auth.plan)
    return rpcResult(id, result)
  }

  return rpcError(id, -32601, `Method not found: ${method}`)
}
