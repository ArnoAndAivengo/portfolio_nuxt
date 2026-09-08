import { LEVELS, type PythonLevelId } from './levels'

export const usePythonLevel = () =>
  useState<PythonLevelId>('python-quiz-level', () => 'basic')

export const pythonLevelMeta = (id: PythonLevelId) =>
  LEVELS.find((item) => item.id === id) ?? LEVELS[0]
