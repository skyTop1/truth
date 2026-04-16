<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    showCancel?: boolean
  }>(),
  {
    description: '',
    confirmText: '确认',
    cancelText: '取消',
    showCancel: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function closeDialog() {
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  closeDialog()
}

function handleConfirm() {
  emit('confirm')
  closeDialog()
}

function handleMaskTap() {
  handleCancel()
}
</script>

<template>
  <view v-if="props.modelValue" class="app-dialog">
    <view class="app-dialog__mask" @click="handleMaskTap" />
    <view class="app-dialog__panel">
      <view class="app-dialog__header">
        <text class="app-dialog__title">{{ title }}</text>
        <text v-if="description" class="app-dialog__description">{{ description }}</text>
      </view>

      <view v-if="$slots.default" class="app-dialog__body">
        <slot />
      </view>

      <view class="app-dialog__footer">
        <button
          v-if="showCancel"
          class="app-dialog__button app-dialog__button--secondary"
          hover-class="none"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button class="app-dialog__button app-dialog__button--primary" hover-class="none" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-dialog {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.app-dialog__mask {
  position: absolute;
  inset: 0;
  background: var(--mask-color-bg);
  backdrop-filter: blur(12px);
}

.app-dialog__panel {
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 100%;
  max-width: 640rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 36rpx;
  background: var(--color-bg-2);
  border: 2rpx solid var(--color-border-2);
  border-radius: var(--border-radius-large, 16rpx);
  box-shadow: var(--shadow3-down);
}

.app-dialog__header,
.app-dialog__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.app-dialog__title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text-1);
}

.app-dialog__description {
  font-size: 25rpx;
  line-height: 1.7;
  color: var(--color-text-2);
}

.app-dialog__footer {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.app-dialog__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 88rpx;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
  font-size: 28rpx;
  font-weight: 600;
}

.app-dialog__button::after {
  border: 0;
}

.app-dialog__button--secondary {
  color: var(--color-text-1);
  background: var(--color-fill-2);
  border-color: var(--color-border-2);
}

.app-dialog__button--primary {
  color: var(--color-bg-5);
  background: var(--primary-6);
  border-color: var(--primary-6);
}
</style>
