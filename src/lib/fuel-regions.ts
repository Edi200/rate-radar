export const FUEL_REGION_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'americas', label: 'Americas' },
  { value: 'africa', label: 'Africa' },
  { value: 'oceania', label: 'Oceania' },
] as const

export type FuelRegionFilter = (typeof FUEL_REGION_FILTER_OPTIONS)[number]['value']

const API_REGIONS_BY_FILTER: Record<
  Exclude<FuelRegionFilter, 'all'>,
  readonly string[]
> = {
  europe: ['europe'],
  asia: [
    'middle_east',
    'cis',
    'south_asia',
    'east_asia',
    'southeast_asia',
  ],
  americas: ['latam', 'north_america', 'central_america', 'caribbean'],
  africa: ['africa'],
  oceania: ['oceania'],
}

export function matchesFuelRegion(
  apiRegion: string,
  filter: FuelRegionFilter,
): boolean {
  if (filter === 'all') {
    return true
  }
  return API_REGIONS_BY_FILTER[filter].includes(apiRegion)
}
