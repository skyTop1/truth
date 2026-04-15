<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

import AppButton from '@/components/app/AppButton.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppSharePoster from '@/components/app/AppSharePoster.vue'
import AppTag from '@/components/app/AppTag.vue'
import {
  cyberStatusCopy,
  formatRitualBadgeLabel,
  getLocalRecordStatusMeta,
  getPosterStatusMeta
} from '@/constants/status'
import { useRitualStore } from '@/stores'
import { createLocalId } from '@/utils/local-id'
import { getCurrentPageOptions, registerShareAppMessage } from '@/utils/uni-page'

import type { PosterStatus } from '@/constants/status'

defineOptions({
  name: 'CyberRitualResultPage'
})

type PosterCanvasContext = ReturnType<typeof uni.createCanvasContext>

const posterCanvasId = 'ritualPosterCanvas'
const posterWidth = 960
const posterHeight = 1560

const ritualStore = useRitualStore()

let posterSecondaryActionText = '保存海报到相册'
// #ifdef H5
posterSecondaryActionText = '预览分享图'
// #endif

const ritualId = ref(createLocalId('ritual'))
const title = ref('今日赛博祭祖已完成')
const badge = ref('祖域接入员')
const ancestorName = ref('太爷爷 A-108')
const incenseValue = ref('108')
const signalValue = ref('87%')
const ritualCount = ref('3')
const message = ref('你向祖域上传了一次心意，祖先信号节点已被点亮。')
const actionKeys = ref<string[]>([])
const isGeneratingPoster = ref(false)
const posterImageUrl = ref('')
const posterStatus = ref<PosterStatus>('idle')
const posterStatusDetail = ref('等待写入本次赛博战报。')
const hasRestoredLocalRecord = ref(false)

const displayBadge = computed(() => {
  return formatRitualBadgeLabel(badge.value)
})

const shareTitle = computed(() => {
  return `${title.value} · ${displayBadge.value}`
})

const sharePath = computed(() => {
  const encodedTitle = encodeURIComponent(title.value)
  const encodedBadge = encodeURIComponent(displayBadge.value)
  const encodedAncestor = encodeURIComponent(ancestorName.value)
  const encodedMessage = encodeURIComponent(message.value)
  const encodedSelected = encodeURIComponent(actionKeys.value.join(','))

  return `/pages-sub/cyber/ritual-result?ritualId=${encodeURIComponent(ritualId.value)}&title=${encodedTitle}&badge=${encodedBadge}&ancestor=${encodedAncestor}&incense=${incenseValue.value}&signal=${signalValue.value}&actions=${ritualCount.value}&selected=${encodedSelected}&message=${encodedMessage}`
})

const posterStatusMeta = computed(() => {
  return getPosterStatusMeta(posterStatus.value)
})

const posterPrimaryActionText = computed(() => {
  if (isGeneratingPoster.value) {
    return '海报生成中...'
  }

  if (posterImageUrl.value.length > 0) {
    return '重新生成分享图'
  }

  return '生成分享图'
})

const posterStatusLabel = computed(() => {
  return posterStatusMeta.value.label
})

const posterStatusVariant = computed(() => {
  return posterStatusMeta.value.variant
})

const localRecordStatusMeta = computed(() => {
  return getLocalRecordStatusMeta(hasRestoredLocalRecord.value)
})

const posterPlaceholderTitle = computed(() => {
  if (posterStatus.value === 'generating') {
    return '正在写入海报'
  }

  if (posterStatus.value === 'stale') {
    return '缓存已失效'
  }

  if (posterStatus.value === 'failed') {
    return '生成失败'
  }

  if (posterStatus.value === 'save-blocked') {
    return '等待保存授权'
  }

  return '海报待生成'
})

