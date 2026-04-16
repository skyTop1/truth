<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'

import AppButton from '@/components/app/AppButton.vue'
import AppIcon from '@/components/app/AppIcon.vue'
import AppNavBar from '@/components/app/AppNavBar.vue'
import AppSharePoster from '@/components/app/AppSharePoster.vue'
import AppTag from '@/components/app/AppTag.vue'
import { useTheme } from '@/composables/useTheme'
import {
  cyberStatusCopy,
  formatRitualBadgeLabel,
  getLocalRecordStatusMeta,
  getPosterStatusMeta
} from '@/constants/status'
import { themePosterPalettes } from '@/constants/theme'
import { useRitualStore } from '@/stores'
import { createLocalId } from '@/utils/local-id'
import { getCurrentPageOptions } from '@/utils/uni-page'

import type { PosterStatus } from '@/types/status'

defineOptions({
  name: 'CyberRitualResultPage'
})

const posterCanvasId = 'ritualPosterCanvas'
const posterWidth = 960
const posterHeight = 1580

const ritualStore = useRitualStore()
const { themePreset } = useTheme()

let posterSecondaryActionText = '保存海报到相册'
// #ifdef H5
posterSecondaryActionText = '预览分享图'
// #endif

const ritualId = ref(createLocalId('ritual'))
const title = ref('今日赛博祭祖已完成')
const badge = ref('祖域接入员')
const ancestorName = ref('太爷爷')
const incenseValue = ref('0')
const signalValue = ref('0%')
const ritualCount = ref('0')
const message = ref('你向祖域上传了一次心意，祖先信号节点已被点亮。')
const actionKeys = ref<string[]>([])
const isGeneratingPoster = ref(false)
const posterImageUrl = ref<string>('')
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

  if (posterImageUrl.value?.length > 0) {
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

const activePosterPalette = computed(() => {
  return themePosterPalettes[themePreset.value]
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

  if (posterStatus.value === 'ready' && posterImageUrl.value?.length > 0) {
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

  if (posterImageUrl.value?.length > 0) {
    return
  }

  void generatePoster(true)
})

onShareAppMessage(() => {
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

    const renderedUrl = await renderPosterImage()

    if (!renderedUrl) {
      throw new Error('祖域图像引擎未能输出图片，请稍后重试。')
    }

    posterImageUrl.value = renderedUrl ?? ''
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

  if (!posterImageUrl.value?.length) {
    await generatePoster(true)
  }

  if (!posterImageUrl.value?.length) {
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

  if (cachedImageUrl?.length > 0) {
    posterImageUrl.value = cachedImageUrl ?? ''
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

function getPosterCanvasNode(): Promise<HTMLCanvasElement> {
  // #ifdef H5
  return new Promise<HTMLCanvasElement>((resolve) => {
    // H5 使用离屏 canvas，不依赖 DOM 中的 <canvas> 元素
    // 避免屏幕外 canvas 不渲染导致 toDataURL 导出空白
    const canvas = document.createElement('canvas')
    canvas.width = posterWidth
    canvas.height = posterHeight
    resolve(canvas)
  })
  // #endif

  // #ifndef H5
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    // @dcloudio/types 尚未完整定义 Canvas 2D node 查询，此处需类型桥接
    const query = uni.createSelectorQuery() as unknown as {
      select: (selector: string) => { node: () => { exec: (callback: (res: { node: HTMLCanvasElement }[]) => void) => void } }
    }
    query
      .select(`#${posterCanvasId}`)
      .node()
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          reject(new Error('Failed to get poster canvas node'))
          return
        }
        const canvas = res[0].node
        canvas.width = posterWidth
        canvas.height = posterHeight
        resolve(canvas)
      })
  })
  // #endif
}

async function renderPosterImage(): Promise<string> {
  const canvas = await getPosterCanvasNode()
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Failed to get 2d context from poster canvas')
  }

  drawPoster(context)

  // #ifdef H5
  return canvas.toDataURL('image/png')
  // #endif

  // #ifndef H5
  return new Promise<string>((resolve, reject) => {
    const options: Record<string, unknown> = {
      canvas,
      fileType: 'png',
      quality: 1,
      destWidth: posterWidth,
      destHeight: posterHeight,
      success: (result: { tempFilePath: string }) => {
        const tempFilePath = result?.tempFilePath

        if (typeof tempFilePath === 'string' && tempFilePath.length > 0) {
          resolve(tempFilePath)
          return
        }

        reject(new Error('Canvas export returned empty path'))
      },
      fail: (error: unknown) => {
        reject(error instanceof Error ? error : new Error('Failed to export ritual poster'))
      }
    }
    void uni.canvasToTempFilePath(options as unknown as UniApp.CanvasToTempFilePathOptions)
  })
  // #endif
}

function parseMetricValue(value: string) {
  const normalizedValue = Number(value.replace('%', '').trim())

  return Number.isFinite(normalizedValue) ? normalizedValue : 0
}

