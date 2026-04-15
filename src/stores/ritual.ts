import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  DEFAULT_ANCESTOR_NAME,
  RITUAL_ARCHIVE_STORAGE_KEY,
  RITUAL_ARCHIVE_VERSION
} from '@/constants/ritual'
import { readLocalCache, removeLocalCache, writeLocalCache } from '@/utils/local-storage'

import type {
  AncestorProfile,
  PosterRecord,
  PosterRecordDraft,
  RitualArchive,
  RitualArchiveHydrationInfo,
  RitualArchiveMeta,
  RitualRecord,
  RitualRecordDraft
} from '@/types/ritual'

function createArchiveMeta(seedTimestamp = ''): RitualArchiveMeta {
  return {
    lastHydratedAt: seedTimestamp,
    lastMutationAt: seedTimestamp,
    lastBackupAt: ''
  }
}

function createEmptyArchive(): RitualArchive {
  return {
    version: RITUAL_ARCHIVE_VERSION,
    recentAncestorName: DEFAULT_ANCESTOR_NAME,
    records: [],
    posters: [],
    meta: createArchiveMeta()
  }
}

function createHydrationInfo(state: RitualArchiveHydrationInfo['state'], detail: string): RitualArchiveHydrationInfo {
  return {
    state,
    detail
  }
}

function normalizeArchive(rawArchive: unknown): { archive: RitualArchive; hydrationInfo: RitualArchiveHydrationInfo } {
  const emptyArchive = createEmptyArchive()

  if (typeof rawArchive === 'undefined' || rawArchive === '') {
    return {
      archive: emptyArchive,
      hydrationInfo: createHydrationInfo('fresh', '当前设备还没有本地祖域仓，会在第一次完成仪式后自动创建。')
    }
  }

  if (typeof rawArchive !== 'object' || rawArchive === null) {
    return {
      archive: emptyArchive,
      hydrationInfo: createHydrationInfo('recovered', '检测到损坏的本地缓存，已自动重建空白祖域仓。')
    }
  }

  const archive = rawArchive as Partial<RitualArchive>
  const looksLikeArchive =
    'records' in archive || 'posters' in archive || 'recentAncestorName' in archive || 'version' in archive || 'meta' in archive

  if (!looksLikeArchive) {
    return {
      archive: emptyArchive,
      hydrationInfo: createHydrationInfo('recovered', '检测到异常缓存结构，已自动回退到新的本地祖域仓。')
    }
  }

  const normalizedRecords = dedupeRitualRecords(Array.isArray(archive.records) ? archive.records.map(normalizeRitualRecord) : [])
  const normalizedPosters = dedupePosterRecords(Array.isArray(archive.posters) ? archive.posters.map(normalizePosterRecord) : [])
  const archiveSeedTimestamp = resolveArchiveSeedTimestamp(normalizedRecords, normalizedPosters)
  const normalizedMeta = normalizeArchiveMeta(archive.meta, archiveSeedTimestamp)

  const normalizedArchive = reconcileArchive({
    version: RITUAL_ARCHIVE_VERSION,
    recentAncestorName:
      typeof archive.recentAncestorName === 'string' && archive.recentAncestorName.trim().length > 0
        ? archive.recentAncestorName
        : normalizedRecords[0]?.ancestorName ?? DEFAULT_ANCESTOR_NAME,
    records: normalizedRecords,
    posters: normalizedPosters,
    meta: normalizedMeta
  })

  const rawVersion = typeof archive.version === 'number' && Number.isFinite(archive.version) ? archive.version : 0
  const shouldMigrate = rawVersion !== RITUAL_ARCHIVE_VERSION || !isArchiveMetaObject(archive.meta)

  return {
    archive: normalizedArchive,
    hydrationInfo: shouldMigrate
      ? createHydrationInfo('migrated', `已把本地祖域仓升级到 v${RITUAL_ARCHIVE_VERSION}，旧记录已自动兼容。`)
      : createHydrationInfo('ready', '本地祖域仓状态正常，祭祖内容仍只保存在当前设备。')
  }
}

