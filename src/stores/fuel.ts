import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { withOpenVanSource } from '../lib/openvan'
import {
  mapFuelCountryEntry,
  type FuelCountry,
  type FuelPricesResponse,
} from '../types/fuel'

const FUEL_PRICES_URL = 'https://openvan.camp/api/fuel/prices'

export const useFuelStore = defineStore('fuel', () => {
  const countries = ref<Record<string, FuelCountry>>({})
  const isLoading = ref(false)
  const hasError = ref(false)

  const countryList = computed(() =>
    Object.values(countries.value).sort((a, b) =>
      a.country_name.localeCompare(b.country_name),
    ),
  )

  const hasCountries = computed(
    () => Object.keys(countries.value).length > 0,
  )

  async function fetchFuelPrices(): Promise<void> {
    if (hasCountries.value) {
      return
    }

    isLoading.value = true
    hasError.value = false

    try {
      const response = await fetch(withOpenVanSource(FUEL_PRICES_URL))
      if (!response.ok) {
        throw new Error(`Fuel API responded with ${response.status}`)
      }

      const body = (await response.json()) as FuelPricesResponse
      if (!body.success || !body.data) {
        throw new Error('Fuel API returned unsuccessful response')
      }

      const mapped: Record<string, FuelCountry> = {}
      for (const entry of Object.values(body.data)) {
        const country = mapFuelCountryEntry(entry)
        mapped[country.country_code] = country
      }
      countries.value = mapped
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    countries,
    isLoading,
    hasError,
    countryList,
    fetchFuelPrices,
  }
})
