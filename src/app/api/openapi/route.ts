import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Scoped API",
      version: "1.0.0",
      description:
        "Create fixed-scope freelance offer pages and collect deposits. Authenticate with Authorization: Bearer sk_scoped_...",
    },
    servers: [{ url: origin }],
    paths: {
      "/api/v1/offers": {
        get: {
          operationId: "listOffers",
          summary: "List your offers",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Offer list",
            },
          },
        },
        post: {
          operationId: "createOffer",
          summary: "Create a scoped offer",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "freelancerName",
                    "clientName",
                    "title",
                    "brief",
                    "included",
                    "priceCents",
                  ],
                  properties: {
                    freelancerName: { type: "string" },
                    clientName: { type: "string" },
                    title: { type: "string" },
                    brief: { type: "string" },
                    included: {
                      type: "array",
                      items: { type: "string" },
                    },
                    excluded: {
                      type: "array",
                      items: { type: "string" },
                    },
                    priceCents: { type: "integer" },
                    depositPercent: { type: "integer", default: 40 },
                    deliveryDays: { type: "integer", default: 7 },
                    currency: { type: "string", default: "USD" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Created offer + public url" },
          },
        },
      },
      "/api/v1/offers/{id}": {
        get: {
          operationId: "getOffer",
          summary: "Get one offer",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Offer" },
            "404": { description: "Not found" },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "sk_scoped",
        },
      },
    },
  }

  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
}
