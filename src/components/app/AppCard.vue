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
  background: var(--color-bg-2);
  border: 2rpx solid var(--color-border-2);
  border-radius: var(--border-radius-large, 16rpx);
  box-shadow: var(--shadow1-down);
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
  color: var(--color-text-1);
}

.app-card__subtitle {
  max-width: 560rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: var(--color-text-2);
}

.app-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
