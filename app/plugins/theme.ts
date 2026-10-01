import { THEME_DARK_COLOR, THEME_KEY, THEME_LIGHT_COLOR, themeBootScript, themeFromCookie } from '~/utils/theme'

export default defineNuxtPlugin(() => {
  const dark = useThemeDark()

  if (import.meta.server) {
    const fromCookie = themeFromCookie(useRequestHeaders(['cookie']).cookie)

    if (fromCookie !== null) dark.value = fromCookie
  }

  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(THEME_KEY)

      if (stored === 'dark') dark.value = true

      if (stored === 'light') dark.value = false
    } catch {
      /* ignore */
    }

    if (document.documentElement.classList.contains('dark')) dark.value = true
  }

  useHead({
    htmlAttrs: {
      class: computed(() => ({ dark: dark.value })),
    },
    script: [{
      key: 'theme-boot',
      innerHTML: themeBootScript,
      tagPriority: 'critical',
    }],
    meta: [
      { name: 'theme-color', content: () => (dark.value ? THEME_DARK_COLOR : THEME_LIGHT_COLOR) },
    ],
  })

  if (!import.meta.client) return

  applyTheme(dark.value)
  document.documentElement.classList.add('theme-settled')

  document.addEventListener('change', (event) => {
    const target = event.target

    if (!(target instanceof HTMLInputElement) || target.id !== 'theme-toggle') return

    applyTheme(target.checked)
  })

  const router = useRouter()

  router.afterEach(() => {
    nextTick(() => applyTheme(dark.value))
  })
})
