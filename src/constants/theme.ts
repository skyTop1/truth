import type { ThemeMode, ThemePreset, ThemePresetId, ThemeTokenGroup } from '@/types/theme'

export const stackHighlights = [
  'uni-app',
  'Vue 3',
  'TypeScript',
  'Vite',
  'Pinia',
  'uni-ui'
]

export const cyberThemeHighlights = [
  '量子祠堂',
  '祖域接入',
  '全息灵牌',
  '赛博供品',
  '家谱星链'
]

export const themeTokenGroups: ThemeTokenGroup[] = [
  {
    title: 'Arco 核心色阶',
    description: '核心色直接按 Arco 的 1-10 色阶组织，组件态从正式 token 派生，不再经过额外前缀层。',
    tokens: [
      { label: '主色 6', name: '--primary-6', value: '#355A76', usage: '主按钮 / 主链接' },
      { label: '主色 7', name: '--primary-7', value: '#244A6C', usage: '按下态 / 强强调' },
      { label: '主色浅底', name: '--color-primary-light-1', value: '#E8F9FF', usage: '主色弱背景' },
      { label: '链接 6', name: '--link-6', value: '#587D76', usage: '次级高亮 / 数据强调' }
    ]
  },
  {
    title: 'Arco 中性层级',
    description: '中性色和背景层改为 Arco 正式 token：文字、背景、边框都从 neutral / bg / border 体系取值。',
    tokens: [
      { label: '主文字', name: '--color-text-1', value: '#1D2129', usage: '标题 / 主正文' },
      { label: '次文字', name: '--color-text-2', value: '#4E5969', usage: '说明 / 辅助文案' },
      { label: '页面背景', name: '--color-bg-1', value: '#F7F8FA', usage: '页面根背景' },
      { label: '卡片背景', name: '--color-bg-2', value: '#FFFFFF', usage: '卡片 / 面板' },
      { label: '默认边框', name: '--color-border-2', value: '#E5E6EB', usage: '边框 / 分割线' }
    ]
  },
  {
    title: 'Arco 语义状态',
    description: '成功、警示、风险统一回到 Arco 语义色阶，并通过 light token 派生弱背景。',
    tokens: [
      { label: '成功 6', name: '--success-6', value: '#4B7F67', usage: '成功 / 完成' },
      { label: '警示 6', name: '--warning-6', value: '#B58A47', usage: '待处理 / 提醒' },
      { label: '风险 6', name: '--danger-6', value: '#B85B5B', usage: '删除 / 错误' },
      { label: '成功浅底', name: '--color-success-light-1', value: '#E8FFF0', usage: '状态弱背景' }
    ]
  },
  {
    title: 'Scene 扩展',
    description: '业务页仍保留 scene 扩展层，专门服务赛博祭台场景，但它只挂在 Arco 正式 token 之外。',
    tokens: [
      { label: '场景主轴', name: '--scene-primary-6', value: '#837680', usage: '首页赛博主轴 / 深层点缀' },
      { label: '场景辅助', name: '--scene-accent-6', value: '#546A6F', usage: '辅助信息 / 线框' },
      { label: '场景高亮', name: '--scene-warning-6', value: '#A88552', usage: '仪式高亮 / 徽标' },
      { label: '场景面板', name: '--scene-panel', value: 'rgba(255, 252, 247, 0.92)', usage: '赛博面板背景' }
    ]
  }
]

