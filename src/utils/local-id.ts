export function createLocalId(prefix: string) {
  const timestamp = Date.now().toString(36)
  const randomValue = Math.random().toString(36).slice(2, 8)

  return `${prefix}-${timestamp}-${randomValue}`
}
