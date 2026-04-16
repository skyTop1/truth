<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppButton from '@/components/app/AppButton.vue'
import AppCard from '@/components/app/AppCard.vue'
import AppDialog from '@/components/app/AppDialog.vue'
import AppEmpty from '@/components/app/AppEmpty.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppTabBar from '@/components/app/AppTabBar.vue'
import AppTag from '@/components/app/AppTag.vue'
import { primaryTabItems } from '@/constants/navigation'
import { DEFAULT_ANCESTOR_NAME } from '@/constants/ritual'
import {
  formatArchiveVersionLabel,
  formatRitualBadgeLabel,
  getArchiveHydrationStatusMeta,
  getBackupImportStatusMeta,
  getStateActivityLabel
} from '@/constants/status'
import { useRitualStore } from '@/stores'

import type { PosterRecord, RitualRecord } from '@/types/ritual'
import type { BackupImportStatus, StatusTagVariant } from '@/types/status'

defineOptions({
  name: 'WorkbenchPage'
})

type ArchiveDialogMode = 'reset' | 'remove-record' | 'remove-poster' | 'import' | null

const ritualStore = useRitualStore()

ritualStore.ensureHydrated()

const activeDialogMode = ref<ArchiveDialogMode>(null)
const pendingRecord = ref<RitualRecord | null>(null)
const pendingPoster = ref<PosterRecord | null>(null)
const backupImportDraft = ref('')
const backupImportStatus = ref<BackupImportStatus>('idle')
const backupImportMessage = ref('把你导出的本地备份 JSON 粘进来，就能在当前设备恢复。')
const ancestorDomainTags = ['本机缓存', '离线祭台', '不上传']

onMounted(() => {
  ritualStore.ensureHydrated()
})

const isActionDialogVisible = computed({
  get() {
    return activeDialogMode.value !== null
  },
  set(value: boolean) {
    if (!value) {
      closeActionDialog()
    }
  }
})

const summaryStats = computed(() => {
  return [
    {
      label: '本地记录',
      value: `${String(ritualStore.totalRitualCount).padStart(2, '0')}`
    },
    {
      label: '祖先节点',
      value: `${String(ritualStore.ancestorProfiles.length).padStart(2, '0')}`
    },
    {
      label: '海报战报',
      value: `${String(ritualStore.totalPosterCount).padStart(2, '0')}`
    }
  ]
})

const recentAncestors = computed(() => {
  return ritualStore.ancestorProfiles.slice(0, 4)
})

const recentRecords = computed(() => {
  return ritualStore.ritualRecords.slice(0, 5)
})

const recentPosters = computed(() => {
  return ritualStore.posterRecords.slice(0, 4)
})

const archiveStatusMeta = computed(() => {
  return getArchiveHydrationStatusMeta(ritualStore.archiveHydrationState)
})

const archiveStatusLabel = computed(() => {
  return archiveStatusMeta.value.label
})

const archiveStatusVariant = computed(() => {
  return archiveStatusMeta.value.variant
})

const archiveBackupLabel = computed(() => {
  return formatRecordTime(ritualStore.lastBackupAt, '还没有手动备份')
})

const archiveMutationLabel = computed(() => {
  return formatRecordTime(ritualStore.lastMutationAt, '当前设备还没有本地写入')
})

const backupImportStatusMeta = computed(() => {
  return getBackupImportStatusMeta(backupImportStatus.value)
})

const latestRecord = computed(() => {
  return ritualStore.latestRecord
})