const posterPlaceholderCopy = computed(() => {
  if (posterStatus.value === 'generating') {
    return '把发光灵牌、称号和香火值压成一张单图。'
  }

  if (posterStatus.value === 'stale') {
    return '图片临时文件已经不可靠了，但本地祭祖记录还在。重新生成即可恢复。'
  }

  if (posterStatus.value === 'failed') {
    return '祖域图像引擎这次没成功输出图片，可以直接重试。'
  }

  if (posterStatus.value === 'save-blocked') {
    return '图已经生成，只是当前设备没有相册写入权限。'
  }

  return '生成后更适合截图、分享和二次传播。'
})

const posterHint = computed(() => {
  if (posterStatus.value === 'generating') {
    return '祖域图像引擎正在写入霓虹战报，请等它把香火值和称号压进图里。'
  }

  if (posterStatus.value === 'restored') {
    return '这张海报是从本地祖域仓恢复出来的缓存。要是预览失败，通常说明临时文件已经过期，需要重新生成一次。'
  }

  if (posterStatus.value === 'ready' && posterImageUrl.value.length > 0) {
    return '海报已生成，现在这页既能直接截图，也能打开单图预览或保存到相册。'
  }

  if (posterStatus.value === 'stale') {
    return '检测到本地海报缓存已经失效。记录还在，但图片临时文件不可靠了，重新生成一次就能恢复。'
  }

  if (posterStatus.value === 'save-blocked') {
    return '图已经有了，但系统没有给相册写入权限。你仍然可以先预览或截图。'
  }

  if (posterStatus.value === 'failed') {
    return posterStatusDetail.value
  }

  return '结果页已经够亮，但真正适合刷屏的是单图海报。点一下，把这次仪式压缩成一张热梗战报。'
})

