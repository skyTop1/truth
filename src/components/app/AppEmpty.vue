<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'

import type { AppIconName } from '@/constants/icons'

withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: AppIconName
  }>(),
  {
    description: '',
    icon: 'package-open'
  }
)
</script>

<template>
  <view class="app-empty">
    <view class="app-empty__icon" aria-hidden="true">
      <app-icon :name="icon" size="56rpx" />
    </view>
    <view class="app-empty__content">
      <text class="app-empty__title">{{ title }}</text>
      <text v-if="description" class="app-empty__description">{{ description }}</text>
    </view>
    <view v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-empty {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 56rpx 32rpx;
  background: var(--color-bg-2);
  border: 2rpx dashed var(--color-border-2);
  border-radius: var(--border-radius-large, 16rpx);
  box-shadow: var(--shadow1-down);
  text-align: center;
}

.app-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  border-radius: 32rpx;
  color: var(--primary-6);
  background: var(--color-primary-light-1);
}

.app-empty__content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.app-empty__title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--color-text-1);
}

.app-empty__description {
  max-width: 520rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: var(--color-text-2);
}

.app-empty__action {
  display: flex;
  justify-content: center;
}
</style>
