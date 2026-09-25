# Портфолио — Александр Обухов

Исходники сайта [arnoandaivengo.ru](https://arnoandaivengo.ru/).

## Стек

- Nuxt 4, Vue 3, `@nuxt/content` 3
- TypeScript, ESLint (`@nuxt/eslint`)
- Vitest, Playwright
- CSS-переменные в `app/assets/css/theme.css`, шрифты self-host

## Команды

```bash
  npm install
  npm run dev        # http://localhost:3000
  npm run generate   # статика в .output/public
  npm run preview    # превью собранного сайта по HTTP
  npm run lint
  npm run typecheck
  npm run test       # Vitest
  npm run test:e2e   # Playwright smoke (нужен предварительный generate)
  npm run prepush    # lint + typecheck + Vitest; то же самое ставится на git push
  npm run ai:snapshot  # снимок рейтингов /projects/ai/ (без nuxt generate)
```

## Разделы

| URL | Содержание |
|-----|------------|
| `/` | Главная |
| `/resume` | Резюме |
| `/projects` | Текущие продукты: CodeVega и Codestats |
| `/projects/portfolio` | Портфолио — pet-проекты и живые демо |
| `/projects/codevega` | Страница CodeVega |
| `/projects/codestats` | Страница Codestats |
| `/projects/crypto/` | SPA-демо Crypto Dashboard |
| `/projects/saas-dashboard/` | SPA-демо SaaS Metrics Hub |
| `/projects/ai-chat/` | SPA-демо AI Chat |
| `/projects/ai/` | Рейтинг нейросетей |
| `/trainers` | Хаб тренажёров |
| `/trainers/typing` | Touch Type |
| `/trainers/interviews` | Собеседования: Python и JavaScript |
| `/trainers/python` | Квиз по Python |
| `/trainers/javascript` | Квиз по JavaScript |
| `/trainers/bugs` | Поиск багов: Python и JavaScript |
| `/trainers/bugs/python` | Поиск багов в Python |
| `/trainers/bugs/javascript` | Поиск багов в JavaScript |
| `/services` | Услуги — бесплатно, от лендинга до SPA |
| `/articles` | Статьи |
| `/articles/techblog` | Техблог CodeVega |
| `/motivation` | История: путь IT-специалиста |

## Контент

| Коллекция | Файлы |
|-----------|--------|
| Главная | `content/home.md` |
| Резюме (текст) | `content/resume.md` |
| Резюме (мета) | `content/resume-meta.yml` |
| Места работы | `content/jobs/*.yml` |
| Проекты | `content/projects/*.md` |
| Услуги | `content/services.yml` |
| Статьи | `content/articles/**/*.md` |

После правок контента достаточно `npm run generate`.

## Структура

```text
app/
  constants/     # SITE_NAV, SITE_ORIGIN, OG_IMAGE
  components/
  composables/
  entities/      # страницы проектов, тренажёров и мотивации
  features/      # Touch Type, квизы Python / JavaScript, история и поиск багов
  widgets/       # хабы, сайдбары, кейсы CodeVega / Codestats
  shared/
  layouts/
  pages/
  utils/
content/
public/          # robots.txt, sitemap.xml, файлы Вебмастера/Search Console,
                 # favicon, картинки, SPA-демо в public/projects/
scripts/         # ai-snapshot.mjs — обновление рейтинга нейросетей
nginx.snippet.conf
```