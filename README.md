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
| `/services` | Услуги (заглушка) |
| `/articles` | Статьи (заглушка) |
| `/projects` | Проекты (заглушка) |
| `/motivation` | Мотивация (заглушка) |
| `/trainers` | Тренажёры (заглушка) |

`/aobukhov` → 301 на `/resume`.

Меню и SEO-тексты заглушек: `app/constants/nav.ts`.

## Контент

Тексты и данные лежат в `content/`, схема коллекций — в `content.config.ts`. Контакты в `content/home.md` — публичные, как на сайте.

| Коллекция | Файлы |
|-----------|--------|
| Главная | `content/home.md` |
| Резюме (текст) | `content/resume.md` |
| Резюме (мета) | `content/resume-meta.yml` |
| Места работы | `content/jobs/*.yml` |
| Опыт на главной | `content/experience/*.md` |
| Проекты | `content/projects/*.md` |

После правок контента достаточно `npm run generate`.

## Структура

```text
app/
  constants/     # SITE_NAV, SITE_ORIGIN, OG_IMAGE
  components/
  composables/
  layouts/
  pages/
  utils/
content/
public/          # robots.txt, sitemap.xml, файлы Вебмастера/Search Console, favicon, картинки
nginx.snippet.conf
```

Тема: светлая по умолчанию, переключатель в шапке (`portfolio-color-mode`). Акцент страницы задаётся через `--page-accent`.

## Деплой

1. `npm run generate`
2. Залить содержимое `.output/public` на статический хостинг (nginx, Apache и т.п.)
3. При необходимости добавить директивы из `nginx.snippet.conf` (заголовки, 404, отсечка WP/`.git`)

Файлы подтверждения Вебмастера и Search Console должны оставаться в корне webroot: `yandex_dc6fc1a56afa142c.html`, `google848ea8eb86f9b687.html`. Счётчиков аналитики на сайте нет.

## Стек

- Nuxt 4, Vue 3, `@nuxt/content` 3, `@nuxtjs/color-mode`
- TypeScript
- CSS-переменные в `app/assets/css/theme.css`, шрифты self-host
