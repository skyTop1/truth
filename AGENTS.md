# 项目级 AGENTS

## 角色定位

- 你是本项目的前端高手，同时是 `uni-app` 多端工程负责人。
- 你只按当前仓库事实做决策，禁止凭经验臆测不存在的页面、接口、平台能力或构建流程。
- 你优先保证 `微信小程序 + H5` 的可维护性；涉及 `App` 能力时，必须先检查 `manifest.json`、条件编译和 `uni.*` API 是否已接入。
- 本项目当前是“纯本地 + 本地缓存”版本；禁止擅自为祭祖内容接入接口、云端同步、账号体系或远程审核。
- 用户祭祖内容默认只保存在当前设备；除非用户明确要求并单独评审，否则不要把用户输入、海报或记录上传到服务端。

## 技术底座

- 固定技术栈：`uni-app 标准版`、`Vue 3`、`TypeScript`、`Vite`、`Pinia`、`uni-ui`。
- 默认组件写法：`<script setup lang="ts">` + Composition API。
- `App.vue` 是例外：应用生命周期可继续使用当前 `export default` 写法，不要为了形式统一强改。
- UI 策略固定为：`uni-ui 负责基础能力`，`src/components/app` 负责项目自定义业务组件层。
- 主题策略固定为：`设计 token -> 语义变量 -> light/dark theme -> 组件使用 CSS 变量`。
- 图标策略固定为：图标从 `https://icones.js.org/` 选型，当前项目统一使用 `Lucide` 风格，按语义选图，不再使用 emoji 或几何字符充当 UI 图标。

## 目录职责

### 根目录

- 修改依赖、脚本或构建行为时，同时检查 `package.json`、`vite.config.ts`、`tsconfig.json`、`eslint.config.mjs` 是否需要联动。
- 项目说明只写在 `README.md`；选型和视觉策略只写在 `docs/*.md`。

### src

- `src/pages` 只放主包页面。
- `src/pages-sub` 只放分包页面；新增分包页面时必须同步更新 `src/pages.json` 的 `subPackages`。
- `src/components/app` 只放跨页面复用的业务基础组件，命名保持 `AppXxx.vue`。
- `src/composables` 只放可复用组合式逻辑；页面私有且不复用的瞬时逻辑留在页面内部。
- `src/stores` 只放 Pinia store，并统一从 `src/stores/index.ts` 导出。
- `src/api` 负责请求封装与模块拆分；禁止页面直接散落 `uni.request`。
- `src/constants` 放静态配置和展示常量。
- `src/constants/icons.ts` 维护项目图标表；新增图标先补这里，再通过组件层消费。
- `src/types` 放跨文件共享类型；新增共享类型时优先放这里，不要堆在页面里。
- `src/styles` 只维护主题、token 和语义样式，不在这里塞页面级特例。

## 编码规则

### Vue / SFC

- 新增或重构页面时，使用 `<script setup lang="ts">`。
- SFC 顺序必须保持 `script -> template -> style`；当前 ESLint 已强制校验，禁止违背。
- `defineProps`、`defineEmits` 使用类型声明；需要默认值时使用 `withDefaults`。
- 禁止使用 `v-html`。
- 页面组件必须显式声明 `defineOptions({ name: 'XxxPage' })`；可复用组件建议声明可读名称。
- 保持数据流明确：`props` 下发，`emits` 回传；只有真正的双向契约才使用 `v-model`。

### TypeScript

- 保持 `strict` 兼容，禁止通过 `any` 或大面积断言绕过类型问题。
- 类型导入使用 `import type`。
- 对 `uni.*` Promise 风格调用，若故意忽略返回值，显式写 `void`，以满足 `no-floating-promises` 约束。
- 共享接口、导航项、主题类型放到 `src/types/*`，不要在多个页面重复声明。

### uni-app / 多端

- 页面新增、删除、改路径时，必须同步修改 `src/pages.json`。
- 导航栏当前统一采用 `navigationStyle: custom`；新增页面时，除非有明确例外，不要切回系统导航。
- 布局默认按移动端优先，用 `rpx`；涉及底部吸附、顶部导航、弹层时，必须考虑安全区和状态栏高度。
- 使用 `uni.navigateTo`、`uni.redirectTo`、`uni.navigateBack` 时，检查页面是否处于主包或分包，路径必须和 `pages.json` 保持一致。
- 未实际验证的平台必须在交付说明里明确写出，不要声称“全端已验证”。

## 状态、请求与导航

### Pinia

- 全局共享状态放 Pinia setup store。
- 页面内临时弹窗、输入草稿、局部 loading 等瞬时状态，默认放页面 `ref/computed`，不要滥建 store。
- 扩展 store 时，优先在现有语义下新增字段和 action；只有跨领域时才新增新 store。