function applyPageOptions(options?: Record<string, string | undefined>) {
  if (!options) {
    return
  }

  if (typeof options.ritualId === 'string' && options.ritualId.trim().length > 0) {
    ritualId.value = decodeURIComponent(options.ritualId)
  }

  if (typeof options.title === 'string' && options.title.trim().length > 0) {
    title.value = decodeURIComponent(options.title)
  }

  if (typeof options.badge === 'string' && options.badge.trim().length > 0) {
    badge.value = formatRitualBadgeLabel(decodeURIComponent(options.badge))
  }

  if (typeof options.ancestor === 'string' && options.ancestor.trim().length > 0) {
    ancestorName.value = decodeURIComponent(options.ancestor)
  }

  if (typeof options.incense === 'string' && options.incense.trim().length > 0) {
    incenseValue.value = options.incense
  }

  if (typeof options.signal === 'string' && options.signal.trim().length > 0) {
    signalValue.value = options.signal
  }

  if (typeof options.actions === 'string' && options.actions.trim().length > 0) {
    ritualCount.value = options.actions
  }

  if (typeof options.selected === 'string' && options.selected.trim().length > 0) {
    actionKeys.value = decodeURIComponent(options.selected)
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  if (typeof options.message === 'string' && options.message.trim().length > 0) {
    message.value = decodeURIComponent(options.message)
  }
}

applyPageOptions(getCurrentPageOptions())

onMounted(() => {
  ritualStore.ensureHydrated()
  applyPageOptions(getCurrentPageOptions())
  restoreRecordFromArchive()
  persistRitualRecord()

  if (posterImageUrl.value.length > 0) {
    return
  }

  void generatePoster(true)
})

registerShareAppMessage(() => {
  return {
    title: shareTitle.value,
    path: sharePath.value,
    imageUrl: posterImageUrl.value || undefined
  }
})

function goBack() {
  if (getCurrentPages().length <= 1) {
    void uni.redirectTo({
      url: '/pages/index/index'
    })
    return
  }

  void uni.navigateBack()
}

function replayRitual() {
  void uni.redirectTo({
    url: `/pages-sub/cyber/ritual-entry?ancestor=${encodeURIComponent(ancestorName.value)}&message=${encodeURIComponent(message.value)}&selected=${encodeURIComponent(actionKeys.value.join(','))}`
  })
}

function openAncestorDomain() {
  void uni.redirectTo({
    url: '/pages/workbench/index'
  })
}

function handleGeneratePoster() {
  void generatePoster()
}

function handlePosterAsset() {
  void previewOrSavePoster()
}

async function generatePoster(silent = false) {
  if (isGeneratingPoster.value) {
    return
  }

  isGeneratingPoster.value = true
  posterStatus.value = 'generating'
  posterStatusDetail.value = '祖域图像引擎正在重新写入本地战报。'

  try {
    await nextTick()

    posterImageUrl.value = await renderPosterImage()
    ritualStore.upsertPosterRecord({
      id: `poster-${ritualId.value}`,
      ritualRecordId: ritualId.value,
      ancestorName: ancestorName.value.trim(),
      title: title.value,
      badge: displayBadge.value,
      imageUrl: posterImageUrl.value
    })
    posterStatus.value = 'ready'
    posterStatusDetail.value = '本地海报已重新生成，当前设备上的缓存也已更新。'

    if (!silent) {
      void uni.showToast({
        title: '赛博战报已生成',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('[CyberRitualResultPage] poster generation failed', error)
    posterStatus.value = 'failed'
    posterStatusDetail.value = `海报生成失败：${parseRuntimeError(error, '祖域图像引擎未能输出图片，请稍后重试。')}`

    void uni.showToast({
      title: '海报生成失败，请重试',
      icon: 'none'
    })
  } finally {
    isGeneratingPoster.value = false
  }
}

async function previewOrSavePoster() {
  if (isGeneratingPoster.value) {
    return
  }

  if (posterImageUrl.value.length === 0) {
    await generatePoster(true)
  }

  if (posterImageUrl.value.length === 0) {
    return
  }

  // #ifdef H5
  void uni.previewImage({
    current: posterImageUrl.value,
    urls: [posterImageUrl.value],
    fail: (error) => {
      if (isFileUnavailableError(error)) {
        clearPosterCache('本地海报缓存已失效，请重新生成。')
        return
      }

      posterStatus.value = 'failed'
      posterStatusDetail.value = parseRuntimeError(error, '海报预览失败，请重新生成或直接截图当前页面。')
    }
  })
  // #endif

  // #ifndef H5
  uni.saveImageToPhotosAlbum({
    filePath: posterImageUrl.value,
    success: () => {
      posterStatus.value = 'ready'
      posterStatusDetail.value = '海报已保存到相册，也仍保留在本地祖域仓里。'
      void uni.showToast({
        title: '已保存到相册',
        icon: 'none'
      })
    },
    fail: (error) => {
      if (isPermissionDeniedError(error)) {
        posterStatus.value = 'save-blocked'
        posterStatusDetail.value = '系统拒绝了相册写入权限。你仍然可以预览图片，或去设置里授权后再试。'

        void uni.showToast({
          title: '请先允许保存到相册',
          icon: 'none'
        })
        return
      }

      if (isFileUnavailableError(error)) {
        clearPosterCache('本地海报缓存已失效，请重新生成。')
        return
      }

      void uni.previewImage({
        current: posterImageUrl.value,
        urls: [posterImageUrl.value]
      })

      void uni.showToast({
        title: '保存失败，已打开预览',
        icon: 'none'
      })
    }
  })
  // #endif
}

function persistRitualRecord() {
  ritualStore.rememberAncestorName(ancestorName.value.trim())
  ritualStore.upsertRitualRecord({
    id: ritualId.value,
    ancestorName: ancestorName.value.trim(),
    badge: displayBadge.value,
    title: title.value,
    message: message.value,
    incenseValue: parseMetricValue(incenseValue.value),
    signalValue: parseMetricValue(signalValue.value),
    ritualCount: parseMetricValue(ritualCount.value),
    actionKeys: actionKeys.value
  })
}

function restoreRecordFromArchive() {
  const localRecord = ritualStore.findRitualRecordById(ritualId.value)

  if (localRecord) {
    title.value = localRecord.title
    badge.value = formatRitualBadgeLabel(localRecord.badge)
    ancestorName.value = localRecord.ancestorName
    incenseValue.value = `${localRecord.incenseValue}`
    signalValue.value = `${localRecord.signalValue}%`
    ritualCount.value = `${localRecord.ritualCount}`
    message.value = localRecord.message
    actionKeys.value = localRecord.actionKeys
    hasRestoredLocalRecord.value = true
  }

  const localPoster = ritualStore.findPosterRecordByRitualId(ritualId.value)
  const cachedImageUrl = localPoster?.imageUrl ?? localRecord?.posterImageUrl ?? ''

  if (cachedImageUrl.length > 0) {
    posterImageUrl.value = cachedImageUrl
    posterStatus.value = 'restored'
    posterStatusDetail.value = '已从本地祖域仓恢复海报缓存。'
    return
  }

  posterStatus.value = 'idle'
  posterStatusDetail.value = localRecord ? '本地记录已恢复，但还没有可用海报缓存。' : '这次结果还没有写入可用的海报缓存。'
}

function clearPosterCache(detail: string) {
  const localPoster = ritualStore.findPosterRecordByRitualId(ritualId.value)

  if (localPoster) {
    ritualStore.removePosterRecord(localPoster.id)
  }

  posterImageUrl.value = ''
  posterStatus.value = 'stale'
  posterStatusDetail.value = detail

  void uni.showToast({
    title: '海报缓存已失效，请重生图',
    icon: 'none'
  })
}

function parseRuntimeError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'errMsg' in error && typeof error.errMsg === 'string') {
    return error.errMsg
  }

  return fallbackMessage
}

function isPermissionDeniedError(error: unknown) {
  const message = parseRuntimeError(error, '').toLowerCase()

  return message.includes('auth') || message.includes('authorize') || message.includes('permission')
}

function isFileUnavailableError(error: unknown) {
  const message = parseRuntimeError(error, '').toLowerCase()

  return message.includes('file') || message.includes('path') || message.includes('no such')
}

function renderPosterImage() {
  const context = uni.createCanvasContext(posterCanvasId)

  drawPoster(context)

  return new Promise<string>((resolve, reject) => {
    context.draw(false, () => {
      uni.canvasToTempFilePath({
        canvasId: posterCanvasId,
        fileType: 'png',
        quality: 1,
        destWidth: posterWidth,
        destHeight: posterHeight,
        success: (result) => {
          resolve(result.tempFilePath)
        },
        fail: (error) => {
          reject(error instanceof Error ? error : new Error('Failed to export ritual poster'))
        }
      })
    })
  })
}

function parseMetricValue(value: string) {
  const normalizedValue = Number(value.replace('%', '').trim())

  return Number.isFinite(normalizedValue) ? normalizedValue : 0
}

function drawPoster(context: PosterCanvasContext) {
  const backgroundGradient = context.createLinearGradient(0, 0, 0, posterHeight)
  backgroundGradient.addColorStop(0, '#150d39')
  backgroundGradient.addColorStop(0.55, '#0a122b')
  backgroundGradient.addColorStop(1, '#050811')

  context.clearRect(0, 0, posterWidth, posterHeight)
  context.setFillStyle(backgroundGradient)
  context.fillRect(0, 0, posterWidth, posterHeight)

  drawGlowOrb(context, 776, 192, 126, '#7a61ff', 'rgba(122, 97, 255, 0.54)')
  drawGlowOrb(context, 172, 1260, 92, '#1be1ff', 'rgba(27, 225, 255, 0.32)')

  const panelGradient = context.createLinearGradient(60, 72, 900, 1488)
  panelGradient.addColorStop(0, 'rgba(18, 28, 61, 0.98)')
  panelGradient.addColorStop(0.7, 'rgba(9, 16, 36, 0.98)')
  panelGradient.addColorStop(1, 'rgba(5, 8, 17, 0.98)')

  fillRoundedRect(context, 60, 72, 840, 1416, 54, panelGradient)
  strokeRoundedRect(context, 60, 72, 840, 1416, 54, 'rgba(114, 140, 214, 0.38)', 2)

  context.setFillStyle('#1be1ff')
  context.setFontSize(32)
  context.fillText(cyberStatusCopy.posterEyebrow, 94, 138)

  drawBadgePill(context, displayBadge.value, 868, 104)

  const badgeGradient = context.createLinearGradient(94, 182, 250, 334)
  badgeGradient.addColorStop(0, 'rgba(122, 97, 255, 0.98)')
  badgeGradient.addColorStop(1, 'rgba(48, 239, 255, 0.18)')
  fillRoundedRect(context, 94, 182, 152, 152, 38, badgeGradient)
  context.setShadow(0, 0, 34, 'rgba(255, 211, 110, 0.44)')
  context.setFillStyle('#ffd36e')
  context.setFontSize(80)
  context.setTextAlign('center')
  context.fillText('祖', 170, 282)
  context.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)')
  context.setTextAlign('left')

  context.setFillStyle('#f6f7ff')
  context.setFontSize(74)
  const titleBottom = drawWrappedText(context, title.value, 94, 420, 772, 88, 2)

  context.setFillStyle('#ffe3a4')
  context.setFontSize(38)
  context.fillText(truncateText(context, ancestorName.value, 772), 94, titleBottom + 70)

  context.setFillStyle('#b6bedf')
  context.setFontSize(34)
  const messageBottom = drawWrappedText(context, message.value, 94, titleBottom + 146, 772, 54, 3)

  fillRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, 'rgba(48, 239, 255, 0.08)')
  strokeRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, 'rgba(48, 239, 255, 0.22)', 2)
  context.setFillStyle('#1be1ff')
  context.setFontSize(28)
  context.fillText('祖域传输通道已稳定，建议立即截图或单图转发。', 126, messageBottom + 117)

  const metricTop = messageBottom + 202
  drawMetricCard(context, 94, metricTop, 240, 214, incenseValue.value, '香火值', '#ffd36e')
  drawMetricCard(context, 360, metricTop, 240, 214, signalValue.value, '信号强度', '#1be1ff')
  drawMetricCard(context, 626, metricTop, 240, 214, ritualCount.value, '仪式动作', '#9f8cff')

  fillRoundedRect(context, 94, metricTop + 258, 772, 272, 38, 'rgba(255, 255, 255, 0.04)')
  strokeRoundedRect(context, 94, metricTop + 258, 772, 272, 38, 'rgba(255, 255, 255, 0.08)', 2)
  context.setFillStyle('#7f89b3')
  context.setFontSize(26)
  context.fillText(cyberStatusCopy.posterMemoEyebrow, 126, metricTop + 318)
  context.setFillStyle('#f6f7ff')
  context.setFontSize(46)
  drawWrappedText(context, '不是传统纪念页，是一张够离谱、够亮、够想转发的赛博战报。', 126, metricTop + 388, 708, 62, 3)

  context.setStrokeStyle('rgba(48, 239, 255, 0.18)')
  context.setLineWidth(2)
  context.beginPath()
  context.moveTo(94, 1384)
  context.lineTo(866, 1384)
  context.stroke()

  context.setFillStyle('#b6bedf')
  context.setFontSize(30)
  context.fillText(cyberStatusCopy.posterSignature, 94, 1448)
  context.setFillStyle('#1be1ff')
  context.setFontSize(28)
  context.fillText('截图、转发、再来一次', 94, 1494)
}

