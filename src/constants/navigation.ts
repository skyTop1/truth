import type { TabBarItem } from '@/types/navigation'

export const primaryTabItems: TabBarItem[] = [
  {
    key: 'home',
    label: '祭台',
    path: '/pages/index/index',
    icon: 'layout-dashboard'
  },
  {
    key: 'workbench',
    label: '祖域',
    path: '/pages/workbench/index',
    icon: 'boxes'
  }
]
