export type ConsentChoice = 'accepted' | 'declined' | ''

const YEAR = 60 * 60 * 24 * 365

export const readConsent = (cookie: string): ConsentChoice => {
  if (!import.meta.client) return ''

  const match = document.cookie.match(new RegExp(`(?:^|; )${cookie.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`))
  const value = match ? decodeURIComponent(match[1]) : ''

  return value === 'accepted' || value === 'declined' ? value : ''
}

export const writeConsent = (cookie: string, value: Exclude<ConsentChoice, ''>, maxAge = YEAR) => {
  document.cookie = `${cookie}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

export const consentLabel = (choice: ConsentChoice) => {
  if (choice === 'accepted') return 'принято'
  if (choice === 'declined') return 'отклонено'

  return 'не сделан'
}
