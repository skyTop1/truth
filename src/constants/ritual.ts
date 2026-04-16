import type { RitualActionTemplate } from '@/types/ritual'

export const RITUAL_ARCHIVE_STORAGE_KEY = 'truth.cyber-ritual.archive'
export const RITUAL_ARCHIVE_VERSION = 2
export const DEFAULT_ANCESTOR_NAME = '太爷爷'

export const ritualActionTemplates: RitualActionTemplate[] = [
  {
    key: 'incense',
    title: '上传电子香火',
    badge: '香火上传',
    description: '给当前祖先节点注入一束霓虹香火，立刻让祭台回路变亮。',
    energy: 18,
    iconName: 'flame'
  },
  {
    key: 'signal',
    title: '激活祖先信号',
    badge: '信号强化',
    description: '把祖域信号从离线灰态拉回高亮，像在宇宙里点亮一颗节点。',
    energy: 24,
    iconName: 'sparkles'
  },
  {
    key: 'offering',
    title: '投送量子元宝',
    badge: '供品投送',
    description: '不是烧纸，是给祖域缓存池塞一枚发光的赛博供品。',
    energy: 12,
    iconName: 'package-open'
  }
]

export const ritualMessageTemplates = [
  '祖域信号稳定，今日电子香火已送达。',
  '量子供品已投送，当前祖先节点发光正常。',
  '本机祭台同步完成，这次心意只留在你的设备里。'
]
