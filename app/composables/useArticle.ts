import { articlePageForPath } from '~/entities/article'

export const useArticle = () => {
  const route = useRoute()

  return useAsyncData(
    () => 'article-' + route.path,
    () => {
      const path = route.path
      if (articlePageForPath(path)?.hub) return Promise.resolve(null)

      return queryCollection('articles').path(path).first()
    },
  )
}

