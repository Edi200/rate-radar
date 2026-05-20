export interface BasketCountry {
  country_code: string
  country_name: string
  /** Food cost index; world average = 100 */
  index: number | null
}

export interface BasketCountriesResponse {
  success: boolean
  data: Record<string, BasketCountryApiEntry>
}

interface BasketCountryApiEntry {
  country_code: string
  country_name: string
  vanbasket_index?: number | null
}

export function mapBasketCountryEntry(entry: BasketCountryApiEntry): BasketCountry {
  return {
    country_code: entry.country_code,
    country_name: entry.country_name,
    index: entry.vanbasket_index ?? null,
  }
}

export interface BasketCompareCountry {
  country_code: string
  country_name: string
  index: number | null
}

export interface BasketCompareData {
  from: BasketCompareCountry
  to: BasketCompareCountry
  diff_percent: number
  budget_100: number
  cheaper: boolean
}

export interface BasketCompareResponse {
  success: boolean
  data: BasketCompareData
}

interface BasketCompareCountryApiEntry {
  country_code: string
  country_name: string
  vanbasket_index?: number | null
}

interface BasketCompareDataApi {
  from: BasketCompareCountryApiEntry
  to: BasketCompareCountryApiEntry
  diff_percent: number
  budget_100: number
  cheaper: boolean
}

export function mapBasketCompareCountry(
  entry: BasketCompareCountryApiEntry,
): BasketCompareCountry {
  return {
    country_code: entry.country_code,
    country_name: entry.country_name,
    index: entry.vanbasket_index ?? null,
  }
}

export function mapBasketCompareData(entry: BasketCompareDataApi): BasketCompareData {
  return {
    from: mapBasketCompareCountry(entry.from),
    to: mapBasketCompareCountry(entry.to),
    diff_percent: entry.diff_percent,
    budget_100: entry.budget_100,
    cheaper: entry.cheaper,
  }
}
