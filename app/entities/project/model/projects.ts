export const PROJECT_PAGES = {
  index: {
    pageKey: 'projects',
    current: 'index',
    eyebrow: 'Проекты',
    name: '',
    role: '',
    lead: 'Собственные продукты — от архитектуры и кода до деплоя.',
  },
  portfolio: {
    pageKey: 'projects',
    current: 'portfolio',
    eyebrow: 'Проекты',
    name: '',
    role: '',
    lead: 'Портфолио — код на GitLab или GitHub, плюс живые демо.',
  },
  codevega: {
    pageKey: 'codevega',
    current: 'codevega',
    eyebrow: 'Текущий проект',
    name: 'CodeVega',
    role: 'Сияй в коде. Навсегда.',
    lead: 'Уникальный проект для обучения программированию: структурное обучение и IT-паспорт, который сохраняет весь прогресс.',
    repo: 'https://github.com/ArnoAndAivengo/learn-portal-platform',
    site: 'https://codevega.ru/',
    seoTitle: 'CodeVega — Сияй в коде. Навсегда. · Александр Обухов',
    seoDescription: 'CodeVega — уникальный проект для обучения программированию. Прогресс, код и пет-проекты остаются в IT-паспорте. Бесплатная платформа, которую развивает сообщество.',
    sections: [
      { id: 'overview', label: 'О проекте' },
      { id: 'screenshots', label: 'Скриншоты' },
      { id: 'inside', label: 'Что внутри' },
      { id: 'stack', label: 'Стек' },
      { id: 'status', label: 'Статус' },
      { id: 'join', label: 'Участие' },
    ],
  },
  codestats: {
    pageKey: 'codestats',
    current: 'codestats',
    eyebrow: 'Текущий проект',
    name: 'Codestats',
    role: '',
    lead: 'Платформа для IT-рекрутинга — вакансии, кандидаты и проверяемый GitHub-след в одном месте.',
    repo: 'https://github.com/ArnoAndAivengo/codestats-platform',
    seoTitle: 'Текущий проект — Codestats · Александр Обухов',
    seoDescription: 'Codestats — платформа аналитики для IT-рекрутинга: вакансии, кандидаты и проверяемый GitHub-след. Репозиторий закрытый, участие по приглашению.',
    sections: [
      { id: 'overview', label: 'О проекте' },
      { id: 'inside', label: 'Что внутри' },
      { id: 'stack', label: 'Стек' },
      { id: 'status', label: 'Статус' },
      { id: 'code', label: 'Код' },
      { id: 'codevega', label: 'CodeVega' },
    ],
  },
} as const

export type ProjectPage = (typeof PROJECT_PAGES)[keyof typeof PROJECT_PAGES]

export const projectPageForPath = (path: string): ProjectPage | null => {
  if (!path.startsWith('/projects')) return null
  if (path.startsWith('/projects/crypto')) return null
  if (path.startsWith('/projects/saas-dashboard')) return null
  if (path.startsWith('/projects/ai-chat')) return null
  if (path.startsWith('/projects/ai')) return null
  if (path.startsWith('/projects/portfolio') || path.startsWith('/projects/pets')) {
    return PROJECT_PAGES.portfolio
  }
  if (path.startsWith('/projects/codevega') || path.startsWith('/projects/learn-portal')) {
    return PROJECT_PAGES.codevega
  }
  if (path.startsWith('/projects/codestats')) return PROJECT_PAGES.codestats

  return PROJECT_PAGES.index
}
