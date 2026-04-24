# Truth

`Truth` 当前是一款本地优先的“赛博祭祖”小程序 / H5 原型。

当前产品前提：

- `uni-app` 标准版
- `Vue 3 + TypeScript + Vite`
- `Pinia`
- `uni-ui`
- 赛博祭台视觉方向
- 纯本地 + 本地缓存
- 不上传用户祭祖内容

## 当前页面结构

- `/pages/index/index`：首页祭台，负责概念展示、本地状态概览和入口分发
- `/pages/workbench/index`：祖域页，负责本地记录、海报、备份导入导出和清空管理
- `/pages-sub/cyber/ritual-entry`：仪式接入页，负责祖先称呼、动作选择和文案输入
- `/pages-sub/cyber/ritual-result`：结果页，负责写入本地记录、恢复旧记录、生成和保存海报
- `/pages-sub/system/theme-preview`：主题预览页，负责切换和查看当前四套运行时主题

## 当前主链路

- 首页进入赛博祭台
- 接入祖域完成一次仪式
- 生成分享海报
- 把记录写入本机祖域仓
- 在祖域页查看、复用、删除和备份本地记录

当前阶段不做：

- 账号体系
- 云端同步
- 服务端存储
- 用户内容审核接口
- 远程祭祖记录上传

当前 `src/api/*` 仍保留为工程占位，但默认禁用：

- `REMOTE_API_ENABLED = false`
- 未经单独评审，不允许把页面或 store 接到远程请求

## 主题系统

当前运行时主题已经接入四套预设，并统一走同一条变量链路：

- `黛蓝灰`：浅色主方案
- `夜祠墨`：深色赛博主方案
- `夜祠金`：无渐变暗场候选
- `碑青灰`：无渐变亮场候选

主题实现约束：

- 主题根层统一使用 `--primary-* / --link-* / --success-* / --warning-* / --danger-* / --color-text-* / --color-bg-* / --color-border-*`
- 页面与组件直接消费 Arco 官方 token；赛博页面额外直接消费 `--scene-*` 扩展层，不再保留兼容桥或 `$ui-*` 中转
- scene 扩展层继续服务赛博页面，但不再承担全局结构 token 的职责
- 当前主题预设会持久化到本地缓存 `truth-theme-preset`
- 旧的 `truth-theme-mode` 会在启动时自动兼容迁移

## 启动

```bash
pnpm install
pnpm run lint
pnpm run dev:h5
```

微信小程序开发：

```bash
pnpm run dev:mp-weixin
```

开发补充说明：

- 当前优先验证平台仍然是 `H5 + 微信小程序`
- `src/manifest.json` 里的 `mp-weixin.appid` 仍为空，当前适合原型开发，不是可直接提审状态
- `pnpm run build:app-plus` 当前已可生成 `App` 调试资源，但本项目仍不把 `App` 端视为已验证平台

最小校验：

```bash
pnpm run lint
pnpm run type-check
```

## App 打包准备

当前 `App` 端现状：

- `pnpm run build:app-plus` 已可成功生成调试资源
- 构建产物用于 HBuilderX 导入调试，当前命令行输出的导入目录为 `dist/build/app`
- `src/manifest.json` 已补 `app-plus.optimization.subPackages = true`，与当前分包结构保持一致
- `src/manifest.json` 已补 `app-plus.distribute.android / ios` 字段骨架，但发布所需真实值仍需手工填写

在 HBuilderX 云打包或正式发版前，至少还要补齐这些真实配置：

- Android：`packagename`、签名 `keystore`、签名 `password`、签名别名 `aliasname`
- iOS：`appid`、`mobileprovision`、`p12`、证书密码
- 应用图标、启动图、应用名称与商店展示信息

当前建议的 App 真机回归重点：

- 海报生成后预览、保存到相册
- 首页 / 仪式页 / 结果页 / 祖域页主链路
- 剪贴板导出与导入恢复
- 自定义导航、底部吸附和安全区表现
- 输入框与 `textarea` 的键盘顶起行为

更细的 App 回归与发版准备，可直接参考：

