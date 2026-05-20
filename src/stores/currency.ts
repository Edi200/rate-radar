import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { withOpenVanSource } from '../lib/openvan'
import type { CurrencyRatesApiResponse } from '../types/currency'

const CURRENCY_RATES_URL = 'https://openvan.camp/api/currency/rates'

export const useCurrencyStore = defineStore('currency', () => {
  const rates = ref<Record<string, number>>({})
  const updatedAt = ref('')
  const isLoading = ref(false)
  const hasError = ref(false)

  const hasRates = computed(() => Object.keys(rates.value).length > 0)

  async function fetchCurrencyRates(): Promise<void> {
    if (hasRates.value) {
      return
    }

    isLoading.value = true
    hasError.value = false

    try {
      const response = await fetch(withOpenVanSource(CURRENCY_RATES_URL))
      if (!response.ok) {
        throw new Error(`Currency API responded with ${response.status}`)
      }

      const body = (await response.json()) as CurrencyRatesApiResponse
      if (!body.success || !body.rates) {
        throw new Error('Currency API returned unsuccessful response')
      }

      rates.value = body.rates
      updatedAt.value = body.meta?.updated_at ?? ''
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    rates,
    updatedAt,
    isLoading,
    hasError,
    fetchCurrencyRates,
  }
})
