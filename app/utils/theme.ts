export const THEME_KEY = 'portfolio-color-mode'
export const THEME_DARK_COLOR = '#0a192f'
export const THEME_LIGHT_COLOR = '#ffffff'

export const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var m=localStorage.getItem(k);if(m!=='dark'&&m!=='light')return;document.documentElement.classList.toggle('dark',m==='dark');document.cookie=k+'='+m+'; Path=/; Max-Age=31536000; SameSite=Lax'}catch(e){}})();`

export const themeFromCookie = (raw: string | undefined | null): boolean | null => {
  if (!raw) return null

  const match = raw.match(new RegExp(`(?:^|; )${THEME_KEY}=(dark|light)(?:;|$)`))

  if (!match) return null

  return match[1] === 'dark'
}