function drawPoster(context: CanvasRenderingContext2D) {
  const palette = activePosterPalette.value

  /* ── Pass 1: measure dynamic Y positions (no drawing) ── */
  context.fillStyle = palette.title
  context.font = '74px sans-serif'
  const titleLines = wrapText(context, title.value, 772, 2)
  const titleBottom = 420 + (titleLines.length - 1) * 88

  context.fillStyle = palette.bodyText
  context.font = '34px sans-serif'
  const messageLines = wrapText(context, message.value, 772, 3)
  const messageBottom = titleBottom + 146 + (messageLines.length - 1) * 54

  const metricTop = messageBottom + 202
  const memoTop = metricTop + 258

  context.fillStyle = palette.title
  context.font = '46px sans-serif'
  const memoLines = wrapText(context, '不是传统纪念页，是一张够离谱、够亮、够想转发的赛博战报。', 708, 3)
  const memoTextBottom = memoTop + 130 + (memoLines.length - 1) * 62

  const footerTop = Math.max(memoTop + 272 + 60, memoTextBottom + 60)
  const panelBottom = footerTop + 164
  const panelHeight = panelBottom - 72

  /* ── Pass 2: draw background & panel ── */
  const backgroundGradient = context.createLinearGradient(0, 0, 0, posterHeight)
  backgroundGradient.addColorStop(0, palette.backgroundTop)
  backgroundGradient.addColorStop(0.55, palette.backgroundMid)
  backgroundGradient.addColorStop(1, palette.backgroundBottom)

  context.clearRect(0, 0, posterWidth, posterHeight)
  context.fillStyle = backgroundGradient
  context.fillRect(0, 0, posterWidth, posterHeight)

  drawGlowOrb(context, 776, 192, 126, palette.glowPrimaryFill, palette.glowPrimaryShadow)
  drawGlowOrb(context, 172, Math.min(1260, panelBottom - 92), 92, palette.glowSecondaryFill, palette.glowSecondaryShadow)

  const panelGradient = context.createLinearGradient(60, 72, 900, panelBottom)
  panelGradient.addColorStop(0, palette.panelTop)
  panelGradient.addColorStop(0.7, palette.panelBottom)
  panelGradient.addColorStop(1, palette.panelBottom)

  fillRoundedRect(context, 60, 72, 840, panelHeight, 54, panelGradient)
  strokeRoundedRect(context, 60, 72, 840, panelHeight, 54, palette.panelBorder, 2)

  /* ── Pass 3: draw content inside panel ── */
  context.fillStyle = palette.eyebrow
  context.font = '32px sans-serif'
  context.fillText(cyberStatusCopy.posterEyebrow, 94, 138)

  drawBadgePill(context, displayBadge.value, 868, 104, palette)

  const badgeGradient = context.createLinearGradient(94, 182, 250, 334)
  badgeGradient.addColorStop(0, palette.glyphStart)
  badgeGradient.addColorStop(1, palette.glyphEnd)
  fillRoundedRect(context, 94, 182, 152, 152, 38, badgeGradient)
  context.shadowBlur = 34
  context.shadowColor = palette.glowPrimaryShadow
  context.fillStyle = palette.glyphText
  context.font = '80px sans-serif'
  context.textAlign = 'center'
  context.fillText('祖', 170, 282)
  context.shadowBlur = 0
  context.shadowColor = 'rgba(0, 0, 0, 0)'
  context.textAlign = 'left'

  context.fillStyle = palette.title
  context.font = '74px sans-serif'
  drawWrappedText(context, title.value, 94, 420, 772, 88, 2)

  context.fillStyle = palette.ancestor
  context.font = '38px sans-serif'
  context.fillText(truncateText(context, ancestorName.value, 772), 94, titleBottom + 70)

  context.fillStyle = palette.bodyText
  context.font = '34px sans-serif'
  drawWrappedText(context, message.value, 94, titleBottom + 146, 772, 54, 3)

  fillRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, palette.hintBackground)
  strokeRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, palette.hintBorder, 2)
  context.fillStyle = palette.hintText
  context.font = '28px sans-serif'
  context.fillText('祖域传输通道已稳定，建议立即截图或单图转发。', 126, messageBottom + 117)

  drawMetricCard(context, 94, metricTop, 240, 214, incenseValue.value, '香火值', palette.metricPrimary, palette)
  drawMetricCard(context, 360, metricTop, 240, 214, signalValue.value, '信号强度', palette.metricSecondary, palette)
  drawMetricCard(context, 626, metricTop, 240, 214, ritualCount.value, '仪式动作', palette.metricTertiary, palette)

  fillRoundedRect(context, 94, memoTop, 772, 272, 38, palette.metricCardBackground)
  strokeRoundedRect(context, 94, memoTop, 772, 272, 38, palette.metricCardBorder, 2)
  context.fillStyle = palette.memoEyebrow
  context.font = '26px sans-serif'
  context.fillText(cyberStatusCopy.posterMemoEyebrow, 126, memoTop + 60)
  context.fillStyle = palette.title
  context.font = '46px sans-serif'
  drawWrappedText(context, '不是传统纪念页，是一张够离谱、够亮、够想转发的赛博战报。', 126, memoTop + 130, 708, 62, 3)

  context.strokeStyle = palette.divider
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(94, footerTop)
  context.lineTo(866, footerTop)
  context.stroke()

  context.fillStyle = palette.signature
  context.font = '30px sans-serif'
  context.fillText(cyberStatusCopy.posterSignature, 94, footerTop + 64)
  context.fillStyle = palette.action
  context.font = '28px sans-serif'
  context.fillText('截图、转发、再来一次', 94, footerTop + 110)
}

