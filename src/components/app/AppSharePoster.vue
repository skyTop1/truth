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
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: var(--border-radius-hero);
  background: var(--scene-panel-strong);
  box-shadow: var(--scene-shadow-float);
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
  color: var(--link-6);
}

.app-share-poster__badge {
  padding: 10rpx 16rpx;
  border: 2rpx solid var(--color-warning-light-3);
  border-radius: var(--border-radius-circle);
  background: var(--color-warning-light-1);
  color: var(--warning-6);
}

.app-share-poster__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110rpx;
  height: 110rpx;
  border-radius: 30rpx;
  color: var(--warning-6);
  background: var(--scene-surface-solid);
  box-shadow:
    0 0 0 2rpx var(--color-link-light-1),
    0 0 56rpx var(--color-warning-light-2);
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
  color: var(--scene-text-1);
}

.app-share-poster__ancestor {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--warning-6);
}

.app-share-poster__message {
  font-size: 24rpx;
  line-height: 1.72;
  color: var(--scene-text-2);
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
  background: var(--scene-panel);
  border: 2rpx solid var(--color-primary-light-2);
  box-shadow: var(--scene-shadow-inset);
}

.app-share-poster__metric-value {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--primary-6);
}

.app-share-poster__metric-label {
  font-size: 20rpx;
  color: var(--scene-text-3);
}
</style>
