import { OG_IMAGE } from '~/constants'
import { siteUrl } from '~/utils/site'

type SeoInput = {
  title: () => string | undefined
  description: () => string | undefined
  path: () => string | undefined
  type?: string
  image?: () => string | undefined
  author?: () => string | undefined
}

export const usePageSeo = (input: SeoInput) => {
  const url = () => siteUrl(input.path() || '/')
  const image = () => input.image?.() || OG_IMAGE

  useSeoMeta({
    title: () => input.title(),
    description: () => input.description(),
    ogTitle: () => input.title(),
    ogDescription: () => input.description(),
    ogType: input.type || 'website',
    ogUrl: url,
    ogImage: image,
    ogLocale: 'ru_RU',
    ogSiteName: 'Александр Обухов',
    twitterCard: 'summary_large_image',
    twitterTitle: () => input.title(),
    twitterDescription: () => input.description(),
    twitterImage: image,
    author: () => input.author?.(),
    robots: 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ],
  })
}
