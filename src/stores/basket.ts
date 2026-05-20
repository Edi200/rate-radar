import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { withOpenVanSource } from '../lib/openvan'
import {
  mapBasketCountryEntry,
  type BasketCountriesResponse,
  type BasketCountry,
} from '../types/basket'

const BASKET_COUNTRIES_URL = 'https://openvan.camp/api/vanbasket/countries'

export const useBasketStore = defineStore('basket', () => {
  const countries = ref<BasketCountry[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  const hasCountries = computed(() => countries.value.length > 0)

  const countryList = computed(() =>
    [...countries.value].sort((a, b) =>
      a.country_name.localeCompare(b.country_name),
    ),
  )

  async function fetchBasketCountries(): Promise<void> {
    if (hasCountries.value) {
      return
    }

    isLoading.value = true
    hasError.value = false

    try {
      const response = await fetch(withOpenVanSource(BASKET_COUNTRIES_URL))
      if (!response.ok) {
        throw new Error(`Basket API responded with ${response.status}`)
      }

      const body = (await response.json()) as BasketCountriesResponse
      if (!body.success || !body.data) {
        throw new Error('Basket API returned unsuccessful response')
      }

      countries.value = Object.values(body.data).map(mapBasketCountryEntry)
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
    fetchBasketCountries,
  }
})
