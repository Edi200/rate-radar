export type BasketTier = 'cheap' | 'average' | 'expensive'

export function formatBasketIndex(index: number | null): string {
  if (index === null) {
    return '—'
  }
  return index.toFixed(1)
}

export function getBasketTier(index: number | null): BasketTier | null {
  if (index === null) {
    return null
  }
  if (index < 80) {
    return 'cheap'
  }
  if (index <= 120) {
    return 'average'
  }
  return 'expensive'
}

export function getBasketTierLabel(tier: BasketTier): string {
  const labels: Record<BasketTier, string> = {
    cheap: 'Cheap',
    average: 'Average',
    expensive: 'Expensive',
  }
  return labels[tier]
}

export function getBasketTierBadgeClass(tier: BasketTier): string {
  const classes: Record<BasketTier, string> = {
    cheap: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    average: 'border-amber-300 bg-amber-100 text-amber-800',
    expensive: 'border-red-300 bg-red-100 text-red-800',
  }
  return classes[tier]
}

export function getBasketTierBadgeVariant(_tier: BasketTier): 'outline' {
  return 'outline'
}

export function compareBasketIndex(
  a: number | null,
  b: number | null,
  ascending: boolean,
): number {
  if (a === null && b === null) {
    return 0
  }
  if (a === null) {
    return 1
  }
  if (b === null) {
    return -1
  }
  return ascending ? a - b : b - a
}
