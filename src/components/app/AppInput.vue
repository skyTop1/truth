<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
  }>(),
  {
    label: '',
    placeholder: '请输入内容'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const targetValue = (event.target as HTMLInputElement | null)?.value
  const detailValue = (event as Event & { detail?: { value?: string } }).detail?.value

  emit('update:modelValue', targetValue ?? detailValue ?? '')
}
</script>

<template>
  <view class="app-input">
    <text v-if="label" class="app-input__label">{{ label }}</text>
    <view class="app-input__wrapper">
      <input
        class="app-input__field"
        :value="props.modelValue"
        :placeholder="placeholder"
        placeholder-class="app-input__placeholder"
        @input="handleInput"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-input {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.app-input__label {
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  color: var(--color-text-primary);
}

.app-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 92rpx;
  padding: 0 24rpx;
  background: var(--gradient-cyber-button-secondary, var(--color-bg-card));
  border: 2rpx solid var(--color-cyber-panel-line, var(--color-border-strong));
  border-radius: 24rpx;
  box-shadow: var(--shadow-cyber-inset, none);
  transition:
    border-color var(--duration-cyber-base, 260ms) ease,
    box-shadow var(--duration-cyber-base, 260ms) ease;
}

.app-input__field {
  width: 100%;
  font-size: 28rpx;
  line-height: 1.4;
  color: var(--color-text-primary);
}

.app-input__placeholder {
  color: var(--color-text-placeholder);
}

.app-input__field:focus {
  color: var(--color-text-primary);
}

.app-input__wrapper:focus-within {
  border-color: var(--color-accent);
  box-shadow:
    inset 0 1rpx 0 var(--color-cyber-white-soft),
    0 0 0 2rpx var(--color-cyber-cyan-faint),
    0 0 36rpx var(--color-cyber-cyan-glow);
}
</style>