const stateMatrix = computed(() => {
  return [
    {
      label: '首次进入',
      description: '当前设备上还没有任何本地祭祖内容。',
      active: !ritualStore.hasLocalData,
      variant: (!ritualStore.hasLocalData ? 'warning' : 'muted') as StatusTagVariant
    },
    {
      label: '已有本地历史',
      description: '祖先节点和祭祖记录已经写入本机祖域仓。',
      active: ritualStore.totalRitualCount > 0,
      variant: (ritualStore.totalRitualCount > 0 ? 'success' : 'muted') as StatusTagVariant
    },
    {
      label: '传播图已就绪',
      description: '至少有一张海报可用于预览、截图或二次传播。',
      active: ritualStore.totalPosterCount > 0,
      variant: (ritualStore.totalPosterCount > 0 ? 'success' : 'muted') as StatusTagVariant
    }
  ]
})

const nextActionTitle = computed(() => {
  if (!ritualStore.hasLocalData) {
    return '当前设备还是空祖域'
  }

  if (ritualStore.totalRitualCount > 0 && ritualStore.totalPosterCount === 0) {
    return '你已经有历史，但还缺传播图'
  }

  return '祖域状态已完整'
})

const nextActionDescription = computed(() => {
  if (!ritualStore.hasLocalData) {
    return '先做完第一次仪式，祖域仓才会进入可管理状态。'
  }

  if (ritualStore.totalRitualCount > 0 && ritualStore.totalPosterCount === 0) {
    return '从最近一条历史里重开战报，再补一张海报，这一轮闭环就完整了。'
  }

  return '你现在可以继续刷新记录，也可以删掉旧图、整理本地历史。'
})

const posterEmptyTitle = computed(() => {
  return ritualStore.totalRitualCount > 0 ? '你有本地历史，但还没有海报缓存' : '还没有本地海报缓存'
})

const posterEmptyDescription = computed(() => {
  return ritualStore.totalRitualCount > 0
    ? '历史已经留在本机里了，但传播图还没生成。直接重开最近一条战报会更快。'
    : '先生成一张赛博海报，这里才会出现你的本地图库。'
})

const posterEmptyActionLabel = computed(() => {
  return ritualStore.totalRitualCount > 0 ? '重开最近战报' : '去生成一张'
})

const historyEmptyTitle = computed(() => {
  return ritualStore.archiveHydrationState === 'fresh' ? '当前设备还是首次进入' : '还没有本地祭祖历史'
})

const historyEmptyDescription = computed(() => {
  return ritualStore.archiveHydrationState === 'fresh'
    ? ritualStore.archiveHydrationDetail
    : '先完成一次赛博祭祖，结果页会自动写入这里。'
})

const dialogTitle = computed(() => {
  if (activeDialogMode.value === 'import') {
    return '覆盖恢复本地祖域仓'
  }

  if (activeDialogMode.value === 'remove-record') {
    return '删除本地祭祖记录'
  }

  if (activeDialogMode.value === 'remove-poster') {
    return '删除本地海报记录'
  }

  return '清空本地祖域仓'
})

const dialogDescription = computed(() => {
  if (activeDialogMode.value === 'import') {
    return '恢复会直接覆盖当前设备上的本地祖域仓。这个过程不会上传任何数据，但当前本机内容会被替换。'
  }

  if (activeDialogMode.value === 'remove-record') {
    return '删除后不会经过回收站，也不能从云端恢复，因为本项目默认不上传任何祭祖内容。'
  }

  if (activeDialogMode.value === 'remove-poster') {
    return '只会删除本地海报记录，不会替你保留任何云端副本。'
  }

  return '清空后无法从云端恢复，因为本项目默认不上传任何祭祖内容。'
})

const dialogConfirmText = computed(() => {
  if (activeDialogMode.value === 'import') {
    return '确认覆盖恢复'
  }

  if (activeDialogMode.value === 'remove-record') {
    return '确认删除记录'
  }

  if (activeDialogMode.value === 'remove-poster') {
    return '确认删除海报'
  }

  return '确认清空'
})

const dialogCancelText = computed(() => {
  if (activeDialogMode.value === 'import') {
    return '先不恢复'
  }

  return activeDialogMode.value === 'reset' ? '先不清空' : '先不删除'
})

