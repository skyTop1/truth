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

export const cyberThemeTokenGroups: ThemeTokenGroup[] = [
  {
    title: '深空底色',
    description: '首页祭台、祖域空间和分享海报统一用深空色做底，保证第一眼冲击力。',
    tokens: [
      { label: '极夜黑', name: 'space-950', value: '#05060A', usage: '极深背景' },
      { label: '深空黑', name: 'space-900', value: '#0B0E16', usage: '页面底色' },
      { label: '星舰板', name: 'space-800', value: '#141A27', usage: '卡片背景' },
      { label: '夜幕层', name: 'space-700', value: '#1E2740', usage: '浮层背景' }
    ]
  },
  {
    title: '霓虹紫',
    description: '承担主 CTA、仪式光圈和赛博祭台的核心科技感。',
    tokens: [
      { label: '紫雾微光', name: 'neon-violet-300', value: '#B88CFF', usage: '弱高亮' },
      { label: '霓虹主紫', name: 'neon-violet-500', value: '#915EFF', usage: '主科技强调' },
      { label: '高能紫核', name: 'neon-violet-600', value: '#7B43FF', usage: '主按钮 / 主仪式' },
      { label: '压深紫电', name: 'neon-violet-700', value: '#622EE2', usage: '按下态 / 深层能量感' }
    ]
  },
  {
    title: '电子蓝',
    description: '承担扫描线、祖先信号、信息状态和辅助高亮。',
    tokens: [
      { label: '闪频蓝光', name: 'signal-cyan-300', value: '#7EE7FF', usage: '扫描高亮' },
      { label: '信号主蓝', name: 'signal-cyan-500', value: '#35CFFF', usage: '信息高亮' },
      { label: '深层蓝束', name: 'signal-cyan-700', value: '#1496C4', usage: '深辅助色' }
    ]
  },
  {
    title: '香火金',
    description: '承担香火值、能量值、称号和结果页高光。',
    tokens: [
      { label: '余烬微金', name: 'ember-gold-300', value: '#FFD48A', usage: '轻火光' },
      { label: '香火主金', name: 'ember-gold-500', value: '#FFB648', usage: '供品高亮' },
      { label: '灼亮金芯', name: 'ember-gold-700', value: '#D9851E', usage: '强高亮' }
    ]
  }
]

