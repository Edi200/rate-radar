<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <AppNavbar />
    <main class="flex-1 px-4 py-6">
      <Suspense>
        <RouterView />
        <template #fallback>
          <p class="text-gray-500">Loading…</p>
        </template>
      </Suspense>
    </main>
    <AppFooter />
  </div>
</template>
