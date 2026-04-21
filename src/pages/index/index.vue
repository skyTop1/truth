<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AppButton from '@/components/app/AppButton.vue'
import AppCyberAltar from '@/components/app/AppCyberAltar.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppTabBar from '@/components/app/AppTabBar.vue'
import AppTag from '@/components/app/AppTag.vue'
import { DEFAULT_ANCESTOR_NAME, ritualActionTemplates } from '@/constants/ritual'
import {
  cyberStatusCopy,
  formatArchiveVersionLabel,
  formatRitualBadgeLabel,
  getArchiveHydrationStatusMeta,
  getJourneyProgressLabel
} from '@/constants/status'
import { primaryTabItems } from '@/constants/navigation'
import { cyberThemeHighlights } from '@/constants/theme'
import { useRitualStore } from '@/stores'

defineOptions({
  name: 'HomePage'
})

const ritualStore = useRitualStore()

ritualStore.ensureHydrated()

onMounted(() => {
  ritualStore.ensureHydrated()
})

const signalMetrics = computed(() => {
  const latestRecord = ritualStore.latestRecord

  return [
    {
      label: '本机香火值',
      value: ritualStore.totalIncenseValue > 0 ? `${ritualStore.totalIncenseValue}` : '--',
      description: '只统计当前设备上的赛博祭祖记录，不连云。'
    },
    {
      label: '最近称号',
      value: latestRecord ? formatRitualBadgeLabel(latestRecord.badge) : '待点亮',
      description: latestRecord ? `最近一次由 ${latestRecord.ancestorName} 节点触发。` : '完成一次仪式后会自动写入本地祖域仓。'
    },
    {
      label: '本地海报',
      value: `${String(ritualStore.totalPosterCount).padStart(2, '0')}`,
      description: '生成过的分享海报状态会保存在本地记录里。'
    }
  ]
})

const altarFeed = computed(() => {
  if (ritualStore.ritualRecords.length > 0) {
    return ritualStore.ritualRecords.slice(0, 3).map((record) => {
      return `${record.ancestorName} 节点已接入，香火值 ${record.incenseValue}，称号 ${formatRitualBadgeLabel(record.badge)}。`
    })
  }

  return [
    '这个祭台默认只认你的本机记录，不连云，也不上传。',
    '完成一次赛博祭祖后，祖域页会自动出现本地历史。',
    '生成一张海报，才算把这次离谱心意压成一张战报。'
  ]
})

const altarTitle = computed(() => {
  return `当前祖先节点：${ritualStore.recentAncestorName || DEFAULT_ANCESTOR_NAME}`
})

const altarSubtitle = computed(() => {
  const latestRecord = ritualStore.latestRecord

  if (latestRecord) {
    return `最近一次本机祭祖已经点亮 ${formatRitualBadgeLabel(latestRecord.badge)} 状态。继续接入，可以把这次记录压成新海报。`
  }

  return '这个祭台默认只保存你本机里的记录。先接入一次祖域，再把离谱仪式变成能转发的战报。'
})

const altarSignalValue = computed(() => {
  return ritualStore.latestRecord ? `${ritualStore.latestRecord.signalValue}%` : '--'
})

const altarIncenseValue = computed(() => {
  return ritualStore.latestRecord ? `${ritualStore.latestRecord.incenseValue}` : '--'
})

const altarRitualValue = computed(() => {
  return ritualStore.latestRecord ? `${String(ritualStore.latestRecord.ritualCount).padStart(2, '0')}` : '00'
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
  return formatArchiveTime(ritualStore.lastBackupAt, '还没有手动备份')
})

const archiveMutationLabel = computed(() => {
  return formatArchiveTime(ritualStore.lastMutationAt, '当前设备还没有本地写入')
})

const journeySteps = computed(() => {
  return [
    {
      label: '写下一个祖先节点',
      description: '先给这次赛博祭祖起一个你自己认得出来的称呼。',
      done: ritualStore.hasLocalData || ritualStore.recentAncestorName !== DEFAULT_ANCESTOR_NAME
    },
    {
      label: '完成第一次仪式',
      description: '点亮动作并写入第一条本地祭祖记录。',
      done: ritualStore.totalRitualCount > 0
    },
    {
      label: '生成第一张传播海报',
      description: '把本地记录压成一张适合截图传播的战报。',
      done: ritualStore.totalPosterCount > 0
    }
  ]
})

