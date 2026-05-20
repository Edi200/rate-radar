export const BASE_CURRENCY_OPTIONS = [
  'EUR',
  'USD',
  'HUF',
  'RSD',
  'GBP',
  'CHF',
  'TRY',
] as const

export type BaseCurrency = (typeof BASE_CURRENCY_OPTIONS)[number]

/** Top 30 fiat currencies for conversion display (EUR-based API rates). */
export const TOP_CURRENCY_CODES = [
  'USD',
  'EUR',
  'RSD',
  'HUF',
  'GBP',
  'JPY',
  'CHF',
  'CAD',
  'AUD',
  'CNY',
  'INR',
  'BRL',
  'MXN',
  'KRW',
  'SEK',
  'NOK',
  'PLN',
  'TRY',
  'ZAR',
  'SGD',
  'HKD',
  'NZD',
  'THB',
  'IDR',
  'PHP',
  'CZK',
  'RON',
  'DKK',
  'ILS',
  'SAR',
  'AED',
] as const

export type TopCurrencyCode = (typeof TOP_CURRENCY_CODES)[number]

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  KRW: 'South Korean Won',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  PLN: 'Polish Zloty',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  THB: 'Thai Baht',
  IDR: 'Indonesian Rupiah',
  PHP: 'Philippine Peso',
  HUF: 'Hungarian Forint',
  CZK: 'Czech Koruna',
  RON: 'Romanian Leu',
  DKK: 'Danish Krone',
  ILS: 'Israeli Shekel',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  RSD: 'Serbian Dinar',
}

/** EUR-based rates: units of `to` per 1 unit of `from`. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number | null {
  const fromRate = rates[from]
  const toRate = rates[to]
  if (fromRate == null || toRate == null || fromRate === 0) {
    return null
  }
  return amount * (toRate / fromRate)
}

export function getCurrencyName(code: string): string {
  return CURRENCY_NAMES[code] ?? code
}