export const cyberThemeTokenGroups: ThemeTokenGroup[] = [
  {
    title: 'Arco 深色核心',
    description: '深色主题同样直接使用 Arco 正式 token 命名，弱背景走 dark light token，不再保留旧前缀中间层。',
    tokens: [
      { label: '主色 6', name: '--primary-6', value: '#C3A15F', usage: '主 CTA / 主链接' },
      { label: '主色 7', name: '--primary-7', value: '#A57F3C', usage: '按下态 / 强强调' },
      { label: '链接 6', name: '--link-6', value: '#758B93', usage: '信息高亮 / 辅助强调' },
      { label: '主色浅底', name: '--color-primary-light-1', value: 'rgba(195, 161, 95, 0.2)', usage: '深色弱背景' }
    ]
  },
  {
    title: 'Arco 深色中性',
    description: '深色层级统一回到 Arco 的 bg / text / border 结构层，业务色不再承担页面骨架。',
    tokens: [
      { label: '主文字', name: '--color-text-1', value: 'rgba(255, 255, 255, 0.9)', usage: '主标题 / 正文' },
      { label: '次文字', name: '--color-text-2', value: 'rgba(255, 255, 255, 0.7)', usage: '说明 / 次级文案' },
      { label: '页面背景', name: '--color-bg-1', value: '#17171A', usage: '页面根背景' },
      { label: '卡片背景', name: '--color-bg-2', value: '#232324', usage: '卡片 / 容器' },
      { label: '默认边框', name: '--color-border-2', value: 'rgba(255, 255, 255, 0.12)', usage: '边框 / 分割线' }
    ]
  },
  {
    title: 'Arco 深色语义',
    description: '功能状态和亮点色拆开，状态色回到 Arco 语义 token，弱背景走 alpha light token。',
    tokens: [
      { label: '成功 6', name: '--success-6', value: '#708A73', usage: '完成 / 成功' },
      { label: '警示 6', name: '--warning-6', value: '#C3A15F', usage: '待处理 / 提醒' },
      { label: '风险 6', name: '--danger-6', value: '#B98179', usage: '删除 / 错误' },
      { label: '成功浅底', name: '--color-success-light-1', value: 'rgba(112, 138, 115, 0.2)', usage: '状态弱背景' }
    ]
  },
  {
    title: 'Scene 扩展',
    description: '赛博场景色独立在 scene 层，继续服务夜祠页面，但不再直接扮演全局 token。',
    tokens: [
      { label: '场景烟紫', name: '--scene-primary-6', value: '#7C6C75', usage: '赛博主轴 / 深层点缀' },
      { label: '场景碑青', name: '--scene-accent-6', value: '#6F8894', usage: '信息高亮 / 线框' },
      { label: '场景香火金', name: '--scene-warning-6', value: '#C3A15F', usage: '仪式高亮 / 徽标' },
      { label: '场景面板', name: '--scene-panel', value: 'rgba(25, 28, 32, 0.86)', usage: '赛博面板背景' }
    ]
  }
]

const altarGoldTokenGroups: ThemeTokenGroup[] = [
  {
    title: 'Arco 核心色阶',
    description: '纯色候选 A 把金色作为主轴，但根层仍然直接落在 Arco 正式 token 上。',
    tokens: [
      { label: '主色 6', name: '--primary-6', value: '#C8A45C', usage: '主操作 / 强 CTA' },
      { label: '主色 7', name: '--primary-7', value: '#A9813A', usage: '按下态 / 深强调' },
      { label: '链接 6', name: '--link-6', value: '#6F8894', usage: '辅助信息 / 线框' },
      { label: '主色浅底', name: '--color-primary-light-1', value: 'rgba(200, 164, 92, 0.2)', usage: '主色弱背景' }
    ]
  },
  {
    title: 'Arco 中性层级',
    description: '深色纯色预设依然复用 Arco 的 dark bg / text / border 层，不再让业务色承担结构层。',
    tokens: [
      { label: '主文字', name: '--color-text-1', value: 'rgba(255, 255, 255, 0.9)', usage: '标题 / 正文' },
      { label: '次文字', name: '--color-text-2', value: 'rgba(255, 255, 255, 0.7)', usage: '说明 / 次文案' },
      { label: '页面背景', name: '--color-bg-1', value: '#17171A', usage: '页面根背景' },
      { label: '卡片背景', name: '--color-bg-2', value: '#232324', usage: '卡片 / 面板' },
      { label: '默认边框', name: '--color-border-2', value: 'rgba(255, 255, 255, 0.12)', usage: '边框 / 分割线' }
    ]
  },
  {
    title: 'Arco 语义状态',
    description: '状态色与业务高亮拆开，警示仍归 warning，弱背景统一由 Arco light token 派生。',
    tokens: [
      { label: '成功 6', name: '--success-6', value: '#6D8A74', usage: '完成 / 成功' },
      { label: '警示 6', name: '--warning-6', value: '#C8A45C', usage: '提醒 / 待处理' },
      { label: '风险 6', name: '--danger-6', value: '#C8827D', usage: '删除 / 风险' },
      { label: '风险浅底', name: '--color-danger-light-1', value: 'rgba(200, 130, 125, 0.2)', usage: '风险弱背景' }
    ]
  },
  {
    title: 'Scene 扩展',
    description: 'Scene 层仅保留祭台页面真正需要的业务语义，不再复制整套全局语义变量。',
    tokens: [
      { label: '夜祠烟紫', name: '--scene-primary-6', value: '#786871', usage: '弱装饰 / 深层点缀' },
      { label: '档案青', name: '--scene-accent-6', value: '#6F8894', usage: '辅助信息 / 线框' },
      { label: '香火金', name: '--scene-warning-6', value: '#C8A45C', usage: '仪式高亮 / 徽标' },
      { label: '场景面板', name: '--scene-panel', value: 'rgba(25, 28, 32, 0.84)', usage: '组件面层' }
    ]
  }
]

