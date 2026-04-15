import type { AppIconName } from '@/constants/icons'

export interface TabBarItem {
  key: string
  label: string
  path: string
  icon: AppIconName
}
