export function readLocalCache<T>(key: string, fallbackValue: T) {
  if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') {
    return fallbackValue
  }

  try {
    const cachedValue: unknown = uni.getStorageSync(key)

    if (cachedValue === '' || typeof cachedValue === 'undefined') {
      return fallbackValue
    }

    return cachedValue as T
  } catch (error) {
    console.error(`[local-storage] failed to read key: ${key}`, error)
    return fallbackValue
  }
}

export function writeLocalCache<T>(key: string, value: T) {
  if (typeof uni === 'undefined' || typeof uni.setStorageSync !== 'function') {
    return
  }

  try {
    uni.setStorageSync(key, value)
  } catch (error) {
    console.error(`[local-storage] failed to write key: ${key}`, error)
  }
}

export function removeLocalCache(key: string) {
  if (typeof uni === 'undefined' || typeof uni.removeStorageSync !== 'function') {
    return
  }

  try {
    uni.removeStorageSync(key)
  } catch (error) {
    console.error(`[local-storage] failed to remove key: ${key}`, error)
  }
}
