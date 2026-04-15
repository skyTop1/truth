<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppButton from '@/components/app/AppButton.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import AppInput from '@/components/app/AppInput.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppRitualAction from '@/components/app/AppRitualAction.vue'
import AppTag from '@/components/app/AppTag.vue'
import { DEFAULT_ANCESTOR_NAME, ritualActionTemplates, ritualMessageTemplates } from '@/constants/ritual'
import { cyberStatusCopy } from '@/constants/status'
import { useRitualStore } from '@/stores'
import { createLocalId } from '@/utils/local-id'
import { getCurrentPageOptions } from '@/utils/uni-page'

import type { RitualRecord } from '@/types/ritual'

defineOptions({
  name: 'CyberRitualEntryPage'
})

const ritualStore = useRitualStore()

ritualStore.ensureHydrated()

const ancestorName = ref(ritualStore.recentAncestorName || DEFAULT_ANCESTOR_NAME)
const ritualMessage = ref(ritualMessageTemplates[0] ?? '')
const selectedActionKeys = ref<string[]>([])

function applySelectedActionKeys(keys: string[]) {
  const allowedKeySet = new Set(ritualActionTemplates.map((item) => item.key))

  selectedActionKeys.value = keys.filter((item, index) => {
    return item.length > 0 && allowedKeySet.has(item) && keys.indexOf(item) === index
  })
}

function applyPageOptions(options?: Record<string, string | undefined>) {
  if (!options) {
    return
  }

  if (typeof options.ancestor === 'string' && options.ancestor.trim().length > 0) {
    ancestorName.value = decodeURIComponent(options.ancestor)
  }

  if (typeof options.message === 'string' && options.message.trim().length > 0) {
    ritualMessage.value = decodeURIComponent(options.message)
  }

  if (typeof options.selected === 'string' && options.selected.trim().length > 0) {
    applySelectedActionKeys(
      decodeURIComponent(options.selected)
        .split(',')
        .map((item) => item.trim())
    )
  }
}

applyPageOptions(getCurrentPageOptions())

onMounted(() => {
  ritualStore.ensureHydrated()
  applyPageOptions(getCurrentPageOptions())
})

const selectedActions = computed(() => {
  return ritualActionTemplates.filter((item) => selectedActionKeys.value.includes(item.key))
})

const recentTemplateRecords = computed(() => {
  return ritualStore.ritualRecords.slice(0, 3)
})

const totalIncenseValue = computed(() => {
  return selectedActions.value.reduce((sum, item) => sum + item.energy, 72)
})

const signalStrength = computed(() => {
  return `${Math.min(99, 61 + selectedActions.value.length * 12)}%`
})

const ritualBadge = computed(() => {
  if (selectedActions.value.length >= 3) {
    return '祖域接入员'
  }

  if (selectedActions.value.length >= 2) {
    return '香火黑客'
  }

  return '待点亮'
})

const resolvedMessage = computed(() => {
  if (ritualMessage.value.trim().length > 0) {
    return ritualMessage.value.trim()
  }

  return '今日祖域接入完成，电子香火已上传。'
})

function goBack() {
  if (getCurrentPages().length <= 1) {
    void uni.redirectTo({
      url: '/pages/index/index'
    })
    return
  }

  void uni.navigateBack()
}

function toggleAction(key: string) {
  if (selectedActionKeys.value.includes(key)) {
    selectedActionKeys.value = selectedActionKeys.value.filter((item) => item !== key)
    return
  }

  selectedActionKeys.value = [...selectedActionKeys.value, key]
}

function applyMessageTemplate(template: string) {
  ritualMessage.value = template
}

function applyHistoryTemplate(record: RitualRecord) {
  ancestorName.value = record.ancestorName
  ritualMessage.value = record.message
  applySelectedActionKeys(record.actionKeys)

  void uni.showToast({
    title: '已套用本地历史模板',
    icon: 'none'
  })
}

function openResultPage() {
  const normalizedAncestorName = ancestorName.value.trim()

  if (normalizedAncestorName.length === 0) {
    void uni.showToast({
      title: '先写一个祖先称呼',
      icon: 'none'
    })
    return
  }

  if (selectedActions.value.length === 0) {
    void uni.showToast({
      title: '先点亮一个仪式动作',
      icon: 'none'
    })
    return
  }

  ritualStore.rememberAncestorName(normalizedAncestorName)

  const ritualId = createLocalId('ritual')
  const message = encodeURIComponent(resolvedMessage.value)
  const badge = encodeURIComponent(ritualBadge.value)
  const ancestor = encodeURIComponent(normalizedAncestorName)
  const title = encodeURIComponent('今日赛博祭祖已完成')
  const selected = encodeURIComponent(selectedActionKeys.value.join(','))

  void uni.navigateTo({
    url: `/pages-sub/cyber/ritual-result?ritualId=${ritualId}&ancestor=${ancestor}&incense=${totalIncenseValue.value}&signal=${signalStrength.value}&actions=${selectedActions.value.length}&selected=${selected}&badge=${badge}&message=${message}&title=${title}`
  })
}
</script>

