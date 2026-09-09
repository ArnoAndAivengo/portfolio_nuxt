# Портфолио — Александр Обухов

Исходники сайта [arnoandaivengo.ru](https://arnoandaivengo.ru/).

Nuxt 4 + `@nuxt/content`. В продакшене только HTML, CSS и JS: без Node, PHP, базы и API.

Лицензия: [MIT](./LICENSE). Поле `"private": true` в `package.json` значит «не публиковать в npm», не «закрытый GitHub».

## Требования

- Node.js 22.5+ (на сборке Content использует встроенный `node:sqlite`)

## Команды

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # статика в .output/public
npm run preview    # превью собранного сайта по HTTP
```

Не открывайте `index.html` как файл: без HTTP Vue не гидрируется.

## Разделы

| URL | Содержание |
|-----|------------|
| `/` | Главная |
| `/resume` | Резюме |
| `/projects` | Текущие продукты: LearnPortal и Codestats |
| `/projects/pets` | Pet-проекты и живые демо |
| `/projects/learn-portal` | Страница LearnPortal |
| `/projects/codestats` | Страница Codestats |
| `/projects/crypto/` | SPA-демо Crypto Dashboard |
| `/projects/saas-dashboard/` | SPA-демо SaaS Metrics Hub |
| `/projects/ai-chat/` | SPA-демо AI Chat |
| `/trainers` | Хаб тренажёров |
| `/trainers/typing` | Touch Type |
| `/trainers/python` | Квиз по Python |
| `/services` | Услуги (заглушка) |
| `/articles` | Статьи (заглушка) |
| `/motivation` | Мотивация (заглушка) |

`/aobukhov` → 301 на `/resume`. Старые URL тренажёров `/trainers/typing.html` и `/trainers/python.html` тоже редиректят на актуальные пути.

Страницы `/ai` нет; чат с моделями живёт как демо `/projects/ai-chat/`.

Меню и SEO-тексты: `app/constants/nav.ts`.

Карточки проектов на главной и в резюме сами не ссылки: «Превью» ведёт на страницу или демо, иконка git — в репозиторий.

## Контент

Тексты и данные лежат в `content/`, схема коллекций — в `content.config.ts`. Контакты в `content/home.md` — публичные, как на сайте (в футере).

| Коллекция | Файлы |
|-----------|--------|
| Главная | `content/home.md` |
| Резюме (текст) | `content/resume.md` |
| Резюме (мета) | `content/resume-meta.yml` |
| Места работы | `content/jobs/*.yml` |
| Опыт на главной | `content/experience/*.md` |
| Проекты | `content/projects/*.md` |
| Статьи | `content/articles/**/*.md` (пока пусто) |

После правок контента достаточно `npm run generate`.

SPA-демо в `public/projects/{crypto,saas-dashboard,ai-chat}/` — готовые сборки чужих приложений. Nuxt их не пререндерит; в nginx для crypto нужен свой CSP (Binance / CoinGecko), см. `nginx.snippet.conf`.

## Структура

```text
app/
  constants/     # SITE_NAV, SITE_ORIGIN, OG_IMAGE
  components/
  composables/
  entities/      # страницы проектов и тренажёров
  features/      # Touch Type, квиз Python
  widgets/       # хабы, сайдбары, кейсы LearnPortal / Codestats
  shared/
  layouts/
  pages/
  utils/
content/
public/          # robots.txt, sitemap.xml, файлы Вебмастера/Search Console,
                 # favicon, картинки, SPA-демо в public/projects/
nginx.snippet.conf
```

Тема: светлая по умолчанию, переключатель в шапке (`portfolio-color-mode`). Акцент страницы задаётся через `--page-accent`.

## Деплой

1. `npm run generate`
2. Залить содержимое `.output/public` на статический хостинг (nginx, Apache и т.п.)
3. При необходимости добавить директивы из `nginx.snippet.conf` (заголовки, 404, SPA saas-dashboard, прокси CoinGecko, отсечка WP/`.git`)

Файлы подтверждения Вебмастера и Search Console должны оставаться в корне webroot: `yandex_dc6fc1a56afa142c.html`, `google848ea8eb86f9b687.html`. Счётчиков аналитики на сайте нет.

## Стек

- Nuxt 4, Vue 3, `@nuxt/content` 3, `@nuxtjs/color-mode`
- TypeScript
- CSS-переменные в `app/assets/css/theme.css`, шрифты self-host
