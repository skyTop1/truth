import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { DEFAULT_THEME_PRESET_ID, resolveThemePreset, themePresetByMode } from '@/constants/theme'
import { syncThemeRootClass } from '@/utils/theme-root'

import type { ThemeMode, ThemePresetId } from '@/types/theme'

const THEME_MODE_STORAGE_KEY = 'truth-theme-mode'
const THEME_PRESET_STORAGE_KEY = 'truth-theme-preset'

export const useAppStore = defineStore('app', () => {
  const appName = ref('Truth')
  const themePreset = ref<ThemePresetId>(DEFAULT_THEME_PRESET_ID)
  const activeThemePreset = computed(() => resolveThemePreset(themePreset.value))
  const themeMode = computed(() => activeThemePreset.value.mode)

  const themeLabel = computed(() => {
    return activeThemePreset.value.label
  })

  const themeClass = computed(() => activeThemePreset.value.themeClass)

  function applyThemePreset(presetId: ThemePresetId) {
    themePreset.value = presetId
    syncThemeRootClass(resolveThemePreset(presetId).themeClass)
  }

  function setThemePreset(presetId: ThemePresetId) {
    applyThemePreset(presetId)
    uni.setStorageSync(THEME_PRESET_STORAGE_KEY, presetId)
  }

  function setThemeMode(mode: ThemeMode) {
    setThemePreset(themePresetByMode[mode])
  }

  function toggleThemeMode() {
    setThemePreset(themeMode.value === 'light' ? themePresetByMode.dark : themePresetByMode.light)
  }

  function hydrateThemeMode() {
    const cachedThemePreset: unknown = uni.getStorageSync(THEME_PRESET_STORAGE_KEY)
    const cachedThemeMode: unknown = uni.getStorageSync(THEME_MODE_STORAGE_KEY)

    if (
      cachedThemePreset === 'light' ||
      cachedThemePreset === 'dark' ||
      cachedThemePreset === 'altar-gold' ||
      cachedThemePreset === 'stele-cyan'
    ) {
      applyThemePreset(cachedThemePreset)
      return
    }

    if (cachedThemeMode === 'light' || cachedThemeMode === 'dark') {
      const nextThemePreset = themePresetByMode[cachedThemeMode]

      applyThemePreset(nextThemePreset)
      uni.setStorageSync(THEME_PRESET_STORAGE_KEY, nextThemePreset)
      return
    }

    syncThemeRootClass(themeClass.value)
  }

  return {
    appName,
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
})
