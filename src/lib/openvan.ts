export const OPENVAN_SOURCE = 'radar.viredsoft.com'

export function withOpenVanSource(url: string): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}source=${encodeURIComponent(OPENVAN_SOURCE)}`
}
