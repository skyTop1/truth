import type { RitualArchiveHydrationState } from '@/types/ritual'

export type StatusTagVariant = 'primary' | 'accent' | 'muted' | 'success' | 'warning' | 'danger'
export type BackupImportStatus = 'idle' | 'success' | 'error'
export type PosterStatus = 'idle' | 'generating' | 'ready' | 'restored' | 'failed' | 'stale' | 'save-blocked'

export interface StatusDisplayMeta {
  label: string
  variant: StatusTagVariant
}

const archiveHydrationStatusMetaMap: Record<RitualArchiveHydrationState, StatusDisplayMeta> = {
  fresh: {
    label: '本地仓未创建',
    variant: 'muted'
  },
  ready: {
    label: '本地仓正常',
    variant: 'success'
  },
  migrated: {
    label: '本地仓已升级',
    variant: 'warning'
  },
  recovered: {
    label: '缓存已修复',
    variant: 'danger'
  },
  imported: {
    label: '备份已导入',
    variant: 'success'
  }
}

const backupImportStatusMetaMap: Record<BackupImportStatus, StatusDisplayMeta> = {
  idle: {
    label: '等待导入',
    variant: 'muted'
  },
  success: {
    label: '导入内容可用',
    variant: 'success'
  },
  error: {
    label: '导入内容异常',
    variant: 'danger'
  }
}

const posterStatusMetaMap: Record<PosterStatus, StatusDisplayMeta> = {
  idle: {
    label: '待生成',
    variant: 'muted'
  },
  generating: {
    label: '生成中',
    variant: 'warning'
  },
  ready: {
    label: '海报已就绪',
    variant: 'success'
  },
  restored: {
    label: '缓存已恢复',
    variant: 'success'
  },
  failed: {
    label: '生成失败',
    variant: 'danger'
  },
  stale: {
    label: '缓存已失效',
    variant: 'danger'
  },
  'save-blocked': {
    label: '保存受限',
    variant: 'warning'
  }
}

const ritualBadgeLabelMap: Record<string, string> = {
  'INCENSE UPLOAD': '香火上传',
  'SIGNAL BOOST': '信号强化',
  'OFFERING DROP': '供品投送'
}

export const cyberStatusCopy = {
  altarSignalOnline: '祖先信号在线',
  ancestorOnline: '祖先在线',
  localOnly: '仅存本地',
  localFirst: '本地优先',
  shareableResult: '可传播结果',
  stateMatrix: '状态矩阵',
  hotTag: '热梗',
  todayRituals: '今日仪式',
  localFeed: '本机动态',
  hotPalette: '热梗色板',
  posterEyebrow: '赛博祭祖完成',
  posterMemoEyebrow: '热点传播摘录',
  posterSignature: 'truth://赛博祭祖 / 本机祖域在线'
} as const

export function getArchiveHydrationStatusMeta(state: RitualArchiveHydrationState): StatusDisplayMeta {
  return archiveHydrationStatusMetaMap[state]
}

export function getBackupImportStatusMeta(status: BackupImportStatus): StatusDisplayMeta {
  return backupImportStatusMetaMap[status]
}

export function getPosterStatusMeta(status: PosterStatus): StatusDisplayMeta {
  return posterStatusMetaMap[status]
}

export function getJourneyProgressLabel(done: boolean) {
  return done ? '已完成' : '待完成'
}

export function getStateActivityLabel(active: boolean) {
  return active ? '已激活' : '未激活'
}

export function getLocalRecordStatusMeta(hasRestoredLocalRecord: boolean): StatusDisplayMeta {
  if (hasRestoredLocalRecord) {
    return {
      label: '本地记录已恢复',
      variant: 'success'
    }
  }

  return {
    label: '新记录已写入',
    variant: 'muted'
  }
}

export function formatArchiveVersionLabel(version: number | string) {
  return `本地仓 v${version}`
}

export function formatRitualBadgeLabel(badge: string) {
  const normalizedBadge = badge.trim()

  if (normalizedBadge.length === 0) {
    return badge
  }

  return ritualBadgeLabelMap[normalizedBadge] ?? badge
}