function drawGlowOrb(
  context: PosterCanvasContext,
  x: number,
  y: number,
  radius: number,
  fillColor: string,
  shadowColor: string
) {
  context.setShadow(0, 0, radius * 0.72, shadowColor)
  context.setFillStyle(fillColor)
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
  context.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)')
}

function drawBadgePill(context: PosterCanvasContext, label: string, right: number, top: number) {
  context.setFontSize(26)
  const text = truncateText(context, label, 230)
  const width = Math.max(162, context.measureText(text).width + 42)
  const x = right - width

  fillRoundedRect(context, x, top, width, 54, 999, 'rgba(255, 211, 110, 0.14)')
  strokeRoundedRect(context, x, top, width, 54, 999, 'rgba(255, 211, 110, 0.22)', 2)
  context.setFillStyle('#ffd36e')
  context.fillText(text, x + 22, top + 35)
}

function drawMetricCard(
  context: PosterCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  label: string,
  accentColor: string
) {
  fillRoundedRect(context, x, y, width, height, 30, 'rgba(255, 255, 255, 0.04)')
  strokeRoundedRect(context, x, y, width, height, 30, 'rgba(255, 255, 255, 0.08)', 2)

  context.setFillStyle(accentColor)
  context.setFontSize(54)
  context.fillText(value, x + 28, y + 88)
  context.setFillStyle('#9ca4c8')
  context.setFontSize(26)
  context.fillText(label, x + 28, y + 140)
  context.setFillStyle('rgba(255, 255, 255, 0.08)')
  context.fillRect(x + 28, y + 168, width - 56, 10)
  context.setFillStyle(accentColor)
  context.fillRect(x + 28, y + 168, Math.max(64, width - 138), 10)
}

