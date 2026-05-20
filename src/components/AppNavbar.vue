<script setup lang="ts">
const navLinkActiveClass =
  'border-b-2 border-sky-600 text-sky-600 font-medium'
const navLinkInactiveClass =
  'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
</script>

<template>
  <header class="border-b border-gray-200 bg-white px-4 py-3">
    <nav
      class="flex justify-center gap-1 overflow-x-auto sm:gap-2"
      aria-label="Main navigation"
    >
      <RouterLink
        to="/fuel"
        class="shrink-0 whitespace-nowrap px-3 py-2 text-sm sm:text-base"
        :active-class="navLinkActiveClass"
        :inactive-class="navLinkInactiveClass"
      >
        Fuel
      </RouterLink>
      <RouterLink
        to="/currency"
        class="shrink-0 whitespace-nowrap px-3 py-2 text-sm sm:text-base"
        :active-class="navLinkActiveClass"
        :inactive-class="navLinkInactiveClass"
      >
        Currency
      </RouterLink>
      <RouterLink
        to="/basket"
        class="shrink-0 whitespace-nowrap px-3 py-2 text-sm sm:text-base"
        :active-class="navLinkActiveClass"
        :inactive-class="navLinkInactiveClass"
      >
        Basket
      </RouterLink>
    </nav>
  </header>
</template>