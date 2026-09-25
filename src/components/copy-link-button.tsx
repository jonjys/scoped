"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button type="button" variant="outline" onClick={copy}>
      {copied ? "Copied" : "Copy client link"}
    </Button>
  )
}
