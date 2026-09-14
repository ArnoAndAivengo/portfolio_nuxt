import { describe, expect, it } from 'vitest'
import { TRAINER_PAGES, isBugPath, isInterviewPath, trainerPageForPath } from './trainers'

describe('trainerPageForPath', () => {
  it('отдаёт хаб тренажёров', () => {
    expect(trainerPageForPath('/trainers')).toBe(TRAINER_PAGES.index)
    expect(trainerPageForPath('/trainers/')).toBe(TRAINER_PAGES.index)
  })

  it('отдаёт собеседования, языки и поиск багов', () => {
    expect(trainerPageForPath('/trainers/interviews')).toBe(TRAINER_PAGES.interviews)
    expect(trainerPageForPath('/trainers/python')).toBe(TRAINER_PAGES.python)
    expect(trainerPageForPath('/trainers/javascript')).toBe(TRAINER_PAGES.javascript)
    expect(trainerPageForPath('/trainers/bugs')).toBe(TRAINER_PAGES.bugs)
    expect(trainerPageForPath('/trainers/bugs/python')).toBe(TRAINER_PAGES.bugsPython)
    expect(trainerPageForPath('/trainers/bugs/javascript')).toBe(TRAINER_PAGES.bugsJavascript)
  })

  it('не матчит чужие пути', () => {
    expect(trainerPageForPath('/motivation')).toBeNull()
    expect(trainerPageForPath('/')).toBeNull()
  })
})

describe('isInterviewPath', () => {
  it('включает хаб и страницы языков', () => {
    expect(isInterviewPath('/trainers/interviews')).toBe(true)
    expect(isInterviewPath('/trainers/python')).toBe(true)
    expect(isInterviewPath('/trainers/javascript')).toBe(true)
    expect(isInterviewPath('/trainers/typing')).toBe(false)
    expect(isInterviewPath('/trainers/bugs')).toBe(false)
    expect(isInterviewPath('/trainers/bugs/javascript')).toBe(false)
  })
})

describe('isBugPath', () => {
  it('включает хаб и страницы языков', () => {
    expect(isBugPath('/trainers/bugs')).toBe(true)
    expect(isBugPath('/trainers/bugs/python')).toBe(true)
    expect(isBugPath('/trainers/bugs/javascript')).toBe(true)
    expect(isBugPath('/trainers/python')).toBe(false)
    expect(isBugPath('/trainers/interviews')).toBe(false)
  })
})
