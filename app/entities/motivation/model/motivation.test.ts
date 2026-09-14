import { describe, expect, it } from 'vitest'
import { MOTIVATION_PAGES, motivationPageForPath } from './motivation'

describe('motivationPageForPath', () => {
  it('возвращает историю для корня раздела', () => {
    expect(motivationPageForPath('/motivation')).toBe(MOTIVATION_PAGES.story)
    expect(motivationPageForPath('/motivation/')).toBe(MOTIVATION_PAGES.story)
  })

  it('не матчит чужие пути', () => {
    expect(motivationPageForPath('/trainers')).toBeNull()
    expect(motivationPageForPath('/trainers/bugs')).toBeNull()
    expect(motivationPageForPath('/')).toBeNull()
  })
})
