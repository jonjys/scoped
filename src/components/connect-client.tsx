"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type KeyResponse = {
  key: string
  plan: "free" | "pro"
  ownerId: string
  hint: string
}

export function ConnectClient({ baseUrl }: { baseUrl: string }) {
  const [key, setKey] = useState<string | null>(null)
  const [plan, setPlan] = useState<"free" | "pro" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const cursorConfig = useMemo(() => {
    const token = key ?? "sk_scoped_YOUR_KEY"
    return JSON.stringify(
      {
        mcpServers: {
          scoped: {
            url: `${baseUrl}/api/mcp`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        },
      },
      null,
      2
    )
  }, [baseUrl, key])

  const installLink = useMemo(() => {
    const token = key ?? "sk_scoped_YOUR_KEY"
    const config = {
      url: `${baseUrl}/api/mcp`,
      headers: { Authorization: `Bearer ${token}` },
    }
    const b64 =
      typeof window === "undefined"
        ? ""
        : btoa(JSON.stringify(config))
    return `https://cursor.com/link/mcp?name=scoped&config=${b64}`
  }, [baseUrl, key])

  const curlExample = useMemo(() => {
    const token = key ?? "sk_scoped_YOUR_KEY"
    return `curl -X POST ${baseUrl}/api/v1/offers \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "freelancerName": "Alex Rivera",
    "clientName": "Northwind Co.",
    "title": "Homepage redesign — fixed scope",
    "brief": "Need a cleaner homepage by next month.",
    "included": ["Discovery", "Two directions", "One revision"],
    "excluded": ["Retainer"],
    "priceCents": 180000,
    "depositPercent": 40,
    "deliveryDays": 10
  }'`
  }, [baseUrl, key])

  async function createKey() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch("/api/keys", { method: "POST" })
      const data = (await res.json()) as KeyResponse & { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not create key.")
        return
      }
      setKey(data.key)
      setPlan(data.plan)
    } catch {
      setError("Network error.")
    } finally {
      setPending(false)
    }
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
        <h2 className="font-display text-2xl tracking-tight">1. Create API key</h2>
        <p className="text-[var(--muted-ink)]">
          Your AI plugin uses this key to publish offers as you. Free keys can
          keep one live offer. Unlock Pro in the browser first for a Pro key.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" disabled={pending} onClick={createKey}>
            {pending ? "Creating…" : key ? "Create another key" : "Create API key"}
          </Button>
          {plan && (
            <span className="rounded-md bg-[var(--acid)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]">
              {plan} key
            </span>
          )}
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        {key && (
          <div className="space-y-2">
            <p className="text-xs tracking-[0.14em] text-[var(--muted-ink)] uppercase">
              Copy now — shown once
            </p>
            <code className="block break-all rounded-lg bg-[var(--ink)] px-4 py-3 text-sm text-[var(--paper)]">
              {key}
            </code>
            <Button variant="outline" onClick={() => copy("key", key)}>
              {copied === "key" ? "Copied" : "Copy key"}
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
        <h2 className="font-display text-2xl tracking-tight">
          2. Connect Cursor (MCP / plugin)
        </h2>
        <p className="text-[var(--muted-ink)]">
          Paste into Cursor Settings → MCP for instant use. For Marketplace
          listing as a selectable plugin, the repo includes{" "}
          <code className="text-[var(--ink)]">.cursor-plugin/</code> +{" "}
          <code className="text-[var(--ink)]">mcp.json</code> — submit at{" "}
          <a
            className="underline underline-offset-2"
            href="https://cursor.com/marketplace/publish"
            target="_blank"
            rel="noreferrer"
          >
            cursor.com/marketplace/publish
          </a>{" "}
          (public GitHub + Cursor review required).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[var(--ink)] p-4 text-xs leading-relaxed text-[var(--paper)]">
          {cursorConfig}
        </pre>
        <Button variant="outline" onClick={() => copy("cursor", cursorConfig)}>
          {copied === "cursor" ? "Copied" : "Copy Cursor config"}
        </Button>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
        <h2 className="font-display text-2xl tracking-tight">
          3. Connect ChatGPT / other AI (OpenAPI)
        </h2>
        <p className="text-[var(--muted-ink)]">
          Use this OpenAPI URL as a Custom GPT Action (or any OpenAPI client).
          Auth: Bearer token with your Scoped key.
        </p>
        <code className="block break-all rounded-lg bg-[var(--paper-deep)] px-4 py-3 text-sm">
          {baseUrl}/api/openapi
        </code>
        <Button
          variant="outline"
          onClick={() => copy("openapi", `${baseUrl}/api/openapi`)}
        >
          {copied === "openapi" ? "Copied" : "Copy OpenAPI URL"}
        </Button>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
        <h2 className="font-display text-2xl tracking-tight">4. Raw HTTP</h2>
        <pre className="overflow-x-auto rounded-lg bg-[var(--ink)] p-4 text-xs leading-relaxed text-[var(--paper)]">
          {curlExample}
        </pre>
        <Button variant="outline" onClick={() => copy("curl", curlExample)}>
          {copied === "curl" ? "Copied" : "Copy curl"}
        </Button>
      </section>
    </div>
  )
}
