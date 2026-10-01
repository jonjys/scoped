"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CheckForm() {
  const router = useRouter()
  const [sourceText, setSourceText] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [contact, setContact] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText, companyName, contact }),
      })
      const data = (await res.json()) as {
        report?: { id: string }
        error?: string
      }
      if (!res.ok || !data.report) {
        setError(data.error ?? "Could not run the check.")
        return
      }
      router.push(`/r/${data.report.id}`)
    } catch {
      setError("Network error. Try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="check-form space-y-5">
      <div className="space-y-2">
        <Label htmlFor="source">Paste the inbound message</Label>
        <Textarea
          id="source"
          required
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Dear Freelancer, we found your profile… paste the email, LinkedIn DM, Upwork invite, or Slack dump here."
          className="min-h-44 bg-[var(--paper)]/80 text-base"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company name (optional)</Label>
          <Input
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Northwind AB"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Their email / handle (optional)</Label>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="hiring@company.com"
          />
        </div>
      </div>
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="cta-pulse w-full sm:w-auto" disabled={pending}>
        {pending ? "Scanning…" : "Check before I reply"}
      </Button>
      <p className="text-sm text-[var(--muted-ink)]">
        Free risk score in seconds. Full sealed report is 49 kr when you need
        the actions and reply script.
      </p>
    </form>
  )
}