const steleCyanTokenGroups: ThemeTokenGroup[] = [
  {
    title: 'Arco 核心色阶',
    description: '纯色候选 B 用碑青做主轴，但仍按 Arco 正式色阶命名和派生组件态。',
    tokens: [
      { label: '主色 6', name: '--primary-6', value: '#546A6F', usage: '主操作 / 主链接' },
      { label: '主色 7', name: '--primary-7', value: '#3A5D66', usage: '按下态 / 深强调' },
      { label: '链接 6', name: '--link-6', value: '#8A7254', usage: '辅助标签 / 次强调' },
      { label: '主色浅底', name: '--color-primary-light-1', value: '#E8FFFF', usage: '主色弱背景' }
    ]
  },
  {
    title: 'Arco 中性层级',
    description: '浅色纯色预设依然复用 Arco 的 light bg / text / border 层，保证消费面和其他主题一致。',
    tokens: [
      { label: '主文字', name: '--color-text-1', value: '#1D2129', usage: '标题 / 正文' },
      { label: '次文字', name: '--color-text-2', value: '#4E5969', usage: '说明 / 次文案' },
      { label: '页面背景', name: '--color-bg-1', value: '#F7F8FA', usage: '页面根背景' },
      { label: '卡片背景', name: '--color-bg-2', value: '#FFFFFF', usage: '卡片 / 面板' },
      { label: '默认边框', name: '--color-border-2', value: '#E5E6EB', usage: '边框 / 分割线' }
    ]
  },
  {
    title: 'Arco 语义状态',
    description: '状态色仍是单独一层，和业务扩展色分离，弱背景统一来自 Arco light token。',
    tokens: [
      { label: '成功 6', name: '--success-6', value: '#607B62', usage: '完成 / 成功' },
      { label: '警示 6', name: '--warning-6', value: '#A88552', usage: '提醒 / 待处理' },
      { label: '风险 6', name: '--danger-6', value: '#B16A64', usage: '删除 / 风险' },
      { label: '成功浅底', name: '--color-success-light-1', value: '#EAFFE8', usage: '状态弱背景' }
    ]
  },
  {
    title: 'Scene 扩展',
    description: '场景扩展继续服务祭台页，但只保留业务层真正要消费的那一组 token。',
    tokens: [
      { label: '灰紫', name: '--scene-primary-6', value: '#837680', usage: '弱装饰 / 深层点缀' },
      { label: '碑青', name: '--scene-accent-6', value: '#546A6F', usage: '辅助信息 / 线框' },
      { label: '温金', name: '--scene-warning-6', value: '#A88552', usage: '仪式高亮 / 徽标' },
      { label: '场景面板', name: '--scene-panel', value: 'rgba(255, 252, 247, 0.92)', usage: '组件面层' }
    ]
  }
]

interface ThemePosterPalette {
  backgroundTop: string
  backgroundMid: string
  backgroundBottom: string
  glowPrimaryFill: string
  glowPrimaryShadow: string
  glowSecondaryFill: string
  glowSecondaryShadow: string
  panelTop: string
  panelBottom: string
  panelBorder: string
  eyebrow: string
  badgeBackground: string
  badgeBorder: string
  badgeText: string
  glyphStart: string
  glyphEnd: string
  glyphText: string
  title: string
  ancestor: string
  bodyText: string
  hintBackground: string
  hintBorder: string
  hintText: string
  metricCardBackground: string
  metricCardBorder: string
  metricPrimary: string
  metricSecondary: string
  metricTertiary: string
  metricLabel: string
  memoEyebrow: string
  divider: string
  signature: string
  action: string
}