const dialogList = computed(() => {
  if (activeDialogMode.value === 'import') {
    return [
      '1. 当前设备上的本地祖域仓会被备份内容覆盖',
      '2. 这个过程不经过云端，也不会上传任何 JSON',
      '3. 恢复完成后，首页和祖域页会立刻切到恢复后的状态'
    ]
  }

  if (activeDialogMode.value === 'remove-record') {
    return [
      `1. ${pendingRecord.value?.ancestorName ?? '当前'} 的本地祭祖记录会被删除`,
      '2. 关联的本地海报记录也会一起移除',
      '3. 因为没有云同步，删除后无法恢复'
    ]
  }

  if (activeDialogMode.value === 'remove-poster') {
    return [
      `1. ${pendingPoster.value?.ancestorName ?? '当前'} 的海报记录会被删除`,
      '2. 祭祖历史会保留，但海报状态会重置成未生成',
      '3. 如果还想要图，需要重新生成一次'
    ]
  }

  return [
    '1. 当前设备里的祭祖记录会被清空',
    '2. 当前设备里的海报状态也会一起清空',
    '3. 卸载或清空后无法从服务端找回，因为本项目不上传数据'
  ]
})

function openResetDialog() {
  activeDialogMode.value = 'reset'
}

function openImportDialog() {
  if (backupImportDraft.value.trim().length === 0) {
    void uni.showToast({
      title: '先粘贴一段备份 JSON',
      icon: 'none'
    })
    return
  }

  if (ritualStore.hasLocalData) {
    activeDialogMode.value = 'import'
    return
  }

  applyImportArchive()
}

function openRitualEntry() {
  void uni.navigateTo({
    url: `/pages-sub/cyber/ritual-entry?ancestor=${encodeURIComponent(ritualStore.recentAncestorName || DEFAULT_ANCESTOR_NAME)}`
  })
}

function openRecord(record: RitualRecord) {
  const message = encodeURIComponent(record.message)
  const badge = encodeURIComponent(record.badge)
  const ancestor = encodeURIComponent(record.ancestorName)
  const title = encodeURIComponent(record.title)
  const selected = encodeURIComponent(record.actionKeys.join(','))

  void uni.navigateTo({
    url: `/pages-sub/cyber/ritual-result?ritualId=${encodeURIComponent(record.id)}&ancestor=${ancestor}&incense=${record.incenseValue}&signal=${record.signalValue}%&actions=${record.ritualCount}&selected=${selected}&badge=${badge}&message=${message}&title=${title}`
  })
}

function openLatestRecord() {
  if (latestRecord.value) {
    openRecord(latestRecord.value)
    return
  }

  openRitualEntry()
}

function reuseRecord(record: RitualRecord) {
  const ancestor = encodeURIComponent(record.ancestorName)
  const message = encodeURIComponent(record.message)
  const selected = encodeURIComponent(record.actionKeys.join(','))

  void uni.navigateTo({
    url: `/pages-sub/cyber/ritual-entry?ancestor=${ancestor}&message=${message}&selected=${selected}`
  })
}

function openPosterPreview(poster: PosterRecord) {
  if (poster.imageUrl.length === 0) {
    void uni.showToast({
      title: '海报缓存已失效，请重新生成',
      icon: 'none'
    })
    return
  }

  void uni.previewImage({
    current: poster.imageUrl,
    urls: [poster.imageUrl],
    fail: () => {
      void uni.showToast({
        title: '海报预览失败，请重新生成',
        icon: 'none'
      })
    }
  })
}

function requestRemoveRecord(record: RitualRecord) {
  pendingRecord.value = record
  pendingPoster.value = null
  activeDialogMode.value = 'remove-record'
}

function requestRemovePoster(poster: PosterRecord) {
  pendingPoster.value = poster
  pendingRecord.value = null
  activeDialogMode.value = 'remove-poster'
}