function parseImportedArchive(rawArchive: unknown): RitualArchive {
  if (typeof rawArchive !== 'object' || rawArchive === null) {
    throw new Error('备份内容不是有效 JSON 对象。')
  }

  const archiveCandidate = rawArchive as Partial<RitualArchive>

  if (
    !Array.isArray(archiveCandidate.records) ||
    !Array.isArray(archiveCandidate.posters) ||
    typeof archiveCandidate.recentAncestorName !== 'string'
  ) {
    throw new Error('备份内容缺少必要字段，无法作为祖域仓导入。')
  }

  return normalizeArchive(rawArchive).archive
}

function normalizeArchiveMeta(rawMeta: unknown, fallbackTimestamp: string): RitualArchiveMeta {
  const meta = isArchiveMetaObject(rawMeta) ? rawMeta : {}

  return {
    lastHydratedAt: typeof meta.lastHydratedAt === 'string' ? meta.lastHydratedAt : fallbackTimestamp,
    lastMutationAt: typeof meta.lastMutationAt === 'string' ? meta.lastMutationAt : fallbackTimestamp,
    lastBackupAt: typeof meta.lastBackupAt === 'string' ? meta.lastBackupAt : ''
  }
}

function normalizeRitualRecord(rawRecord: unknown): RitualRecord {
  const record = typeof rawRecord === 'object' && rawRecord !== null ? (rawRecord as Partial<RitualRecord>) : {}
  const timestamp = typeof record.createdAt === 'string' && record.createdAt.length > 0 ? record.createdAt : new Date().toISOString()

  return {
    id: typeof record.id === 'string' && record.id.length > 0 ? record.id : `ritual-${timestamp}`,
    ancestorName:
      typeof record.ancestorName === 'string' && record.ancestorName.trim().length > 0
        ? record.ancestorName
        : DEFAULT_ANCESTOR_NAME,
    badge: typeof record.badge === 'string' ? record.badge : '祖域接入员',
    title: typeof record.title === 'string' ? record.title : '今日赛博祭祖已完成',
    message: typeof record.message === 'string' ? record.message : '',
    incenseValue: toNumber(record.incenseValue, 72),
    signalValue: toNumber(record.signalValue, 61),
    ritualCount: toNumber(record.ritualCount, 1),
    actionKeys: Array.isArray(record.actionKeys) ? record.actionKeys.filter(isStringValue) : [],
    createdAt: timestamp,
    updatedAt: typeof record.updatedAt === 'string' && record.updatedAt.length > 0 ? record.updatedAt : timestamp,
    posterReady: Boolean(record.posterReady),
    posterImageUrl: typeof record.posterImageUrl === 'string' ? record.posterImageUrl : ''
  }
}

function normalizePosterRecord(rawRecord: unknown): PosterRecord {
  const record = typeof rawRecord === 'object' && rawRecord !== null ? (rawRecord as Partial<PosterRecord>) : {}
  const timestamp = typeof record.createdAt === 'string' && record.createdAt.length > 0 ? record.createdAt : new Date().toISOString()

  return {
    id: typeof record.id === 'string' && record.id.length > 0 ? record.id : `poster-${timestamp}`,
    ritualRecordId: typeof record.ritualRecordId === 'string' ? record.ritualRecordId : '',
    ancestorName:
      typeof record.ancestorName === 'string' && record.ancestorName.trim().length > 0
        ? record.ancestorName
        : DEFAULT_ANCESTOR_NAME,
    title: typeof record.title === 'string' ? record.title : '赛博祭祖海报',
    badge: typeof record.badge === 'string' ? record.badge : '祖域接入员',
    imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : '',
    createdAt: timestamp,
    updatedAt: typeof record.updatedAt === 'string' && record.updatedAt.length > 0 ? record.updatedAt : timestamp
  }
}

