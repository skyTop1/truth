<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
  }>(),
  {
    label: '',
    placeholder: ''
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
  color: var(--color-text-2);
}

.app-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 92rpx;
  padding: 0 24rpx;
  background: var(--color-bg-2);
  border: 2rpx solid var(--color-border-2);
  border-radius: 24rpx;
  transition:
    border-color var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease),
    box-shadow var(--transition-duration-3, 0.3s) var(--transition-timing-function-standard, ease);
}

.app-input__field {
  width: 100%;
  font-size: 28rpx;
  line-height: 1.4;
  color: var(--color-text-1);
}

.app-input__placeholder {
  color: var(--color-text-4);
}

.app-input__field:focus {
  color: var(--color-text-1);
}

.app-input__wrapper:focus-within {
  border-color: var(--primary-6);
  box-shadow:
    0 0 0 6rpx var(--color-primary-light-1);
}
</style>
