export function formatFuelPrice(value: number | null): string {
  if (value === null) {
    return '—'
  }
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value)
}

export function formatFuelUnitLabel(unit: string): string {
  if (unit === 'gallon') {
    return 'per gallon'
  }
  return 'per liter'
}
