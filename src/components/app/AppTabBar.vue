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
  background: var(--gradient-cyber-panel, var(--color-bg-card));
  border: 2rpx solid var(--color-border);
  border-radius: 32rpx;
  box-shadow: var(--shadow-cyber-float, var(--shadow-card));
  backdrop-filter: blur(24px);
}

.app-tab-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle at 50% 0%, var(--color-cyber-cyan-trace) 0%, transparent 38%),
    linear-gradient(180deg, var(--color-cyber-white-ghost) 0%, transparent 100%);
  pointer-events: none;
}

.app-tab-bar__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-height: 84rpx;
  padding: 8rpx 0 4rpx;
  border-radius: 20rpx;
  border: 2rpx solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  opacity: 0.92;
  transition:
    color var(--duration-cyber-base, 260ms) ease,
    text-shadow var(--duration-cyber-base, 260ms) ease,
    opacity var(--duration-cyber-fast, 180ms) ease;
}

.app-tab-bar__item::after {
  border: 0;
}

.app-tab-bar__item--active {
  color: var(--color-primary);
  opacity: 1;
  text-shadow: 0 0 22rpx var(--color-cyber-violet-soft-strong);
}

.app-tab-bar__icon {
  color: currentColor;
  transition:
    filter var(--duration-cyber-base, 260ms) ease;
}

.app-tab-bar__item--active .app-tab-bar__icon {
  filter: drop-shadow(0 0 16rpx var(--color-cyber-cyan-glow));
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
