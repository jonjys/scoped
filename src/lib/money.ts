export function formatMoney(amountMinor: number, currency = "SEK") {
  return new Intl.NumberFormat(currency === "SEK" ? "sv-SE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
  }).format(amountMinor / 100)
}
