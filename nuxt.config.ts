const CRYPTO_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.coingecko.com https://api.rss2json.com wss://stream.binance.com:9443 https://stream.binance.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

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
        { rel: 'preload', href: '/fonts/inter/cyrillic-600-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/inter/latin-600-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
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
        '/yandex_dc6fc1a56afa142c.html',
        '/google848ea8eb86f9b687.html',
      ],
      routes: [
        '/',
        '/services',
        '/articles',
        '/projects',
        '/projects/pets',
        '/projects/learn-portal',
        '/projects/codestats',
        '/resume',
        '/motivation',
        '/trainers',
        '/trainers/typing',
        '/trainers/python',
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
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
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
    '/aobukhov': { redirect: { to: '/resume', statusCode: 301 } },
    '/trainers/typing.html': { redirect: { to: '/trainers/typing', statusCode: 301 } },
    '/trainers/python.html': { redirect: { to: '/trainers/python', statusCode: 301 } },
  },
})
