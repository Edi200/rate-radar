export interface CurrencyRates {
  rates: Record<string, number>
  updated_at: string
}

export interface CurrencyRatesApiResponse {
  success: boolean
  rates: Record<string, number>
  meta: {
    updated_at: string
    base?: string
  }
}