function dedupeRitualRecords(records: RitualRecord[]) {
  const recordMap = new Map<string, RitualRecord>()

  records.forEach((record) => {
    const currentRecord = recordMap.get(record.id)

    if (!currentRecord || record.updatedAt.localeCompare(currentRecord.updatedAt) > 0) {
      recordMap.set(record.id, record)
    }
  })

  return [...recordMap.values()]
}

function dedupePosterRecords(posters: PosterRecord[]) {
  const posterMap = new Map<string, PosterRecord>()

  posters.forEach((poster) => {
    if (poster.ritualRecordId.length === 0) {
      return
    }

    const currentPoster = posterMap.get(poster.id)

    if (!currentPoster || poster.updatedAt.localeCompare(currentPoster.updatedAt) > 0) {
      posterMap.set(poster.id, poster)
    }
  })

  return [...posterMap.values()]
}

function resolveArchiveSeedTimestamp(records: RitualRecord[], posters: PosterRecord[]) {
  const timestamps = [
    ...records.map((item) => item.updatedAt || item.createdAt),
    ...posters.map((item) => item.updatedAt || item.createdAt)
  ].filter((item) => item.length > 0)

  if (timestamps.length === 0) {
    return ''
  }

  return [...timestamps].sort((left, right) => right.localeCompare(left))[0] ?? ''
}

function reconcileArchive(archive: RitualArchive): RitualArchive {
  const posterMap = new Map<string, PosterRecord>()

  archive.posters.forEach((poster) => {
    if (poster.ritualRecordId.length > 0 && !posterMap.has(poster.ritualRecordId)) {
      posterMap.set(poster.ritualRecordId, poster)
    }
  })

  const records = archive.records.map((record) => {
    const poster = posterMap.get(record.id)

    return {
      ...record,
      posterReady: Boolean(poster?.imageUrl),
      posterImageUrl: poster?.imageUrl ?? ''
    }
  })

  return {
    ...archive,
    records,
    recentAncestorName:
      archive.recentAncestorName.trim().length > 0 ? archive.recentAncestorName : records[0]?.ancestorName ?? DEFAULT_ANCESTOR_NAME
  }
}

function isArchiveMetaObject(value: unknown): value is Partial<RitualArchiveMeta> {
  return typeof value === 'object' && value !== null
}

function isStringValue(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function toNumber(value: unknown, fallbackValue: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalizedValue = Number(value.replace('%', '').trim())

    if (Number.isFinite(normalizedValue)) {
      return normalizedValue
    }
  }

  return fallbackValue
}

function buildAncestorProfiles(records: RitualRecord[]) {
  const profileMap = new Map<string, AncestorProfile>()

  records.forEach((record) => {
    const key = record.ancestorName.trim().toLowerCase()
    const existingProfile = profileMap.get(key)

    if (existingProfile) {
      existingProfile.ritualCount += 1
      existingProfile.totalIncense += record.incenseValue
      existingProfile.highestSignal = Math.max(existingProfile.highestSignal, record.signalValue)
      existingProfile.lastRitualAt = existingProfile.lastRitualAt > record.createdAt ? existingProfile.lastRitualAt : record.createdAt
      return
    }

    profileMap.set(key, {
      id: `ancestor-${encodeURIComponent(record.ancestorName.trim())}`,
      name: record.ancestorName,
      ritualCount: 1,
      totalIncense: record.incenseValue,
      highestSignal: record.signalValue,
      lastRitualAt: record.createdAt
    })
  })

  return [...profileMap.values()].sort((left, right) => right.lastRitualAt.localeCompare(left.lastRitualAt))
}

