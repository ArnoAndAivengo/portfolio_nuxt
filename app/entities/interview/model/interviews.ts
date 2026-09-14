export const INTERVIEWS = [
  {
    to: '/trainers/python',
    title: 'Python',
    key: 'python',
    excerpt: 'Базовый уровень: синтаксис, строки, циклы, функции и вопросы как на собесе. Средний и продвинутый — скоро.',
    icon: '/icons/python.svg',
    accent: 'var(--accent-python)',
  },
  {
    to: '/trainers/javascript',
    title: 'JavaScript',
    key: 'javascript',
    excerpt: 'Базовый уровень: синтаксис, типы, массивы, объекты, функции и вопросы как на собесе. Средний и продвинутый — скоро.',
    icon: '/icons/javascript.svg',
    accent: 'var(--accent-javascript)',
  },
] as const

export type InterviewKey = (typeof INTERVIEWS)[number]['key']