export const themeTokenGroups: ThemeTokenGroup[] = [
  {
    title: '品牌主色',
    description: '主按钮、主操作、品牌识别统一使用黛蓝系。',
    tokens: [
      { label: '晨雾浅蓝', name: 'brand-50', value: '#F2F6F9', usage: '轻提示背景' },
      { label: '黛蓝弱底', name: 'brand-100', value: '#E2EAF0', usage: '选中弱背景' },
      { label: '黛蓝辅色', name: 'brand-300', value: '#9FB4C4', usage: '图表辅色' },
      { label: '品牌基蓝', name: 'brand-500', value: '#4D6F89', usage: '品牌基础值' },
      { label: '品牌主蓝', name: 'brand-600', value: '#355A76', usage: '主按钮 / 主链接' },
      { label: '压深黛蓝', name: 'brand-700', value: '#2B4A62', usage: '按下态 / 强调态' }
    ]
  },
  {
    title: '辅助强调色',
    description: '灰青色只在局部提气，不参与主操作竞争。',
    tokens: [
      { label: '雾青浅底', name: 'accent-50', value: '#F2F7F6', usage: '辅助浅底' },
      { label: '雾青标签', name: 'accent-100', value: '#E1ECEA', usage: '标签底色' },
      { label: '灰青辅色', name: 'accent-300', value: '#99BBB5', usage: '图表辅助' },
      { label: '数据青光', name: 'accent-500', value: '#587D76', usage: '数据高亮' },
      { label: '深层灰青', name: 'accent-600', value: '#466861', usage: '深强调' }
    ]
  },
  {
    title: '界面中性色',
    description: '页面层级、正文可读性和边框秩序感都交给中性色完成。',
    tokens: [
      { label: '纯白底', name: 'gray-0', value: '#FFFFFF', usage: '卡片背景' },
      { label: '雾白页', name: 'gray-50', value: '#F5F7F8', usage: '页面背景' },
      { label: '轻分割灰', name: 'gray-200', value: '#DEE4E8', usage: '弱边框 / 分割线' },
      { label: '次级文案灰', name: 'gray-500', value: '#73808C', usage: '次级文案' },
      { label: '正文深灰', name: 'gray-700', value: '#414C59', usage: '正文' },
      { label: '标题墨灰', name: 'gray-900', value: '#1E2833', usage: '主标题' }
    ]
  },
  {
    title: '状态语义色',
    description: '状态色只表达结果，不用于装饰。',
    tokens: [
      { label: '完成绿', name: 'success', value: '#4B7F67', usage: '成功 / 完成' },
      { label: '警示金', name: 'warning', value: '#B58A47', usage: '警告 / 待处理' },
      { label: '风险红', name: 'danger', value: '#B85B5B', usage: '错误 / 删除' },
      { label: '信息蓝', name: 'info', value: '#567596', usage: '说明 / 通知' }
    ]
  }
]

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
    description: '更适合看品牌基蓝、中性色层级和常规组件语义，强调清晰、秩序和可读性。',
    themeClass: 'theme-light',
    tokenGroups: themeTokenGroups
  },
  {
    id: 'dark',
    mode: 'dark',
    label: '夜航蓝',
    title: '赛博夜航',
    description: '更适合看深空底色、霓虹紫和电子蓝的发光关系，强调热梗感和科技冲击力。',
    themeClass: 'theme-dark',
    tokenGroups: cyberThemeTokenGroups
  },
  {
    id: 'altar-gold',
    mode: 'dark',
    label: '夜祠金',
    title: '无渐变候选 A',
    description: '深炭黑底配香火金主色和档案青辅助，高亮收束，层次只靠纯色、边框和阴影推进。',
    themeClass: 'theme-solid-altar-gold',
    tokenGroups: [
      {
        title: '基础语义变量',
        description: '主操作和辅助强调都沿用现有语义命名，不新增命名分支。',
        tokens: [
          { label: '主按钮', name: '--color-primary', value: '#C8A45C', usage: '主操作 / 强 CTA' },
          { label: '按下态', name: '--color-primary-pressed', value: '#A88443', usage: '主按钮按下' },
          { label: '次强调', name: '--color-accent', value: '#6F8894', usage: '次级信息高亮' },
          { label: '主色浅底', name: '--color-primary-soft', value: '#2B2418', usage: '主色弱背景' }
        ]
      },
      {
        title: '界面层变量',
        description: '页面不再依赖渐变起伏，直接用深底、卡片面和边框层级制造厚度。',
        tokens: [
          { label: '页面底', name: '--color-bg-page', value: '#121416', usage: '页面根背景' },
          { label: '卡片底', name: '--color-bg-card', value: '#1B1F23', usage: '卡片 / 面板背景' },
          { label: '主要文字', name: '--color-text-primary', value: '#F3EEE5', usage: '标题 / 正文' },
          { label: '默认边框', name: '--color-border', value: '#363028', usage: '边框 / 分割线' }
        ]
      },
      {
        title: '赛博扩展变量',
        description: '保留现有扩展变量键名，但把色感压到更克制的“夜祠”方向。',
        tokens: [
          { label: '金色主轴', name: '--color-cyber-gold', value: '#C8A45C', usage: '仪式高亮 / 徽标' },
          { label: '档案青', name: '--color-cyber-cyan', value: '#6F8894', usage: '辅助信息 / 线框' },
          { label: '烟紫', name: '--color-cyber-violet', value: '#786871', usage: '弱装饰 / 深层点缀' },
          { label: '面板纯色', name: '--color-cyber-panel', value: 'rgba(25, 28, 32, 0.84)', usage: '组件面层' }
        ]
      },
      {
        title: '状态语义变量',
        description: '状态色依旧只表达结果，不拿来制造装饰性冲突。',
        tokens: [
          { label: '成功', name: '--color-success', value: '#6D8A74', usage: '完成 / 成功' },
          { label: '警示', name: '--color-warning', value: '#C8A45C', usage: '提醒 / 待处理' },
          { label: '风险', name: '--color-danger', value: '#C8827D', usage: '删除 / 风险' },
          { label: '信息', name: '--color-info', value: '#7F98A4', usage: '说明 / 通知' }
        ]
      }
    ]
  },
  {
    id: 'stele-cyan',
    mode: 'light',
    label: '碑青灰',
    title: '无渐变候选 B',
    description: '碑面灰和纸页米白做底，主色改为碑青，整体更安静，适合轻纪念和档案感页面。',
    themeClass: 'theme-solid-stele-cyan',
    tokenGroups: [
      {
        title: '基础语义变量',
        description: '主色偏碑青，辅助色转为温纸棕，仍然完全复用当前变量命名。',
        tokens: [
          { label: '主按钮', name: '--color-primary', value: '#546A6F', usage: '主操作 / 主链接' },
          { label: '按下态', name: '--color-primary-pressed', value: '#43545A', usage: '主按钮按下' },
          { label: '次强调', name: '--color-accent', value: '#8A7254', usage: '辅助标签 / 次强调' },
          { label: '主色浅底', name: '--color-primary-soft', value: '#EAF0F1', usage: '主色弱背景' }
        ]
      },
      {
        title: '界面层变量',
        description: '整体不再用渐变和雾面叠层，改用纸页色差和边框秩序拉开层级。',
        tokens: [
          { label: '页面底', name: '--color-bg-page', value: '#F4F1EB', usage: '页面根背景' },
          { label: '卡片底', name: '--color-bg-card', value: '#FFFCF7', usage: '卡片 / 面板背景' },
          { label: '主要文字', name: '--color-text-primary', value: '#2D3134', usage: '标题 / 正文' },
          { label: '默认边框', name: '--color-border', value: '#D8D1C8', usage: '边框 / 分割线' }
        ]
      },
      {
        title: '赛博扩展变量',
        description: '扩展层继续保留兼容位，但色相转成碑青、温金和灰紫，避免夜店感。',
        tokens: [
          { label: '温金', name: '--color-cyber-gold', value: '#A88552', usage: '仪式高亮 / 徽标' },
          { label: '碑青', name: '--color-cyber-cyan', value: '#546A6F', usage: '辅助信息 / 线框' },
          { label: '灰紫', name: '--color-cyber-violet', value: '#837680', usage: '弱装饰 / 深层点缀' },
          { label: '面板纯色', name: '--color-cyber-panel', value: 'rgba(255, 252, 247, 0.92)', usage: '组件面层' }
        ]
      },
      {
        title: '状态语义变量',
        description: '状态色全部走纯色块，不额外叠渐变边缘。',
        tokens: [
          { label: '成功', name: '--color-success', value: '#607B62', usage: '完成 / 成功' },
          { label: '警示', name: '--color-warning', value: '#A88552', usage: '提醒 / 待处理' },
          { label: '风险', name: '--color-danger', value: '#B16A64', usage: '删除 / 风险' },
          { label: '信息', name: '--color-info', value: '#607784', usage: '说明 / 通知' }
        ]
      }
    ]
  }
]

export function resolveThemePreset(presetId: string) {
  return themePresets.find((item) => item.id === presetId) ?? themePresets[0]
}
