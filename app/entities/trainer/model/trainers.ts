export const TRAINERS = [
  {
    to: '/trainers/typing',
    title: 'Touch Type',
    key: 'typing',
    excerpt: 'Слепая печать на английском QWERTY: уроки по клавишам, разминка новых букв и свободная практика.',
  },
  {
    to: '/trainers/interviews',
    title: 'Собеседования',
    key: 'interviews',
    excerpt: 'Квизы по языкам: уроки, уровни и вопросы как на собесе.',
  },
  {
    to: '/trainers/bugs',
    title: 'Поиск багов',
    key: 'bugs',
    excerpt: 'Ищи ошибки в коде на Python и JavaScript: уровни Junior → Expert, таймер и разбор.',
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
  interviews: {
    pageKey: 'trainers',
    current: 'interviews',
    eyebrow: 'Тренажёр',
    name: 'Собеседования',
    role: 'Python · JavaScript',
    lead: 'Выберите язык и проходите уроки. Повторение важнее скорости: читайте разбор и возвращайтесь к пройденному.',
    tip: false,
  },
  python: {
    pageKey: 'python',
    current: 'python',
    eyebrow: 'Собеседование',
    name: 'Python',
    role: 'Базовый уровень',
    lead: 'Базовый уровень программирования на Python включает освоение синтаксиса, основных типов данных и стандартных конструкций для создания простых программ.',
    tip: false,
  },
  javascript: {
    pageKey: 'javascript',
    current: 'javascript',
    eyebrow: 'Собеседование',
    name: 'JavaScript',
    role: 'Базовый уровень',
    lead: 'Базовый JavaScript: синтаксис, типы, массивы, объекты и функции — с вопросами, как на собеседовании.',
    tip: false,
  },
  bugs: {
    pageKey: 'bugs',
    current: 'bugs',
    eyebrow: 'Тренажёр',
    name: 'Поиск багов',
    role: 'Python · JavaScript',
    lead: 'Выберите язык и ищите ошибки в коде. Таймер давит как на ревью, но разбор важнее очков.',
    tip: false,
  },
  bugsPython: {
    pageKey: 'python',
    current: 'bugs-python',
    eyebrow: 'Поиск багов',
    name: 'Python',
    role: 'Junior → Expert',
    lead: 'Типы, словари, копии, замыкания и мутабельные значения по умолчанию.',
    tip: false,
  },
  bugsJavascript: {
    pageKey: 'javascript',
    current: 'bugs-javascript',
    eyebrow: 'Поиск багов',
    name: 'JavaScript',
    role: 'Junior → Expert',
    lead: 'Типы, замыкания, this, промисы и типичные ловушки Vue.',
    tip: false,
  },
} as const

export type TrainerPage = (typeof TRAINER_PAGES)[keyof typeof TRAINER_PAGES]
export type TrainerCurrent = TrainerPage['current']

export const trainerPageForPath = (path: string): TrainerPage | null => {
  if (!path.startsWith('/trainers')) return null
  if (path.startsWith('/trainers/typing')) return TRAINER_PAGES.typing
  if (path.startsWith('/trainers/interviews')) return TRAINER_PAGES.interviews
  if (path.startsWith('/trainers/python')) return TRAINER_PAGES.python
  if (path.startsWith('/trainers/javascript')) return TRAINER_PAGES.javascript
  if (path.startsWith('/trainers/bugs/python')) return TRAINER_PAGES.bugsPython
  if (path.startsWith('/trainers/bugs/javascript')) return TRAINER_PAGES.bugsJavascript
  if (path.startsWith('/trainers/bugs')) return TRAINER_PAGES.bugs

  return TRAINER_PAGES.index
}

export const isInterviewPath = (path: string) =>
  path.startsWith('/trainers/interviews')
  || path.startsWith('/trainers/python')
  || path.startsWith('/trainers/javascript')

export const isBugPath = (path: string) =>
  path.startsWith('/trainers/bugs')
