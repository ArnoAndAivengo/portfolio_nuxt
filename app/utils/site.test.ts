import { describe, expect, it } from 'vitest'
import { siteHost, siteUrl } from './site'

describe('siteUrl', () => {
  it('keeps a trailing slash on the origin', () => {
    expect(siteUrl('/')).toBe('https://arnoandaivengo.ru/')
    expect(siteUrl()).toBe('https://arnoandaivengo.ru/')
  })

  it('prefixes the site origin', () => {
    expect(siteUrl('/resume')).toBe('https://arnoandaivengo.ru/resume')
  })

  it('adds a leading slash when missing', () => {
    expect(siteUrl('resume')).toBe('https://arnoandaivengo.ru/resume')
  })
})

describe('siteHost', () => {
  it('strips www from hostnames', () => {
    expect(siteHost('https://www.example.com/x')).toBe('example.com')
  })

  it('returns the original string for invalid urls', () => {
    expect(siteHost('not a url')).toBe('not a url')
  })
})