<template>
  <app-theme-page class="ritual-page ritual-page--cyber">
    <app-nav-bar title="接入祖域" subtitle="30 秒完成一次赛博仪式">
      <template #left>
        <view class="ritual-page__back" @click="goBack">
          <app-icon name="circle-chevron-left" size="34rpx" />
        </view>
      </template>
    </app-nav-bar>

    <view class="ritual-page__content">
      <view class="ritual-page__hero">
        <view class="ritual-page__tag-list">
          <app-tag variant="accent">{{ cyberStatusCopy.ancestorOnline }}</app-tag>
          <app-tag variant="primary">{{ ritualBadge }}</app-tag>
          <app-tag variant="accent">{{ cyberStatusCopy.localOnly }}</app-tag>
        </view>
        <text class="ritual-page__title">{{ ancestorName }}</text>
        <text class="ritual-page__subtitle">
          选择 1 到 3 个动作，不要拖。这个页面的目标不是复杂，而是让反馈够快、够亮、够有截图价值，同时默认只把记录留在本机。
        </text>
      </view>

      <view class="ritual-page__identity-card">
        <app-input
          v-model="ancestorName"
          label="当前祖先节点"
          placeholder="输入你想接入的祖先称呼，比如：太爷爷 A-108"
        />
        <text class="ritual-page__identity-hint">不连云，不上传。你填的祖先称呼会优先保存在当前设备里。</text>
      </view>

      <view class="ritual-page__stats">
        <view class="ritual-page__stat">
          <text class="ritual-page__stat-value">{{ signalStrength }}</text>
          <text class="ritual-page__stat-label">信号强度</text>
        </view>
        <view class="ritual-page__stat">
          <text class="ritual-page__stat-value">{{ totalIncenseValue }}</text>
          <text class="ritual-page__stat-label">香火值</text>
        </view>
        <view class="ritual-page__stat">
          <text class="ritual-page__stat-value">{{ selectedActions.length }}</text>
          <text class="ritual-page__stat-label">已点亮动作</text>
        </view>
      </view>

      <view class="ritual-page__actions">
        <app-ritual-action
          v-for="item in ritualActionTemplates"
          :key="item.key"
          :title="item.title"
          :description="item.description"
          :badge="item.badge"
          :energy="item.energy"
          :active="selectedActionKeys.includes(item.key)"
          :icon-name="item.iconName"
          @toggle="toggleAction(item.key)"
        />
      </view>

      <view class="ritual-page__message-card">
        <text class="ritual-page__message-title">留下一句星际悼词</text>
        <textarea
          v-model="ritualMessage"
          class="ritual-page__textarea"
          maxlength="40"
          placeholder="比如：祖域信号稳定，今日电子香火已送达。"
          placeholder-class="ritual-page__textarea-placeholder"
        />
        <view class="ritual-page__template-list">
          <view
            v-for="item in ritualMessageTemplates"
            :key="item"
            class="ritual-page__template-chip"
            @click="applyMessageTemplate(item)"
          >
            <app-tag variant="muted">{{ item }}</app-tag>
          </view>
        </view>
      </view>

      <view v-if="recentTemplateRecords.length > 0" class="ritual-page__message-card">
        <text class="ritual-page__message-title">复用本地历史模板</text>
        <view class="ritual-page__history-template-list">
          <view
            v-for="item in recentTemplateRecords"
            :key="item.id"
            class="ritual-page__history-template"
            @click="applyHistoryTemplate(item)"
          >
            <view class="ritual-page__history-template-header">
              <text class="ritual-page__history-template-name">{{ item.ancestorName }}</text>
              <app-tag :variant="item.posterReady ? 'accent' : 'primary'">
                {{ item.posterReady ? '海报已存' : '本地模板' }}
              </app-tag>
            </view>
            <text class="ritual-page__history-template-message">{{ item.message }}</text>
            <text class="ritual-page__history-template-meta">
              动作 {{ item.actionKeys.length }} 个 · 香火 {{ item.incenseValue }} · 信号 {{ item.signalValue }}%
            </text>
          </view>
        </view>
      </view>

      <view class="ritual-page__footer">
        <app-button block @click="openResultPage">完成接入并生成结果</app-button>
        <text class="ritual-page__footer-text">结果页会生成可截图传播的海报，并把这次仪式记录写入本地祖域仓。</text>
      </view>
    </view>
  </app-theme-page>
</template>

<style scoped lang="scss">
.ritual-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg-page);
  overflow: hidden;
}

