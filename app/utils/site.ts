import { SITE_ORIGIN } from '~/constants'

export const siteUrl = (path = '/') => {
  if (!path || path === '/') return `${SITE_ORIGIN}/`

  const normalized = path.startsWith('/') ? path : `/${path}`

  return `${SITE_ORIGIN}${normalized}`
}

export const siteHost = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return href
  }
}

