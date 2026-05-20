export interface FuelCountry {
  country_code: string
  country_name: string
  region: string
  currency: string
  unit: string
  prices: {
    gasoline: number | null
    diesel: number | null
    lpg: number | null
  }
  price_changes: {
    gasoline: number | null
    diesel: number | null
    lpg: number | null
  }
}

export interface FuelPricesResponse {
  success: boolean
  data: Record<string, FuelCountryApiEntry>
}

interface FuelCountryApiEntry {
  country_code: string
  country_name: string
  region: string
  currency: string
  unit: string
  prices: {
    gasoline?: number | null
    diesel?: number | null
    lpg?: number | null
  }
  price_changes: {
    gasoline?: number | null
    diesel?: number | null
    lpg?: number | null
  }
}

export function mapFuelCountryEntry(entry: FuelCountryApiEntry): FuelCountry {
  return {
    country_code: entry.country_code,
    country_name: entry.country_name,
    region: entry.region,
    currency: entry.currency,
    unit: entry.unit,
    prices: {
      gasoline: entry.prices.gasoline ?? null,
      diesel: entry.prices.diesel ?? null,
      lpg: entry.prices.lpg ?? null,
    },
    price_changes: {
      gasoline: entry.price_changes.gasoline ?? null,
      diesel: entry.price_changes.diesel ?? null,
      lpg: entry.price_changes.lpg ?? null,
    },
  }
}
