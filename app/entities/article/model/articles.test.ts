import { describe, expect, it } from 'vitest'
import { ARTICLE_PAGES, articleHref, articlePageForPath } from './articles'

describe('articlePageForPath', () => {
  it('отдаёт хаб публикаций', () => {
    expect(articlePageForPath('/articles')).toBe(ARTICLE_PAGES.posts)
    expect(articlePageForPath('/articles/')).toBe(ARTICLE_PAGES.posts)
  })

  it('отдаёт хаб техблога', () => {
    expect(articlePageForPath('/articles/techblog')).toBe(ARTICLE_PAGES.issues)
  })

  it('отдаёт выпуск техблога и обычную статью', () => {
    expect(articlePageForPath('/articles/learnportal-tehblog-08')).toBe(ARTICLE_PAGES.issue)
    expect(articlePageForPath('/articles/it-bez-opyta')).toBe(ARTICLE_PAGES.post)
  })

  it('не матчит чужие пути', () => {
    expect(articlePageForPath('/projects')).toBeNull()
    expect(articlePageForPath('/')).toBeNull()
  })
})

describe('articleHref', () => {
  it('не дублирует префикс /articles', () => {
    expect(articleHref('/articles/foo')).toBe('/articles/foo')
    expect(articleHref('/foo')).toBe('/articles/foo')
    expect(articleHref('foo')).toBe('/articles/foo')
  })
})
