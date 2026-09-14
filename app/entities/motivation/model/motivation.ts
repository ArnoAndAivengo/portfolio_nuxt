export const MOTIVATION_PAGES = {
  story: {
    pageKey: 'motivation',
    current: 'story',
    eyebrow: 'Мотивация',
    name: 'История',
    role: 'Путь в IT',
    lead: 'Интерактивная история о росте в IT — от диплома до Senior, с юмором, багами и правильными выводами.',
    seoTitle: 'Мотивация — Путь IT-специалиста · Александр Обухов',
    seoDescription: 'Интерактивная история о пути IT-специалиста — от диплома до Senior.',
  },
} as const

export type MotivationPage = (typeof MOTIVATION_PAGES)[keyof typeof MOTIVATION_PAGES]
export type MotivationCurrent = MotivationPage['current']

export const motivationPageForPath = (path: string): MotivationPage | null => {
  if (!path.startsWith('/motivation')) return null

  return MOTIVATION_PAGES.story
}
