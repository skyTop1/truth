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
    transform var(--duration-cyber-fast, 180ms) ease,
    box-shadow var(--duration-cyber-base, 260ms) ease,
    border-color var(--duration-cyber-base, 260ms) ease,
    background var(--duration-cyber-base, 260ms) ease,
    color var(--duration-cyber-base, 260ms) ease;
}

.app-button::after {
  border: 0;
}

.app-button::before {
  content: '';
  position: absolute;
  inset: 2rpx;
  border-radius: 22rpx;
  background: var(--gradient-cyber-sheen);
  opacity: 0.68;
  pointer-events: none;
}

.app-button--block {
  width: 100%;
}

.app-button--primary {
  color: var(--color-cyber-text-primary);
  background: var(--gradient-cyber-button, var(--color-primary));
  box-shadow: var(--shadow-cyber-button-primary);
}

.app-button--primary:active {
  transform: translateY(2rpx);
}

.app-button--secondary {
  color: var(--color-text-primary);
  background: var(--gradient-cyber-button-secondary, var(--color-bg-card));
  border-color: var(--color-cyber-panel-line-strong, var(--color-border-strong));
  box-shadow: var(--shadow-cyber-panel, var(--shadow-card));
}

.app-button--text {
  min-width: auto;
  height: 72rpx;
  padding: 0 18rpx;
  color: var(--color-accent);
  background: transparent;
  box-shadow: none;
}

.app-button--danger {
  color: var(--color-cyber-text-primary);
  background: linear-gradient(135deg, var(--color-cyber-hot, var(--color-danger)) 0%, var(--color-danger) 100%);
  box-shadow: var(--shadow-cyber-button-danger);
}

.app-button--disabled {
  color: var(--color-text-disabled);
  background: var(--color-cyber-white-soft);
  border-color: transparent;
  box-shadow: none;
}

.app-button--text::before,
.app-button--disabled::before {
  display: none;
}
</style>