function drawGlowOrb(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fillColor: string,
  shadowColor: string
) {
  context.shadowBlur = radius * 0.72
  context.shadowColor = shadowColor
  context.fillStyle = fillColor
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
  context.shadowBlur = 0
  context.shadowColor = 'rgba(0, 0, 0, 0)'
}

function drawBadgePill(
  context: CanvasRenderingContext2D,
  label: string,
  right: number,
  top: number,
  palette: (typeof themePosterPalettes)[keyof typeof themePosterPalettes]
) {
  context.font = '26px sans-serif'
  const text = truncateText(context, label, 230)
  const width = Math.max(162, context.measureText(text).width + 42)
  const x = right - width

  fillRoundedRect(context, x, top, width, 54, 999, palette.badgeBackground)
  strokeRoundedRect(context, x, top, width, 54, 999, palette.badgeBorder, 2)
  context.fillStyle = palette.badgeText
  context.fillText(text, x + 22, top + 35)
}

function drawMetricCard(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  label: string,
  accentColor: string,
  palette: (typeof themePosterPalettes)[keyof typeof themePosterPalettes]
) {
  fillRoundedRect(context, x, y, width, height, 30, palette.metricCardBackground)
  strokeRoundedRect(context, x, y, width, height, 30, palette.metricCardBorder, 2)

  context.fillStyle = accentColor
  context.font = '54px sans-serif'
  context.fillText(value, x + 28, y + 88)
  context.fillStyle = palette.metricLabel
  context.font = '26px sans-serif'
  context.fillText(label, x + 28, y + 140)
  context.fillStyle = palette.metricCardBorder
  context.fillRect(x + 28, y + 168, width - 56, 10)
  context.fillStyle = accentColor
  context.fillRect(x + 28, y + 168, Math.max(64, width - 138), 10)
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
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

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
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

function truncateText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (context.measureText(text).width <= maxWidth) {
    return text
  }

  return trimTextToWidth(context, text, maxWidth)
}

function trimTextToWidth(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
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
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  roundedRectPath(context, x, y, width, height, radius)
  context.fillStyle = fillStyle
  context.fill()
}

function strokeRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  roundedRectPath(context, x, y, width, height, radius)
  context.lineWidth = lineWidth
  context.strokeStyle = strokeStyle
  context.stroke()
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
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
  <app-theme-page class="ritual-result-page">
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
      type="2d"
      id="ritualPosterCanvas"
      :style="{ width: `${posterWidth}px`, height: `${posterHeight}px` }"
      class="ritual-result-page__poster-canvas"
    />
  </app-theme-page>
</template>

<style scoped lang="scss">
.ritual-result-page {
  position: relative;
  min-height: 100vh;
  background: var(--scene-space);
  overflow: hidden;
}

.ritual-result-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--color-primary-light-2) 0, transparent 34%),
    linear-gradient(180deg, var(--color-primary-light-1) 0, transparent 260rpx);
  pointer-events: none;
}

.ritual-result-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at left 18%, var(--color-link-light-1) 0, transparent 26%);
  opacity: 0.72;
  pointer-events: none;
}

:deep(.app-nav-bar) {
  background: var(--scene-nav);
  border-color: var(--scene-border-1);
}

.ritual-result-page__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border: 2rpx solid var(--color-link-light-3);
  border-radius: 24rpx;
  background: var(--color-link-light-1);
  color: var(--link-6);
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
  border: 2rpx solid var(--scene-border-1);
  border-radius: var(--border-radius-xlarge);
  background: var(--scene-panel);
  box-shadow: var(--scene-shadow-panel);
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
  color: var(--scene-text-1);
  text-shadow: 0 0 32rpx var(--color-primary-light-3);
}

.ritual-result-page__subtitle {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--scene-text-2);
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
  color: var(--link-6);
}

.ritual-result-page__poster-state {
  color: var(--primary-6);
}

.ritual-result-page__poster-preview {
  overflow: hidden;
  border-radius: 30rpx;
  border: 2rpx solid var(--color-primary-light-2);
  background: var(--scene-nav-soft);
  box-shadow: var(--scene-shadow-inset);
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
  background: var(--color-link-light-1);
  color: var(--link-6);
  box-shadow: 0 0 60rpx var(--color-link-light-2);
}

.ritual-result-page__poster-placeholder-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--scene-text-1);
}

.ritual-result-page__poster-placeholder-copy,
.ritual-result-page__poster-copy {
  font-size: 23rpx;
  line-height: 1.82;
  color: var(--scene-text-2);
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
