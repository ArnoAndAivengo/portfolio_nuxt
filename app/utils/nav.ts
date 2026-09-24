import { SITE_NAV } from '~/constants'

export const navItemForPath = (path: string) => {
  if (path.startsWith('/aobukhov') || path.startsWith('/resume')) {
    return SITE_NAV.find((item) => item.key === 'resume') ?? SITE_NAV[0]
  }

  const matches = SITE_NAV.filter((item) =>
    item.to === '/' ? path === '/' : path.startsWith(item.to)
  )

  if (!matches.length) return SITE_NAV[0]

  return matches.reduce((best, item) =>
    item.to.length > best.to.length ? item : best
  )
}
