export type UniPageOptions = Record<string, string | undefined>

type UniShareContent = {
  title?: string
  path?: string
  imageUrl?: string
}

type UniPageWithOptions = {
  options?: UniPageOptions
  $page?: {
    options?: UniPageOptions
  }
}

type UniPageRuntime = typeof globalThis & {
  onShareAppMessage?: (hook: (_options: unknown) => UniShareContent) => void
}

export function getCurrentPageOptions() {
  if (typeof getCurrentPages !== 'function') {
    return undefined
  }

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as UniPageWithOptions | undefined

  return currentPage?.options ?? currentPage?.$page?.options
}

export function registerShareAppMessage(hook: (_options: unknown) => UniShareContent) {
  const runtime = globalThis as UniPageRuntime
  runtime.onShareAppMessage?.(hook)
}
