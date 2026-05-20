# RateRadar

A lightweight single-page application that aggregates global fuel prices, currency exchange rates, and food cost indices in one place.

Live: [radar.viredsoft.com](https://radar.viredsoft.com)

## Features

- **Fuel Prices** — Retail gasoline, diesel, and LPG prices for 115+ countries with region filter and country search
- **Currency Rates** — Live exchange rates for 30+ major currencies with base currency selector and amount converter
- **Food Basket Index** — Cost of living food index for 90+ countries relative to world average (100), with tier badges and country comparison mode

## Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API, `<script setup>`, TypeScript
- [Vite 8](https://vitejs.dev/) — Build tool with Rolldown bundler
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/) — Table, Card, Select, Input, Badge, Skeleton, Alert, Combobox
- [Vue Router 5](https://router.vuejs.org/)
- [Pinia 3](https://pinia.vuejs.org/) — State management with session cache (no re-fetch on tab switch)
- [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/)
- [country-flag-emoji-polyfill](https://www.npmjs.com/package/country-flag-emoji-polyfill) — Flag emoji support on Windows Chrome
- [country-currency-emoji-flags](https://www.npmjs.com/package/country-currency-emoji-flags) — Flag emojis from currency codes
- [lucide-vue-next](https://lucide.dev/) — Icons

## Data Source

All data is provided by the [OpenVan.camp Public API](https://openvan.camp/en/developers) — free, no authentication required, CORS enabled.

| Endpoint | Data |
|---|---|
| `/api/fuel/prices` | Fuel prices, 115+ countries, weekly updates |
| `/api/currency/rates` | Exchange rates, 150+ currencies, hourly updates |
| `/api/vanbasket/countries` | Food basket index, 90+ countries |
| `/api/vanbasket/compare` | Side-by-side country cost comparison |

Data license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — attribution to [OpenVan.camp](https://openvan.camp)

## Project Structure

```
src/
  components/       # AppNavbar, AppFooter, shadcn-vue UI components
  views/            # FuelView, CurrencyView, BasketView
  stores/           # Pinia stores: fuel, currency, basket
  lib/              # Helpers: formatters, flag emoji, region filters, currency utils
  types/            # TypeScript interfaces per feature
  router/           # Vue Router config
```

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Upload the contents of `dist/` to your shared hosting root. A `.htaccess` file is included in `public/` for Apache servers to handle SPA routing correctly.

## Hosting

Deployed as a static SPA on shared hosting via FTP. No server-side code required.