const journeyTitle = computed(() => {
  if (!ritualStore.hasLocalData) {
    return '当前还是首次进入状态'
  }

  if (ritualStore.totalRitualCount > 0 && ritualStore.totalPosterCount === 0) {
    return '你已经有本地历史，但还没形成传播图'
  }

  if (ritualStore.totalPosterCount > 0) {
    return '祖域已经进入可传播状态'
  }

  return '本地祖域仓已就绪'
})

const journeyDescription = computed(() => {
  if (!ritualStore.hasLocalData) {
    return '先做完第一次仪式，本地祖域仓就会从空白状态进入可管理状态。'
  }

  if (ritualStore.totalRitualCount > 0 && ritualStore.totalPosterCount === 0) {
    return '历史已经在本机里了，下一步最值得做的是补一张海报，让这次记录真正有传播价值。'
  }

  return '你已经有完整的本地记录和海报缓存，可以继续刷一轮新记录，或者去祖域页做整理。'
})

const nextActionLabel = computed(() => {
  if (!ritualStore.hasLocalData) {
    return '开始第一轮仪式'
  }

  if (ritualStore.totalRitualCount > 0 && ritualStore.totalPosterCount === 0) {
    return '补一张海报'
  }

  return '继续刷新记录'
})

function openSignalPreview() {
  void uni.navigateTo({
    url: '/pages-sub/system/theme-preview'
  })
}

function openAncestorDomain() {
  void uni.redirectTo({
    url: '/pages/workbench/index'
  })
}

function openRitualEntry() {
  void uni.navigateTo({
    url: `/pages-sub/cyber/ritual-entry?ancestor=${encodeURIComponent(ritualStore.recentAncestorName || DEFAULT_ANCESTOR_NAME)}`
  })
}

