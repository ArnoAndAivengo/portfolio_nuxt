import { SITE_NAV } from '~/constants'

export const navItemForPath = (path: string) => {
  if (path.startsWith('/aobukhov') || path.startsWith('/resume')) {
    return SITE_NAV.find((item) => item.key === 'resume') ?? SITE_NAV[0]
  }

  return SITE_NAV.find((item) =>
    item.to === '/' ? path === '/' : path.startsWith(item.to)
  ) ?? SITE_NAV[0]
}
