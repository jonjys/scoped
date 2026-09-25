import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function OfferNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-start justify-center gap-4 px-5 sm:px-8">
      <h1 className="font-display text-3xl tracking-tight">Offer not found</h1>
      <p className="text-[var(--muted-ink)]">
        This scope link is missing or was never published.
      </p>
      <Link href="/new" className={buttonVariants({ size: "lg" })}>
        Create a new offer
      </Link>
    </div>
  )
}