export const useRitualStore = defineStore('ritual', () => {
  const archive = ref<RitualArchive>(createEmptyArchive())
  const isHydrated = ref(false)
  const hydrationInfo = ref<RitualArchiveHydrationInfo>(
    createHydrationInfo('fresh', '当前设备还没有本地祖域仓，会在第一次完成仪式后自动创建。')
  )

  const ritualRecords = computed(() => {
    return [...archive.value.records].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  })

  const posterRecords = computed(() => {
    return [...archive.value.posters].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  })

  const ancestorProfiles = computed(() => {
    return buildAncestorProfiles(ritualRecords.value)
  })

  const recentAncestorName = computed(() => {
    return archive.value.recentAncestorName || DEFAULT_ANCESTOR_NAME
  })

  const archiveVersion = computed(() => {
    return archive.value.version
  })

  const archiveHydrationState = computed(() => {
    return hydrationInfo.value.state
  })

  const archiveHydrationDetail = computed(() => {
    return hydrationInfo.value.detail
  })

  const lastBackupAt = computed(() => {
    return archive.value.meta.lastBackupAt
  })

  const lastMutationAt = computed(() => {
    return archive.value.meta.lastMutationAt
  })

  const totalRitualCount = computed(() => {
    return ritualRecords.value.length
  })

  const totalPosterCount = computed(() => {
    return posterRecords.value.length
  })

  const totalIncenseValue = computed(() => {
    return ritualRecords.value.reduce((sum, record) => sum + record.incenseValue, 0)
  })

  const latestRecord = computed(() => {
    return ritualRecords.value[0] ?? null
  })

  const hasLocalData = computed(() => {
    return archive.value.records.length > 0 || archive.value.posters.length > 0
  })

  function ensureHydrated() {
    if (isHydrated.value) {
      return
    }

    const now = new Date().toISOString()
    const { archive: nextArchive, hydrationInfo: nextHydrationInfo } = normalizeArchive(
      readLocalCache<unknown>(RITUAL_ARCHIVE_STORAGE_KEY, undefined)
    )

    archive.value = {
      ...nextArchive,
      meta: {
        ...nextArchive.meta,
        lastHydratedAt: now
      }
    }
    hydrationInfo.value = nextHydrationInfo
    isHydrated.value = true

    if (nextHydrationInfo.state === 'migrated' || nextHydrationInfo.state === 'recovered') {
      writeLocalCache(RITUAL_ARCHIVE_STORAGE_KEY, archive.value)
    }
  }

  function persistArchive(mode: 'mutation' | 'backup' | 'silent' = 'mutation') {
    const now = new Date().toISOString()

    archive.value.meta = {
      ...archive.value.meta,
      lastMutationAt: mode === 'mutation' ? now : archive.value.meta.lastMutationAt,
      lastBackupAt: mode === 'backup' ? now : archive.value.meta.lastBackupAt
    }

    writeLocalCache(RITUAL_ARCHIVE_STORAGE_KEY, archive.value)
  }

  function rememberAncestorName(name: string) {
    ensureHydrated()

    archive.value.recentAncestorName = name.trim().length > 0 ? name.trim() : DEFAULT_ANCESTOR_NAME
    persistArchive('mutation')
  }

  function upsertRitualRecord(recordDraft: RitualRecordDraft) {
    ensureHydrated()

    const now = new Date().toISOString()
    const normalizedDraft = normalizeRitualRecord({
      ...recordDraft,
      createdAt: now,
      updatedAt: now
    })
    const existingRecordIndex = archive.value.records.findIndex((item) => item.id === normalizedDraft.id)

    if (existingRecordIndex >= 0) {
      const existingRecord = archive.value.records[existingRecordIndex]

      archive.value.records.splice(existingRecordIndex, 1, {
        ...normalizedDraft,
        createdAt: existingRecord.createdAt,
        posterReady: existingRecord.posterReady,
        posterImageUrl: existingRecord.posterImageUrl
      })
    } else {
      archive.value.records.unshift(normalizedDraft)
    }

    archive.value = reconcileArchive({
      ...archive.value,
      records: archive.value.records,
      posters: archive.value.posters,
      recentAncestorName: normalizedDraft.ancestorName
    })
    persistArchive('mutation')

    return archive.value.records.find((item) => item.id === normalizedDraft.id) ?? normalizedDraft
  }

  function upsertPosterRecord(recordDraft: PosterRecordDraft) {
    ensureHydrated()

    const now = new Date().toISOString()
    const normalizedDraft = normalizePosterRecord({
      ...recordDraft,
      createdAt: now,
      updatedAt: now
    })
    const existingRecordIndex = archive.value.posters.findIndex((item) => item.id === normalizedDraft.id)

    if (existingRecordIndex >= 0) {
      const existingRecord = archive.value.posters[existingRecordIndex]

      archive.value.posters.splice(existingRecordIndex, 1, {
        ...normalizedDraft,
        createdAt: existingRecord.createdAt
      })
    } else {
      archive.value.posters.unshift(normalizedDraft)
    }

    archive.value = reconcileArchive({
      ...archive.value,
      records: archive.value.records,
      posters: archive.value.posters
    })
    persistArchive('mutation')

    return archive.value.posters.find((item) => item.id === normalizedDraft.id) ?? normalizedDraft
  }

  function findRitualRecordById(recordId: string) {
    ensureHydrated()

    return archive.value.records.find((item) => item.id === recordId) ?? null
  }

  function findPosterRecordByRitualId(recordId: string) {
    ensureHydrated()

    return archive.value.posters.find((item) => item.ritualRecordId === recordId) ?? null
  }

  function removeRitualRecord(recordId: string) {
    ensureHydrated()

    archive.value = reconcileArchive({
      ...archive.value,
      records: archive.value.records.filter((item) => item.id !== recordId),
      posters: archive.value.posters.filter((item) => item.ritualRecordId !== recordId)
    })
    persistArchive('mutation')
  }

  function removePosterRecord(posterId: string) {
    ensureHydrated()

    archive.value = reconcileArchive({
      ...archive.value,
      records: archive.value.records,
      posters: archive.value.posters.filter((item) => item.id !== posterId)
    })
    persistArchive('mutation')
  }

  function exportArchiveSnapshot() {
    ensureHydrated()
    persistArchive('backup')

    return JSON.stringify(archive.value, null, 2)
  }

  function importArchiveSnapshot(snapshot: string) {
    ensureHydrated()

    const normalizedSnapshot = snapshot.trim()

    if (normalizedSnapshot.length === 0) {
      throw new Error('先粘贴一段本地备份 JSON。')
    }

    let parsedSnapshot: unknown

    try {
      parsedSnapshot = JSON.parse(normalizedSnapshot) as unknown
    } catch {
      throw new Error('备份内容不是合法 JSON，无法恢复。')
    }

    const importedArchive = parseImportedArchive(parsedSnapshot)

    archive.value = reconcileArchive(importedArchive)
    hydrationInfo.value = createHydrationInfo('imported', '已从手动备份恢复当前设备上的本地祖域仓。')
    persistArchive('mutation')

    return `已恢复 ${archive.value.records.length} 条本地记录和 ${archive.value.posters.length} 张海报缓存。`
  }

  function clearLocalArchive() {
    archive.value = createEmptyArchive()
    hydrationInfo.value = createHydrationInfo('fresh', '本地祖域仓已清空，当前设备已回到首次进入状态。')
    isHydrated.value = true
    removeLocalCache(RITUAL_ARCHIVE_STORAGE_KEY)
  }

  return {
    isHydrated,
    ritualRecords,
    posterRecords,
    ancestorProfiles,
    recentAncestorName,
    archiveVersion,
    archiveHydrationState,
    archiveHydrationDetail,
    lastBackupAt,
    lastMutationAt,
    totalRitualCount,
    totalPosterCount,
    totalIncenseValue,
    latestRecord,
    hasLocalData,
    ensureHydrated,
    rememberAncestorName,
    upsertRitualRecord,
    upsertPosterRecord,
    findRitualRecordById,
    findPosterRecordByRitualId,
    removeRitualRecord,
    removePosterRecord,
    exportArchiveSnapshot,
    importArchiveSnapshot,
    clearLocalArchive
  }
})
