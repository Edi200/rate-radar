declare module 'country-currency-emoji-flags' {
  export function getEmojiByCurrencyCode(
    currencyCode: string,
  ): string | null | undefined

  export function getEmojiByCountryCode(
    countryCode: string,
  ): string | null | undefined
}
