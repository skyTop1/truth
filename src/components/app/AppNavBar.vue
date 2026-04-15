<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineProps<{
  title: string
  subtitle?: string
}>()

const slots = useSlots()

const hasLeftSlot = computed(() => {
  return typeof slots.left === 'function'
})

const hasRightSlot = computed(() => {
  return typeof slots.default === 'function'
})
</script>

<template>
  <view class="app-nav-bar-shell">
    <view
      class="app-nav-bar"
      :class="{
        'app-nav-bar--with-left': hasLeftSlot,
        'app-nav-bar--with-right': hasRightSlot
      }"
    >
      <view v-if="hasLeftSlot" class="app-nav-bar__aside app-nav-bar__aside--left">
        <slot name="left" />
      </view>

      <view class="app-nav-bar__content">
        <text class="app-nav-bar__title">{{ title }}</text>
        <text v-if="subtitle" class="app-nav-bar__subtitle">{{ subtitle }}</text>
      </view>

      <view v-if="hasRightSlot" class="app-nav-bar__aside app-nav-bar__aside--right">
        <slot />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-nav-bar-shell {
  position: relative;
  flex-shrink: 0;
  min-height: calc(var(--status-bar-height, 0px) + 156rpx);
}

.app-nav-bar {
  position: fixed;
  top: 12rpx;
  left: 16rpx;
  right: 16rpx;
  z-index: 20;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: calc(var(--status-bar-height, 0px) + 20rpx) 28rpx 24rpx;
  background: var(--gradient-cyber-panel, var(--color-bg-page));
  border: 2rpx solid var(--color-border);
  border-radius: 0 0 var(--radius-cyber-panel, 36rpx) var(--radius-cyber-panel, 36rpx);
  box-shadow: var(--shadow-cyber-float, var(--shadow-card));
  backdrop-filter: blur(24px);
}

.app-nav-bar::before,
.app-nav-bar::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  pointer-events: none;
}

.app-nav-bar::before {
  top: 0;
  height: 2rpx;
  background: var(--gradient-cyber-highlight);
}

.app-nav-bar::after {
  top: 0;
  background:
    radial-gradient(circle at 12% 20%, var(--color-cyber-cyan-faint) 0%, transparent 18%),
    radial-gradient(circle at 88% 10%, var(--color-cyber-violet-soft) 0%, transparent 22%);
}

.app-nav-bar__content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  min-width: 0;
}

.app-nav-bar__aside {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.app-nav-bar__aside--right {
  margin-left: auto;
}

.app-nav-bar__title {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: var(--color-text-primary);
  text-shadow: 0 0 28rpx var(--color-cyber-violet-shadow);
}

.app-nav-bar__subtitle {
  font-size: 22rpx;
  line-height: 1.6;
  letter-spacing: 1rpx;
  color: var(--color-text-secondary);
}
</style>
