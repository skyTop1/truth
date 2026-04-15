import { themePresets } from '@/constants/theme'

const THEME_CLASS_LIST = themePresets.map((item) => item.themeClass)

export function syncThemeRootClass(themeClass: string) {
  // #ifdef H5
  if (typeof document === 'undefined') {
    return
  }

  const rootElement = document.documentElement
  const bodyElement = document.body

  rootElement.classList.remove(...THEME_CLASS_LIST)
  rootElement.classList.add(themeClass)

  if (bodyElement) {
    bodyElement.classList.remove(...THEME_CLASS_LIST)
    bodyElement.classList.add(themeClass)
  }
  // #endif
}
