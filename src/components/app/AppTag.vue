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
  border-radius: var(--radius-cyber-chip, 999rpx);
  font-size: 20rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  backdrop-filter: blur(14px);
}

.app-tag--primary {
  color: var(--color-primary-pressed);
  background: var(--color-primary-soft);
  border-color: var(--color-primary-border-soft);
}

.app-tag--accent {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: var(--color-cyber-panel-line-strong);
}

.app-tag--muted {
  color: var(--color-text-secondary);
  background: var(--color-bg-muted);
  border-color: var(--color-border);
}

.app-tag--success {
  color: var(--color-success);
  background: var(--color-success-soft);
  border-color: var(--color-success-border-soft);
}

.app-tag--warning {
  color: var(--color-warning);
  background: var(--color-warning-soft);
  border-color: var(--color-warning-border-soft);
}

.app-tag--danger {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border-color: var(--color-danger-border-soft);
}
</style>
