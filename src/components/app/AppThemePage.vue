<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

defineOptions({
  name: 'AppThemePage'
})

const { themeClass } = useTheme()
</script>

<template>
  <view class="app-theme-page" :class="themeClass">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.app-theme-page {
  min-height: 100vh;
  background: var(--color-bg-1);
  color: var(--color-text-1);
  transition:
    background-color 220ms ease,
    color 220ms ease;
}
</style>
