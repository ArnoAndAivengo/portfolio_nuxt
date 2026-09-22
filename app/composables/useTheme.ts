import { THEME_DARK_COLOR, THEME_KEY, THEME_LIGHT_COLOR } from '~/utils/theme'

export function useThemeDark() {
  return useState('theme-dark', () => false)
}

export function applyTheme(on: boolean) {
  useThemeDark().value = on

  if (!import.meta.client) return

  document.documentElement.classList.toggle('dark', on)

  try {
    localStorage.setItem(THEME_KEY, on ? 'dark' : 'light')
  } catch {
    /* ignore */
  }

  const input = document.getElementById('theme-toggle')

  if (input instanceof HTMLInputElement) input.checked = on

  const meta = document.querySelector('meta[name="theme-color"]')

  if (meta) meta.setAttribute('content', on ? THEME_DARK_COLOR : THEME_LIGHT_COLOR)
}
