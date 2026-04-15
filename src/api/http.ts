// Local-first placeholder only.
// This project currently does not allow remote API access unless that product decision changes.
export interface HttpRequestOptions extends Omit<UniApp.RequestOptions, 'url' | 'success' | 'fail'> {
  url: string
}

const BASE_URL = ''
export const REMOTE_API_ENABLED = false

function toRequestError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'errMsg' in error &&
    typeof error.errMsg === 'string'
  ) {
    return new Error(error.errMsg)
  }

  return new Error(fallbackMessage)
}

export function http<T>(options: HttpRequestOptions) {
  if (!REMOTE_API_ENABLED) {
    return Promise.reject<T>(
      new Error(`Remote API is disabled in this local-first build: ${options.url}. Review product rules before enabling.`)
    )
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      url: options.url.startsWith('http') ? options.url : `${BASE_URL}${options.url}`,
      success: (response) => {
        const { statusCode, data } = response

        if (statusCode >= 200 && statusCode < 300) {
          resolve(data as T)
          return
        }

        reject(new Error(`Request failed with status ${statusCode}`))
      },
      fail: (error) => {
        reject(toRequestError(error, 'Request failed'))
      }
    })
  })
}