function drawWrappedText(
  context: PosterCanvasContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const lines = wrapText(context, text, maxWidth, maxLines)

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight)
  })

  return y + (lines.length - 1) * lineHeight
}

function wrapText(context: PosterCanvasContext, text: string, maxWidth: number, maxLines: number) {
  const characters = [...text]
  const lines: string[] = []
  let currentLine = ''

  characters.forEach((character) => {
    const nextLine = `${currentLine}${character}`

    if (currentLine.length > 0 && context.measureText(nextLine).width > maxWidth) {
      lines.push(currentLine)
      currentLine = character
      return
    }

    currentLine = nextLine
  })

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  if (lines.length <= maxLines) {
    return lines
  }

  const visibleLines = lines.slice(0, maxLines)
  visibleLines[maxLines - 1] = trimTextToWidth(context, visibleLines[maxLines - 1], maxWidth)
  return visibleLines
}

function truncateText(context: PosterCanvasContext, text: string, maxWidth: number) {
  if (context.measureText(text).width <= maxWidth) {
    return text
  }

  return trimTextToWidth(context, text, maxWidth)
}

function trimTextToWidth(context: PosterCanvasContext, text: string, maxWidth: number) {
  const ellipsis = '...'

  if (context.measureText(text).width <= maxWidth) {
    return text
  }

  let result = text

  while (result.length > 1 && context.measureText(`${result}${ellipsis}`).width > maxWidth) {
    result = result.slice(0, -1)
  }

  return `${result}${ellipsis}`
}

