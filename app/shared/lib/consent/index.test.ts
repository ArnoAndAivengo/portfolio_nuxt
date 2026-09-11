import { beforeEach, describe, expect, it } from 'vitest'
import { consentLabel, readConsent, writeConsent } from './index'

const COOKIE = 'portfolio-test-consent'

describe('consent', () => {
  beforeEach(() => {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0]?.trim()
      if (name) document.cookie = `${name}=; Max-Age=0; Path=/`
    }
  })

  it('reads empty when the cookie is missing', () => {
    expect(readConsent(COOKIE)).toBe('')
  })

  it('writes and reads accepted', () => {
    writeConsent(COOKIE, 'accepted')
    expect(readConsent(COOKIE)).toBe('accepted')
  })

  it('writes and reads declined', () => {
    writeConsent(COOKIE, 'declined')
    expect(readConsent(COOKIE)).toBe('declined')
  })

  it('labels stored choices', () => {
    expect(consentLabel('accepted')).toBe('принято')
    expect(consentLabel('declined')).toBe('отклонено')
    expect(consentLabel('')).toBe('не сделан')
  })
})