function closeActionDialog() {
  activeDialogMode.value = null
  pendingRecord.value = null
  pendingPoster.value = null
}

function applyImportArchive() {
  try {
    const resultMessage = ritualStore.importArchiveSnapshot(backupImportDraft.value)

    backupImportStatus.value = 'success'
    backupImportMessage.value = resultMessage
    backupImportDraft.value = ''

    void uni.showToast({
      title: '本地祖域仓已恢复',
      icon: 'none'
    })
  } catch (error) {
    backupImportStatus.value = 'error'
    backupImportMessage.value = error instanceof Error ? error.message : '恢复失败，请检查备份内容。'

    void uni.showToast({
      title: '恢复失败',
      icon: 'none'
    })
  }
}

function handleDialogConfirm() {
  if (activeDialogMode.value === 'import') {
    applyImportArchive()
    closeActionDialog()
    return
  }

  if (activeDialogMode.value === 'remove-record' && pendingRecord.value) {
    ritualStore.removeRitualRecord(pendingRecord.value.id)

    void uni.showToast({
      title: '本地祭祖记录已删除',
      icon: 'none'
    })

    closeActionDialog()
    return
  }

  if (activeDialogMode.value === 'remove-poster' && pendingPoster.value) {
    ritualStore.removePosterRecord(pendingPoster.value.id)

    void uni.showToast({
      title: '本地海报记录已删除',
      icon: 'none'
    })

    closeActionDialog()
    return
  }

  ritualStore.clearLocalArchive()

  void uni.showToast({
    title: '本地祖域仓已清空',
    icon: 'none'
  })

  closeActionDialog()
}

function copyArchiveSnapshot() {
  const archiveSnapshot = ritualStore.exportArchiveSnapshot()

  void uni.setClipboardData({
    data: archiveSnapshot,
    success: () => {
      void uni.showToast({
        title: '备份串已复制',
        icon: 'none'
      })
    },
    fail: () => {
      void uni.showToast({
        title: '复制失败，请稍后重试',
        icon: 'none'
      })
    }
  })
}

function pasteArchiveSnapshot() {
  void uni.getClipboardData({
    success: (result) => {
      backupImportDraft.value = result.data
      backupImportStatus.value = 'idle'
      backupImportMessage.value = '已从剪贴板读取内容，确认无误后可以直接恢复。'

      void uni.showToast({
        title: '已读取剪贴板',
        icon: 'none'
      })
    },
    fail: () => {
      backupImportStatus.value = 'error'
      backupImportMessage.value = '读取剪贴板失败，请手动粘贴备份 JSON。'

      void uni.showToast({
        title: '读取剪贴板失败',
        icon: 'none'
      })
    }
  })
}

function clearImportDraft() {
  backupImportDraft.value = ''
  backupImportStatus.value = 'idle'
  backupImportMessage.value = '把你导出的本地备份 JSON 粘进来，就能在当前设备恢复。'
}

