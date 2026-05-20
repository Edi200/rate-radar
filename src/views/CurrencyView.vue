<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getEmojiByCurrencyCode } from 'country-currency-emoji-flags'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import {
  BASE_CURRENCY_OPTIONS,
  convertAmount,
  getCurrencyName,
  TOP_CURRENCY_CODES,
  type BaseCurrency,
} from '../lib/currency-common'
import { formatCurrencyAmount } from '../lib/format-currency-amount'
import { useCurrencyStore } from '../stores/currency'

interface ConversionRow {
  code: string
  name: string
  formatted: string
}

const currencyStore = useCurrencyStore()
const { rates, updatedAt, isLoading, hasError } = storeToRefs(currencyStore)

const baseCurrency = ref<BaseCurrency>('EUR')
const amount = ref(1)

const parsedAmount = computed(() => {
  const value = Number(amount.value)
  if (Number.isNaN(value) || value < 0) {
    return 0
  }
  return value
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

const conversionRows = computed((): ConversionRow[] => {
  if (isLoading.value || hasError.value) {
    return []
  }
  return TOP_CURRENCY_CODES.filter((code) => code !== baseCurrency.value).map(
    (code) => {
      const converted = convertAmount(
        parsedAmount.value,
        baseCurrency.value,
        code,
        rates.value,
      )
      return {
        code,
        name: getCurrencyName(code),
        formatted: formatCurrencyAmount(converted, code),
      }
    },
  )
})

onMounted(() => {
  currencyStore.fetchCurrencyRates()
})

function currencyFlag(code: string): string {
  const emoji = getEmojiByCurrencyCode(code)
  return emoji ?? ''
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold text-foreground">Currency Rates</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Convert amounts across major currencies using live exchange rates.
      </p>
    </header>

    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label
          for="base-currency"
          class="text-sm font-medium text-foreground"
        >
          Base currency
        </label>
        <Select
          v-model="baseCurrency"
          :disabled="isLoading"
        >
          <SelectTrigger
            id="base-currency"
            class="w-full"
          >
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="code in BASE_CURRENCY_OPTIONS"
              :key="code"
              :value="code"
            >
              {{ code }} — {{ getCurrencyName(code) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="amount"
          class="text-sm font-medium text-foreground"
        >
          Amount
        </label>
        <Input
          id="amount"
          v-model="amount"
          type="number"
          min="0"
          step="any"
          placeholder="1"
          :disabled="isLoading"
        />
      </div>
    </div>

    <p
      v-if="formattedUpdatedAt && !isLoading && !hasError"
      class="mb-4 text-sm text-muted-foreground"
    >
      Rates updated {{ formattedUpdatedAt }}
    </p>

    <div
      v-if="isLoading"
      class="space-y-3"
      aria-busy="true"
      aria-label="Loading currency rates"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="h-16 animate-pulse rounded-xl bg-muted"
      />
    </div>

    <div
      v-else-if="hasError"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <p class="font-medium">Could not load currency rates.</p>
      <p class="mt-1 opacity-90">
        Please check your connection and reload the page to try again.
      </p>
    </div>

    <template v-else>
      <div class="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted hover:bg-muted">
              <TableHead class="px-4 py-4 h-auto">
                Currency
              </TableHead>
              <TableHead class="px-4 py-4 h-auto text-right">
                {{ parsedAmount }} {{ baseCurrency }} equals
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in conversionRows"
              :key="row.code"
              class="odd:bg-white even:bg-muted/50"
            >
              <TableCell class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span
                    v-if="currencyFlag(row.code)"
                    class="text-base leading-none"
                    aria-hidden="true"
                  >{{ currencyFlag(row.code) }}</span>
                  <Badge variant="secondary">
                    {{ row.code }}
                  </Badge>
                  <span class="text-sm text-muted-foreground">
                    {{ row.name }}
                  </span>
                </div>
              </TableCell>
              <TableCell class="px-4 py-4 text-right font-medium tabular-nums">
                {{ row.formatted }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <ul class="space-y-3 md:hidden">
        <li
          v-for="row in conversionRows"
          :key="row.code"
        >
          <Card>
            <CardHeader class="flex flex-row items-center justify-between gap-2 p-4 pb-2">
              <div class="flex min-w-0 items-center gap-2">
                <span
                  v-if="currencyFlag(row.code)"
                  class="shrink-0 text-base leading-none"
                  aria-hidden="true"
                >{{ currencyFlag(row.code) }}</span>
                <Badge variant="secondary">
                  {{ row.code }}
                </Badge>
                <span class="truncate text-sm text-muted-foreground">
                  {{ row.name }}
                </span>
              </div>
            </CardHeader>
            <CardContent class="p-4 pt-0">
              <p class="text-lg font-semibold tabular-nums">
                {{ row.formatted }}
              </p>
            </CardContent>
          </Card>
        </li>
      </ul>

      <p class="mt-4 text-center text-xs text-muted-foreground">
        {{ conversionRows.length }} currencies shown
      </p>
    </template>
  </div>
</template>
