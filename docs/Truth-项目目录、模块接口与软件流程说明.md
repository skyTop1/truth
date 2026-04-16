# Truth 项目目录、模块接口与软件流程说明

## 1. 项目定位

- 项目名称：`Truth`
- 产品方向：赛博祭祖小程序 / uni-app 多端原型
- 技术栈：`uni-app + Vue 3 + TypeScript + Vite + Pinia + uni-ui`
- 数据策略：纯本地运行、纯本地缓存、不接入远程接口
- 安全边界：不做账号体系、不做云同步、不做服务端存储、不上传用户祭祖内容
- 视觉方向：高亮赛博祭台、霓虹色、传播感强，保持“离谱但记忆点强”的热梗感

## 2. 根目录说明

```text
.
├── .gitignore
├── AGENTS.md
├── README.md
├── shrimp-rules.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── index.html
├── docs/
└── src/
```

### 2.1 根目录文件职责

| 路径 | 作用 |
| --- | --- |
| `.gitignore` | 本地仓库忽略规则，当前已排除 `node_modules`、`dist`、`.pnpm-store` 等本地产物。 |
| `AGENTS.md` | 项目级代理规则，约束实现风格、前端定位和本地优先原则。 |
| `shrimp-rules.md` | 项目补充规则，强调不接入接口、数据不出端。 |
| `package.json` | 依赖与脚本入口。 |
| `vite.config.ts` | uni-app + Vite 构建配置。 |
| `tsconfig.json` | TypeScript 编译配置。 |
| `eslint.config.mjs` | ESLint 规则。 |
| `index.html` | H5 入口模板。 |
| `docs/` | 产品、体验、缺口、技术说明文档。 |
| `src/` | 主应用源码。 |

### 2.2 常用脚本

| 命令 | 用途 |
| --- | --- |
| `pnpm run dev:h5` | H5 开发模式 |
| `pnpm run dev:mp-weixin` | 微信小程序开发模式 |
| `pnpm run build:h5` | H5 构建 |
| `pnpm run build:mp-weixin` | 微信小程序构建 |
| `pnpm run build:app-plus` | App 端构建 |
| `pnpm run lint` | ESLint 检查 |
| `pnpm run type-check` | `vue-tsc` 类型检查 |

## 3. `src` 目录结构说明

```text
src
├── App.vue
├── main.ts
├── env.d.ts
├── pages.json
├── manifest.json
├── uni.scss
├── api/
├── components/app/
├── composables/
├── constants/
├── pages/
├── pages-sub/
├── stores/
├── styles/
├── types/
└── utils/
```

### 3.1 应用入口层

| 路径 | 说明 |
| --- | --- |
| `src/main.ts` | 创建 SSR App，注册 Pinia，全局注册 `AppThemePage`。 |
| `src/App.vue` | uni-app 全局生命周期入口，在 `onLaunch / onShow` 阶段同步当前主题预设并保留基础日志；全局引入 `runtime-theme.scss`。 |
| `src/env.d.ts` | TypeScript 环境声明，包含 `@dcloudio/types`、`vite/client` 和 `*.vue` 模块声明。 |
| `src/pages.json` | 页面路由、分包、全局导航样式、`easycom` 配置。 |
| `src/manifest.json` | uni-app 工程平台配置。 |

### 3.2 页面层

| 路径 | 说明 |
| --- | --- |
| `src/pages/index/index.vue` | 首页祭台。负责概念展示、本地仓状态概览、引导进入仪式页或祖域页。 |
| `src/pages/workbench/index.vue` | 祖域页。负责本地历史、海报管理、备份导入导出、清空与删除。 |
| `src/pages-sub/cyber/ritual-entry.vue` | 仪式接入页。负责填写祖先称呼、选择动作、填写文案、复用历史模板。 |
| `src/pages-sub/cyber/ritual-result.vue` | 仪式结果页。负责落本地记录、恢复旧记录、生成海报、保存/预览海报。 |
| `src/pages-sub/system/theme-preview.vue` | 主题预览页。当前既展示 token，也直接切换四套运行时主题预设。 |

### 3.3 组件层