function fillRoundedRect(
  context: PosterCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | UniApp.CanvasGradient
) {
  roundedRectPath(context, x, y, width, height, radius)
  context.setFillStyle(fillStyle)
  context.fill()
}

function strokeRoundedRect(
  context: PosterCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  roundedRectPath(context, x, y, width, height, radius)
  context.setLineWidth(lineWidth)
  context.setStrokeStyle(strokeStyle)
  context.stroke()
}

function roundedRectPath(
  context: PosterCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2)

  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.lineTo(x + width - safeRadius, y)
  context.arcTo(x + width, y, x + width, y + safeRadius, safeRadius)
  context.lineTo(x + width, y + height - safeRadius)
  context.arcTo(x + width, y + height, x + width - safeRadius, y + height, safeRadius)
  context.lineTo(x + safeRadius, y + height)
  context.arcTo(x, y + height, x, y + height - safeRadius, safeRadius)
  context.lineTo(x, y + safeRadius)
  context.arcTo(x, y, x + safeRadius, y, safeRadius)
  context.closePath()
}
</script>

<template>
  <app-theme-page class="ritual-result-page ritual-result-page--cyber">
    <app-nav-bar title="结果页" subtitle="现在就截图，传播这个概念">
      <template #left>
        <view class="ritual-result-page__back" @click="goBack">
          <app-icon name="circle-chevron-left" size="34rpx" />
        </view>
      </template>
    </app-nav-bar>

    <view class="ritual-result-page__content">
      <view class="ritual-result-page__hero">
        <view class="ritual-result-page__tag-list">
          <app-tag variant="accent">{{ cyberStatusCopy.shareableResult }}</app-tag>
          <app-tag :variant="posterStatusVariant">{{ posterStatusLabel }}</app-tag>
          <app-tag :variant="localRecordStatusMeta.variant">{{ localRecordStatusMeta.label }}</app-tag>
        </view>
        <text class="ritual-result-page__title">{{ title }}</text>
        <text class="ritual-result-page__subtitle">
          这页不是完成提示，而是传播海报。让用户一眼看到发光灵牌、香火值、称号和一句洗脑文案。
        </text>
      </view>

      <app-share-poster
        :title="title"
        :badge="displayBadge"
        :ancestor-name="ancestorName"
        :incense-value="incenseValue"
        :signal-value="signalValue"
        :ritual-count="ritualCount"
        :message="message"
      />

      <view class="ritual-result-page__poster-panel">
        <view class="ritual-result-page__poster-heading">
          <text class="ritual-result-page__poster-label">传播海报</text>
          <text class="ritual-result-page__poster-state">
            {{ posterStatusLabel }}
          </text>
        </view>

        <view class="ritual-result-page__poster-preview">
          <image
            v-if="posterImageUrl"
            class="ritual-result-page__poster-image"
            :src="posterImageUrl"
            mode="widthFix"
          />

          <view v-else class="ritual-result-page__poster-placeholder">
            <view class="ritual-result-page__poster-placeholder-icon">
              <app-icon :name="posterStatus === 'generating' ? 'share-2' : 'sparkles'" size="44rpx" />
            </view>
            <text class="ritual-result-page__poster-placeholder-title">{{ posterPlaceholderTitle }}</text>
            <text class="ritual-result-page__poster-placeholder-copy">{{ posterPlaceholderCopy }}</text>
          </view>
        </view>

        <text class="ritual-result-page__poster-copy">{{ posterHint }}</text>
      </view>

      <view class="ritual-result-page__actions">
        <app-button block :disabled="isGeneratingPoster" @click="handleGeneratePoster">
          {{ posterPrimaryActionText }}
        </app-button>
        <app-button block variant="secondary" :disabled="isGeneratingPoster" @click="handlePosterAsset">
          {{ posterSecondaryActionText }}
        </app-button>
        <app-button block variant="secondary" @click="replayRitual">再祭一次</app-button>
        <app-button block variant="text" @click="openAncestorDomain">去看祖域</app-button>
      </view>
    </view>

    <canvas
      :style="{ width: `${posterWidth}px`, height: `${posterHeight}px` }"
      canvas-id="ritualPosterCanvas"
      id="ritualPosterCanvas"
      class="ritual-result-page__poster-canvas"
    />
  </app-theme-page>
