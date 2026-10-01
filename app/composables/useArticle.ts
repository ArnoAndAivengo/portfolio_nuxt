import { articlePageForPath } from '~/entities/article'

const articlePath = (path: string) => path.replace(/\/+$/, '') || '/'

export const useArticle = () => {
  const route = useRoute()

  return useAsyncData(
    () => 'article-' + articlePath(route.path),
    () => {
      const path = articlePath(route.path)

      if (articlePageForPath(path)?.hub) return Promise.resolve(null)

      return queryCollection('articles').path(path).first()
    },
  )
}

