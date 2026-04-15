<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <view class="app-card">
    <view v-if="title || subtitle" class="app-card__header">
      <view class="app-card__title-wrap">
        <text v-if="title" class="app-card__title">{{ title }}</text>
        <text v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</text>
      </view>
      <slot name="extra" />
    </view>
    <view class="app-card__body">
      <slot />
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
  background: var(--gradient-cyber-panel, var(--color-bg-card));
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-cyber-panel, 36rpx);
  box-shadow: var(--shadow-cyber-panel, var(--shadow-card));
  backdrop-filter: blur(24px);
}

.app-card::before,
.app-card::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.app-card::before {
  inset: 0;
  background:
    radial-gradient(circle at 8% 12%, var(--color-cyber-cyan-faint) 0%, transparent 18%),
    radial-gradient(circle at 92% 0%, var(--color-cyber-violet-soft) 0%, transparent 20%),
    linear-gradient(180deg, var(--color-cyber-white-ghost) 0%, transparent 100%);
}

.app-card::after {
  top: 22rpx;
  right: 22rpx;
  width: 96rpx;
  height: 96rpx;
  border-top: 2rpx solid var(--color-cyber-panel-line-strong, var(--color-border-strong));
  border-right: 2rpx solid var(--color-cyber-panel-line-strong, var(--color-border-strong));
  border-radius: 0 24rpx 0 0;
  opacity: 0.72;
}

.app-card__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.app-card__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.app-card__title {
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: var(--color-text-primary);
}

.app-card__subtitle {
  max-width: 560rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.app-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
