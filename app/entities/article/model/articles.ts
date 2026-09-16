export const ARTICLE_PAGES = {
  posts: {
    pageKey: 'articles',
    current: 'posts',
    hub: true,
    eyebrow: 'Статьи',
    name: '',
    role: '',
    lead: 'Заметки о карьере в IT, обучении и практике разработки — без воды, с акцентом на то, что реально помогает расти.',
    seoTitle: 'Статьи — Александр Обухов',
    seoDescription: 'Заметки о карьере в IT, обучении и практике разработки — без воды, с акцентом на то, что реально помогает расти.',
  },
  issues: {
    pageKey: 'techblog',
    current: 'issues',
    hub: true,
    eyebrow: 'Техблог',
    name: '',
    role: '',
    lead: 'Fullstack-разработка обучающей платформы: что делаю, почему так и где есть сложности — без сухих чеклистов, с живым опытом.',
    seoTitle: 'Техблог LearnPortal — Александр Обухов',
    seoDescription: 'Пятничный техблог о разработке обучающей платформы LearnPortal: архитектура, инфраструктура, курсы и живой опыт fullstack-разработки.',
  },
  post: {
    pageKey: 'articles',
    current: 'posts',
    hub: false,
    eyebrow: 'Статья',
    name: '',
    role: '',
    lead: '',
  },
  issue: {
    pageKey: 'techblog',
    current: 'issues',
    hub: false,
    eyebrow: 'Техблог',
    name: '',
    role: '',
    lead: '',
  },
} as const

export type ArticlePage = (typeof ARTICLE_PAGES)[keyof typeof ARTICLE_PAGES]
export type ArticleCurrent = ArticlePage['current']

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

export const articlePageForPath = (path: string): ArticlePage | null => {
  if (!path.startsWith('/articles')) return null

  const normalized = normalizePath(path)
  if (normalized === '/articles') return ARTICLE_PAGES.posts
  if (normalized === '/articles/techblog') return ARTICLE_PAGES.issues

  const slug = normalized.slice('/articles/'.length)
  if (slug.startsWith('learnportal-tehblog-')) return ARTICLE_PAGES.issue

  return ARTICLE_PAGES.post
}

export const articleHref = (path: string) =>
  path.startsWith('/articles') ? path : `/articles${path.startsWith('/') ? path : `/${path}`}`
