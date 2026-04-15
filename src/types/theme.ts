export type ThemeMode = 'light' | 'dark'
export type ThemePresetId = 'light' | 'dark' | 'altar-gold' | 'stele-cyan'

export interface ThemePreset {
  id: ThemePresetId
  mode: ThemeMode
  label: string
  title: string
  description: string
  themeClass: string
  tokenGroups: ThemeTokenGroup[]
}

export interface ThemeToken {
  label: string
  name: string
  value: string
  usage: string
}

export interface ThemeTokenGroup {
  title: string
  description: string
  tokens: ThemeToken[]
}
