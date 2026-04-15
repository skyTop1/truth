<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/app/AppButton.vue'
import AppCard from '@/components/app/AppCard.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppTag from '@/components/app/AppTag.vue'
import { useTheme } from '@/composables/useTheme'
import { cyberStatusCopy } from '@/constants/status'
import { themePresets } from '@/constants/theme'

import type { ThemePresetId } from '@/types/theme'

defineOptions({
  name: 'ThemePreviewPage'
})

const { themeLabel, themeMode, themePreset, setThemePreset } = useTheme()

const activeThemePreset = computed(() => {
  return themePresets.find((item) => item.id === themePreset.value) ?? themePresets[0]
})

const activeTokenGroups = computed(() => {
  return activeThemePreset.value.tokenGroups
})

function goBack() {
  void uni.navigateBack()
}

function switchTheme(presetId: ThemePresetId) {
  if (presetId === themePreset.value) {
    return
  }

  const nextThemePreset = themePresets.find((item) => item.id === presetId) ?? themePresets[0]

  setThemePreset(presetId)

  void uni.showToast({
    title: `已切换到${nextThemePreset.label}`,
    icon: 'none'
  })
}
</script>

<template>
  <app-theme-page class="preview-page" :class="[`preview-page--${themeMode}`, `preview-page--${themePreset}`]">
    <app-nav-bar title="信号色板" :subtitle="`主题预览 · ${themeLabel}`">
      <template #left>
        <view class="preview-page__back" @click="goBack">
          <app-icon name="circle-chevron-left" size="34rpx" />
        </view>
      </template>
    </app-nav-bar>

    <view class="preview-page__content">
      <app-card title="主题切换" subtitle="这里会直接切换当前运行时主题，四套主题都使用同一套变量命名和组件消费面。">
        <view class="preview-theme-panel">
          <view class="preview-theme-panel__copy">
            <view class="preview-theme-panel__tag-list">
              <app-tag variant="accent">{{ cyberStatusCopy.hotPalette }}</app-tag>
              <app-tag variant="primary">{{ activeThemePreset.label }}</app-tag>
            </view>
            <text class="preview-theme-panel__title">{{ activeThemePreset.title }}</text>
            <text class="preview-theme-panel__description">{{ activeThemePreset.description }}</text>
          </view>

          <view class="preview-theme-panel__actions">
            <app-button
              v-for="item in themePresets"
              :key="item.id"
              :variant="themePreset === item.id ? 'primary' : 'secondary'"
              @click="switchTheme(item.id)"
            >
              {{ item.label }}
            </app-button>
          </view>
        </view>
      </app-card>

      <app-card
        v-for="group in activeTokenGroups"
        :key="group.title"
        :title="group.title"
        :subtitle="group.description"
      >
        <view class="preview-grid">
          <view v-for="token in group.tokens" :key="token.name" class="preview-token">
            <view class="preview-token__swatch" :style="{ backgroundColor: token.value }" />
            <text class="preview-token__name">{{ token.label }}</text>
            <text class="preview-token__value">{{ token.name }}</text>
            <text class="preview-token__usage">{{ token.value }} · {{ token.usage }}</text>
          </view>
        </view>
      </app-card>
    </view>
  </app-theme-page>
</template>

<style scoped lang="scss">
.preview-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg-page);
  overflow: hidden;
  transition:
    background-color 220ms ease,
    color 220ms ease;
}

.preview-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 10% 0%, var(--preview-glow-primary) 0%, transparent 28%),
    radial-gradient(circle at 90% 12%, var(--preview-glow-secondary) 0%, transparent 18%),
    linear-gradient(180deg, var(--preview-bg-top) 0%, var(--preview-bg-bottom) 100%);
  pointer-events: none;
}

.preview-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--overlay-cyber-grid, none);
  background-size: 48rpx 48rpx;
  opacity: var(--preview-grid-opacity);
  pointer-events: none;
}

.preview-page--light {
  --preview-glow-primary: var(--color-primary-soft);
  --preview-glow-secondary: var(--color-accent-soft);
  --preview-bg-top: var(--color-bg-page);
  --preview-bg-bottom: var(--color-bg-muted);
  --preview-grid-opacity: 0.08;
}

.preview-page--dark {
  --preview-glow-primary: var(--color-cyber-violet-soft-strong);
  --preview-glow-secondary: var(--color-cyber-cyan-faint);
  --preview-bg-top: var(--color-cyber-space-deep);
  --preview-bg-bottom: var(--color-cyber-space);
  --preview-grid-opacity: 0.12;
}

.preview-page--altar-gold,
.preview-page--stele-cyan {
  --preview-glow-primary: transparent;
  --preview-glow-secondary: transparent;
  --preview-bg-top: var(--color-bg-page);
  --preview-bg-bottom: var(--color-bg-page);
  --preview-grid-opacity: 0;
}

.preview-page--light :deep(.app-nav-bar) {
  background: linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-muted) 100%);
  border-color: var(--color-border);
}

.preview-page--dark :deep(.app-nav-bar) {
  background: linear-gradient(180deg, var(--color-cyber-nav) 0%, var(--color-cyber-nav-soft) 100%);
  border-color: var(--color-cyber-border);
}

.preview-page--altar-gold :deep(.app-nav-bar),
.preview-page--stele-cyan :deep(.app-nav-bar) {
  background: var(--color-bg-card);
  border-color: var(--color-border);
}

.preview-page__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx 24rpx 48rpx;
}

.preview-page__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border: 2rpx solid var(--color-accent-soft);
  border-radius: 24rpx;
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.preview-theme-panel,
.preview-theme-panel__copy {
  display: flex;
  flex-direction: column;
}

.preview-theme-panel {
  gap: 24rpx;
}

.preview-theme-panel__copy {
  gap: 14rpx;
}

.preview-theme-panel__tag-list,
.preview-theme-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.preview-theme-panel__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}

.preview-theme-panel__description {
  font-size: 24rpx;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.preview-token {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 20rpx;
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-muted);
  border-radius: 22rpx;
}

.preview-token__swatch {
  height: 96rpx;
  border-radius: 18rpx;
}

.preview-token__name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}

.preview-token__value,
.preview-token__usage {
  font-size: 22rpx;
  color: var(--color-text-secondary);
}
</style>
