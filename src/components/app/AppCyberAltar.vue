<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'

defineOptions({
  name: 'AppCyberAltar'
})

defineProps<{
  statusLabel: string
  title: string
  subtitle: string
  signalValue: string
  incenseValue: string
  ritualValue: string
  protocolTags: string[]
}>()
</script>

<template>
  <view class="app-cyber-altar">
    <view class="app-cyber-altar__scanline" />

    <view class="app-cyber-altar__header">
      <text class="app-cyber-altar__status">{{ statusLabel }}</text>
      <view class="app-cyber-altar__tags">
        <text v-for="item in protocolTags" :key="item" class="app-cyber-altar__tag">
          {{ item }}
        </text>
      </view>
    </view>

    <view class="app-cyber-altar__core">
      <view class="app-cyber-altar__halo app-cyber-altar__halo--outer" />
      <view class="app-cyber-altar__halo app-cyber-altar__halo--inner" />
      <view class="app-cyber-altar__glyph">
        <app-icon name="ancestor-tablet" size="104rpx" />
      </view>
    </view>

    <view class="app-cyber-altar__body">
      <text class="app-cyber-altar__title">{{ title }}</text>
      <text class="app-cyber-altar__subtitle">{{ subtitle }}</text>
    </view>

    <view class="app-cyber-altar__metrics">
      <view class="app-cyber-altar__metric">
        <text class="app-cyber-altar__metric-value">{{ signalValue }}</text>
        <text class="app-cyber-altar__metric-label">祖先信号</text>
      </view>
      <view class="app-cyber-altar__metric">
        <text class="app-cyber-altar__metric-value">{{ incenseValue }}</text>
        <text class="app-cyber-altar__metric-label">今日香火</text>
      </view>
      <view class="app-cyber-altar__metric">
        <text class="app-cyber-altar__metric-value">{{ ritualValue }}</text>
        <text class="app-cyber-altar__metric-label">仪式动作</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-cyber-altar {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 36rpx 30rpx 30rpx;
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: var(--border-radius-hero);
  background: var(--scene-panel-strong);
  box-shadow: var(--scene-shadow-float);
}

.app-cyber-altar__scanline {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: transparent;
  pointer-events: none;
}

.app-cyber-altar__header,
.app-cyber-altar__body,
.app-cyber-altar__metrics {
  position: relative;
  z-index: 1;
}

.app-cyber-altar__header {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.app-cyber-altar__status {
  align-self: flex-start;
  padding: 10rpx 18rpx;
  border: 2rpx solid var(--color-link-light-3);
  border-radius: var(--border-radius-circle);
  background: var(--color-link-light-1);
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
  color: var(--link-6);
}

.app-cyber-altar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.app-cyber-altar__tag {
  padding: 8rpx 14rpx;
  border: 2rpx solid var(--color-primary-light-3);
  border-radius: var(--border-radius-circle);
  background: var(--color-primary-light-1);
  font-size: 19rpx;
  letter-spacing: 2rpx;
  color: var(--primary-6);
}

.app-cyber-altar__core {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360rpx;
}

.app-cyber-altar__halo {
  position: absolute;
  border-radius: 999rpx;
  border: 2rpx solid var(--color-link-light-3);
  animation: halo-spin 14s linear infinite;
}

.app-cyber-altar__halo--outer {
  width: 300rpx;
  height: 300rpx;
  box-shadow: 0 0 40rpx var(--color-primary-light-3);
}

.app-cyber-altar__halo--inner {
  width: 220rpx;
  height: 220rpx;
  border-style: dashed;
  animation-direction: reverse;
  animation-duration: 10s;
}

.app-cyber-altar__glyph {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152rpx;
  height: 152rpx;
  border: 2rpx solid var(--color-warning-light-3);
  border-radius: 36rpx;
  color: var(--warning-6);
  background: var(--scene-surface-solid);
  box-shadow:
    0 0 0 2rpx var(--color-link-light-1),
    0 0 56rpx var(--color-warning-light-2);
}

.app-cyber-altar__body {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  text-align: center;
}

.app-cyber-altar__title {
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1.15;
  color: var(--scene-text-1);
}

.app-cyber-altar__subtitle {
  font-size: 24rpx;
  line-height: 1.7;
  color: var(--scene-text-2);
}

.app-cyber-altar__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.app-cyber-altar__metric {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 18rpx 16rpx;
  border: 2rpx solid var(--color-primary-light-2);
  border-radius: 24rpx;
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-inset);
}

.app-cyber-altar__metric-value {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--warning-6);
}

.app-cyber-altar__metric-label {
  font-size: 20rpx;
  color: var(--scene-text-3);
}

@keyframes halo-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
