const SITE_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
const CRYPTO_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.coingecko.com https://api.rss2json.com wss://stream.binance.com:9443 https://stream.binance.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
const AI_RANKING_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://whatstrending.ai https://raw.githubusercontent.com https://cdn.jsdelivr.net https://api.wulong.dev; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/theme.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preload', href: '/fonts/inter/cyrillic-400-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/inter/latin-400-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/inter/cyrillic-700-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/inter/latin-700-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      ],
    },
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'portfolio-color-mode',
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: true,
    },
  ],
  experimental: {
    payloadExtraction: false,
  },
  imports: {
    dirs: ['constants'],
  },
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: true,
      ignore: [
        '/projects/crypto',
        '/projects/crypto/**',
        '/projects/saas-dashboard',
        '/projects/saas-dashboard/**',
        '/projects/ai-chat',
        '/projects/ai-chat/**',
        '/projects/ai',
        '/projects/ai/**',
        '/yandex_dc6fc1a56afa142c.html',
        '/google848ea8eb86f9b687.html',
      ],
      routes: [
        '/',
        '/services',
        '/articles',
        '/articles/techblog',
        '/projects',
        '/projects/pets',
        '/projects/learn-portal',
        '/projects/codestats',
        '/resume',
        '/motivation',
        '/trainers',
        '/trainers/typing',
        '/trainers/interviews',
        '/trainers/python',
        '/trainers/javascript',
        '/trainers/bugs',
        '/trainers/bugs/python',
        '/trainers/bugs/javascript',
      ],
    },
    devProxy: {
      '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
      },
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': SITE_CSP,
      },
    },
    '/projects/crypto/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': CRYPTO_CSP,
      },
    },
    '/projects/saas-dashboard/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      },
    },
    '/projects/ai-chat/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      },
    },
    '/projects/ai': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': AI_RANKING_CSP,
      },
    },
    '/projects/ai/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': AI_RANKING_CSP,
      },
    },
    '/ai': { redirect: { to: '/projects/ai/', statusCode: 301 } },
    '/ai/': { redirect: { to: '/projects/ai/', statusCode: 301 } },
    '/aobukhov': { redirect: { to: '/resume', statusCode: 301 } },
    '/trainers/typing.html': { redirect: { to: '/trainers/typing', statusCode: 301 } },
    '/trainers/python.html': { redirect: { to: '/trainers/python', statusCode: 301 } },
    '/motivation/interview': { redirect: { to: '/trainers/interviews', statusCode: 301 } },
    '/motivation/interview.html': { redirect: { to: '/trainers/interviews', statusCode: 301 } },
    '/motivation/bugs': { redirect: { to: '/trainers/bugs', statusCode: 301 } },
    '/motivation/bugs.html': { redirect: { to: '/trainers/bugs', statusCode: 301 } },
    '/articles/techblog.html': { redirect: { to: '/articles/techblog', statusCode: 301 } },
    '/articles/python-svyazuyushchee-zveno.html': { redirect: { to: '/articles/python-svyazuyushchee-zveno', statusCode: 301 } },
    '/articles/kogda-rakety-ne-vzletayut.html': { redirect: { to: '/articles/kogda-rakety-ne-vzletayut', statusCode: 301 } },
    '/articles/iskusstvennyy-intellekt.html': { redirect: { to: '/articles/iskusstvennyy-intellekt', statusCode: 301 } },
    '/articles/it-bez-opyta.html': { redirect: { to: '/articles/it-bez-opyta', statusCode: 301 } },
    '/articles/learnportal-tehblog-01.html': { redirect: { to: '/articles/learnportal-tehblog-01', statusCode: 301 } },
    '/articles/learnportal-tehblog-02.html': { redirect: { to: '/articles/learnportal-tehblog-02', statusCode: 301 } },
    '/articles/learnportal-tehblog-03.html': { redirect: { to: '/articles/learnportal-tehblog-03', statusCode: 301 } },
    '/articles/learnportal-tehblog-04.html': { redirect: { to: '/articles/learnportal-tehblog-04', statusCode: 301 } },
    '/articles/learnportal-tehblog-05.html': { redirect: { to: '/articles/learnportal-tehblog-05', statusCode: 301 } },
    '/articles/learnportal-tehblog-06.html': { redirect: { to: '/articles/learnportal-tehblog-06', statusCode: 301 } },
    '/articles/learnportal-tehblog-07.html': { redirect: { to: '/articles/learnportal-tehblog-07', statusCode: 301 } },
    '/articles/learnportal-tehblog-08.html': { redirect: { to: '/articles/learnportal-tehblog-08', statusCode: 301 } },
  },
})
