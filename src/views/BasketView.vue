<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { withOpenVanSource } from '../lib/openvan'
import {
  compareBasketIndex,
  formatBasketIndex,
  getBasketTier,
  getBasketTierBadgeClass,
  getBasketTierBadgeVariant,
  getBasketTierLabel,
  type BasketTier,
} from '../lib/basket-tier'
import { countryCodeToFlagEmoji } from '../lib/country-flag'
import { useBasketStore } from '../stores/basket'
import {
  mapBasketCompareData,
  type BasketCompareCountry,
  type BasketCompareData,
  type BasketCompareResponse,
  type BasketCountry,
} from '../types/basket'

const BASKET_COMPARE_BASE = 'https://openvan.camp/api/vanbasket/compare'

const basketStore = useBasketStore()
const { countryList, updatedAt, isLoading, hasError } = storeToRefs(basketStore)

const searchQuery = ref('')
const sortAscending = ref(true)
const compareFromCode = ref('')
const compareToCode = ref('')
const compareFromOpen = ref(false)
const compareToOpen = ref(false)
const compareResult = ref<BasketCompareData | null>(null)
const isCompareLoading = ref(false)
const hasCompareError = ref(false)

let compareRequestId = 0

const filteredCountries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const filtered = countryList.value.filter((country) => {
    if (query && !country.country_name.toLowerCase().includes(query)) {
      return false
    }
    return true
  })
  return [...filtered].sort((a, b) =>
    compareBasketIndex(a.index, b.index, sortAscending.value),
  )
})

