export const BUG_HUNTS = [
  {
    to: '/trainers/bugs/python',
    title: 'Python',
    key: 'python',
    excerpt: 'Работа с поиском багов на Python: типы, словари, копии, замыкания, мутабельные значения по умолчанию.',
    icon: '/icons/python.svg',
    accent: 'var(--accent-python)',
  },
  {
    to: '/trainers/bugs/javascript',
    title: 'JavaScript',
    key: 'javascript',
    excerpt: 'Работа с поиском багов на JavaScript: типы, замыкания, this, промисы и типичные ловушки Vue.',
    icon: '/icons/javascript.svg',
    accent: 'var(--accent-javascript)',
  },
] as const

export type BugHuntKey = (typeof BUG_HUNTS)[number]['key']
