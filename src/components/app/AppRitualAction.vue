<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/app/AppIcon.vue'
import { formatRitualBadgeLabel } from '@/constants/status'

import type { AppIconName } from '@/constants/icons'

defineOptions({
  name: 'AppRitualAction'
})

const props = defineProps<{
  title: string
  description: string
  badge: string
  energy: number
  active: boolean
  iconName: AppIconName
}>()

const emit = defineEmits<{
  toggle: []
}>()

const classes = computed(() => {
  return {
    'app-ritual-action--active': props.active
  }
})

const displayBadge = computed(() => {
  return formatRitualBadgeLabel(props.badge)
})

function handleClick() {
  emit('toggle')
}
</script>

<template>
  <button class="app-ritual-action" :class="classes" hover-class="none" @click="handleClick">
    <view class="app-ritual-action__icon">
      <app-icon :name="iconName" size="44rpx" />
    </view>
    <view class="app-ritual-action__content">
      <view class="app-ritual-action__topline">
        <text class="app-ritual-action__badge">{{ displayBadge }}</text>
        <text class="app-ritual-action__energy">+{{ energy }}</text>
      </view>
      <text class="app-ritual-action__title">{{ title }}</text>
      <text class="app-ritual-action__description">{{ description }}</text>
    </view>
  </button>
</template>

<style scoped lang="scss">
.app-ritual-action {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid var(--scene-border-1);
  border-radius: 28rpx;
  background: var(--scene-surface-solid);
  box-shadow: var(--scene-shadow-glow);
  text-align: left;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
}

.app-ritual-action::after {
  border: 0;
}

.app-ritual-action::before {
  content: '';
  position: absolute;
  top: -40%;
  bottom: -40%;
  left: 0;
  width: 100%;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      var(--scene-accent-glow) 18%,
      var(--scene-warning-glow) 50%,
      var(--scene-accent-light) 82%,
      transparent 100%
    );
  opacity: 0;
  pointer-events: none;
  transform: translateX(-100%) rotate(16deg);
  transition: opacity 660ms ease, transform 660ms ease;
}


.app-ritual-action:active {
  transform: scale(0.985);
}

.app-ritual-action--active {
  border-color: var(--scene-warning-border);
  background:
    linear-gradient(180deg, var(--scene-primary-glow) 0%, var(--scene-surface-solid) 60%),
    var(--scene-surface-solid);
  box-shadow:
    0 0 0 2rpx var(--scene-warning-outline),
    0 26rpx 60rpx var(--scene-primary-shadow-strong),
    0 0 64rpx var(--scene-warning-shadow);
  transform: translateY(-4rpx);
}

.app-ritual-action--active::before {
  opacity: 1;
  transform: translateX(100%) rotate(16deg);
}

.app-ritual-action__icon::after {
  content: '';
  position: absolute;
  inset: -10rpx;
  border-radius: 30rpx;
  background: radial-gradient(circle, var(--scene-warning-glow) 0%, transparent 72%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease;
}


.app-ritual-action__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  color: var(--link-6);
  background: var(--color-link-light-1);
  flex-shrink: 0;
  transition:
    transform 220ms ease,
    color 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
}


.app-ritual-action--active .app-ritual-action__icon {
  color: var(--warning-6);
  background: var(--scene-warning-light);
  box-shadow:
    0 0 0 2rpx var(--scene-warning-outline),
    0 0 42rpx var(--scene-warning-glow);
  transform: scale(1.06);
}

.app-ritual-action--active .app-ritual-action__icon::after {
  opacity: 1;
}


.app-ritual-action__content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.app-ritual-action__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.app-ritual-action__badge,
.app-ritual-action__energy {
  font-size: 20rpx;
  letter-spacing: 2rpx;
  transition: color 220ms ease, text-shadow 220ms ease;
}

.app-ritual-action__badge {
  color: var(--link-6);
}

.app-ritual-action__energy {
  color: var(--warning-6);
}

.app-ritual-action__title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--scene-text-1);
  transition: color 220ms ease, text-shadow 220ms ease;
}

.app-ritual-action__description {
  font-size: 24rpx;
  line-height: 1.7;
  color: var(--scene-text-2);
  transition: color 220ms ease;
}

.app-ritual-action--active .app-ritual-action__badge,
.app-ritual-action--active .app-ritual-action__title {
  text-shadow: 0 0 20rpx var(--scene-warning-glow);
}

.app-ritual-action--active .app-ritual-action__description {
  color: var(--scene-text-1);
}
</style>