export const themePosterPalettes: Record<ThemePresetId, ThemePosterPalette> = {
  light: {
    backgroundTop: '#e8f9ff',
    backgroundMid: '#f7f8fa',
    backgroundBottom: '#edf2f5',
    glowPrimaryFill: '#355a76',
    glowPrimaryShadow: 'rgba(53, 90, 118, 0.26)',
    glowSecondaryFill: '#587d76',
    glowSecondaryShadow: 'rgba(88, 125, 118, 0.18)',
    panelTop: 'rgba(255, 255, 255, 0.98)',
    panelBottom: 'rgba(247, 248, 250, 0.98)',
    panelBorder: 'rgba(53, 90, 118, 0.16)',
    eyebrow: '#587d76',
    badgeBackground: 'rgba(181, 138, 71, 0.12)',
    badgeBorder: 'rgba(181, 138, 71, 0.24)',
    badgeText: '#b58a47',
    glyphStart: '#355a76',
    glyphEnd: 'rgba(88, 125, 118, 0.16)',
    glyphText: '#ffffff',
    title: '#1d2129',
    ancestor: '#355a76',
    bodyText: '#4e5969',
    hintBackground: 'rgba(53, 90, 118, 0.06)',
    hintBorder: 'rgba(53, 90, 118, 0.16)',
    hintText: '#355a76',
    metricCardBackground: 'rgba(247, 248, 250, 0.94)',
    metricCardBorder: 'rgba(53, 90, 118, 0.12)',
    metricPrimary: '#355a76',
    metricSecondary: '#587d76',
    metricTertiary: '#b58a47',
    metricLabel: '#86909c',
    memoEyebrow: '#86909c',
    divider: 'rgba(53, 90, 118, 0.14)',
    signature: '#4e5969',
    action: '#355a76'
  },
  dark: {
    backgroundTop: '#232324',
    backgroundMid: '#1d1d1f',
    backgroundBottom: '#17171a',
    glowPrimaryFill: '#c3a15f',
    glowPrimaryShadow: 'rgba(195, 161, 95, 0.26)',
    glowSecondaryFill: '#758b93',
    glowSecondaryShadow: 'rgba(117, 139, 147, 0.18)',
    panelTop: 'rgba(42, 42, 43, 0.98)',
    panelBottom: 'rgba(23, 23, 26, 0.98)',
    panelBorder: 'rgba(195, 161, 95, 0.18)',
    eyebrow: '#758b93',
    badgeBackground: 'rgba(195, 161, 95, 0.14)',
    badgeBorder: 'rgba(195, 161, 95, 0.26)',
    badgeText: '#c3a15f',
    glyphStart: '#c3a15f',
    glyphEnd: 'rgba(117, 139, 147, 0.18)',
    glyphText: '#17171a',
    title: 'rgba(255, 255, 255, 0.9)',
    ancestor: '#c3a15f',
    bodyText: 'rgba(255, 255, 255, 0.7)',
    hintBackground: 'rgba(117, 139, 147, 0.12)',
    hintBorder: 'rgba(117, 139, 147, 0.2)',
    hintText: '#758b93',
    metricCardBackground: 'rgba(49, 49, 50, 0.94)',
    metricCardBorder: 'rgba(255, 255, 255, 0.08)',
    metricPrimary: '#c3a15f',
    metricSecondary: '#758b93',
    metricTertiary: '#b98179',
    metricLabel: 'rgba(255, 255, 255, 0.5)',
    memoEyebrow: 'rgba(255, 255, 255, 0.5)',
    divider: 'rgba(255, 255, 255, 0.12)',
    signature: 'rgba(255, 255, 255, 0.7)',
    action: '#c3a15f'
  },
  'altar-gold': {
    backgroundTop: '#232324',
    backgroundMid: '#1d1d1f',
    backgroundBottom: '#17171a',
    glowPrimaryFill: '#c8a45c',
    glowPrimaryShadow: 'rgba(200, 164, 92, 0.28)',
    glowSecondaryFill: '#6f8894',
    glowSecondaryShadow: 'rgba(111, 136, 148, 0.18)',
    panelTop: 'rgba(42, 42, 43, 0.98)',
    panelBottom: 'rgba(23, 23, 26, 0.98)',
    panelBorder: 'rgba(200, 164, 92, 0.2)',
    eyebrow: '#6f8894',
    badgeBackground: 'rgba(200, 164, 92, 0.16)',
    badgeBorder: 'rgba(200, 164, 92, 0.28)',
    badgeText: '#c8a45c',
    glyphStart: '#c8a45c',
    glyphEnd: 'rgba(111, 136, 148, 0.18)',
    glyphText: '#17171a',
    title: 'rgba(255, 255, 255, 0.9)',
    ancestor: '#c8a45c',
    bodyText: 'rgba(255, 255, 255, 0.7)',
    hintBackground: 'rgba(111, 136, 148, 0.12)',
    hintBorder: 'rgba(111, 136, 148, 0.2)',
    hintText: '#6f8894',
    metricCardBackground: 'rgba(49, 49, 50, 0.94)',
    metricCardBorder: 'rgba(255, 255, 255, 0.08)',
    metricPrimary: '#c8a45c',
    metricSecondary: '#6f8894',
    metricTertiary: '#c8827d',
    metricLabel: 'rgba(255, 255, 255, 0.5)',
    memoEyebrow: 'rgba(255, 255, 255, 0.5)',
    divider: 'rgba(255, 255, 255, 0.12)',
    signature: 'rgba(255, 255, 255, 0.7)',
    action: '#c8a45c'
  },
  'stele-cyan': {
    backgroundTop: '#e8ffff',
    backgroundMid: '#f7f8fa',
    backgroundBottom: '#edf2f5',
    glowPrimaryFill: '#546a6f',
    glowPrimaryShadow: 'rgba(84, 106, 111, 0.26)',
    glowSecondaryFill: '#8a7254',
    glowSecondaryShadow: 'rgba(138, 114, 84, 0.18)',
    panelTop: 'rgba(255, 255, 255, 0.98)',
    panelBottom: 'rgba(247, 248, 250, 0.98)',
    panelBorder: 'rgba(84, 106, 111, 0.16)',
    eyebrow: '#8a7254',
    badgeBackground: 'rgba(168, 133, 82, 0.12)',
    badgeBorder: 'rgba(168, 133, 82, 0.24)',
    badgeText: '#a88552',
    glyphStart: '#546a6f',
    glyphEnd: 'rgba(138, 114, 84, 0.14)',
    glyphText: '#ffffff',
    title: '#1d2129',
    ancestor: '#546a6f',
    bodyText: '#4e5969',
    hintBackground: 'rgba(84, 106, 111, 0.06)',
    hintBorder: 'rgba(84, 106, 111, 0.16)',
    hintText: '#546a6f',
    metricCardBackground: 'rgba(247, 248, 250, 0.94)',
    metricCardBorder: 'rgba(84, 106, 111, 0.12)',
    metricPrimary: '#546a6f',
    metricSecondary: '#8a7254',
    metricTertiary: '#a88552',
    metricLabel: '#86909c',
    memoEyebrow: '#86909c',
    divider: 'rgba(84, 106, 111, 0.14)',
    signature: '#4e5969',
    action: '#546a6f'
  }
}

