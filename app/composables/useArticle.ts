import { articlePageForPath } from '~/entities/article'

const fetchArticle = () => {
  const path = useRoute().path
  if (articlePageForPath(path)?.hub) return Promise.resolve(null)

  return queryCollection('articles').path(path).first()
}

export const useArticle = () => {
  const route = useRoute()

  return useAsyncData(
    () => 'article-' + route.path,
    fetchArticle,
  )
}