function formatRecordTime(value: string, fallbackLabel = '刚刚写入') {
  if (value.length === 0) {
    return fallbackLabel
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel
  }

  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${month}.${day} ${hour}:${minute}`
}
</script>

<template>
  <app-theme-page class="workbench-page">
    <app-nav-bar title="祖域" subtitle="本机祖域仓 · 仅本地缓存" />

    <view class="workbench-page__content">
      <app-card title="本机祖域仓" subtitle="祭祖记录、海报状态和常用祖先节点默认只保存在当前设备。">
        <view class="tag-list">
          <app-tag v-for="item in ancestorDomainTags" :key="item" variant="accent">
            {{ item }}
          </app-tag>
          <app-tag :variant="archiveStatusVariant">{{ archiveStatusLabel }}</app-tag>
          <app-tag variant="muted">{{ formatArchiveVersionLabel(ritualStore.archiveVersion) }}</app-tag>
        </view>
        <text class="workbench-page__paragraph">
          这里是你的本地祖域入口。所有赛博祭祖记录都在这里回看、复用、导出和清空，不需要经过任何云端。
        </text>
        <text class="workbench-page__paragraph">{{ ritualStore.archiveHydrationDetail }}</text>
        <view class="workbench-page__meta-list">
          <text class="workbench-page__meta-item">最近写入：{{ archiveMutationLabel }}</text>
          <text class="workbench-page__meta-item">最近备份：{{ archiveBackupLabel }}</text>
        </view>
        <view class="workbench-page__stats">
          <view v-for="item in summaryStats" :key="item.label" class="workbench-page__stat">
            <text class="workbench-page__stat-value">{{ item.value }}</text>
            <text class="workbench-page__stat-label">{{ item.label }}</text>
          </view>
        </view>
        <view class="workbench-page__action-row">
          <app-button @click="openRitualEntry">再祭一次</app-button>
          <app-button variant="secondary" @click="copyArchiveSnapshot">复制备份串</app-button>
          <app-button variant="secondary" @click="openResetDialog">清空本地记录</app-button>
        </view>
        <text class="workbench-page__paragraph">
          卸载应用或主动清空缓存，都可能让这些内容永久消失。当前阶段不做云同步，所以备份只能靠手动复制。
        </text>
      </app-card>

      <app-card title="手动恢复本地备份" subtitle="支持把另一台设备导出的本地备份 JSON 手动恢复到当前设备。">
        <view class="workbench-page__import-panel">
          <textarea
            v-model="backupImportDraft"
            class="workbench-page__import-textarea"
            maxlength="-1"
            placeholder="把祖域页复制出来的本地备份 JSON 粘到这里。"
            placeholder-class="workbench-page__import-placeholder"
          />
          <app-tag :variant="backupImportStatusMeta.variant">{{ backupImportStatusMeta.label }}</app-tag>
          <text class="workbench-page__paragraph">{{ backupImportMessage }}</text>
          <view class="workbench-page__action-row">
            <app-button variant="secondary" @click="pasteArchiveSnapshot">从剪贴板读取</app-button>
            <app-button @click="openImportDialog">恢复到当前设备</app-button>
            <app-button variant="text" @click="clearImportDraft">清空内容</app-button>
          </view>
        </view>
      </app-card>

      <app-card title="当前状态矩阵" subtitle="看清当前设备处在哪个阶段，以及下一步最该做什么。">
        <view class="status-matrix">
          <view v-for="item in stateMatrix" :key="item.label" class="status-matrix__item">
            <view class="status-matrix__head">
              <text class="status-matrix__title">{{ item.label }}</text>
              <app-tag :variant="item.variant">{{ getStateActivityLabel(item.active) }}</app-tag>
            </view>
            <text class="status-matrix__desc">{{ item.description }}</text>
          </view>
        </view>
        <view class="status-matrix__focus">
          <text class="status-matrix__focus-title">{{ nextActionTitle }}</text>
          <text class="status-matrix__focus-desc">{{ nextActionDescription }}</text>
        </view>
      </app-card>

      <app-card title="最近祖先节点" subtitle="当前设备上最近被点亮的祖先节点。">
        <view v-if="recentAncestors.length > 0" class="ancestor-list">
          <view v-for="item in recentAncestors" :key="item.id" class="ancestor-item">
            <view class="ancestor-item__body">
              <text class="ancestor-item__name">{{ item.name }}</text>
              <text class="ancestor-item__meta">
                共 {{ item.ritualCount }} 次接入 · 香火 {{ item.totalIncense }} · 最高信号 {{ item.highestSignal }}%
              </text>
            </view>
            <app-tag variant="primary">{{ formatRecordTime(item.lastRitualAt) }}</app-tag>
          </view>
        </view>
        <app-empty
          v-else
          title="祖域还没有本地节点"
          :description="ritualStore.archiveHydrationDetail"
          icon="boxes"
        >
          <template #action>
            <app-button @click="openRitualEntry">立即接入祖域</app-button>
          </template>
        </app-empty>
      </app-card>

      <app-card title="本地海报图库" subtitle="这批图只存在当前设备缓存里，适合二次截图和热点传播。">
        <view v-if="recentPosters.length > 0" class="poster-list">
          <view v-for="item in recentPosters" :key="item.id" class="poster-item">
            <view class="poster-item__thumb">
              <image v-if="item.imageUrl" class="poster-item__image" :src="item.imageUrl" mode="aspectFill" />
              <view v-else class="poster-item__thumb-placeholder">
                <app-icon name="share-2" size="38rpx" />
              </view>
            </view>
            <view class="poster-item__body">
              <view class="poster-item__header">
                <text class="poster-item__name">{{ item.ancestorName }}</text>
                <app-tag variant="accent">{{ formatRecordTime(item.updatedAt) }}</app-tag>
              </view>
              <text class="poster-item__title">{{ item.title }}</text>
              <text class="poster-item__badge">{{ formatRitualBadgeLabel(item.badge) }}</text>
              <view class="poster-item__actions">
                <app-button variant="text" @click="openPosterPreview(item)">预览海报</app-button>
                <app-button variant="text" @click="requestRemovePoster(item)">删除海报</app-button>
              </view>
            </view>
          </view>
        </view>
        <app-empty
          v-else
          :title="posterEmptyTitle"
          :description="posterEmptyDescription"
          icon="share-2"
        >
          <template #action>
            <app-button @click="openLatestRecord">{{ posterEmptyActionLabel }}</app-button>
          </template>
        </app-empty>
      </app-card>

      <app-card title="本机祭祖历史" subtitle="最近保存在本机的赛博祭祖战报。">
        <view v-if="recentRecords.length > 0" class="history-list">
          <view v-for="item in recentRecords" :key="item.id" class="history-item">
            <view class="history-item__topline">
              <view class="history-item__headline">
                <text class="history-item__name">{{ item.ancestorName }}</text>
                <text class="history-item__time">{{ formatRecordTime(item.createdAt) }}</text>
              </view>
              <app-tag :variant="item.posterReady ? 'accent' : 'muted'">
                {{ item.posterReady ? '海报已生成' : '仅本地记录' }}
              </app-tag>
            </view>
            <text class="history-item__badge">{{ formatRitualBadgeLabel(item.badge) }}</text>
            <text class="history-item__message">{{ item.message }}</text>
            <view class="history-item__metrics">
              <text class="history-item__metric">香火 {{ item.incenseValue }}</text>
              <text class="history-item__metric">信号 {{ item.signalValue }}%</text>
              <text class="history-item__metric">动作 {{ item.ritualCount }}</text>
            </view>
            <view class="history-item__actions">
              <app-button variant="text" @click="openRecord(item)">重开战报</app-button>
              <app-button variant="text" @click="reuseRecord(item)">复用仪式</app-button>
              <app-button variant="text" @click="requestRemoveRecord(item)">删除记录</app-button>
            </view>
          </view>
        </view>
        <app-empty
          v-else
          :title="historyEmptyTitle"
          :description="historyEmptyDescription"
          icon="sparkles"
        >
          <template #action>
            <app-button @click="openRitualEntry">开始第一条记录</app-button>
          </template>
        </app-empty>
      </app-card>
    </view>

    <app-tab-bar :items="primaryTabItems" active-key="workbench" />

    <app-dialog
      v-model="isActionDialogVisible"
      :title="dialogTitle"
      :description="dialogDescription"
      :confirm-text="dialogConfirmText"
      :cancel-text="dialogCancelText"
      @confirm="handleDialogConfirm"
    >
      <view class="dialog-list">
        <text v-for="item in dialogList" :key="item" class="dialog-list__item">{{ item }}</text>
      </view>
    </app-dialog>
  </app-theme-page>
</template>

<style scoped lang="scss">
.workbench-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-1);
  overflow: hidden;
}

.workbench-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--color-primary-light-2) 0, transparent 32%),
    linear-gradient(180deg, var(--color-primary-light-1) 0, transparent 220rpx);
  pointer-events: none;
}

.workbench-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at left 18%, var(--color-link-light-1) 0, transparent 24%);
  opacity: 0.68;
  pointer-events: none;
}

.workbench-page__content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  padding: 20rpx 24rpx 40rpx;
}

.tag-list,
.workbench-page__action-row,
.history-item__metrics,
.poster-item__actions,
.history-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.workbench-page__paragraph {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--color-text-2);
}

.workbench-page__meta-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.workbench-page__meta-item {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--color-text-2);
}

.workbench-page__import-panel {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.workbench-page__import-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 24rpx;
  box-sizing: border-box;
  border: 2rpx solid var(--color-primary-light-3);
  border-radius: 24rpx;
  background: var(--color-bg-1);
  font-size: 24rpx;
  line-height: 1.8;
  color: var(--color-text-1);
  box-shadow: var(--shadow1-down);
}

.workbench-page__import-placeholder {
  color: var(--color-text-4);
}

.workbench-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.status-matrix {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.status-matrix__item,
.status-matrix__focus {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 20rpx 18rpx;
  border-radius: 22rpx;
  background: var(--color-bg-2);
  border: 2rpx solid var(--color-border-2);
  box-shadow: var(--shadow1-down);
}

.status-matrix__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.status-matrix__title,
.status-matrix__focus-title {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-1);
}

.status-matrix__desc,
.status-matrix__focus-desc {
  font-size: 22rpx;
  line-height: 1.7;
  color: var(--color-text-2);
}

.workbench-page__stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 18rpx;
  border: 2rpx solid var(--color-border-2);
  border-radius: 22rpx;
  background: var(--color-bg-2);
  box-shadow: var(--shadow1-down);
}

.workbench-page__stat-value {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--primary-6);
  text-shadow: 0 0 22rpx var(--color-primary-light-2);
}

.workbench-page__stat-label {
  font-size: 20rpx;
  letter-spacing: 2rpx;
  color: var(--color-text-2);
}

.ancestor-list,
.poster-list,
.history-list,
.dialog-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ancestor-item,
.poster-item,
.history-item {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 22rpx;
  border: 2rpx solid var(--color-border-2);
  border-radius: 24rpx;
  background: var(--color-bg-2);
  box-shadow: var(--shadow1-down);
}

.ancestor-item {
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.poster-item {
  flex-direction: row;
  align-items: stretch;
  gap: 18rpx;
}

.ancestor-item__body,
.poster-item__body,
.history-item__headline {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.poster-item__body {
  flex: 1;
}

.ancestor-item__name,
.poster-item__name,
.history-item__name {
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: var(--color-text-1);
}

.ancestor-item__meta,
.poster-item__title,
.poster-item__badge,
.history-item__time,
.history-item__message,
.history-item__metric,
.dialog-list__item {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--color-text-2);
}

.history-item__topline,
.poster-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.poster-item__thumb {
  flex: 0 0 180rpx;
  width: 180rpx;
  min-height: 240rpx;
  overflow: hidden;
  border-radius: 20rpx;
  border: 2rpx solid var(--color-border-2);
  background: var(--color-fill-2);
}

.poster-item__image,
.poster-item__thumb-placeholder {
  width: 100%;
  height: 100%;
}

.poster-item__thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--link-6);
}

.poster-item__badge,
.history-item__badge {
  font-size: 22rpx;
  letter-spacing: 2rpx;
  color: var(--link-6);
}

.history-item__metric {
  padding: 8rpx 14rpx;
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: var(--border-radius-circle);
  background: var(--color-primary-light-1);
}
</style>