export const DEFAULT_THEME_PRESET_ID: ThemePresetId = 'light'

export const themePresetByMode: Record<ThemeMode, ThemePresetId> = {
  light: 'light',
  dark: 'dark'
}

export const themePresets: ThemePreset[] = [
  {
    id: 'light',
    mode: 'light',
    label: '黛蓝灰',
    title: '浅色日巡',
    description: '主题根层直接使用 Arco 正式 token 命名，标准页面走 neutral / bg / border 结构层，赛博场景则通过 scene token 扩展。',
    themeClass: 'theme-light',
    tokenGroups: themeTokenGroups
  },
  {
    id: 'dark',
    mode: 'dark',
    label: '夜祠墨',
    title: '夜祠深巡',
    description: '深色主题同样直接落在 Arco 正式 token 上，再把夜祠场景色挂到 scene 扩展层，结构和业务扩展分离。',
    themeClass: 'theme-dark',
    tokenGroups: cyberThemeTokenGroups
  },
  {
    id: 'altar-gold',
    mode: 'dark',
    label: '夜祠金',
    title: '纯色候选 A',
    description: '以金色为主品牌轴的深色纯色版本，页面不再堆渐变，主题根层直接使用 Arco 正式 token + scene 扩展。',
    themeClass: 'theme-solid-altar-gold',
    tokenGroups: altarGoldTokenGroups
  },
  {
    id: 'stele-cyan',
    mode: 'light',
    label: '碑青灰',
    title: '纯色候选 B',
    description: '以碑青为主品牌轴的浅色纯色版本，整体更安静，变量组织保持和其他主题同一套 Arco 正式分层。',
    themeClass: 'theme-solid-stele-cyan',
    tokenGroups: steleCyanTokenGroups
  }
]

export function resolveThemePreset(presetId: string) {
  return themePresets.find((item) => item.id === presetId) ?? themePresets[0]
}
