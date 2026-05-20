import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import './style.css'
import App from './App.vue'
import router from './router'

polyfillCountryFlagEmojis()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')