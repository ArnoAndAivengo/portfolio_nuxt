import { useLanguageQuiz } from '~/shared/lib/language-quiz'
import { LESSONS, LEVELS } from './lessons'
import { usePythonLevel } from './usePythonLevel'

export const usePythonQuiz = () => useLanguageQuiz({
  lessons: LESSONS,
  levels: LEVELS,
  storage: 'ao-python-v1',
  cookie: 'ao-python-consent',
  level: usePythonLevel(),
  resetConfirm: 'Сбросить прогресс Python-тренажёра?',
})
