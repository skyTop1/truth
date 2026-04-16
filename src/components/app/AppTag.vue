<script setup lang="ts">
type TagVariant = 'primary' | 'accent' | 'muted' | 'success' | 'warning' | 'danger'

withDefaults(
  defineProps<{
    variant?: TagVariant
  }>(),
  {
    variant: 'muted'
  }
)
</script>

<template>
  <view class="app-tag" :class="`app-tag--${variant}`">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.app-tag {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52rpx;
  padding: 0 18rpx;
  border: 2rpx solid transparent;
  border-radius: var(--border-radius-circle, 999rpx);
  font-size: 20rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  backdrop-filter: blur(14px);
}

.app-tag--primary {
  color: var(--primary-6);
  background: var(--color-primary-light-1);
  border-color: var(--color-primary-light-3);
}

.app-tag--accent {
  color: var(--link-6);
  background: var(--color-link-light-1);
  border-color: var(--color-link-light-3);
}

.app-tag--muted {
  color: var(--color-text-2);
  background: var(--color-fill-2);
  border-color: var(--color-border-2);
}

.app-tag--success {
  color: var(--success-6);
  background: var(--color-success-light-1);
  border-color: var(--color-success-light-3);
}

.app-tag--warning {
  color: var(--warning-6);
  background: var(--color-warning-light-1);
  border-color: var(--color-warning-light-3);
}

.app-tag--danger {
  color: var(--danger-6);
  background: var(--color-danger-light-1);
  border-color: var(--color-danger-light-3);
}
</style>
