<script setup lang="ts">
import { computed } from 'vue'

import { appIcons } from '@/constants/icons'
import type { AppIconDefinition, AppIconName, AppIconNode } from '@/constants/icons'

defineOptions({
  name: 'AppIcon'
})

const props = withDefaults(
  defineProps<{
    name: AppIconName
    size?: number | string
    color?: string
    strokeWidth?: number
    decorative?: boolean
    label?: string
  }>(),
  {
    size: 36,
    color: 'currentColor',
    strokeWidth: undefined,
    decorative: true,
    label: ''
  }
)

const icon = computed<AppIconDefinition>(() => appIcons[props.name])

const resolvedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}rpx` : props.size
})

const svgStyle = computed(() => {
  return {
    width: resolvedSize.value,
    height: resolvedSize.value,
    color: props.color
  }
})

function isPathNode(node: AppIconNode): node is Extract<AppIconNode, { tag: 'path' }> {
  return node.tag === 'path'
}

function isRectNode(node: AppIconNode): node is Extract<AppIconNode, { tag: 'rect' }> {
  return node.tag === 'rect'
}

function isCircleNode(node: AppIconNode): node is Extract<AppIconNode, { tag: 'circle' }> {
  return node.tag === 'circle'
}
</script>

<template>
  <svg
    class="app-icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth ?? icon.strokeWidth ?? 2"
    :style="svgStyle"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : label || name"
    role="img"
  >
    <template v-for="(node, index) in icon.nodes" :key="`${name}-${index}`">
      <path
        v-if="isPathNode(node)"
        :d="node.d"
        :fill="node.fill ?? 'none'"
        :stroke="node.stroke ?? 'currentColor'"
      />
      <rect
        v-else-if="isRectNode(node)"
        :x="node.x"
        :y="node.y"
        :width="node.width"
        :height="node.height"
        :rx="node.rx"
        :fill="node.fill ?? 'none'"
        :stroke="node.stroke ?? 'currentColor'"
      />
      <circle
        v-else-if="isCircleNode(node)"
        :cx="node.cx"
        :cy="node.cy"
        :r="node.r"
        :fill="node.fill ?? 'none'"
        :stroke="node.stroke ?? 'currentColor'"
      />
    </template>
  </svg>
</template>

<style scoped lang="scss">
.app-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
