<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const NAV_TABS = [
  { value: 'fuel', to: '/fuel', label: 'Fuel' },
  { value: 'currency', to: '/currency', label: 'Currency' },
  { value: 'basket', to: '/basket', label: 'Basket' },
] as const

const tabTriggerClass = cn(
  'inline-flex h-auto shrink-0 whitespace-nowrap rounded-full border-0 px-4 py-2 text-sm font-medium shadow-none transition-colors sm:text-base',
  'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  'data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-none',
  'focus-visible:ring-sky-600/30 dark:data-[state=active]:bg-sky-600 dark:data-[state=active]:text-white',
)

const route = useRoute()
const router = useRouter()

const activeTab = computed({
  get(): string {
    const match = NAV_TABS.find((tab) => tab.to === route.path)
    return match?.value ?? 'fuel'
  },
  set(value: string) {
    const tab = NAV_TABS.find((item) => item.value === value)
    if (tab) {
      router.push(tab.to)
    }
  },
})
</script>

<template>
  <header class="bg-white px-4 py-3 shadow-sm">
    <nav
      class="flex justify-center overflow-x-auto"
      aria-label="Main navigation"
    >
      <Tabs
        v-model="activeTab"
        class="w-auto"
      >
        <TabsList
          class="inline-flex h-auto w-max min-w-0 justify-center gap-1 rounded-full bg-gray-100/80 p-1"
        >
          <TabsTrigger
            v-for="tab in NAV_TABS"
            :key="tab.value"
            :value="tab.value"
            as-child
            :class="tabTriggerClass"
          >
            <RouterLink :to="tab.to">
              {{ tab.label }}
            </RouterLink>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  </header>
</template>
