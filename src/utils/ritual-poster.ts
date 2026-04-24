import { cyberStatusCopy } from '@/constants/status'
import type { themePosterPalettes } from '@/constants/theme'

type PosterPalette = (typeof themePosterPalettes)[keyof typeof themePosterPalettes]

export interface RitualPosterPayload {
  title: string
  displayBadge: string
  ancestorName: string
  message: string
  incenseValue: string
  signalValue: string
  ritualCount: string
  palette: PosterPalette
}

export interface RitualPosterSize {
  width: number
  height: number
}

export function drawRitualPoster(context: CanvasRenderingContext2D, payload: RitualPosterPayload, size: RitualPosterSize) {
  const { palette } = payload

  context.fillStyle = palette.title
  context.font = '74px sans-serif'
  const titleLines = wrapText(context, payload.title, 772, 2)
  const titleBottom = 420 + (titleLines.length - 1) * 88

  context.fillStyle = palette.bodyText
  context.font = '34px sans-serif'
  const messageLines = wrapText(context, payload.message, 772, 3)
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

  const backgroundGradient = context.createLinearGradient(0, 0, 0, size.height)
  backgroundGradient.addColorStop(0, palette.backgroundTop)
  backgroundGradient.addColorStop(0.55, palette.backgroundMid)
  backgroundGradient.addColorStop(1, palette.backgroundBottom)

  context.clearRect(0, 0, size.width, size.height)
  context.fillStyle = backgroundGradient
  context.fillRect(0, 0, size.width, size.height)

  drawGlowOrb(context, 776, 192, 126, palette.glowPrimaryFill, palette.glowPrimaryShadow)
  drawGlowOrb(context, 172, Math.min(1260, panelBottom - 92), 92, palette.glowSecondaryFill, palette.glowSecondaryShadow)

  const panelGradient = context.createLinearGradient(60, 72, 900, panelBottom)
  panelGradient.addColorStop(0, palette.panelTop)
  panelGradient.addColorStop(0.7, palette.panelBottom)
  panelGradient.addColorStop(1, palette.panelBottom)

  fillRoundedRect(context, 60, 72, 840, panelHeight, 54, panelGradient)
  strokeRoundedRect(context, 60, 72, 840, panelHeight, 54, palette.panelBorder, 2)

  context.fillStyle = palette.eyebrow
  context.font = '32px sans-serif'
  context.fillText(cyberStatusCopy.posterEyebrow, 94, 138)

  drawBadgePill(context, payload.displayBadge, 868, 104, palette)

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
  drawWrappedText(context, payload.title, 94, 420, 772, 88, 2)

  context.fillStyle = palette.ancestor
  context.font = '38px sans-serif'
  context.fillText(truncateText(context, payload.ancestorName, 772), 94, titleBottom + 70)

  context.fillStyle = palette.bodyText
  context.font = '34px sans-serif'
  drawWrappedText(context, payload.message, 94, titleBottom + 146, 772, 54, 3)

  fillRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, palette.hintBackground)
  strokeRoundedRect(context, 94, messageBottom + 60, 772, 94, 30, palette.hintBorder, 2)
  context.fillStyle = palette.hintText
  context.font = '28px sans-serif'
  context.fillText('祖域传输通道已稳定，建议立即截图或单图转发。', 126, messageBottom + 117)

  drawMetricCard(context, 94, metricTop, 240, 214, payload.incenseValue, '香火值', palette.metricPrimary, palette)
  drawMetricCard(context, 360, metricTop, 240, 214, payload.signalValue, '信号强度', palette.metricSecondary, palette)
  drawMetricCard(context, 626, metricTop, 240, 214, payload.ritualCount, '仪式动作', palette.metricTertiary, palette)

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

function drawBadgePill(context: CanvasRenderingContext2D, label: string, right: number, top: number, palette: PosterPalette) {
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
  palette: PosterPalette
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

function roundedRectPath(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
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
