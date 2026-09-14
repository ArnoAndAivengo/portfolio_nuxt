import { useLanguageQuiz } from '~/shared/lib/language-quiz'
import { JS_LESSONS } from './lessons'
import { JS_LEVELS } from './levels'
import { useJavascriptLevel } from './useJavascriptLevel'

export const useJavascriptQuiz = () => useLanguageQuiz({
  lessons: JS_LESSONS,
  levels: JS_LEVELS,
  storage: 'ao-javascript-v1',
  cookie: 'ao-javascript-consent',
  level: useJavascriptLevel(),
  resetConfirm: 'Сбросить прогресс JavaScript-тренажёра?',
})
