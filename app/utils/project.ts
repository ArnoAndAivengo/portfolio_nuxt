export const isRemoteHref = (href: string) => /^https?:\/\//.test(href)

export const projectHrefIsExternal = (href: string, spa?: boolean) =>
  Boolean(spa) || isRemoteHref(href)

export const projectRepoHref = (href: string, repo?: string) => repo || href

export const projectHasPreview = (href: string, spa?: boolean) =>
  Boolean(spa) || !isRemoteHref(href)

export const projectGitUrl = (href: string, repo?: string) => {
  const url = projectRepoHref(href, repo)

  return /(?:github|gitlab)\.com/.test(url) ? url : undefined
}