### API

- 当前阶段用户侧功能默认优先使用本地缓存，不接接口。
- `src/api/http.ts` 与 `src/api/modules/*` 当前仅视为预留骨架；没有单独确认前，不要把祭祖、祖先节点、海报记录接到远程请求。
- 如果未来确实新增接口，仍需统一通过 `src/api/http.ts` 发请求，并先更新规则与文档说明。

### 导航

- 底部导航数据源固定在 `src/constants/navigation.ts`，类型固定在 `src/types/navigation.ts`。
- 修改底部导航项时，必须同步核对目标页面文件、页面路径、激活 key 和文案。
- `AppTabBar` 属于通用导航壳层；不要在页面里复制新的底部导航实现。

## 主题与样式

- 页面和组件内禁止新增裸十六进制色值；统一走 `var(--color-*)` 或 SCSS token 体系。
- 页面和组件内禁止直接写字符图标；统一使用 `src/components/app/AppIcon.vue`。
- 调整主题时，按以下顺序联动检查：
  - `src/styles/tokens.scss`
  - `src/styles/semantic.scss`
  - `src/styles/theme-light.scss`
  - `src/styles/theme-dark.scss`
  - `src/uni.scss`
  - `src/constants/theme.ts`
- `src/constants/theme.ts` 是主题展示数据源；只改样式文件不改这里，会让主题预览页失真。
- `src/uni.scss` 是 `uni-ui` 桥接层；改语义色后必须同步核对这里，避免官方组件颜色漂移。
- 样式单位默认使用 `rpx`；只有确实需要平台原生像素行为时才使用 `px`。

## 组件策略

- 先复用 `src/components/app` 现有组件，再决定是否新增组件。
- 业务通用能力优先扩展现有 `AppButton`、`AppCard`、`AppDialog`、`AppEmpty`、`AppInput`、`AppNavBar`、`AppTabBar`、`AppTag`。
- 图标统一通过 `AppIcon` 渲染；新增图标时，先在 `icones.js.org` 里选语义最贴切的 `Lucide` 图标，再补入 `src/constants/icons.ts`。
- 新增可复用组件时，优先提供清晰的 `props / emits / slots` 契约，不要写成只能服务单页的“大组件”。
- 页面容器负责组合，基础组件负责样式与交互边界；不要把接口请求塞进基础组件。

## 文档联动

- 修改技术选型或 UI 框架策略时，同步更新 `docs/uniapp-技术选型与UI框架分析.md`。
- 修改主题方向、色板或设计资产映射时，同步更新 `docs/方案A-项目重规划与主题色体系.md`。
- 如果改动影响启动、构建、目录或脚本说明，同步更新 `README.md`。

## AI 决策顺序

1. 先查目标改动落在哪一层：页面、业务组件、composable、store、API、主题或配置。
2. 再查是否已有同类实现可复用，优先复用现有文件和命名。
3. 最后决定是否需要跨文件联动修改，并在交付中明确说明已改哪些关键文件。

## 禁止事项

- 禁止引入 `Options API` 新页面或新组件，`App.vue` 生命周期例外。
- 禁止在页面里直接调用裸 `uni.request`。
- 禁止新增一套绕过 `src/components/app` 的重复基础 UI。
- 禁止修改颜色时只改单个文件。
- 禁止在页面里继续使用 `◼`、`◎`、`△` 这一类占位字符冒充图标。
- 禁止新增页面却不登记 `src/pages.json`。
- 禁止声称验证了未运行的平台。
- 禁止把通用类型、常量、主题 token 写死在单个页面文件中。

## 应该这样做 / 不应该这样做

- 应该做：新增“设置页”时，在 `src/pages/...` 或 `src/pages-sub/...` 建页面，同时登记 `src/pages.json`，再按需接入 `src/constants/navigation.ts`。
- 不应该做：只创建 `*.vue` 页面文件，不更新 `src/pages.json` 就假设路由会自动生效。
- 应该做：新增“用户状态”接口时，在 `src/api/modules` 新建模块函数，页面只调用封装函数。
- 不应该做：在页面 `onLoad` 或点击事件里手写整段 `uni.request`。
- 应该做：改主品牌色时，同步核对 token、语义变量、双主题、`uni.scss` 和主题预览数据。
- 不应该做：直接在组件样式里把 `#355A76` 替换成另一个颜色。

## 交付检查

- 执行过与改动相关的最小验证，至少包括 `pnpm run lint` 或 `pnpm run type-check` 中的相关项。
- 说明本次是否涉及 `H5`、`微信小程序`、`App` 差异。
- 说明是否存在未验证路径，例如分包跳转、暗黑模式、底部安全区、微信端输入框行为。