- `docs/赛博祭祖-App打包与真机回归清单.md`

## 本地数据与备份

- 所有祭祖文案、祖先称呼、记录和海报状态默认只保存在当前设备
- 当前阶段不接接口，不上传用户祭祖内容，也不做云同步
- 小程序分享默认只分享应用入口，不把祖先称呼、悼词等用户内容塞进分享路径
- 只有你主动截图、保存到相册、复制备份串或手动发送图片时，内容才可能离开当前设备
- 祖域页支持删除单条记录、删除单张海报、清空本地归档、复制本地 JSON 备份串、手动导入恢复
- 卸载应用、清理缓存或更换设备，都可能导致本地数据丢失
- H5 生成的海报大图只用于当前页面预览或截图，默认不把 base64 大图写入本地归档，避免本地缓存膨胀
- 导入备份时会过滤远程图片、base64 图片等不安全海报缓存，只保留可安全持久化的本地图片路径

当前本地归档说明：

- storage key: `truth.cyber-ritual.archive`
- archive version: `v2`
- 旧缓存会在启动时自动迁移
- 检测到损坏缓存时会自动回退到空白祖域仓
- 手动导入恢复会直接覆盖当前设备上的本地祖域仓

推荐备份流程：

1. 在旧设备祖域页复制本地备份串
2. 在新设备祖域页粘贴 JSON
3. 确认覆盖恢复当前设备

主题偏好说明：

- storage key: `truth-theme-preset`
- 兼容旧 key: `truth-theme-mode`
- 主题切换当前不经过接口，也不会上传任何用户偏好

## 本地回归说明

- 当前推荐把 `docs/赛博祭祖-本地优先回归检查清单.md` 作为每轮改动后的最小验收基线
- 核心回归优先检查：首页 -> 仪式页 -> 结果页 -> 祖域页 -> 主题预设切换
- 本项目重点不是接口联调，而是本地写入、缓存恢复、海报状态和权限反馈是否稳定

## 目录

```text
src
├─ api
├─ components/app
├─ composables
├─ constants
├─ pages
├─ pages-sub
├─ stores
├─ styles
├─ types
├─ utils
├─ App.vue
├─ env.d.ts
├─ main.ts
├─ pages.json
├─ manifest.json
└─ uni.scss
```

## 当前重点

- 赛博祭祖主链路已经可跑通
- 海报生成、预览与保存已接通
- 海报 Canvas 渲染已改为三遍策略（测量 -> 面板 -> 内容），面板高度和底部区域动态计算，不再使用固定坐标
- 祭祖记录会默认写入本地祖域仓
- 本地缓存版本迁移与损坏兜底已接通
- 结果页已经覆盖海报缓存恢复、缓存失效、生成失败、保存权限被拒等状态
- 祖域页已经支持手动导出与导入恢复，纯本地闭环更完整
- 后续重点是继续补齐状态矩阵、隐私说明和工程收口

## 文档索引

- `docs/Truth-项目目录、模块接口与软件流程说明.md`：源码目录、store、路由、缓存结构和主链路说明
- `docs/赛博祭祖-本地优先回归检查清单.md`：围绕本地写入、海报、备份恢复和主题切换的最小回归基线
- `docs/赛博祭祖-App打包与真机回归清单.md`：`app-plus` 构建、HBuilderX 导入、发版前真实配置与真机回归清单
- `docs/uniapp-技术选型与UI框架分析.md`：uni-app、Vue 3、Pinia、uni-ui 的选型背景
- `docs/方案A-项目重规划与主题色体系.md`：主题 token、历史方案和当前无渐变候选补充
- `docs/赛博祭祖-本地优先产品缺口清单.md`：当前仍待收口的产品、文档和工程缺口
- `docs/赛博祭祖-核心页面低保真结构.md`：页面结构草图和信息架构
- `docs/赛博祭祖-热点概念与传播体验设计.md`：传播型体验方向说明
- `docs/赛博祭祖APP与小程序-产品概念与体验设计.md`：历史产品概念归档，当前不作为主线实现依据
