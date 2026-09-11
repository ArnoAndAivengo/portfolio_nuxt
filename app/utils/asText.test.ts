import { describe, expect, it } from 'vitest'
import { asText } from './asText'

describe('asText', () => {
  it('returns strings as-is', () => {
    expect(asText('hello')).toBe('hello')
  })

  it('joins arrays', () => {
    expect(asText(['a', 'b'])).toBe('a, b')
  })

  it('flattens objects', () => {
    expect(asText({ a: 1, b: 'x' })).toBe('a: 1, b: x')
  })

  it('returns empty string for nullish values', () => {
    expect(asText(null)).toBe('')
    expect(asText(undefined)).toBe('')
  })
})
