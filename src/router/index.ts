import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/fuel' },
    {
      path: '/fuel',
      name: 'fuel',
      component: () => import('../views/FuelView.vue'),
    },
    {
      path: '/currency',
      name: 'currency',
      component: () => import('../views/CurrencyView.vue'),
    },
    {
      path: '/basket',
      name: 'basket',
      component: () => import('../views/BasketView.vue'),
    },
  ],
})

export default router