const formattedUpdatedAt = computed(() => {
  if (!updatedAt.value) {
    return ''
  }
  const date = new Date(updatedAt.value)
  if (Number.isNaN(date.getTime())) {
    return updatedAt.value
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
})

const isEmptyFilter = computed(
  () =>
    !isLoading.value &&
    !hasError.value &&
    countryList.value.length > 0 &&
    filteredCountries.value.length === 0,
)

const sortToggleLabel = computed(() =>
  sortAscending.value ? 'Index ↑ (low to high)' : 'Index ↓ (high to low)',
)

const compareFromCountry = computed(
  () =>
    countryList.value.find(
      (country) => country.country_code === compareFromCode.value,
    ) ?? null,
)

const compareToCountry = computed(
  () =>
    countryList.value.find(
      (country) => country.country_code === compareToCode.value,
    ) ?? null,
)

const canCompare = computed(
  () =>
    Boolean(compareFromCode.value) &&
    Boolean(compareToCode.value) &&
    compareFromCode.value !== compareToCode.value,
)

const compareDiffLabel = computed(() => {
  if (!compareResult.value) {
    return ''
  }
  const { diff_percent } = compareResult.value
  const sign = diff_percent > 0 ? '+' : ''
  return `${sign}${diff_percent.toFixed(1)}%`
})

const compareSummaryText = computed(() => {
  if (!compareResult.value) {
    return ''
  }
  const { from, to, diff_percent, cheaper } = compareResult.value
  const abs = Math.abs(diff_percent).toFixed(1)
  if (diff_percent === 0) {
    return `${to.country_name} matches ${from.country_name} at the same food cost level.`
  }
  if (cheaper) {
    return `${to.country_name} is ${abs}% cheaper than ${from.country_name}.`
  }
  return `${to.country_name} is ${abs}% more expensive than ${from.country_name}.`
})

onMounted(() => {
  basketStore.fetchBasketCountries()
})

watch([compareFromCode, compareToCode], async () => {
  compareResult.value = null
  hasCompareError.value = false

  if (!canCompare.value) {
    isCompareLoading.value = false
    return
  }

  const requestId = ++compareRequestId
  isCompareLoading.value = true

  try {
    const url = withOpenVanSource(
      `${BASKET_COMPARE_BASE}?from=${encodeURIComponent(compareFromCode.value)}&to=${encodeURIComponent(compareToCode.value)}`,
    )
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Basket compare API responded with ${response.status}`)
    }

    const body = (await response.json()) as BasketCompareResponse
    if (!body.success || !body.data) {
      throw new Error('Basket compare API returned unsuccessful response')
    }

    if (requestId !== compareRequestId) {
      return
    }

    compareResult.value = mapBasketCompareData(body.data)
  } catch {
    if (requestId !== compareRequestId) {
      return
    }
    hasCompareError.value = true
  } finally {
    if (requestId === compareRequestId) {
      isCompareLoading.value = false
    }
  }
})

function countryFlag(country: BasketCountry): string {
  return countryCodeToFlagEmoji(country.country_code)
}

function compareCountryFlag(country: BasketCompareCountry): string {
  return countryCodeToFlagEmoji(country.country_code)
}

function toggleSort(): void {
  sortAscending.value = !sortAscending.value
}

function countryTier(country: BasketCountry): BasketTier | null {
  return getBasketTier(country.index)
}

function selectCompareFrom(code: string): void {
  compareFromCode.value = code
  compareFromOpen.value = false
}

function selectCompareTo(code: string): void {
  compareToCode.value = code
  compareToOpen.value = false
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold text-foreground">Food Basket Index</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Relative food cost by country. World average index = 100.
      </p>
    </header>

    <p
      v-if="formattedUpdatedAt && !isLoading && !hasError"
      class="mb-4 text-sm text-muted-foreground"
    >
      Prices updated {{ formattedUpdatedAt }}
    </p>

    <section
      class="mb-8 rounded-lg border p-4 sm:p-6"
      aria-labelledby="basket-compare-heading"
    >
      <h2
        id="basket-compare-heading"
        class="text-lg font-medium text-foreground"
      >
        Compare countries
      </h2>
      <p class="mt-1 text-sm text-muted-foreground">
        See how food costs differ between two countries.
      </p>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label
            for="basket-compare-from"
            class="text-sm font-medium text-foreground"
          >
            From
          </label>
          <Popover v-model:open="compareFromOpen">
            <PopoverTrigger as-child>
              <Button
                id="basket-compare-from"
                variant="outline"
                role="combobox"
                :aria-expanded="compareFromOpen"
                class="w-full justify-between font-normal"
                :disabled="isLoading || hasError"
              >
                <span
                  v-if="compareFromCountry"
                  class="flex min-w-0 items-center gap-2"
                >
                  <span
                    class="shrink-0"
                    aria-hidden="true"
                  >{{ countryFlag(compareFromCountry) }}</span>
                  <span class="truncate">{{ compareFromCountry.country_name }}</span>
                </span>
                <span
                  v-else
                  class="text-muted-foreground"
                >Search country...</span>
                <ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              class="w-(--reka-popover-trigger-width) p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="country in countryList"
                      :key="`from-${country.country_code}`"
                      :value="country.country_name"
                      @select="() => selectCompareFrom(country.country_code)"
                    >
                      <span aria-hidden="true">{{ countryFlag(country) }}</span>
                      {{ country.country_name }}
                      <CheckIcon
                        :class="cn(
                          'ml-auto size-4',
                          compareFromCode === country.country_code
                            ? 'opacity-100'
                            : 'opacity-0',
                        )"
                      />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div class="flex flex-col gap-2">
          <label
            for="basket-compare-to"
            class="text-sm font-medium text-foreground"
          >
            To
          </label>
          <Popover v-model:open="compareToOpen">
            <PopoverTrigger as-child>
              <Button
                id="basket-compare-to"
                variant="outline"
                role="combobox"
                :aria-expanded="compareToOpen"
                class="w-full justify-between font-normal"
                :disabled="isLoading || hasError"
              >
                <span
                  v-if="compareToCountry"
                  class="flex min-w-0 items-center gap-2"
                >
                  <span
                    class="shrink-0"
                    aria-hidden="true"
                  >{{ countryFlag(compareToCountry) }}</span>
                  <span class="truncate">{{ compareToCountry.country_name }}</span>
                </span>
                <span
                  v-else
                  class="text-muted-foreground"
                >Search country...</span>
                <ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              class="w-(--reka-popover-trigger-width) p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="country in countryList"
                      :key="`to-${country.country_code}`"
                      :value="country.country_name"
                      @select="() => selectCompareTo(country.country_code)"
                    >
                      <span aria-hidden="true">{{ countryFlag(country) }}</span>
                      {{ country.country_name }}
                      <CheckIcon
                        :class="cn(
                          'ml-auto size-4',
                          compareToCode === country.country_code
                            ? 'opacity-100'
                            : 'opacity-0',
                        )"
                      />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div
        v-if="isCompareLoading"
        class="mt-4 space-y-2"
        aria-busy="true"
        aria-label="Loading comparison"
      >
        <Skeleton class="h-24 w-full" />
      </div>

      <Alert
        v-else-if="hasCompareError"
        class="mt-4"
        variant="destructive"
      >
        <AlertTitle>Could not compare countries.</AlertTitle>
        <AlertDescription>
          Please try again or pick different countries.
        </AlertDescription>
      </Alert>

      <div
        v-else-if="compareResult"
        class="mt-4"
      >
        <p class="text-center text-2xl font-semibold tabular-nums text-foreground">
          {{ compareDiffLabel }}
        </p>
        <p class="mt-1 text-center text-sm text-muted-foreground">
          {{ compareSummaryText }}
        </p>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="rounded-lg border bg-muted/30 p-4">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              From
            </p>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="text-xl"
                aria-hidden="true"
              >{{ compareCountryFlag(compareResult.from) }}</span>
              <span class="font-medium text-foreground">
                {{ compareResult.from.country_name }}
              </span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              Index
              <span class="ml-1 font-medium tabular-nums text-foreground">
                {{ formatBasketIndex(compareResult.from.index) }}
              </span>
            </p>
          </div>

          <div class="rounded-lg border bg-muted/30 p-4">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              To
            </p>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="text-xl"
                aria-hidden="true"
              >{{ compareCountryFlag(compareResult.to) }}</span>
              <span class="font-medium text-foreground">
                {{ compareResult.to.country_name }}
              </span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              Index
              <span class="ml-1 font-medium tabular-nums text-foreground">
                {{ formatBasketIndex(compareResult.to.index) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label
          for="basket-search"
          class="text-sm font-medium text-foreground"
        >
          Search country
        </label>
        <Input
          id="basket-search"
          v-model="searchQuery"
          type="search"
          placeholder="Filter by country name…"
          :disabled="isLoading"
        />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-foreground">Sort</span>
        <button
          type="button"
          class="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 sm:max-w-56"
          :disabled="isLoading"
          @click="toggleSort"
        >
          {{ sortToggleLabel }}
        </button>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="space-y-3"
      aria-busy="true"
      aria-label="Loading food basket index"
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
      <AlertTitle>Could not load food basket index.</AlertTitle>
      <AlertDescription>
        Please check your connection and reload the page to try again.
      </AlertDescription>
    </Alert>

    <p
      v-else-if="isEmptyFilter"
      class="rounded-lg border px-4 py-8 text-center text-sm text-muted-foreground"
    >
      No countries match your search.
    </p>

    <template v-else>
      <div class="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted hover:bg-muted">
              <TableHead class="h-auto px-4 py-3">
                Country
              </TableHead>
              <TableHead class="h-auto px-4 py-3 text-right">
                Index
              </TableHead>
              <TableHead class="h-auto px-4 py-3 text-right">
                vs world avg
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="country in filteredCountries"
              :key="country.country_code"
              class="odd:bg-white even:bg-muted/50"
            >
              <TableCell class="px-4 py-3">
                <span
                  class="mr-2"
                  aria-hidden="true"
                >{{ countryFlag(country) }}</span>
                {{ country.country_name }}
              </TableCell>
              <TableCell class="px-4 py-3 text-right tabular-nums">
                {{ formatBasketIndex(country.index) }}
              </TableCell>
              <TableCell class="px-4 py-3 text-right">
                <Badge
                  v-if="countryTier(country)"
                  :variant="getBasketTierBadgeVariant(countryTier(country)!)"
                  :class="getBasketTierBadgeClass(countryTier(country)!)"
                >
                  {{ getBasketTierLabel(countryTier(country)!) }}
                </Badge>
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
            <CardHeader class="flex flex-row items-center justify-between gap-2 p-4 pb-2">
              <div class="flex min-w-0 items-center gap-2">
                <span
                  class="shrink-0 text-xl"
                  aria-hidden="true"
                >{{ countryFlag(country) }}</span>
                <span class="truncate font-medium text-foreground">
                  {{ country.country_name }}
                </span>
              </div>
              <Badge
                v-if="countryTier(country)"
                :variant="getBasketTierBadgeVariant(countryTier(country)!)"
                :class="getBasketTierBadgeClass(countryTier(country)!)"
                class="shrink-0"
              >
                {{ getBasketTierLabel(countryTier(country)!) }}
              </Badge>
            </CardHeader>
            <CardContent class="p-4">
              <dl class="text-sm">
                <div class="flex items-baseline justify-between gap-4">
                  <dt class="text-muted-foreground">Index</dt>
                  <dd class="font-medium tabular-nums text-foreground">
                    {{ formatBasketIndex(country.index) }}
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