</template>

<style scoped lang="scss">
.ritual-result-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg-page);
  overflow: hidden;
}

.ritual-result-page--cyber {
  --color-bg-page: var(--color-cyber-space);
  --color-bg-card: var(--color-cyber-surface);
  --color-bg-muted: var(--color-cyber-surface-soft);
  --color-primary: var(--color-cyber-violet-strong);
  --color-primary-pressed: var(--color-cyber-violet);
  --color-primary-soft: var(--color-cyber-violet-soft);
  --color-accent: var(--color-cyber-cyan);
  --color-accent-soft: var(--color-cyber-cyan-faint);
  --color-text-primary: var(--color-cyber-text-primary);
  --color-text-secondary: var(--color-cyber-text-secondary);
  --color-text-tertiary: var(--color-cyber-text-muted);
  --color-text-disabled: var(--color-cyber-text-disabled);
  --color-border: var(--color-cyber-border);
  --color-border-strong: var(--color-cyber-border-strong);
  --color-primary-border-soft: var(--color-cyber-violet-soft-strong);
  --color-overlay: var(--color-cyber-overlay);
  --shadow-card: var(--shadow-cyber-panel);
  --shadow-pop: var(--shadow-cyber-float);
}

.ritual-result-page--cyber::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 0%, var(--color-cyber-violet-soft-strong) 0%, transparent 28%),
    radial-gradient(circle at 84% 24%, var(--color-cyber-cyan-faint) 0%, transparent 18%),
    radial-gradient(circle at 10% 82%, var(--color-cyber-hot-soft) 0%, transparent 18%),
    var(--gradient-cyber-page);
  pointer-events: none;
}

