const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formatterWithKobo = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "symbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** ₦5,000 — whole naira, the default everywhere in the product. */
export function formatNaira(amount: number, { showKobo = false } = {}): string {
  const value = Number.isFinite(amount) ? amount : 0
  return (showKobo ? formatterWithKobo : formatter).format(value)
}

/** Converts a Prisma Decimal (or anything Number()-coercible) to a plain number. */
export function toNumber(value: unknown): number {
  if (value == null) return 0
  if (typeof value === "number") return value
  return Number(value)
}
