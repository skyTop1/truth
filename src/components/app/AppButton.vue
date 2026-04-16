<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    block?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    block: false,
    disabled: false
  }
)

const emit = defineEmits<{
  click: []
}>()

const classes = computed(() => {
  return [
    `app-button--${props.variant}`,
    props.block ? 'app-button--block' : '',
    props.disabled ? 'app-button--disabled' : ''
  ]
})

function handleClick() {
  if (props.disabled) {
    return
  }

  emit('click')
}
</script>

<template>
  <button class="app-button" :class="classes" :disabled="disabled" hover-class="none" @click="handleClick">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.app-button {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180rpx;
  height: 88rpx;
  padding: 0 32rpx;
  border: 2rpx solid transparent;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
  transition:
    transform var(--transition-duration-2, 0.2s) var(--transition-timing-function-standard, ease),
    box-shadow var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease),
    border-color var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease),
    background-color var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease),
    color var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease);
}

.app-button::after {
  border: 0;
}

.app-button::before {
  display: none;
}

.app-button--block {
  width: 100%;
}

.app-button--primary {
  color: var(--color-bg-5);
  background: var(--primary-6);
  border-color: var(--primary-6);
  box-shadow: 0 14rpx 28rpx var(--color-primary-light-3);
}

.app-button--primary:active {
  transform: translateY(2rpx);
  background: var(--primary-7);
  border-color: var(--primary-7);
}

.app-button--secondary {
  color: var(--color-text-1);
  background: var(--color-bg-2);
  border-color: var(--color-border-2);
  box-shadow: var(--shadow1-down);
}

.app-button--text {
  min-width: auto;
  height: 72rpx;
  padding: 0 18rpx;
  color: var(--link-6);
  background: transparent;
  box-shadow: none;
}

.app-button--danger {
  color: var(--color-bg-5);
  background: var(--danger-6);
  border-color: var(--danger-6);
  box-shadow: 0 14rpx 28rpx var(--color-danger-light-3);
}

.app-button--disabled {
  color: var(--color-text-4);
  background: var(--color-fill-2);
  border-color: var(--color-border-1);
  box-shadow: none;
}

.app-button--text::before,
.app-button--disabled::before {
  display: none;
}
</style>
