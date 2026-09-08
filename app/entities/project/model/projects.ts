export const PROJECT_PAGES = {
  index: {
    pageKey: 'projects',
    current: 'index',
    eyebrow: 'Проекты',
    name: '',
    role: '',
    lead: 'Собственные продукты — от архитектуры и кода до деплоя.',
  },
  pets: {
    pageKey: 'projects',
    current: 'pets',
    eyebrow: 'Проекты',
    name: '',
    role: '',
    lead: 'Эксперименты и учебные репозитории — код на GitLab или GitHub, плюс живые демо.',
  },
  learnPortal: {
    pageKey: 'learn-portal',
    current: 'learn-portal',
    eyebrow: 'Текущий проект',
    name: 'LearnPortal',
    role: '',
    lead: 'Обучающая платформа для web-разработчиков — old school фундамент, командные проекты и прозрачный путь кандидата.',
    repo: 'https://github.com/ArnoAndAivengo/learn-portal-platform',
    seoTitle: 'LearnPortal — обучающая платформа · Александр Обухов',
    seoDescription: 'LearnPortal — обучающая платформа для web-разработчиков. Участие открыто и бесплатно: код, курсы, продукт. Пока без публичной площадки — работа локально через merge request.',
    sections: [
      { id: 'overview', label: 'О проекте' },
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
      { id: 'learnportal', label: 'LearnPortal' },
    ],
  },
} as const

export type ProjectPage = (typeof PROJECT_PAGES)[keyof typeof PROJECT_PAGES]

export const projectPageForPath = (path: string): ProjectPage | null => {
  if (!path.startsWith('/projects')) return null
  if (path.startsWith('/projects/crypto')) return null
  if (path.startsWith('/projects/saas-dashboard')) return null
  if (path.startsWith('/projects/ai-chat')) return null
  if (path.startsWith('/projects/pets')) return PROJECT_PAGES.pets
  if (path.startsWith('/projects/learn-portal')) return PROJECT_PAGES.learnPortal
  if (path.startsWith('/projects/codestats')) return PROJECT_PAGES.codestats

  return PROJECT_PAGES.index
}
