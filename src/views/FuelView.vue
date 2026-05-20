<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { countryCodeToFlagEmoji } from '../lib/country-flag'
import { formatFuelPrice, formatFuelUnitLabel } from '../lib/format-fuel-price'
import {
  FUEL_REGION_FILTER_OPTIONS,
  matchesFuelRegion,
  type FuelRegionFilter,
} from '../lib/fuel-regions'
import { useFuelStore } from '../stores/fuel'
import type { FuelCountry } from '../types/fuel'

const fuelStore = useFuelStore()
const { countryList, isLoading, hasError } = storeToRefs(fuelStore)

const selectedRegion = ref<FuelRegionFilter>('all')
const searchQuery = ref('')

const filteredCountries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return countryList.value.filter((country) => {
    if (!matchesFuelRegion(country.region, selectedRegion.value)) {
      return false
    }
    if (query && !country.country_name.toLowerCase().includes(query)) {
      return false
    }
    return true
  })
})

const isEmptyFilter = computed(
  () =>
    !isLoading.value &&
    !hasError.value &&
    countryList.value.length > 0 &&
    filteredCountries.value.length === 0,
)

onMounted(() => {
  fuelStore.fetchFuelPrices()
})

function countryFlag(country: FuelCountry): string {
  return countryCodeToFlagEmoji(country.country_code)
}

function priceWithCurrency(country: FuelCountry, value: number | null): string {
  const formatted = formatFuelPrice(value)
  if (formatted === '—') {
    return formatted
  }
  return `${formatted} ${country.currency}`
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold text-foreground">Fuel Prices</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Retail gasoline, diesel, and LPG prices by country.
      </p>
    </header>

    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label
          for="fuel-region"
          class="text-sm font-medium text-foreground"
        >
          Region
        </label>
        <Select
          v-model="selectedRegion"
          :disabled="isLoading"
        >
          <SelectTrigger
            id="fuel-region"
            class="w-full sm:max-w-48"
          >
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in FUEL_REGION_FILTER_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="fuel-search"
          class="text-sm font-medium text-foreground"
        >
          Search country
        </label>
        <Input
          id="fuel-search"
          v-model="searchQuery"
          type="search"
          placeholder="Filter by country name…"
          :disabled="isLoading"
        />
      </div>
    </div>

    <div
      v-if="isLoading"
      class="space-y-3"
      aria-busy="true"
      aria-label="Loading fuel prices"
    >
      <Skeleton
        v-for="n in 8"
        :key="n"
        class="h-12 w-full"
      />
    </div>

    <Alert
      v-else-if="hasError"
      variant="destructive"
    >
      <AlertTitle>Could not load fuel prices.</AlertTitle>
      <AlertDescription>
        Please check your connection and reload the page to try again.
      </AlertDescription>
    </Alert>

    <p
      v-else-if="isEmptyFilter"
      class="rounded-lg border px-4 py-8 text-center text-sm text-muted-foreground"
    >
      No countries match your filters.
    </p>

    <template v-else>
      <div class="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted hover:bg-muted">
              <TableHead class="px-4 py-4 h-auto">
                Country
              </TableHead>
              <TableHead class="px-4 py-4 h-auto text-right">
                Gasoline
              </TableHead>
              <TableHead class="px-4 py-4 h-auto text-right">
                Diesel
              </TableHead>
              <TableHead class="px-4 py-4 h-auto text-right">
                LPG
              </TableHead>
              <TableHead class="px-4 py-4 h-auto text-right text-muted-foreground">
                Unit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="country in filteredCountries"
              :key="country.country_code"
              class="odd:bg-white even:bg-muted/50"
            >
              <TableCell class="px-4 py-4">
                <span
                  class="mr-2"
                  aria-hidden="true"
                >{{ countryFlag(country) }}</span>
                {{ country.country_name }}
              </TableCell>
              <TableCell class="px-4 py-4 text-right tabular-nums">
                {{ priceWithCurrency(country, country.prices.gasoline) }}
              </TableCell>
              <TableCell class="px-4 py-4 text-right tabular-nums">
                {{ priceWithCurrency(country, country.prices.diesel) }}
              </TableCell>
              <TableCell class="px-4 py-4 text-right tabular-nums">
                {{ priceWithCurrency(country, country.prices.lpg) }}
              </TableCell>
              <TableCell class="px-4 py-4 text-right text-muted-foreground">
                {{ formatFuelUnitLabel(country.unit) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <ul class="space-y-3 md:hidden">
        <li
          v-for="country in filteredCountries"
          :key="country.country_code"
        >
          <Card>
            <CardHeader class="flex flex-row items-center gap-2 p-4 pb-2">
              <span
                class="text-xl"
                aria-hidden="true"
              >{{ countryFlag(country) }}</span>
              <span class="font-medium text-foreground">
                {{ country.country_name }}
              </span>
            </CardHeader>
            <CardContent class="p-4 pt-0">
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt class="text-muted-foreground">Gasoline</dt>
                  <dd class="font-medium tabular-nums text-foreground">
                    {{ priceWithCurrency(country, country.prices.gasoline) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-muted-foreground">Diesel</dt>
                  <dd class="font-medium tabular-nums text-foreground">
                    {{ priceWithCurrency(country, country.prices.diesel) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-muted-foreground">LPG</dt>
                  <dd class="font-medium tabular-nums text-foreground">
                    {{ priceWithCurrency(country, country.prices.lpg) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-muted-foreground">Unit</dt>
                  <dd class="text-foreground">
                    {{ formatFuelUnitLabel(country.unit) }}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </li>
      </ul>

      <p class="mt-4 text-center text-xs text-muted-foreground">
        {{ filteredCountries.length }}
        {{ filteredCountries.length === 1 ? 'country' : 'countries' }}
      </p>
    </template>
  </div>
</template>
