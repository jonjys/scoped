import { headers } from "next/headers"
import { ConnectClient } from "@/components/connect-client"

export default async function ConnectPage() {
  const hdrs = await headers()
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3847"
  const proto = hdrs.get("x-forwarded-proto") ?? "http"
  const baseUrl = `${proto}://${host}`

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-5 pb-20 sm:px-8">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.18em] text-[var(--muted-ink)] uppercase">
          AI connection
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Connect your AI
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted-ink)]">
          Plug Scoped into Cursor via MCP, or into ChatGPT and other agents via
          OpenAPI. Your AI turns a messy brief into a live deposit link.
        </p>
      </div>
      <ConnectClient baseUrl={baseUrl} />
    </div>
  )
}
