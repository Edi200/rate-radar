export function formatCurrencyAmount(
  value: number | null,
  currencyCode: string,
): string {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value)
  } catch {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value)
  }
}
