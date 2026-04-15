<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/app/AppIcon.vue'
import { cyberStatusCopy, formatRitualBadgeLabel } from '@/constants/status'

defineOptions({
  name: 'AppSharePoster'
})

const props = defineProps<{
  title: string
  badge: string
  ancestorName: string
  incenseValue: string
  signalValue: string
  ritualCount: string
  message: string
}>()

const displayBadge = computed(() => {
  return formatRitualBadgeLabel(props.badge)
})
</script>

<template>
  <view class="app-share-poster">
    <view class="app-share-poster__glow app-share-poster__glow--violet" />
    <view class="app-share-poster__glow app-share-poster__glow--cyan" />

    <view class="app-share-poster__topline">
      <text class="app-share-poster__eyebrow">{{ cyberStatusCopy.posterEyebrow }}</text>
      <text class="app-share-poster__badge">{{ displayBadge }}</text>
    </view>

    <view class="app-share-poster__glyph">
      <app-icon name="share-2" size="54rpx" />
    </view>

    <view class="app-share-poster__body">
      <text class="app-share-poster__title">{{ title }}</text>
      <text class="app-share-poster__ancestor">{{ ancestorName }}</text>
      <text class="app-share-poster__message">{{ message }}</text>
    </view>

    <view class="app-share-poster__metrics">
      <view class="app-share-poster__metric">
        <text class="app-share-poster__metric-value">{{ incenseValue }}</text>
        <text class="app-share-poster__metric-label">香火值</text>
      </view>
      <view class="app-share-poster__metric">
        <text class="app-share-poster__metric-value">{{ signalValue }}</text>
        <text class="app-share-poster__metric-label">信号强度</text>
      </view>
      <view class="app-share-poster__metric">
        <text class="app-share-poster__metric-value">{{ ritualCount }}</text>
        <text class="app-share-poster__metric-label">仪式动作</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-share-poster {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 34rpx;
  border: 2rpx solid var(--color-cyber-border-strong);
  border-radius: var(--radius-cyber-hero, 42rpx);
  background:
    radial-gradient(circle at top, var(--color-cyber-violet-soft-strong) 0%, transparent 42%),
    radial-gradient(circle at 92% 14%, var(--color-cyber-cyan-faint) 0%, transparent 20%),
    var(--gradient-cyber-panel-strong);
  box-shadow: var(--shadow-cyber-float);
}

.app-share-poster__glow {
  position: absolute;
  border-radius: 999rpx;
  filter: blur(54rpx);
  opacity: 0.48;
}

.app-share-poster__glow--violet {
  top: 32rpx;
  right: 24rpx;
  width: 160rpx;
  height: 160rpx;
  background: var(--color-cyber-violet);
}

.app-share-poster__glow--cyan {
  left: 32rpx;
  bottom: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background: var(--color-cyber-cyan);
}

.app-share-poster__topline,
.app-share-poster__body,
.app-share-poster__metrics,
.app-share-poster__glyph {
  position: relative;
  z-index: 1;
}

.app-share-poster__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.app-share-poster__eyebrow,
.app-share-poster__badge {
  font-size: 20rpx;
  letter-spacing: 3rpx;
}

.app-share-poster__eyebrow {
  color: var(--color-cyber-cyan);
}

.app-share-poster__badge {
  padding: 10rpx 16rpx;
  border: 2rpx solid var(--color-cyber-gold-border);
  border-radius: var(--radius-cyber-chip, 999rpx);
  background: var(--color-cyber-gold-faint);
  color: var(--color-cyber-gold);
}

.app-share-poster__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110rpx;
  height: 110rpx;
  border-radius: 30rpx;
  color: var(--color-cyber-gold);
  background:
    linear-gradient(180deg, var(--color-cyber-violet-soft) 0%, var(--color-cyber-cyan-faint) 100%),
    var(--color-cyber-surface-solid);
  box-shadow:
    0 0 0 2rpx var(--color-cyber-cyan-faint),
    0 0 56rpx var(--color-cyber-gold-faint-strong);
}

.app-share-poster__body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.app-share-poster__title {
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1.08;
  color: var(--color-text-primary);
}

.app-share-poster__ancestor {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-cyber-gold-soft);
}

.app-share-poster__message {
  font-size: 24rpx;
  line-height: 1.72;
  color: var(--color-text-secondary);
}

.app-share-poster__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.app-share-poster__metric {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 18rpx 16rpx;
  border-radius: 22rpx;
  background: var(--color-cyber-panel);
  border: 2rpx solid var(--color-cyber-violet-soft);
  box-shadow: var(--shadow-cyber-inset);
}

.app-share-poster__metric-value {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-cyber-gold);
}

.app-share-poster__metric-label {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}
</style>
