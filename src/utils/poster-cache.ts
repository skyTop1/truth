const LOCAL_POSTER_IMAGE_PREFIXES = ['wxfile://', 'file://', '_doc/', '_downloads/', 'tmp/', '/tmp/'] as const
const LOCAL_TEMP_HTTP_PREFIXES = ['http://tmp/', 'https://tmp/'] as const
const BLOCKED_POSTER_IMAGE_PREFIXES = ['data:', 'blob:', 'javascript:', 'http://', 'https://', '//'] as const

export function normalizePersistablePosterImageUrl(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  const imageUrl = value.trim()

  if (imageUrl.length === 0) {
    return ''
  }

  const normalizedImageUrl = imageUrl.toLowerCase()

  if (LOCAL_TEMP_HTTP_PREFIXES.some((prefix) => normalizedImageUrl.startsWith(prefix))) {
    return imageUrl
  }

  if (BLOCKED_POSTER_IMAGE_PREFIXES.some((prefix) => normalizedImageUrl.startsWith(prefix))) {
    return ''
  }

  return LOCAL_POSTER_IMAGE_PREFIXES.some((prefix) => normalizedImageUrl.startsWith(prefix)) ? imageUrl : ''
}
