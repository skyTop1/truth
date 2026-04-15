import type { AppIconName } from '@/constants/icons'

export interface RitualActionTemplate {
  key: string
  title: string
  badge: string
  description: string
  energy: number
  iconName: AppIconName
}

export interface RitualRecord {
  id: string
  ancestorName: string
  badge: string
  title: string
  message: string
  incenseValue: number
  signalValue: number
  ritualCount: number
  actionKeys: string[]
  createdAt: string
  updatedAt: string
  posterReady: boolean
  posterImageUrl: string
}

export interface PosterRecord {
  id: string
  ritualRecordId: string
  ancestorName: string
  title: string
  badge: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface RitualArchiveMeta {
  lastHydratedAt: string
  lastMutationAt: string
  lastBackupAt: string
}

export interface RitualArchive {
  version: number
  recentAncestorName: string
  records: RitualRecord[]
  posters: PosterRecord[]
  meta: RitualArchiveMeta
}

export type RitualArchiveHydrationState = 'fresh' | 'ready' | 'migrated' | 'recovered' | 'imported'

export interface RitualArchiveHydrationInfo {
  state: RitualArchiveHydrationState
  detail: string
}

export interface RitualRecordDraft {
  id: string
  ancestorName: string
  badge: string
  title: string
  message: string
  incenseValue: number
  signalValue: number
  ritualCount: number
  actionKeys: string[]
}

export interface PosterRecordDraft {
  id: string
  ritualRecordId: string
  ancestorName: string
  title: string
  badge: string
  imageUrl: string
}

export interface AncestorProfile {
  id: string
  name: string
  ritualCount: number
  totalIncense: number
  highestSignal: number
  lastRitualAt: string
}
