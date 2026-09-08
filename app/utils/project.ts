export const isRemoteHref = (href: string) => /^https?:\/\//.test(href)

export const projectHrefIsExternal = (href: string, spa?: boolean) =>
  Boolean(spa) || isRemoteHref(href)

export const projectRepoHref = (href: string, repo?: string) => repo || href
