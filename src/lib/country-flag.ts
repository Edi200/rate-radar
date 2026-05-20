/** Regional-indicator flag emoji from ISO 3166-1 alpha-2 country code. */
export function countryCodeToFlagEmoji(countryCode: string): string {
  const code = countryCode.trim().toUpperCase()
  if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) {
    return ''
  }
  const base = 0x1f1e6
  const first = code.charCodeAt(0) - 65
  const second = code.charCodeAt(1) - 65
  return String.fromCodePoint(base + first, base + second)
}
