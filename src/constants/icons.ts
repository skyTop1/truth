export type AppIconNode =
  | {
      tag: 'path'
      d: string
      fill?: string
      stroke?: string
    }
  | {
      tag: 'rect'
      x: number
      y: number
      width: number
      height: number
      rx?: number
      fill?: string
      stroke?: string
    }
  | {
      tag: 'circle'
      cx: number
      cy: number
      r: number
      fill?: string
      stroke?: string
    }

export interface AppIconDefinition {
  viewBox: string
  strokeWidth?: number
  nodes: AppIconNode[]
}

export const appIcons = {
  'layout-dashboard': {
    viewBox: '0 0 24 24',
    nodes: [
      { tag: 'rect', x: 3, y: 3, width: 7, height: 9, rx: 1 },
      { tag: 'rect', x: 14, y: 3, width: 7, height: 5, rx: 1 },
      { tag: 'rect', x: 14, y: 12, width: 7, height: 9, rx: 1 },
      { tag: 'rect', x: 3, y: 16, width: 7, height: 5, rx: 1 }
    ]
  },
  boxes: {
    viewBox: '0 0 24 24',
    nodes: [
      {
        tag: 'path',
        d: 'M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z'
      },
      { tag: 'path', d: 'm7 16.5-4.74-2.85' },
      { tag: 'path', d: 'm7 16.5 5-3' },
      { tag: 'path', d: 'M7 16.5v5.17' },
      {
        tag: 'path',
        d: 'M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z'
      },
      { tag: 'path', d: 'm17 16.5-5-3' },
      { tag: 'path', d: 'm17 16.5 4.74-2.85' },
      { tag: 'path', d: 'M17 16.5v5.17' },
      {
        tag: 'path',
        d: 'M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z'
      },
      { tag: 'path', d: 'M12 8 7.26 5.15' },
      { tag: 'path', d: 'm12 8 4.74-2.85' },
      { tag: 'path', d: 'M12 13.5V8' }
    ]
  },
  'circle-chevron-left': {
    viewBox: '0 0 24 24',
    nodes: [
      { tag: 'circle', cx: 12, cy: 12, r: 10 },
      { tag: 'path', d: 'm14 16-4-4 4-4' }
    ]
  },
  sparkles: {
    viewBox: '0 0 24 24',
    nodes: [
      { tag: 'path', d: 'M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z' },
      { tag: 'path', d: 'M5 3v3' },
      { tag: 'path', d: 'M3.5 4.5h3' },
      { tag: 'path', d: 'M19 17v4' },
      { tag: 'path', d: 'M17 19h4' }
    ]
  },
  flame: {
    viewBox: '0 0 24 24',
    nodes: [
      {
        tag: 'path',
        d: 'M12 2c.7 3 3.5 4.4 3.5 7.7 0 2.8-1.9 4.3-3.5 5.6-1.6-1.3-3.5-2.8-3.5-5.6C8.5 6.4 11.3 5 12 2Z'
      },
      { tag: 'path', d: 'M12 10c.6 1 1.5 1.6 1.5 3a1.5 1.5 0 1 1-3 0c0-1.4.9-2 1.5-3Z' }
    ]
  },
  'share-2': {
    viewBox: '0 0 24 24',
    nodes: [
      { tag: 'circle', cx: 18, cy: 5, r: 3 },
      { tag: 'circle', cx: 6, cy: 12, r: 3 },
      { tag: 'circle', cx: 18, cy: 19, r: 3 },
      { tag: 'path', d: 'm8.6 13.5 6.8 3.9' },
      { tag: 'path', d: 'm15.4 6.6-6.8 3.8' }
    ]
  },
  palette: {
    viewBox: '0 0 24 24',
    nodes: [
      {
        tag: 'path',
        d: 'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z'
      },
      { tag: 'circle', cx: 13.5, cy: 6.5, r: 0.5, fill: 'currentColor', stroke: 'none' },
      { tag: 'circle', cx: 17.5, cy: 10.5, r: 0.5, fill: 'currentColor', stroke: 'none' },
      { tag: 'circle', cx: 6.5, cy: 12.5, r: 0.5, fill: 'currentColor', stroke: 'none' },
      { tag: 'circle', cx: 8.5, cy: 7.5, r: 0.5, fill: 'currentColor', stroke: 'none' }
    ]
  },
  'package-open': {
    viewBox: '0 0 24 24',
    nodes: [
      { tag: 'path', d: 'M12 22v-9' },
      {
        tag: 'path',
        d: 'M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z'
      },
      {
        tag: 'path',
        d: 'M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13'
      },
      {
        tag: 'path',
        d: 'M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z'
      }
    ]
  }
} as const satisfies Record<string, AppIconDefinition>

export type AppIconName = keyof typeof appIcons