`src/components/app/` 存放整个应用复用的基础 UI 组件和业务展示组件。

### 3.4 组合式函数层

| 路径 | 说明 |
| --- | --- |
| `src/composables/useTheme.ts` | 主题组合式函数，包装 `useAppStore` 的主题相关字段和方法，供页面和组件直接消费。暴露 `activeThemePreset`、`themePreset`、`themeMode`、`themeLabel`、`themeClass`，以及 `hydrateThemeMode`、`setThemePreset`、`setThemeMode`、`toggleThemeMode`。 |

### 3.5 状态与数据层

| 路径 | 说明 |
| --- | --- |
| `src/stores/app.ts` | 应用级状态，负责当前主题预设、亮暗语义、主题缓存迁移与根节点 class 同步。 |
| `src/stores/ritual.ts` | 核心业务 store，负责本地祖域仓读写、归档修复、记录和海报管理。 |

### 3.6 常量层

| 路径 | 说明 |
| --- | --- |
| `src/constants/icons.ts` | 本地图标定义。 |
| `src/constants/navigation.ts` | 自定义 tabBar 项。 |
| `src/constants/ritual.ts` | 仪式动作模板、消息模板、祖域缓存 key 与版本。 |
| `src/constants/status.ts` | 用户可见状态映射、中文标签、旧英文兼容、赛博视觉文案集中收口。同时从 `src/types/status.ts` 重新导出 `StatusTagVariant`、`BackupImportStatus`、`PosterStatus`。 |
| `src/constants/theme.ts` | 四套运行时主题预设配置、亮暗映射、主题 class、token 展示数据、海报色板（`themePosterPalettes`，每套主题约 28 个 Canvas 绘图专用色值）。 |

### 3.7 工具层

| 路径 | 说明 |
| --- | --- |
| `src/utils/local-storage.ts` | 本地缓存读写封装。 |
| `src/utils/local-id.ts` | 本地 ID 生成器。 |
| `src/utils/theme-root.ts` | H5 根节点主题 class 同步工具。 |
| `src/utils/uni-page.ts` | 页面参数读取与分享注册兼容层。 |

### 3.8 类型层

| 路径 | 说明 |
| --- | --- |
| `src/types/ritual.ts` | 仪式、海报、归档结构类型。 |
| `src/types/navigation.ts` | tabBar 项类型。 |
| `src/types/theme.ts` | 主题模式、主题预设 ID、主题预设和 token 结构类型。 |
| `src/types/status.ts` | 状态标签变体、备份导入状态、海报状态类型。 |

### 3.9 样式层

| 路径 | 说明 |
| --- | --- |
| `src/styles/theme-light.scss` | 浅色主题变量，选择器为 `:root, page, .theme-light`。 |
| `src/styles/theme-dark.scss` | 深色主题变量，选择器为 `.theme-dark`。 |
| `src/styles/theme-solid.scss` | 两套无渐变候选主题变量，选择器分别为 `.theme-solid-altar-gold` 和 `.theme-solid-stele-cyan`。 |
| `src/styles/runtime-theme.scss` | 主题变量汇总入口，统一引入四套主题根 token；同时设置 `page / body / view / text / button / input / textarea / image` 的基础样式，并包含 `prefers-reduced-motion` 覆盖。 |
| `src/uni.scss` | uni-app 样式入口，将 uni-app SCSS 变量（`$uni-color-primary` 等）映射到 CSS 自定义属性（`--primary-6` 等），作为 uni-ui 桥接层。 |

## 4. 路由与页面入口说明

