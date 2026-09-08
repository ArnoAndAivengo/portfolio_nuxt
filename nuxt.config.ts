export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
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
      routes: [
        '/',
        '/services',
        '/articles',
        '/projects',
        '/projects/learn-portal',
        '/projects/codestats',
        '/resume',
        '/motivation',
        '/trainers',
        '/trainers/typing',
        '/trainers/python',
        '/ai',
      ],
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
    '/aobukhov': { redirect: { to: '/resume', statusCode: 301 } },
    '/trainers/typing.html': { redirect: { to: '/trainers/typing', statusCode: 301 } },
    '/trainers/python.html': { redirect: { to: '/trainers/python', statusCode: 301 } },
  },
})