.ritual-page--cyber {
  --color-bg-page: var(--color-cyber-space);
  --color-bg-card: var(--color-cyber-surface);
  --color-bg-muted: var(--color-cyber-surface-soft);
  --color-primary: var(--color-cyber-violet-strong);
  --color-primary-pressed: var(--color-cyber-violet);
  --color-primary-soft: var(--color-cyber-violet-soft);
  --color-accent: var(--color-cyber-cyan);
  --color-accent-soft: var(--color-cyber-cyan-faint);
  --color-text-primary: var(--color-cyber-text-primary);
  --color-text-secondary: var(--color-cyber-text-secondary);
  --color-text-tertiary: var(--color-cyber-text-muted);
  --color-text-placeholder: var(--color-cyber-text-muted);
  --color-text-disabled: var(--color-cyber-text-disabled);
  --color-border: var(--color-cyber-border);
  --color-border-strong: var(--color-cyber-border-strong);
  --color-primary-border-soft: var(--color-cyber-violet-soft-strong);
  --color-overlay: var(--color-cyber-overlay);
  --shadow-card: var(--shadow-cyber-panel);
  --shadow-pop: var(--shadow-cyber-float);
}

.ritual-page--cyber::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 0%, var(--color-cyber-violet-soft-strong) 0%, transparent 28%),
    radial-gradient(circle at 88% 20%, var(--color-cyber-cyan-faint) 0%, transparent 18%),
    radial-gradient(circle at 18% 82%, var(--color-cyber-hot-soft) 0%, transparent 18%),
    var(--gradient-cyber-page);
  pointer-events: none;
}

.ritual-page--cyber::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--overlay-cyber-grid);
  background-size: 48rpx 48rpx;
  opacity: 0.1;
  pointer-events: none;
}

.ritual-page--cyber :deep(.app-nav-bar) {
  background: var(--gradient-cyber-nav);
  border-color: var(--color-cyber-border);
}

.ritual-page__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border: 2rpx solid var(--color-cyber-cyan-faint);
  border-radius: 24rpx;
  background: var(--color-cyber-cyan-trace);
  color: var(--color-cyber-cyan);
}

.ritual-page__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 20rpx 24rpx 40rpx;
}

.ritual-page__hero,
.ritual-page__identity-card,
.ritual-page__message-card,
.ritual-page__footer {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 28rpx;
  border: 2rpx solid var(--color-cyber-border);
  border-radius: var(--radius-cyber-panel);
  background:
    radial-gradient(circle at 100% 0%, var(--color-cyber-cyan-trace) 0%, transparent 18%),
    var(--gradient-cyber-panel);
  box-shadow: var(--shadow-card);
}

.ritual-page__hero::before,
.ritual-page__identity-card::before,
.ritual-page__message-card::before,
.ritual-page__footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 28rpx;
  right: 28rpx;
  height: 2rpx;
  background: var(--gradient-cyber-highlight);
  pointer-events: none;
}

.ritual-page__identity-hint {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.ritual-page__tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.ritual-page__title {
  max-width: 620rpx;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: 1rpx;
  color: var(--color-text-primary);
  text-shadow: 0 0 32rpx var(--color-cyber-violet-shadow);
}

.ritual-page__subtitle,
.ritual-page__footer-text {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--color-text-secondary);
}

.ritual-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.ritual-page__stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 20rpx 18rpx;
  border: 2rpx solid var(--color-cyber-panel-line);
  border-radius: 24rpx;
  background:
    var(--gradient-cyber-sheen-soft),
    var(--color-cyber-panel);
  box-shadow: var(--shadow-cyber-inset);
}

.ritual-page__stat-value {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--color-cyber-gold);
  text-shadow: 0 0 20rpx var(--color-cyber-gold-glow);
}

.ritual-page__stat-label {
  font-size: 19rpx;
  letter-spacing: 2rpx;
  color: var(--color-text-tertiary);
}

.ritual-page__actions,
.ritual-page__history-template-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ritual-page__template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.ritual-page__template-chip {
  display: inline-flex;
}

.ritual-page__message-title {
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: var(--color-text-primary);
}

.ritual-page__textarea {
  width: 100%;
  min-height: 196rpx;
  padding: 24rpx;
  border: 2rpx solid var(--color-primary-border-soft);
  border-radius: 24rpx;
  background:
    var(--gradient-cyber-sheen-soft),
    var(--color-cyber-panel);
  font-size: 26rpx;
  line-height: 1.8;
  color: var(--color-text-primary);
  box-sizing: border-box;
  box-shadow: var(--shadow-cyber-inset);
}

.ritual-page__textarea-placeholder {
  color: var(--color-text-placeholder);
}

.ritual-page__history-template {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 22rpx;
  border: 2rpx solid var(--color-cyber-border);
  border-radius: 24rpx;
  background:
    radial-gradient(circle at top right, var(--color-cyber-violet-soft) 0%, transparent 18%),
    var(--color-cyber-panel-soft);
  box-shadow: var(--shadow-cyber-inset);
}

.ritual-page__history-template-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.ritual-page__history-template-name {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}

.ritual-page__history-template-message,
.ritual-page__history-template-meta {
  font-size: 22rpx;
  line-height: 1.8;
  color: var(--color-text-secondary);
}
</style>
