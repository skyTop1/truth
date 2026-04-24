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
    return false
  }

  try {
    uni.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error(`[local-storage] failed to write key: ${key}`, error)
    return false
  }
}

export function removeLocalCache(key: string) {
  if (typeof uni === 'undefined' || typeof uni.removeStorageSync !== 'function') {
    return false
  }

  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.error(`[local-storage] failed to remove key: ${key}`, error)
    return false
  }
}
