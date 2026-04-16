export type UniPageOptions = Record<string, string | undefined>

type UniPageWithOptions = {
  options?: UniPageOptions
  $page?: {
    options?: UniPageOptions
  }
}

export function getCurrentPageOptions() {
  if (typeof getCurrentPages !== 'function') {
    return undefined
  }

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as UniPageWithOptions | undefined

  return currentPage?.options ?? currentPage?.$page?.options
}
