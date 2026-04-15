import { storeToRefs } from 'pinia'

import { useAppStore } from '@/stores'

import type { ThemeMode, ThemePresetId } from '@/types/theme'

export function useTheme() {
  const appStore = useAppStore()
  const { activeThemePreset, themePreset, themeMode, themeLabel, themeClass } = storeToRefs(appStore)

  function setThemePreset(presetId: ThemePresetId) {
    appStore.setThemePreset(presetId)
  }

  function setThemeMode(mode: ThemeMode) {
    appStore.setThemeMode(mode)
  }

  function toggleThemeMode() {
    appStore.toggleThemeMode()
  }

  function hydrateThemeMode() {
    appStore.hydrateThemeMode()
  }

  return {
    activeThemePreset,
    themePreset,
    themeMode,
    themeLabel,
    themeClass,
    hydrateThemeMode,
    setThemePreset,
    setThemeMode,
    toggleThemeMode
  }
}
