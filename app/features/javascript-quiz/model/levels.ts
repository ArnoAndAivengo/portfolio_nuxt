export const JS_LEVELS = [
  {
    id: 'basic',
    label: 'Базовый',
    role: 'Базовый уровень',
    lead: 'Базовый JavaScript: синтаксис, типы, массивы, объекты и функции — достаточно, чтобы уверенно читать чужой код.',
  },
  {
    id: 'middle',
    label: 'Средний',
    role: 'Средний уровень',
    lead: 'Асинхронность, this, прототипы и типичные ловушки. Уроки появятся позже — пока можно пройти базовый уровень.',
  },
  {
    id: 'advanced',
    label: 'Продвинутый',
    role: 'Продвинутый уровень',
    lead: 'Event loop, память и вопросы уровня Senior. Уроки появятся позже — пока можно пройти базовый уровень.',
  },
] as const

export type JavascriptLevelId = (typeof JS_LEVELS)[number]['id']