function copyArchiveSnapshot() {
  const archiveSnapshot = ritualStore.exportArchiveSnapshot()

  void uni.setClipboardData({
    data: archiveSnapshot,
    success: () => {
      void uni.showToast({
        title: '本地备份串已复制',
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

function formatArchiveTime(value: string, fallbackLabel: string) {
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
  <app-theme-page class="page-shell">
    <app-nav-bar title="赛博祭祖" subtitle="祖域接入中 · 热梗原型">
      <view class="page-shell__nav-tag">{{ cyberStatusCopy.hotTag }}</view>
    </app-nav-bar>

    <view class="page-content">
      <view class="hero-copy">
        <view class="tag-list">
          <app-tag v-for="item in cyberThemeHighlights" :key="item" variant="accent">
            {{ item }}
          </app-tag>
        </view>
        <text class="hero-copy__title">把祭祖做成一座会发光的量子祭台。</text>
        <text class="hero-copy__subtitle">
          这不是为了严肃留存，而是为了让人 3 秒内上头，30 秒内完成一次赛博仪式。更关键的是，记录默认只留在你的本机里。
        </text>
      </view>

      <app-cyber-altar
        :status-label="cyberStatusCopy.altarSignalOnline"
        :title="altarTitle"
        :subtitle="altarSubtitle"
        :signal-value="altarSignalValue"
        :incense-value="altarIncenseValue"
        :ritual-value="altarRitualValue"
        :protocol-tags="cyberThemeHighlights.slice(0, 3)"
      />

      <view class="action-row">
        <app-button @click="openRitualEntry">开始接入祖域</app-button>
        <app-button variant="secondary" @click="openSignalPreview">查看信号色板</app-button>
        <app-button variant="text" @click="openAncestorDomain">进入祖域样本库</app-button>
      </view>

      <view class="privacy-panel">
        <view class="tag-list">
          <app-tag :variant="archiveStatusVariant">{{ archiveStatusLabel }}</app-tag>
          <app-tag variant="muted">{{ formatArchiveVersionLabel(ritualStore.archiveVersion) }}</app-tag>
          <app-tag variant="accent">{{ cyberStatusCopy.localFirst }}</app-tag>
        </view>
        <text class="privacy-panel__title">
          {{ ritualStore.hasLocalData ? '你的祖域仓正在本机运行' : '当前设备还没有本地祖域仓' }}
        </text>
        <text class="privacy-panel__desc">{{ ritualStore.archiveHydrationDetail }}</text>
        <view class="privacy-panel__grid">
          <view class="privacy-panel__item">
            <text class="privacy-panel__label">离开设备的唯一方式</text>
            <text class="privacy-panel__value">截图、保存相册、主动分享</text>
          </view>
          <view class="privacy-panel__item">
            <text class="privacy-panel__label">最近写入</text>
            <text class="privacy-panel__value">{{ archiveMutationLabel }}</text>
          </view>
          <view class="privacy-panel__item">
            <text class="privacy-panel__label">最近备份</text>
            <text class="privacy-panel__value">{{ archiveBackupLabel }}</text>
          </view>
        </view>
        <view class="action-row">
          <app-button variant="secondary" @click="copyArchiveSnapshot">复制本地备份串</app-button>
          <app-button variant="text" @click="openAncestorDomain">去管理祖域仓</app-button>
        </view>
      </view>

      <view class="journey-panel">
        <view class="section-heading">
          <text class="section-heading__eyebrow">{{ cyberStatusCopy.stateMatrix }}</text>
          <text class="section-heading__title">{{ journeyTitle }}</text>
        </view>
        <text class="journey-panel__desc">{{ journeyDescription }}</text>
        <view class="journey-panel__list">
          <view v-for="item in journeySteps" :key="item.label" class="journey-panel__item">
            <view class="journey-panel__item-head">
              <text class="journey-panel__item-title">{{ item.label }}</text>
              <app-tag :variant="item.done ? 'success' : 'muted'">{{ getJourneyProgressLabel(item.done) }}</app-tag>
            </view>
            <text class="journey-panel__item-desc">{{ item.description }}</text>
          </view>
        </view>
        <view class="action-row">
          <app-button @click="openRitualEntry">{{ nextActionLabel }}</app-button>
          <app-button variant="text" @click="openAncestorDomain">去祖域看状态</app-button>
        </view>
      </view>

      <view class="signal-grid">
        <view v-for="item in signalMetrics" :key="item.label" class="signal-card">
          <text class="signal-card__label">{{ item.label }}</text>
          <text class="signal-card__value">{{ item.value }}</text>
          <text class="signal-card__desc">{{ item.description }}</text>
        </view>
      </view>

      <view class="ritual-section">
        <view class="section-heading">
          <text class="section-heading__eyebrow">{{ cyberStatusCopy.todayRituals }}</text>
          <text class="section-heading__title">今日可点亮的赛博仪式</text>
        </view>
        <view class="ritual-grid">
          <view v-for="item in ritualActionTemplates" :key="item.key" class="ritual-card">
            <text class="ritual-card__badge">{{ formatRitualBadgeLabel(item.badge) }}</text>
            <text class="ritual-card__title">{{ item.title }}</text>
            <text class="ritual-card__desc">{{ item.description }}</text>
          </view>
        </view>
      </view>

      <view class="feed-panel">
        <view class="section-heading">
          <text class="section-heading__eyebrow">{{ cyberStatusCopy.localFeed }}</text>
          <text class="section-heading__title">本机祖域动态</text>
        </view>
        <view class="feed-list">
          <view v-for="item in altarFeed" :key="item" class="feed-item">
            <view class="feed-item__dot" />
            <text class="feed-item__text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <app-tab-bar :items="primaryTabItems" active-key="home" />
  </app-theme-page>
</template>

<style scoped lang="scss">
.page-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--scene-space);
  overflow: hidden;
}

.page-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--color-primary-light-2) 0, transparent 34%),
    linear-gradient(180deg, var(--color-primary-light-1) 0, transparent 280rpx);
  pointer-events: none;
}

.page-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at left 18%, var(--color-link-light-1) 0, transparent 26%);
  opacity: 0.72;
  pointer-events: none;
}

