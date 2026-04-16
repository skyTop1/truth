<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'

import type { TabBarItem } from '@/types/navigation'

const props = defineProps<{
  items: TabBarItem[]
  activeKey: string
}>()

function handleSwitch(item: TabBarItem) {
  if (item.key === props.activeKey) {
    return
  }

  void uni.redirectTo({
    url: item.path
  })
}
</script>

<template>
  <view class="app-tab-bar-shell">
    <view class="app-tab-bar" :style="{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }">
      <button
        v-for="item in items"
        :key="item.key"
        class="app-tab-bar__item"
        :class="{ 'app-tab-bar__item--active': item.key === activeKey }"
        hover-class="none"
        @click="handleSwitch(item)"
      >
        <app-icon class="app-tab-bar__icon" :name="item.icon" size="32rpx" />
        <text class="app-tab-bar__label">{{ item.label }}</text>
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-tab-bar-shell {
  position: relative;
  flex-shrink: 0;
  height: calc(env(safe-area-inset-bottom) + 124rpx);
}

.app-tab-bar {
  position: fixed;
  bottom: 14rpx;
  left: 16rpx;
  right: 16rpx;
  z-index: 19;
  display: grid;
  gap: 8rpx;
  padding: 12rpx 12rpx calc(env(safe-area-inset-bottom) + 12rpx);
  background: var(--color-bg-5);
  border: 2rpx solid var(--color-border-2);
  border-radius: 32rpx;
  box-shadow: var(--shadow2-down);
  backdrop-filter: blur(24px);
}

.app-tab-bar__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: stretch;
  width: 100%;
  min-width: 0;
  gap: 8rpx;
  min-height: 84rpx;
  padding: 10rpx 12rpx 8rpx;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
  background: transparent;
  color: var(--color-text-3);
  opacity: 0.92;
  transition:
    color var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease),
    opacity var(--transition-duration-2, 0.2s) var(--transition-timing-function-standard, ease);
}

.app-tab-bar__item::after {
  border: 0;
}

.app-tab-bar__item--active {
  color: var(--primary-6);
  opacity: 1;
}

.app-tab-bar__icon {
  color: currentColor;
}

.app-tab-bar__label {
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
  line-height: 1.2;
}

.app-tab-bar__item--active .app-tab-bar__label {
  font-weight: 700;
}
</style>