.ritual-result-page--cyber::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--overlay-cyber-grid);
  background-size: 48rpx 48rpx;
  opacity: 0.1;
  pointer-events: none;
}

.ritual-result-page--cyber :deep(.app-nav-bar) {
  background: var(--gradient-cyber-nav);
  border-color: var(--color-cyber-border);
}

.ritual-result-page__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border: 2rpx solid var(--color-cyber-cyan-faint);
  border-radius: 24rpx;
  background: var(--color-cyber-cyan-trace);
  color: var(--color-cyber-cyan);
}

.ritual-result-page__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 20rpx 24rpx 40rpx;
}

.ritual-result-page__hero,
.ritual-result-page__actions,
.ritual-result-page__poster-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 28rpx;
  border: 2rpx solid var(--color-cyber-border);
  border-radius: var(--radius-cyber-panel);
  background:
    radial-gradient(circle at top right, var(--color-cyber-cyan-trace) 0%, transparent 18%),
    var(--gradient-cyber-panel);
  box-shadow: var(--shadow-card);
}

.ritual-result-page__hero::before,
.ritual-result-page__actions::before,
.ritual-result-page__poster-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 28rpx;
  right: 28rpx;
  height: 2rpx;
  background: var(--gradient-cyber-highlight);
  pointer-events: none;
}

.ritual-result-page__tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.ritual-result-page__title {
  max-width: 620rpx;
  font-size: 50rpx;
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: 1rpx;
  color: var(--color-text-primary);
  text-shadow: 0 0 32rpx var(--color-cyber-violet-shadow);
}

.ritual-result-page__subtitle {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--color-text-secondary);
}

.ritual-result-page__poster-panel {
  gap: 18rpx;
}

.ritual-result-page__poster-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.ritual-result-page__poster-label,
.ritual-result-page__poster-state {
  font-size: 20rpx;
  letter-spacing: 3rpx;
}

.ritual-result-page__poster-label {
  color: var(--color-cyber-cyan);
}

.ritual-result-page__poster-state {
  color: var(--color-cyber-gold);
}

.ritual-result-page__poster-preview {
  overflow: hidden;
  border-radius: 30rpx;
  border: 2rpx solid var(--color-cyber-white-soft);
  background:
    radial-gradient(circle at top, var(--color-cyber-violet-soft-strong) 0%, transparent 48%),
    var(--gradient-cyber-nav-strong);
  box-shadow: var(--shadow-cyber-inset);
}

.ritual-result-page__poster-image {
  display: block;
  width: 100%;
}

.ritual-result-page__poster-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  min-height: 540rpx;
  padding: 48rpx;
  text-align: center;
}

.ritual-result-page__poster-placeholder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 108rpx;
  height: 108rpx;
  border-radius: 30rpx;
  background: var(--color-cyber-cyan-faint);
  color: var(--color-cyber-cyan);
  box-shadow: 0 0 60rpx var(--color-cyber-cyan-glow);
}

.ritual-result-page__poster-placeholder-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}

.ritual-result-page__poster-placeholder-copy,
.ritual-result-page__poster-copy {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--color-text-secondary);
}

.ritual-result-page__actions {
  gap: 14rpx;
}

.ritual-result-page__poster-canvas {
  position: fixed;
  top: -4000px;
  left: -4000px;
  opacity: 0;
  pointer-events: none;
}
</style>
