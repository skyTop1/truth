export const HOME_PAGE_PATH = '/pages/index/index'
export const WORKBENCH_PAGE_PATH = '/pages/workbench/index'
export const THEME_PREVIEW_PAGE_PATH = '/pages-sub/system/theme-preview'
export const RITUAL_ENTRY_PAGE_PATH = '/pages-sub/cyber/ritual-entry'
export const RITUAL_RESULT_PAGE_PATH = '/pages-sub/cyber/ritual-result'

type RouteQueryValue = string | number | boolean | null | undefined

export interface RitualEntryRouteParams {
  ancestorName?: string
  message?: string
  selectedActionKeys?: string[]
}

export interface RitualResultRouteParams {
  ritualId: string
  ancestorName: string
  incenseValue: string | number
  signalValue: string | number
  ritualCount: string | number
  selectedActionKeys: string[]
  badge: string
  message: string
  title: string
}

function buildRouteUrl(path: string, query: Record<string, RouteQueryValue>) {
  const queryString = Object.entries(query)
    .filter(([, value]) => value !== null && typeof value !== 'undefined' && `${value}`.length > 0)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`)
    .join('&')

  return queryString.length > 0 ? `${path}?${queryString}` : path
}

export function buildRitualEntryUrl(params: RitualEntryRouteParams = {}) {
  return buildRouteUrl(RITUAL_ENTRY_PAGE_PATH, {
    ancestor: params.ancestorName,
    message: params.message,
    selected: params.selectedActionKeys?.join(',')
  })
}

export function buildRitualResultUrl(params: RitualResultRouteParams) {
  return buildRouteUrl(RITUAL_RESULT_PAGE_PATH, {
    ritualId: params.ritualId,
    ancestor: params.ancestorName,
    incense: params.incenseValue,
    signal: params.signalValue,
    actions: params.ritualCount,
    selected: params.selectedActionKeys.join(','),
    badge: params.badge,
    message: params.message,
    title: params.title
  })
}

export function decodeRouteParam(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function parseRouteListParam(value: string) {
  return decodeRouteParam(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}
