export const asText = (value: unknown): string => {
  if (typeof value === 'string') return value

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, nested]) => `${key}: ${asText(nested)}`)
      .join(', ')
  }

  if (Array.isArray(value)) return value.map(asText).join(', ')

  if (value == null) return ''

  return String(value)
}