.page-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 26rpx;
  padding: 20rpx 24rpx 40rpx;
}

.page-shell__nav-tag {
  padding: 10rpx 18rpx;
  border: 2rpx solid var(--color-warning-light-3);
  border-radius: var(--border-radius-circle);
  background: var(--color-warning-light-1);
  font-size: 18rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
  color: var(--warning-6);
  box-shadow: 0 0 26rpx var(--color-warning-light-2);
}

:deep(.app-nav-bar) {
  background: var(--scene-nav);
  border-color: var(--scene-border-1);
}

:deep(.app-tab-bar) {
  background: var(--scene-nav-soft);
  border-color: var(--scene-border-1);
}

.hero-copy {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 32rpx;
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: var(--border-radius-hero);
  background: var(--scene-panel-strong);
  box-shadow: var(--scene-shadow-float);
}


.hero-copy__title {
  max-width: 600rpx;
  font-size: 58rpx;
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: 1rpx;
  color: var(--scene-text-1);
  text-shadow: 0 0 34rpx var(--color-primary-light-3);
}

.hero-copy__subtitle {
  max-width: 650rpx;
  font-size: 24rpx;
  line-height: 1.8;
  color: var(--scene-text-2);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.page-content > .action-row {
  padding: 12rpx;
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: var(--border-radius-xlarge);
  background: var(--scene-surface-panel);
  box-shadow: var(--scene-shadow-inset);
}

.privacy-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 28rpx;
  border: 2rpx solid var(--scene-border-1);
  border-radius: var(--border-radius-xlarge);
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-panel);
}

.privacy-panel__title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: var(--scene-text-1);
}

.privacy-panel__desc,
.privacy-panel__label {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--scene-text-2);
}

.privacy-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.privacy-panel__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  min-height: 132rpx;
  padding: 18rpx;
  border-radius: 22rpx;
  border: 2rpx solid var(--color-primary-light-2);
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-inset);
}

.privacy-panel__value {
  font-size: 24rpx;
  font-weight: 600;
  line-height: 1.7;
  color: var(--scene-text-1);
}

.journey-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 28rpx;
  border: 2rpx solid var(--scene-border-1);
  border-radius: var(--border-radius-xlarge);
  background: var(--scene-panel-soft);
  box-shadow: var(--scene-shadow-panel);
}

.journey-panel__desc,
.journey-panel__item-desc {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--scene-text-2);
}

.journey-panel__list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.journey-panel__item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 18rpx;
  border-radius: 22rpx;
  border: 2rpx solid var(--scene-line-2);
  background: var(--scene-panel-soft);
  box-shadow: var(--scene-shadow-inset);
}

.journey-panel__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.journey-panel__item-title {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--scene-text-1);
}

.signal-grid,
.ritual-grid {
  display: grid;
  gap: 16rpx;
}

.signal-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.signal-card,
.ritual-card,
.feed-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 24rpx;
  border: 2rpx solid var(--scene-border-1);
  border-radius: var(--border-radius-large);
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-panel);
}

.signal-card__label,
.ritual-card__badge,
.section-heading__eyebrow {
  font-size: 19rpx;
  letter-spacing: 3rpx;
  text-transform: uppercase;
  color: var(--link-6);
}

.signal-card__value {
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.1;
  color: var(--primary-6);
  text-shadow: 0 0 22rpx var(--color-primary-light-2);
}

.signal-card__desc,
.ritual-card__desc,
.feed-item__text {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--scene-text-2);
}

.ritual-section,
.feed-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.ritual-section {
  padding: 28rpx;
  border: 2rpx solid var(--scene-border-1);
  border-radius: var(--border-radius-xlarge);
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-panel);
}

.section-heading {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.section-heading__title,
.ritual-card__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--scene-text-1);
}

.ritual-grid {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feed-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid var(--scene-line-2);
}

.feed-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.feed-item__dot {
  flex-shrink: 0;
  width: 14rpx;
  height: 14rpx;
  margin-top: 12rpx;
  border-radius: 999rpx;
  background: var(--primary-6);
  box-shadow: 0 0 24rpx var(--color-primary-light-2);
}

</style>
