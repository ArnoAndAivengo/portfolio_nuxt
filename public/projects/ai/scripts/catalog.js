(function (global) {
  const SPHERES = [
    {
      id: 'trending',
      label: 'Сейчас в тренде',
      short: 'Тренд',
      source: 'usage',
      hint: 'Кого вызывают чаще всего — по объёму токенов, не по качеству.'
    },
    {
      id: 'agent',
      label: 'Агенты',
      short: 'Агенты',
      arena: 'agent',
      hint: 'Кто лучше ведёт агента: инструменты, терминал, многошаговые задачи.'
    },
    {
      id: 'code',
      label: 'Код',
      short: 'Код',
      arena: 'code',
      hint: 'Кто лучше пишет и правит код — по слепым сравнениям людей.'
    },
    {
      id: 'text',
      label: 'Чат и текст',
      short: 'Чат',
      arena: 'text',
      hint: 'Обычный чат: рассуждение, письма, ответы без узкой специализации.'
    },
    {
      id: 'search',
      label: 'Поиск',
      short: 'Поиск',
      arena: 'search',
      hint: 'Кто точнее отвечает с опорой на веб-поиск.'
    },
    {
      id: 'vision',
      label: 'Зрение',
      short: 'Зрение',
      arena: 'vision',
      hint: 'Понимание картинок, скриншотов и сканов.'
    },
    {
      id: 'document',
      label: 'Документы',
      short: 'Документы',
      arena: 'document',
      hint: 'Длинные файлы: факты, резюме, разбор PDF.'
    },
    {
      id: 'text-to-image',
      label: 'Картинки',
      short: 'Картинки',
      arena: 'text-to-image',
      hint: 'Картинка по текстовому описанию.'
    },
    {
      id: 'image-edit',
      label: 'Правка фото',
      short: 'Правка',
      arena: 'image-edit',
      hint: 'Правки готового фото: объект, стиль, фон.'
    },
    {
      id: 'text-to-video',
      label: 'Видео',
      short: 'Видео',
      arena: 'text-to-video',
      hint: 'Короткое видео из текстового описания.'
    },
    {
      id: 'image-to-video',
      label: 'Фото → видео',
      short: 'Фото→видео',
      arena: 'image-to-video',
      hint: 'Оживить фото: движение из одного кадра.'
    },
    {
      id: 'video-edit',
      label: 'Монтаж',
      short: 'Монтаж',
      arena: 'video-edit',
      hint: 'Правки уже готового ролика.'
    }
  ];

  const SCENES = [
    {
      id: 'ide',
      sphere: 'code',
      label: 'Код в IDE',
      note: 'написать и править',
      hint: 'Рейтинг для работы в редакторе: код, рефакторинг, правки по задаче.'
    },
    {
      id: 'article-image',
      sphere: 'text-to-image',
      label: 'Картинка для статьи',
      note: 'обложка и иллюстрация',
      hint: 'Картинка по тексту — обложка, схема, иллюстрация к материалу.'
    },
    {
      id: 'photo-video',
      sphere: 'image-to-video',
      label: 'Видео из фото',
      note: 'оживить кадр',
      hint: 'Короткое видео из одного кадра: движение и «оживить» фото.'
    }
  ];

  const CATALOG = [
    {
      id: 'claude-opus-5',
      aliases: ['claude-opus-5', 'claude opus 5'],
      name: 'Claude Opus 5',
      vendor: 'Anthropic',
      kind: 'Флагманская языковая модель / агент',
      website: 'https://claude.ai',
      docs: 'https://docs.anthropic.com',
      summary: 'Текущий флагман Anthropic для агентной работы: код, инструменты, длинный контекст и аккуратное следование инструкции. Часто лидирует Arena Code и Agent.',
      strengths: ['Многошаговые агенты и tool use', 'Сложный код и рефакторинг', 'Длинный контекст без потери нити', 'Мало «своеволия» в правках'],
      weaknesses: ['Дороже flash/haiku-класса', 'Медленнее лёгких моделей', 'Закрытые веса'],
      bestFor: ['Cursor / IDE-агенты', 'Архитектура и ревью', 'Длинные спецификации', 'Исследовательские отчёты'],
      spheres: ['agent', 'code', 'text', 'document', 'vision'],
      context: '1M',
      pricing: '≈ $5 / $25 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты', 'компьютер']
    },
    {
      id: 'claude-fable-5',
      aliases: ['claude-fable-5', 'claude fable 5'],
      name: 'Claude Fable 5',
      vendor: 'Anthropic',
      kind: 'Агентная модель верхнего уровня',
      website: 'https://claude.ai',
      docs: 'https://docs.anthropic.com',
      summary: 'Линейка Anthropic рядом с Opus: сильна в агентных циклах и коде, часто близка к вершине бенчмарков при другой цене/скорости.',
      strengths: ['Агентные циклы', 'Код и инструменты', 'Стабильный стиль ответа'],
      weaknesses: ['Меньше публичных слотов, чем у Sonnet', 'Цена выше массовых flash'],
      bestFor: ['Автономные агенты', 'Сложные PR', 'Долгие сессии в IDE'],
      spheres: ['agent', 'code', 'text'],
      context: '1M',
      pricing: '≈ $5–10 / $25–50 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты']
    },
    {
      id: 'claude-sonnet-5',
      aliases: ['claude-sonnet-5', 'claude sonnet 5'],
      name: 'Claude Sonnet 5',
      vendor: 'Anthropic',
      kind: 'Рабочая лошадка',
      website: 'https://claude.ai',
      docs: 'https://docs.anthropic.com',
      summary: 'Баланс качества и цены: повседневный код, тексты и агенты, когда Opus избыточен.',
      strengths: ['Цена/качество', 'Код и пояснения', 'Предсказуемый тон'],
      weaknesses: ['На самых жёстких агентных задачах уступает Opus', 'Не самый дешёвый flash'],
      bestFor: ['Ежедневная разработка', 'Черновики и правки', 'Чат с инструментами'],
      spheres: ['agent', 'code', 'text', 'document'],
      context: '1M',
      pricing: '≈ $1 / $5 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты']
    },
    {
      id: 'claude-haiku-4',
      aliases: ['claude-haiku-4', 'claude haiku 4'],
      name: 'Claude Haiku 4.5',
      vendor: 'Anthropic',
      kind: 'Быстрая модель',
      website: 'https://claude.ai',
      docs: 'https://docs.anthropic.com',
      summary: 'Лёгкий Claude: классификация, короткие правки, дешёвый слой в пайплайне агента.',
      strengths: ['Скорость', 'Низкая цена', 'Хороший тон Anthropic'],
      weaknesses: ['Слабее на длинной архитектуре', 'Легче теряет сложный план'],
      bestFor: ['Роутинг', 'Короткие правки', 'Массовая обработка'],
      spheres: ['text', 'code'],
      context: '200K',
      pricing: '≈ $0.50 / $2.50 за 1M ток.',
      modalities: ['текст', 'зрение']
    },
    {
      id: 'gpt-5-6-sol',
      aliases: ['gpt-5.6-sol', 'gpt 5.6 sol', 'gpt-5-6-sol'],
      name: 'GPT-5.6 Sol',
      vendor: 'OpenAI',
      kind: 'Флагман OpenAI для агентов и кода',
      website: 'https://chatgpt.com',
      docs: 'https://platform.openai.com/docs',
      summary: 'Тяжёлый GPT-5.6: силён в агентных бенчмарках, Codex-harness и сложном коде. Часто второй полюс рядом с Claude Opus.',
      strengths: ['Агенты и tool calling', 'Код в Codex/IDE', 'Широкая экосистема ChatGPT'],
      weaknesses: ['Дороже Luna', 'Поведение зависит от harness', 'Закрытые веса'],
      bestFor: ['Код-агенты', 'ChatGPT с инструментами', 'Сложные многошаговые задачи'],
      spheres: ['agent', 'code', 'text', 'search'],
      context: '1.1M',
      pricing: '≈ $2–4 / $10–20 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты']
    },
    {
      id: 'gpt-5-6-terra',
      aliases: ['gpt-5.6-terra', 'gpt 5.6 terra'],
      name: 'GPT-5.6 Terra',
      vendor: 'OpenAI',
      kind: 'Универсальная GPT-5.6',
      website: 'https://chatgpt.com',
      docs: 'https://platform.openai.com/docs',
      summary: 'Средний контур GPT-5.6: ближе к повседневному ChatGPT, чем Sol, с большим контекстом.',
      strengths: ['Универсальный чат', 'Код среднего+ уровня', 'Большой контекст'],
      weaknesses: ['На агентных аренах обычно ниже Sol', 'Цена выше Luna'],
      bestFor: ['Смешанные рабочие сессии', 'Документы + код', 'Продуктовые тексты'],
      spheres: ['text', 'code', 'document'],
      context: '1.1M',
      pricing: '≈ $2 / $12 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты']
    },
    {
      id: 'gpt-5-6-luna',
      aliases: ['gpt-5.6-luna', 'gpt 5.6 luna'],
      name: 'GPT-5.6 Luna',
      vendor: 'OpenAI',
      kind: 'Массовая GPT-5.6',
      website: 'https://chatgpt.com',
      docs: 'https://platform.openai.com/docs',
      summary: 'Самый «горячий» GPT по объёму токенов: дешевле Sol, хватает для большинства чатов и лёгкого кода.',
      strengths: ['Дешевле флагмана', 'Огромный фактический трафик', 'Быстрый отклик'],
      weaknesses: ['Слабее Sol на жёстких агентах', 'Легче ошибается в длинном рефакторинге'],
      bestFor: ['Массовый чат', 'Черновики', 'Дешёвый слой агента'],
      spheres: ['text', 'code', 'trending'],
      context: '1.1M',
      pricing: '≈ $0.20 / $1.20 за 1M ток.',
      modalities: ['текст', 'зрение']
    },
    {
      id: 'gpt-image-2',
      aliases: ['gpt-image-2', 'gpt image 2'],
      name: 'GPT Image 2',
      vendor: 'OpenAI',
      kind: 'Генерация изображений',
      website: 'https://chatgpt.com',
      docs: 'https://platform.openai.com/docs',
      summary: 'Текущий лидер Arena Text-to-Image: сильная композиция, текст на картинке и следование промпту.',
      strengths: ['Следование промпту', 'Текст в кадре', 'Связка с ChatGPT'],
      weaknesses: ['Закрытая модель', 'Лимиты и цена через API', 'Меньше контроля, чем у локального Flux'],
      bestFor: ['Концепт-арт', 'UI-макеты', 'Картинки с надписями'],
      spheres: ['text-to-image', 'image-edit'],
      modalities: ['изображение', 'текст']
    },
    {
      id: 'gemini-3-7-flash',
      aliases: ['gemini-3.7-flash', 'gemini 3.7 flash'],
      name: 'Gemini 3.7 Flash',
      vendor: 'Google',
      kind: 'Быстрый мультимодальный Flash',
      website: 'https://gemini.google.com',
      docs: 'https://ai.google.dev/gemini-api/docs',
      summary: 'Массовый Gemini Flash: огромный контекст, зрение, поиск Google, высокий трафик в OpenRouter.',
      strengths: ['Мультимодальность', 'Контекст ~1M', 'Поиск и экосистема Google', 'Цена Flash'],
      weaknesses: ['На чистом коде часто ниже Opus/Sol', 'Стиль ответа менее «плотный»'],
      bestFor: ['Длинные документы', 'Скриншоты', 'Поиск + саммари'],
      spheres: ['text', 'vision', 'search', 'document', 'code'],
      context: '1M',
      pricing: '≈ $0.19 / $0.94 за 1M ток.',
      modalities: ['текст', 'зрение', 'аудио', 'поиск']
    },
    {
      id: 'gemini-3-1-pro',
      aliases: ['gemini-3.1-pro', 'gemini 3.1 pro'],
      name: 'Gemini 3.1 Pro',
      vendor: 'Google',
      kind: 'Pro-контур Gemini',
      website: 'https://gemini.google.com',
      docs: 'https://ai.google.dev/gemini-api/docs',
      summary: 'Тяжелее Flash: лучше рассуждение и сложные мультимодальные задачи ценой скорости.',
      strengths: ['Сложные мультимодальные разборы', 'Длинный контекст', 'Интеграция с Google'],
      weaknesses: ['Дороже Flash', 'На коде не всегда обгоняет Claude/GPT'],
      bestFor: ['Исследование', 'Большие PDF', 'Видео/скриншоты'],
      spheres: ['text', 'vision', 'document', 'search'],
      context: '1M',
      pricing: '≈ $2 / $12 за 1M ток.',
      modalities: ['текст', 'зрение', 'аудио']
    },
    {
      id: 'nano-banana',
      aliases: ['nano-banana', 'gemini-3.1-flash-image', 'gemini-3-pro-image', 'flash-image'],
      name: 'Gemini Image (Nano Banana)',
      vendor: 'Google',
      kind: 'Генерация и правка картинок',
      website: 'https://gemini.google.com',
      docs: 'https://ai.google.dev/gemini-api/docs',
      summary: 'Линейка Gemini Image: сильна в Arena, удобна для правок «из чата» и веб-поиска в кадре.',
      strengths: ['Правки по инструкции', 'Связка с поиском', 'Скорость Flash'],
      weaknesses: ['Стиль менее «киношный», чем у кино-моделей', 'Водяные знаки/политики Google'],
      bestFor: ['Иллюстрации в чате', 'Правка фото', 'Референсы для дизайна'],
      spheres: ['text-to-image', 'image-edit'],
      modalities: ['изображение', 'текст']
    },
    {
      id: 'kimi-k3',
      aliases: ['kimi-k3', 'kimi k3'],
      name: 'Kimi K3',
      vendor: 'Moonshot',
      kind: 'Открытая/гибридная модель с огромным контекстом',
      website: 'https://www.kimi.com',
      docs: 'https://platform.moonshot.ai',
      summary: 'Китайский флагман Moonshot: длинный контекст, сильный код, высокий Agent Confirmed Success. Часто в топе Arena Code.',
      strengths: ['Длинный контекст (~1M)', 'Код и агенты', 'Хорошая цена относительно Opus'],
      weaknesses: ['Документация и UI чаще на EN/CN', 'Качество зависит от режима Max'],
      bestFor: ['Большие репозитории', 'Чтение логов', 'Дешевле Opus на коде'],
      spheres: ['code', 'agent', 'document', 'text'],
      context: '1M',
      pricing: '≈ $2.55 / $12.75 за 1M ток. (Max дороже)',
      modalities: ['текст', 'инструменты']
    },
    {
      id: 'qwen3-8-max',
      aliases: ['qwen3.8-max', 'qwen3.8 max', 'qwen3-8-max'],
      name: 'Qwen 3.8 Max',
      vendor: 'Alibaba',
      kind: 'Флагман Qwen',
      website: 'https://chat.qwen.ai',
      docs: 'https://qwen.readthedocs.io',
      summary: 'Сильный открытый/полуоткрытый контур Alibaba: код, агенты, китайский и английский, конкурент Claude на Arena Code.',
      strengths: ['Код', 'Китайский + EN', 'Агентные задачи', 'Семейство open-weight рядом'],
      weaknesses: ['Экосистема API пестрее OpenAI', 'Лицензия Max может быть не полностью open'],
      bestFor: ['Код', 'CN/EN смешанные тексты', 'Self-host рядом с Max'],
      spheres: ['code', 'agent', 'text'],
      context: '1M',
      pricing: '≈ $2 / $6 за 1M ток.',
      modalities: ['текст', 'зрение', 'инструменты']
    },
    {
      id: 'glm-5-3',
      aliases: ['glm-5.3', 'glm 5.3'],
      name: 'GLM 5.3',
      vendor: 'Z.ai',
      kind: 'Семейство GLM',
      website: 'https://chat.z.ai',
      docs: 'https://docs.z.ai',
      summary: 'Z.ai GLM: Flash даёт гигантский трафик OpenRouter, Max держится в топе Arena Code. Удобный open-source контур.',
      strengths: ['Дешёвый Flash с огромным объёмом', 'Код на Max', 'Open-weight варианты'],
      weaknesses: ['Flash слабее на архитектуре', 'Качество скачет между тирами'],
      bestFor: ['Дешёвый объём', 'Код на Max/Flash', 'Локальные эксперименты'],
      spheres: ['code', 'text', 'trending', 'agent'],
      context: '1.3M (Flash)',
      pricing: 'Flash ≈ $0.08 / $0.25; Max дороже',
      modalities: ['текст', 'инструменты']
    },
    {
      id: 'deepseek-v4',
      aliases: ['deepseek-v4', 'deepseek v4'],
      name: 'DeepSeek V4',
      vendor: 'DeepSeek',
      kind: 'Код и рассуждение, open-weight',
      website: 'https://chat.deepseek.com',
      docs: 'https://api-docs.deepseek.com',
      summary: 'V4 Flash — один из самых используемых моделей в мире по токенам. Pro/High сильнее в Arena Code при низкой цене.',
      strengths: ['Цена', 'Код и математика', 'Огромный фактический трафик', 'Открытые веса у части линейки'],
      weaknesses: ['Стиль ответа суше Claude', 'Flash хуже на длинных агентах'],
      bestFor: ['Бюджетный код', 'Массовый inference', 'Self-host'],
      spheres: ['code', 'text', 'trending', 'agent'],
      context: 'до 1.3M (Flash)',
      pricing: 'Flash ≈ $0.05 / $0.16 за 1M ток.',
      modalities: ['текст', 'инструменты']
    },
    {
      id: 'grok-4-6',
      aliases: ['grok-4.6', 'grok 4.6'],
      name: 'Grok 4.6',
      vendor: 'SpaceXAI',
      kind: 'Флагман Grok',
      website: 'https://grok.com',
      docs: 'https://docs.x.ai',
      summary: 'Модель xAI: живой поиск по X, сильный код в high-режиме, отдельная линейка Imagine для картинок.',
      strengths: ['Свежий веб/X', 'Код в high', 'Смелый тон'],
      weaknesses: ['Цена', 'Закрытые веса', 'Политики контента иные, чем у Claude'],
      bestFor: ['Новости и тренды', 'Код', 'Менее «корпоративный» чат'],
      spheres: ['code', 'text', 'search', 'agent'],
      context: '500K',
      pricing: '≈ $2 / $6 за 1M ток.',
      modalities: ['текст', 'зрение', 'поиск']
    },
    {
      id: 'grok-imagine',
      aliases: ['grok-imagine', 'grok imagine'],
      name: 'Grok Imagine',
      vendor: 'SpaceXAI',
      kind: 'Картинки и короткое видео',
      website: 'https://grok.com',
      docs: 'https://docs.x.ai',
      summary: 'Генерация изображений xAI: высокий объём голосов Arena, быстрые low-режимы и Pro-качество.',
      strengths: ['Скорость', 'Стилизация', 'Интеграция с Grok'],
      weaknesses: ['Контроль кадра слабее кино-моделей', 'Политики xAI'],
      bestFor: ['Мемы и концепты', 'Быстрые итерации', 'Картинки в чате Grok'],
      spheres: ['text-to-image', 'image-to-video'],
      modalities: ['изображение', 'видео']
    },
    {
      id: 'hy4',
      aliases: ['hy4-preview', 'hy4 preview', 'tencent/hy4'],
      name: 'Tencent Hy4',
      vendor: 'Tencent',
      kind: 'Кодовая модель',
      website: 'https://hunyuan.tencent.com',
      summary: 'Новый контур Tencent: быстро вошёл в топ Arena Code и в топ OpenRouter по токенам (preview).',
      strengths: ['Код', 'Растущий трафик', 'Open-weight заявка'],
      weaknesses: ['Preview: API и лимиты плавают', 'Меньше западной экосистемы'],
      bestFor: ['Код', 'Эксперименты с open-weight', 'CN-стек'],
      spheres: ['code', 'trending', 'text'],
      context: '1M',
      pricing: '≈ $0.83 / $2.50 за 1M ток.',
      modalities: ['текст', 'инструменты']
    },
    {
      id: 'minimax-m3',
      aliases: ['minimax-m3', 'minimax m3'],
      name: 'MiniMax M3',
      vendor: 'MiniMax',
      kind: 'Длинный контекст, часто free-слот',
      website: 'https://www.minimax.io',
      summary: 'Большой контекст и бесплатные слоты на роутерах: удобно для прототипов агентов и длинных текстов.',
      strengths: ['Контекст ~1M', 'Часто free', 'Неплохой код среднего уровня'],
      weaknesses: ['Ниже флагманов на Agent Arena', 'Стабильность free-слотов'],
      bestFor: ['Прототипы', 'Длинные саммари', 'Бюджет'],
      spheres: ['text', 'code', 'document'],
      context: '1M',
      pricing: 'часто Free на роутерах',
      modalities: ['текст']
    },
    {
      id: 'mimo-v2-5',
      aliases: ['mimo-v2.5', 'mimo v2.5'],
      name: 'Xiaomi MiMo V2.5',
      vendor: 'Xiaomi',
      kind: 'Open-weight, высокий трафик',
      website: 'https://github.com/XiaomiMiMo',
      summary: 'Сюрприз OpenRouter: огромный объём токенов при низкой цене. Pro — ближе к кодовым аренам.',
      strengths: ['Цена', 'Трафик', 'Open-weight'],
      weaknesses: ['Меньше западных обзоров', 'Качество неравномерно vs Opus'],
      bestFor: ['Дешёвый объём', 'Self-host', 'Черновой код'],
      spheres: ['trending', 'code', 'text'],
      context: '1.1M',
      pricing: '≈ $0.12 / $0.24 за 1M ток.',
      modalities: ['текст']
    },
    {
      id: 'seedream-5',
      aliases: ['seedream-5', 'seedream 5'],
      name: 'Seedream 5',
      vendor: 'ByteDance',
      kind: 'Генерация изображений',
      website: 'https://seed.bytedance.com',
      summary: 'Киношная картинка ByteDance: высокий Elo и огромное число голосов Arena, особенно Pro.',
      strengths: ['Эстетика кадра', 'Детализация', 'Популярность на арене'],
      weaknesses: ['Закрытый API', 'Слабее GPT Image в тексте на картинке'],
      bestFor: ['Постеры', 'Персонажи', 'Рекламные ключи'],
      spheres: ['text-to-image'],
      modalities: ['изображение']
    },
    {
      id: 'flux-2',
      aliases: ['flux-2', 'flux 2'],
      name: 'FLUX.2',
      vendor: 'Black Forest Labs',
      kind: 'Картинки, есть open-ветки',
      website: 'https://bfl.ai',
      summary: 'Семейство FLUX: Pro/Max в облаке, Dev/Klein можно гнать локально. Предсказуемый выбор для продакшена картинок.',
      strengths: ['Локальный Dev', 'Контроль кадра', 'Зрелая экосистема ComfyUI'],
      weaknesses: ['Max закрытый и дороже', 'Текст на картинке слабее GPT Image 2'],
      bestFor: ['Локальная генерация', 'Пайплайны Comfy', 'Коммерческий стиль'],
      spheres: ['text-to-image', 'image-edit'],
      modalities: ['изображение']
    },
    {
      id: 'veo',
      aliases: ['veo-3', 'veo 3', 'veo-3.1'],
      name: 'Google Veo',
      vendor: 'Google',
      kind: 'Видео из текста/кадра',
      website: 'https://gemini.google.com',
      summary: 'Кино-видео Google: часто верх Arena Text-to-Video, есть звук и высокие разрешения.',
      strengths: ['Кинематограф', 'Звук (audio-слоты)', 'Связность сцены'],
      weaknesses: ['Цена и лимиты', 'Очереди', 'Закрытая модель'],
      bestFor: ['Рекламные ролики', 'Превизы', 'Короткий метр'],
      spheres: ['text-to-video', 'image-to-video'],
      modalities: ['видео', 'аудио']
    },
    {
      id: 'sora',
      aliases: ['sora-2', 'sora 2', 'openai-sora'],
      name: 'Sora',
      vendor: 'OpenAI',
      kind: 'Видео',
      website: 'https://sora.chatgpt.com',
      summary: 'Видеомодель OpenAI: сильная физика и следование промпту, доступ через ChatGPT/Sora.',
      strengths: ['Физика сцены', 'Экосистема OpenAI', 'Качество кадра'],
      weaknesses: ['Лимиты доступа', 'Цена', 'Не всегда лучший Elo vs Veo'],
      bestFor: ['Короткое кино', 'Продуктовые тизеры'],
      spheres: ['text-to-video', 'image-to-video'],
      modalities: ['видео']
    },
    {
      id: 'kling',
      aliases: ['kling-2', 'kling 2', 'kling-3'],
      name: 'Kling',
      vendor: 'Kuaishou',
      kind: 'Видео',
      website: 'https://klingai.com',
      summary: 'Китайский лидер видео: часто рядом с Veo на аренах, силён в image-to-video.',
      strengths: ['Движение камеры', 'I2V', 'Длина ролика'],
      weaknesses: ['UI/оплата через CN-сервисы', 'Политики контента'],
      bestFor: ['Оживление фото', 'Динамичные сцены'],
      spheres: ['text-to-video', 'image-to-video'],
      modalities: ['видео']
    },
    {
      id: 'runway',
      aliases: ['runway-gen', 'runway gen', 'runway-aleph'],
      name: 'Runway',
      vendor: 'Runway',
      kind: 'Видео и монтаж',
      website: 'https://runwayml.com',
      summary: 'Продакшен-инструмент: генерация, монтаж, контролы камеры. Силён на Video Edit Arena.',
      strengths: ['Монтаж и контролы', 'Пайплайн для студий', 'Gen-линейка'],
      weaknesses: ['Подписка', 'Не всегда топ T2V Elo'],
      bestFor: ['Студийный пайплайн', 'Правки ролика', 'VFX-черновики'],
      spheres: ['text-to-video', 'video-edit', 'image-to-video'],
      modalities: ['видео']
    }
  ];

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, ' ')
      .replace(/\[.*?\]/g, ' ')
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const ICON_CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.94.0/icons/';
  const VENDOR_ICONS = {
    anthropic: 'anthropic',
    openai: 'openai',
    google: 'gemini',
    gemini: 'gemini',
    gemma: 'gemma',
    deepseek: 'deepseek',
    moonshot: 'moonshot',
    moonshotai: 'moonshot',
    kimi: 'kimi',
    alibaba: 'qwen',
    'alibaba-ath': 'alibaba',
    qwen: 'qwen',
    zai: 'zai',
    'z-ai': 'zai',
    'z.ai': 'zai',
    zhipu: 'zhipu',
    glm: 'chatglm',
    chatglm: 'chatglm',
    spacexai: 'xai',
    xai: 'xai',
    grok: 'grok',
    tencent: 'tencent',
    hunyuan: 'hunyuan',
    minimax: 'minimax',
    bytedance: 'bytedance',
    xiaomi: 'xiaomimimo',
    mimo: 'xiaomimimo',
    xiaomimimo: 'xiaomimimo',
    mistral: 'mistral',
    cohere: 'cohere',
    'black-forest-labs': 'bfl',
    bfl: 'bfl',
    flux: 'flux',
    kuaishou: 'kling',
    kling: 'kling',
    klingai: 'kling',
    runway: 'runway',
    nvidia: 'nvidia',
    meta: 'meta',
    microsoft: 'microsoft',
    'microsoft-ai': 'microsoft',
    luma: 'luma',
    'luma-ai': 'luma',
    perplexity: 'perplexity',
    'perplexity-ai': 'perplexity',
    pika: 'pika',
    ideogram: 'ideogram',
    recraft: 'recraft',
    krea: 'krea',
    reve: 'reve',
    upstage: 'upstage',
    baidu: 'baidu',
    stepfun: 'stepfun',
    poolside: 'poolside',
    pixverse: 'pixverse',
    vidu: 'vidu',
    hailuo: 'hailuo',
    sora: 'sora',
    shengshu: 'vidu'
  };

  function vendorIcon(vendor, extra) {
    const parts = [vendor, extra];
    if (extra && String(extra).indexOf('/') >= 0) parts.push(String(extra).split('/')[0]);
    for (let i = 0; i < parts.length; i += 1) {
      const n = normalize(parts[i]);
      if (!n) continue;
      if (VENDOR_ICONS[n]) return ICON_CDN + VENDOR_ICONS[n] + '.svg';
      const token = n.split('-')[0];
      if (token && VENDOR_ICONS[token]) return ICON_CDN + VENDOR_ICONS[token] + '.svg';
    }
    return '';
  }

  function findProfile(name, extra) {
    const hay = normalize([name, extra].filter(Boolean).join(' '));
    if (!hay) return null;
    let best = null;
    let bestLen = 0;
    for (const item of CATALOG) {
      for (const alias of item.aliases) {
        const a = normalize(alias);
        if (!a) continue;
        if (hay.includes(a) || a.includes(hay)) {
          if (a.length > bestLen) {
            best = item;
            bestLen = a.length;
          }
        }
      }
    }
    return best;
  }

  global.AI_SPHERES = SPHERES;
  global.AI_SCENES = SCENES;
  global.AI_CATALOG = CATALOG;
  global.AI_findProfile = findProfile;
  global.AI_vendorIcon = vendorIcon;
  global.AI_normalize = normalize;
})(window);
