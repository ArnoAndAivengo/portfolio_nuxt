export const TRAINERS = [
  {
    to: '/trainers/typing',
    title: 'Touch Type',
    key: 'typing',
    excerpt: 'Слепая печать на английском QWERTY: уроки по клавишам, разминка новых букв и свободная практика.',
  },
  {
    to: '/trainers/python',
    title: 'Python',
    key: 'python',
    excerpt: 'Базовый уровень заполнен: синтаксис, строки, циклы, функции и вопросы как на собесе. Средний и продвинутый — скоро.',
  },
] as const

export const TRAINER_PAGES = {
  index: {
    pageKey: 'trainers',
    current: 'index',
    eyebrow: 'Тренажёры',
    name: '',
    role: '',
    lead: 'Небольшие интерактивные тренажёры для практики.',
    tip: false,
  },
  typing: {
    pageKey: 'typing',
    current: 'typing',
    eyebrow: 'Тренажёр',
    name: 'Touch Type',
    role: 'English · QWERTY',
    lead: 'Слепая печать десятью пальцами: уроки по клавишам, разбор слабых мест и практика.',
    tip: true,
  },
  python: {
    pageKey: 'python',
    current: 'python',
    eyebrow: 'Тренажёр',
    name: 'Python',
    role: 'Базовый уровень',
    lead: 'Базовый уровень программирования на Python включает освоение синтаксиса, основных типов данных и стандартных конструкций для создания простых программ.',
    tip: false,
  },
} as const

export type TrainerPage = (typeof TRAINER_PAGES)[keyof typeof TRAINER_PAGES]

export const trainerPageForPath = (path: string): TrainerPage | null => {
  if (!path.startsWith('/trainers')) return null
  if (path.startsWith('/trainers/typing')) return TRAINER_PAGES.typing
  if (path.startsWith('/trainers/python')) return TRAINER_PAGES.python

  return TRAINER_PAGES.index
}