### 4.1 页面路由表

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/pages/index/index` | 首页祭台 | 产品概念、状态总览、入口分发 |
| `/pages/workbench/index` | 祖域 | 本地记录管理中心 |
| `/pages-sub/cyber/ritual-entry` | 接入祖域 | 选择动作与文案 |
| `/pages-sub/cyber/ritual-result` | 结果页 | 落记录、生成海报、分享 |
| `/pages-sub/system/theme-preview` | 信号色板 | 查看并切换四套主题预设 |

### 4.2 页面参数接口

#### `ritual-entry`

| 参数 | 类型 | 来源 | 说明 |
| --- | --- | --- | --- |
| `ancestor` | `string` | 首页 / 祖域页 / 历史复用 | 预填祖先称呼 |
| `message` | `string` | 祖域页历史复用 | 预填悼词 |
| `selected` | `string` | 祖域页历史复用 | 已选动作 key 列表，逗号拼接 |

#### `ritual-result`

| 参数 | 类型 | 来源 | 说明 |
| --- | --- | --- | --- |
| `ritualId` | `string` | 仪式页 / 历史重开 | 本次记录 ID |
| `title` | `string` | 仪式页 / 祖域页 | 结果页标题 |
| `badge` | `string` | 仪式页 / 祖域页 | 本次称号 |
| `ancestor` | `string` | 仪式页 / 祖域页 | 祖先称呼 |
| `incense` | `string` | 仪式页 / 祖域页 | 香火值 |
| `signal` | `string` | 仪式页 / 祖域页 | 信号值，带 `%` |
| `actions` | `string` | 仪式页 / 祖域页 | 动作数量 |
| `selected` | `string` | 仪式页 / 祖域页 | 动作 key 列表 |
| `message` | `string` | 仪式页 / 祖域页 | 仪式文案 |

## 5. 核心数据模型说明

数据模型定义位于 `src/types/ritual.ts`。

### 5.1 仪式动作模板

```ts
interface RitualActionTemplate {
  key: string
  title: string
  badge: string
  description: string
  energy: number
  iconName: AppIconName
}
```

用途：仪式页用于渲染动作卡片，计算香火值与信号强度。

### 5.2 仪式记录

```ts
interface RitualRecord {
  id: string
  ancestorName: string
  badge: string
  title: string
  message: string
  incenseValue: number
  signalValue: number
  ritualCount: number
  actionKeys: string[]
  createdAt: string
  updatedAt: string
  posterReady: boolean
  posterImageUrl: string
}
```

用途：结果页持久化、祖域页历史列表、首页摘要展示。

### 5.3 海报记录

```ts
interface PosterRecord {
  id: string
  ritualRecordId: string
  ancestorName: string
  title: string
  badge: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
```

用途：祖域页海报库、结果页恢复海报缓存。

### 5.4 本地祖域仓

```ts
interface RitualArchive {
  version: number
  recentAncestorName: string
  records: RitualRecord[]
  posters: PosterRecord[]
  meta: RitualArchiveMeta
}

interface RitualArchiveMeta {
  lastHydratedAt: string
  lastMutationAt: string
  lastBackupAt: string
}
```

用途：本地持久化的唯一核心数据结构。

### 5.5 祖域仓状态

| 内部状态值 | 中文展示 |
| --- | --- |
| `fresh` | 本地仓未创建 |
| `ready` | 本地仓正常 |
| `migrated` | 本地仓已升级 |
| `recovered` | 缓存已修复 |
| `imported` | 备份已导入 |

### 5.6 海报状态

| 内部状态值 | 中文展示 |
| --- | --- |
| `idle` | 待生成 |
| `generating` | 生成中 |
| `ready` | 海报已就绪 |
| `restored` | 缓存已恢复 |
| `failed` | 生成失败 |
| `stale` | 缓存已失效 |
| `save-blocked` | 保存受限 |

## 6. 状态映射与文案层

`src/constants/status.ts` 是当前项目所有用户可见状态展示的统一入口，负责三类问题：

1. 把内部状态值映射成中文标签。
2. 把旧英文 badge 兼容映射成中文显示。
3. 集中管理赛博视觉文案，避免页面散落硬编码。

当前已经统一收口的内容包括：

- 祖域仓状态标签
- 导入状态标签
- 海报状态标签
- 页面流程标签
- 旧 badge 英文兼容
- 海报抬头、热点摘录、底部签名等文案

## 7. Store 接口说明

### 7.1 `useAppStore`

路径：`src/stores/app.ts`

| 字段 / 方法 | 类型 | 说明 |
| --- | --- | --- |
| `appName` | `Ref<string>` | 应用名，当前为 `Truth` |
| `themePreset` | `Ref<ThemePresetId>` | 当前主题预设 ID，取值为 `light / dark / altar-gold / stele-cyan` |
| `activeThemePreset` | `ComputedRef<ThemePreset>` | 当前主题预设完整配置 |
| `themeMode` | `ComputedRef<'light' | 'dark'>` | 当前主题所属亮暗语义 |
| `themeLabel` | `ComputedRef<string>` | 当前主题的人类可读标签 |
| `themeClass` | `ComputedRef<string>` | 当前主题对应的运行时 class |
| `setThemePreset(presetId)` | `(presetId: ThemePresetId) => void` | 指定主题预设 |
| `setThemeMode(mode)` | `(mode: ThemeMode) => void` | 按亮暗语义切换到默认主题预设 |
| `toggleThemeMode()` | `() => void` | 切换主题模式 |
| `hydrateThemeMode()` | `() => void` | 读取并迁移本地主题缓存，然后同步根节点 class |

### 7.2 `useRitualStore`

路径：`src/stores/ritual.ts`

#### 响应式状态

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isHydrated` | `Ref<boolean>` | 是否已完成本地祖域仓初始化 |
| `ritualRecords` | `ComputedRef<RitualRecord[]>` | 仪式记录，按时间倒序 |
| `posterRecords` | `ComputedRef<PosterRecord[]>` | 海报记录，按时间倒序 |
| `ancestorProfiles` | `ComputedRef<AncestorProfile[]>` | 从仪式记录聚合出的祖先画像 |
| `recentAncestorName` | `ComputedRef<string>` | 最近一次祖先称呼 |
| `archiveVersion` | `ComputedRef<number>` | 当前本地仓版本 |
| `archiveHydrationState` | `ComputedRef<RitualArchiveHydrationState>` | 当前祖域仓状态 |
| `archiveHydrationDetail` | `ComputedRef<string>` | 当前祖域仓状态说明 |
| `lastBackupAt` | `ComputedRef<string>` | 最近手动备份时间 |
| `lastMutationAt` | `ComputedRef<string>` | 最近写入时间 |
| `totalRitualCount` | `ComputedRef<number>` | 仪式总数 |
| `totalPosterCount` | `ComputedRef<number>` | 海报总数 |
| `totalIncenseValue` | `ComputedRef<number>` | 累计香火值 |
| `latestRecord` | `ComputedRef<RitualRecord \| null>` | 最新仪式记录 |
| `hasLocalData` | `ComputedRef<boolean>` | 是否已有任何本地内容 |

#### 方法接口

| 方法 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| `ensureHydrated()` | 无 | `void` | 读取本地缓存并初始化 store，只会执行一次 |
| `rememberAncestorName(name)` | `string` | `void` | 记录最近祖先称呼 |
| `upsertRitualRecord(recordDraft)` | `RitualRecordDraft` | `RitualRecord` | 新增或更新仪式记录 |
| `upsertPosterRecord(recordDraft)` | `PosterRecordDraft` | `PosterRecord` | 新增或更新海报记录 |
| `findRitualRecordById(recordId)` | `string` | `RitualRecord \| null` | 按记录 ID 查询 |
| `findPosterRecordByRitualId(recordId)` | `string` | `PosterRecord \| null` | 按仪式记录 ID 查询海报 |
| `removeRitualRecord(recordId)` | `string` | `void` | 删除仪式记录，同时删除关联海报 |
| `removePosterRecord(posterId)` | `string` | `void` | 删除海报记录 |
| `exportArchiveSnapshot()` | 无 | `string` | 导出格式化 JSON 字符串并更新备份时间 |
| `importArchiveSnapshot(snapshot)` | `string` | `string` | 导入备份并返回恢复结果摘要 |
| `clearLocalArchive()` | 无 | `void` | 清空本地祖域仓 |

## 8. 工具层接口说明

### 8.1 本地缓存工具

路径：`src/utils/local-storage.ts`

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `readLocalCache` | `<T>(key: string, fallbackValue: T) => T` | 安全读取 `uni.getStorageSync` |
| `writeLocalCache` | `<T>(key: string, value: T) => void` | 安全写入 `uni.setStorageSync` |
| `removeLocalCache` | `(key: string) => void` | 安全删除本地缓存 |

### 8.2 本地 ID 工具

路径：`src/utils/local-id.ts`

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `createLocalId` | `(prefix: string) => string` | 生成形如 `prefix-timestamp-random` 的本地唯一 ID |

### 8.3 主题根节点同步工具

路径：`src/utils/theme-root.ts`

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `syncThemeRootClass` | `(themeClass: string) => void` | H5 专用（条件编译 `#ifdef H5`），移除 `<html>` 和 `<body>` 上的全部主题 class，然后添加当前激活主题 class，保证 H5 端主题切换生效 |

### 8.4 页面参数工具

路径：`src/utils/uni-page.ts`

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getCurrentPageOptions` | `() => Record<string, string \| undefined> \| undefined` | 兼容方式读取当前页面 query参数 |

> 小程序分享已改用 uni-app 生命周期钩子 `onShareAppMessage`（从 `@dcloudio/uni-app` 导入），不再通过 `uni-page.ts` 注册。

### 8.5 远程接口占位层

路径：`src/api/http.ts`、`src/api/modules/health.ts`

说明：

- 当前项目明确是本地优先版本。
- `REMOTE_API_ENABLED = false`。
- `http()` 在当前版本默认拒绝远程请求。
- `fetchHealth()` 仅作为未来扩展占位，当前不允许接入业务流。

## 9. 基础组件接口说明

### 9.1 布局与展示组件

| 组件 | Props | Emits / Slot | 说明 |
| --- | --- | --- | --- |
| `AppThemePage` | 无（内部使用 `useTheme()`） | 默认插槽 | 主题上下文容器，将当前主题 class 应用到根 `<view>` |
| `AppNavBar` | `title`、`subtitle?` | 默认插槽、`left` | 自定义吸顶导航栏 |
| `AppTabBar` | `items`、`activeKey` | 无 | 自定义底部导航，内部使用 `uni.redirectTo` |
| `AppCard` | `title?`、`subtitle?` | `default`、`extra` | 通用卡片容器 |
| `AppTag` | `variant?` | 默认插槽 | 状态或标签丸子组件 |
| `AppEmpty` | `title`、`description?`、`icon?` | `action` | 空状态组件 |

### 9.2 输入与操作组件

| 组件 | Props | Emits | 说明 |
| --- | --- | --- | --- |
| `AppButton` | `variant?`、`block?`、`disabled?` | `click` | 通用按钮 |
| `AppInput` | `modelValue`、`label?`、`placeholder?` | `update:modelValue` | 文本输入框 |
| `AppDialog` | `modelValue`、`title`、`description?`、`confirmText?`、`cancelText?`、`showCancel?` | `update:modelValue`、`confirm`、`cancel` | 通用确认弹窗 |

### 9.3 图标与业务展示组件

| 组件 | Props | Emits | 说明 |
| --- | --- | --- | --- |
| `AppIcon` | `name`、`size?`、`color?`、`strokeWidth?`、`decorative?`、`label?` | 无 | 基于本地图标定义渲染 SVG |
| `AppRitualAction` | `title`、`description`、`badge`、`energy`、`active`、`iconName` | `toggle` | 仪式动作卡片，点击触发切换 |
| `AppCyberAltar` | `statusLabel`、`title`、`subtitle`、`signalValue`、`incenseValue`、`ritualValue`、`protocolTags` | 无 | 首页祭台英雄组件 |
| `AppSharePoster` | `title`、`badge`、`ancestorName`、`incenseValue`、`signalValue`、`ritualCount`、`message` | 无 | 结果页海报预览组件 |

## 10. 本地缓存结构与持久化策略

### 10.1 本地缓存 key

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `RITUAL_ARCHIVE_STORAGE_KEY` | `truth.cyber-ritual.archive` | 本地祖域仓唯一存储键 |
| `RITUAL_ARCHIVE_VERSION` | `2` | 当前缓存结构版本 |
| `THEME_PRESET_STORAGE_KEY` | `truth-theme-preset` | 当前运行时主题预设缓存键 |
| `THEME_MODE_STORAGE_KEY` | `truth-theme-mode` | 旧版亮暗主题缓存键，当前仅用于兼容迁移 |

### 10.2 读写策略

1. 首次打开页面时，调用 `ensureHydrated()`。
2. `ensureHydrated()` 读取本地缓存并规范化。
3. 如果缓存损坏，则回退到空祖域仓并标记 `recovered`。
4. 如果缓存版本旧，则自动迁移并标记 `migrated`。
5. 每次增删改记录或海报时，调用 `persistArchive('mutation')`。
6. 导出备份时，调用 `persistArchive('backup')` 更新 `lastBackupAt`。
7. 导入备份时，解析 JSON，验证结构，替换整个本地祖域仓。

### 10.3 旧数据兼容

- 旧英文 badge 会通过 `formatRitualBadgeLabel()` 自动转成中文显示。
- 旧版 meta 缺失时，store 会自动补齐 `lastHydratedAt / lastMutationAt / lastBackupAt`。
- 旧版 `truth-theme-mode` 会在启动时自动迁移到 `truth-theme-preset`。

### 10.4 主题预设与运行时链路

当前主题链路已经稳定为：

`theme preset -> themeClass -> runtime-theme.scss -> AppThemePage / H5 root class -> 页面和组件消费 CSS 变量`

当前四套运行时主题：

| 预设 ID | 标签 | 语义模式 | class |
| --- | --- | --- | --- |
| `light` | `黛蓝灰` | `light` | `theme-light` |
| `dark` | `夜祠墨` | `dark` | `theme-dark` |
| `altar-gold` | `夜祠金` | `dark` | `theme-solid-altar-gold` |
| `stele-cyan` | `碑青灰` | `light` | `theme-solid-stele-cyan` |

约束说明：

- 组件层继续统一消费现有 `--color-* / --gradient-cyber-* / --shadow-* / --overlay-*`
- 无渐变主题不新增变量命名，只把 `--gradient-cyber-*` 降级为纯色或透明层
- H5 通过 `theme-root.ts` 把 class 同步到 `html` / `body`
- 页面容器通过 `AppThemePage` 承接当前主题 class，保证小程序和 H5 行为一致
- 海报 Canvas 渲染不依赖 CSS 变量，而是通过 `themePosterPalettes` 在 JavaScript 侧获取当前主题的专用色板，每套主题约 28 个色值覆盖背景、面板、光球、文字、边框、分割线、签名等绘制要素

## 11. 软件流程说明

### 11.1 总览流程

```text
启动应用
  -> 进入首页祭台
  -> 初始化本地祖域仓
  -> 选择“开始接入祖域”
  -> 进入仪式页
  -> 选择动作 + 输入文案
  -> 跳转结果页
  -> 写入本地仪式记录
  -> 恢复或生成海报
  -> 进入祖域页查看 / 复用 / 删除 / 导出 / 导入
```

### 11.2 启动流程

1. `main.ts` 创建应用并挂载 Pinia，全局注册 `AppThemePage`。
2. `App.vue` 在 `onLaunch / onShow` 时调用 `appStore.hydrateThemeMode()`，同步主题预设。
3. 首页或其他页面首次渲染时调用 `ritualStore.ensureHydrated()`。
4. store 从本地读取 `truth.cyber-ritual.archive`。
5. 页面基于 store 计算首页指标、祖域状态、最近记录、海报列表。

### 11.3 首页流程

首页职责：

- 展示产品概念和赛博祭台氛围
- 显示本地仓状态、最近称号、本地海报数
- 判断当前设备处于首次进入、已有历史、已可传播哪个阶段
- 提供三个主要入口：
  - 接入祖域
  - 查看信号色板
  - 进入祖域样本库

### 11.4 仪式接入流程

1. 页面读取 query 参数。
2. 若来自历史复用，则自动填入祖先称呼、文案和动作。
3. 用户选择 1 到 3 个仪式动作。
4. 页面计算：
   - `totalIncenseValue`
   - `signalStrength`
   - `ritualBadge`
5. 用户点击“完成接入并生成结果”。
6. 页面生成 `ritualId`，将所有信息编码进 query，跳转到结果页。

### 11.5 结果页流程

1. 结果页读取 query 参数。
2. 若本地已有同 `ritualId` 的记录，则恢复旧记录。
3. 结果页立刻调用 `persistRitualRecord()`，把本次记录写入 store。
4. 如果本地已有海报缓存，则恢复海报并标记 `restored`。
5. 如果没有缓存，则自动或手动执行 `generatePoster()`。
6. 海报 Canvas 渲染采用三遍策略：
   - Pass 1：用 `wrapText` 测量各区域行数，推算动态 Y 坐标（`titleBottom`、`messageBottom`、`metricTop`、`memoTop`、`footerTop`）
   - Pass 2：根据动态 `panelHeight` 绘制背景渐变、光球、面板
   - Pass 3：在面板上绘制标题、祖先称呼、文案、提示条、指标卡片、备忘块、分割线、签名和行动文案
7. 面板高度和底部区域均为动态计算，不使用固定 Y 坐标，保证内容不超出面板边界
8. 平台差异：
   - H5：离屏 canvas + `toDataURL` 导出
   - 原生：uni canvas 节点 + `canvasToTempFilePath` 导出
9. 海报生成成功后：
   - 调用 `upsertPosterRecord()`
   - 更新海报状态为 `ready`
10. 用户可执行：
    - 重新生成分享图
    - 预览 / 保存海报（H5 预览图片，原生保存到相册）
    - 再祭一次
    - 去祖域页查看
11. 微信分享通过 `onShareAppMessage` 生命周期钩子注册，分享图使用已生成的海报 URL

### 11.6 祖域页流程

祖域页是本地仓控制台，包含五类操作：

1. 查看本地仓状态与统计
2. 导出本地备份 JSON
3. 从剪贴板或文本框导入备份 JSON
4. 管理海报：
   - 预览
   - 删除
5. 管理历史：
   - 重开战报
   - 复用仪式
   - 删除记录

### 11.7 备份导出流程

1. 用户点击“复制备份串”。
2. 页面调用 `ritualStore.exportArchiveSnapshot()`。
3. store 返回格式化 JSON 字符串并记录 `lastBackupAt`。
4. 页面将 JSON 写入剪贴板。

### 11.8 备份导入流程

1. 用户粘贴或读取剪贴板中的 JSON。
2. 页面切换 `backupImportStatus`。
3. 用户点击“恢复到当前设备”。
4. store 执行 `importArchiveSnapshot()`：
   - 校验 JSON
   - 校验结构
   - 规范化记录
   - 替换本地祖域仓
5. 祖域状态变更为 `imported`。

### 11.9 删除与清空流程

#### 删除记录

- 删除一条仪式记录时，会级联删除关联海报。

#### 删除海报

- 只删除海报缓存，不删除仪式记录本身。

#### 清空祖域仓

- 直接重置为全新空仓。
- 本地缓存 key 会被移除。
- 应用重新回到首次进入状态。

## 12. 当前项目边界与后续扩展建议

### 12.1 当前边界

- 不接远程 API
- 不做登录
- 不做云备份
- 不做跨设备同步
- 不做内容审核
- 不做社交关系链

### 12.2 若未来扩展

建议先保持以下顺序：

1. 继续强化本地体验与传播闭环
2. 完善海报模板与更多仪式动作
3. 增加更多本地可管理能力
4. 只有在产品规则变更后，才考虑解除 `REMOTE_API_ENABLED`

## 13. 结论

当前 `Truth` 的源码结构已经比较清晰，核心逻辑集中在五个层级：

1. 页面层负责流程编排和用户交互
2. 组件层负责复用 UI 和视觉呈现
3. composable 层负责主题等跨页面共享逻辑的便捷消费
4. store 层负责本地祖域仓的读写与聚合
5. 工具层负责缓存、ID、主题根节点同步和 uni 页面兼容逻辑

整个软件的核心闭环是：

`首页引导 -> 仪式接入 -> 结果生成 -> 本地归档 -> 祖域管理 -> 备份导出 / 导入`

这套闭环已经完全建立在“纯本地 + 本地缓存”的约束之上，且当前实现没有依赖任何远程接口。
