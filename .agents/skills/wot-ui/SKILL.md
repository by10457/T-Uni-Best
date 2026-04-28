---
name: wot-ui
description: wot-ui uni-app 组件库开发指南（v2）。当用户询问 wot-ui 组件使用、配置、示例或 API 时使用此技能。
---

# wot-ui（v2）

此技能提供使用 wot-ui v2 组件库（`@wot-ui/ui`）开发应用程序的专业知识。

## 何时使用

当用户需要以下帮助时使用此技能：
- 实现特定的 wot-ui 组件（例如，"如何使用 Calendar 日历组件？"）
- 配置全局 Provider 或主题（含深色模式）
- 排查组件行为问题
- 查找 props、events 和 slots 的 API 参考
- 使用函数式调用（useToast / useDialog / useImagePreview / useVideoPreview 等）

## 组件参考

`references/` 目录包含每个组件的详细文档（均来自 v2 官方 llms-full.txt）。当用户询问特定组件时，请检查 `references/` 中对应的 markdown 文件。

### 指南 (Guide)

- [introduction.md](references/introduction.md) — 简介与起步
- [quick-use.md](references/quick-use.md) — 快速使用（安装、easycom 配置）
- [common-problems.md](references/common-problems.md) — 常见问题
- [custom-theme.md](references/custom-theme.md) — 自定义主题（CSS 变量）
- [custom-style.md](references/custom-style.md) — 样式覆盖（custom-class / custom-style 外部样式类）⭐ v2 新增
- [dark-mode.md](references/dark-mode.md) — 深色模式（wd-config-provider theme="dark"）⭐ v2 新增
- [unocss-preset.md](references/unocss-preset.md) — UnoCSS Preset（@wot-ui/unocss-preset）⭐ v2 新增
- [design.md](references/design.md) — 设计规范 ⭐ v2 新增
- [locale.md](references/locale.md) — 国际化
- [cli.md](references/cli.md) — 脚手架（create-uni）⭐ v2 新增
- [templates.md](references/templates.md) — 模板列表（wot-starter 等）⭐ v2 新增
- [open-wot.md](references/open-wot.md) — @wot-ui/cli + MCP Server（离线组件知识库、wot list/info/doc/demo/lint 命令）⭐ v2 新增
- [skills.md](references/skills.md) — 官方 AI Skills 生态（wot-ui-v2、wot-ui-cli、unocss-preset-guide 等 skill 入口）⭐ v2 新增

### 基础 (Basic)

- [button.md](references/button.md), [cell.md](references/cell.md), [config-provider.md](references/config-provider.md), [icon.md](references/icon.md), [img.md](references/img.md), [layout.md](references/layout.md), [popup.md](references/popup.md), [resize.md](references/resize.md), [transition.md](references/transition.md)

### 表单 (Form)

- [calendar.md](references/calendar.md), [calendar-view.md](references/calendar-view.md)
- [cascader.md](references/cascader.md) ⭐ v2 新增 — 树形结构级联选择器，支持静态数据与异步加载
- [checkbox.md](references/checkbox.md)
- [col-picker.md](references/col-picker.md)
- [datetime-picker.md](references/datetime-picker.md), [datetime-picker-view.md](references/datetime-picker-view.md)
- [form.md](references/form.md)
- [input.md](references/input.md), [input-number.md](references/input-number.md), [password-input.md](references/password-input.md), [textarea.md](references/textarea.md)
- [keyboard.md](references/keyboard.md), [number-keyboard.md](references/number-keyboard.md)
- [picker.md](references/picker.md), [picker-view.md](references/picker-view.md)
- [radio.md](references/radio.md)
- [rate.md](references/rate.md)
- [search.md](references/search.md)
- [select-picker.md](references/select-picker.md)
- [signature.md](references/signature.md)
- [slider.md](references/slider.md)
- [switch.md](references/switch.md)
- [upload.md](references/upload.md), [img-cropper.md](references/img-cropper.md)
- [slide-verify.md](references/slide-verify.md)

### 反馈 (Action)

- [action-sheet.md](references/action-sheet.md), [curtain.md](references/curtain.md), [drop-menu.md](references/drop-menu.md), [overlay.md](references/overlay.md), [popover.md](references/popover.md), [swipe-action.md](references/swipe-action.md)
- [dialog.md](references/dialog.md) ⭐ v2 新增 — 弹出对话框（Alert / Confirm / Prompt），支持函数式调用，完全替代并移除了旧版 message-box
- [notify.md](references/notify.md), [toast.md](references/toast.md), [loading.md](references/loading.md)
- [tooltip.md](references/tooltip.md)
- [fab.md](references/fab.md), [floating-panel.md](references/floating-panel.md)

### 展示 (Display)

- [avatar.md](references/avatar.md), [badge.md](references/badge.md), [tag.md](references/tag.md)
- [card.md](references/card.md), [circle.md](references/circle.md), [divider.md](references/divider.md)
- [collapse.md](references/collapse.md)
- [count-down.md](references/count-down.md), [count-to.md](references/count-to.md)
- [empty.md](references/empty.md) ⭐ v2 新增 — 缺省占位展示，内置 no-result / no-wifi / no-content 等图标
- [grid.md](references/grid.md), [table.md](references/table.md)
- [loadmore.md](references/loadmore.md) — 加载更多（state: loading / finished / error，支持 reload 事件和自定义文案）
- [image-preview.md](references/image-preview.md) ⭐ v2 新增 — 图片预览，支持多图滑动与函数式调用（useImagePreview）
- [video-preview.md](references/video-preview.md) ⭐ v2 新增 — 视频预览，支持函数式调用（useVideoPreview）
- [notice-bar.md](references/notice-bar.md), [status-tip.md](references/status-tip.md)
- [progress.md](references/progress.md), [steps.md](references/steps.md)
- [segmented.md](references/segmented.md)
- [skeleton.md](references/skeleton.md)
- [sort-button.md](references/sort-button.md)
- [swiper.md](references/swiper.md)
- [text.md](references/text.md)
- [tour.md](references/tour.md)
- [watermark.md](references/watermark.md)
- [root-portal.md](references/root-portal.md)
- [gap.md](references/gap.md)

### 导航 (Navigation)

- [backtop.md](references/backtop.md)
- [index-bar.md](references/index-bar.md)
- [navbar.md](references/navbar.md)
- [pagination.md](references/pagination.md)
- [sidebar.md](references/sidebar.md)
- [sticky.md](references/sticky.md)
- [tabbar.md](references/tabbar.md)
- [tabs.md](references/tabs.md)

### 组合式函数 (Composables)

- [use-config-provider.md](references/use-config-provider.md)
- [use-count-down.md](references/use-count-down.md)
- [use-dialog.md](references/use-dialog.md) ⭐ v2 新增 — 函数式调用 wd-dialog（alert / confirm / prompt / show / close）
- [use-image-preview.md](references/use-image-preview.md) ⭐ v2 新增 — 函数式调用 wd-image-preview
- [use-notify.md](references/use-notify.md)
- [use-toast.md](references/use-toast.md)
- [use-upload.md](references/use-upload.md)
- [use-video-preview.md](references/use-video-preview.md) ⭐ v2 新增 — 函数式调用 wd-video-preview

## v1 → v2 关键变更速查

| 变更类型 | v1 | v2 |
| --------- | ---- | ---- |
| **包名** | `wot-design-uni` | `@wot-ui/ui` |
| **easycom 前缀** | `wot-design-uni/components` | `@wot-ui/ui/components` |
| **新增组件** | — | `wd-cascader`, `wd-dialog`, `wd-empty`, `wd-image-preview`, `wd-video-preview` |
| **新增 Composable** | — | `useDialog`, `useImagePreview`, `useVideoPreview` |
| **深色模式** | 无内置支持 | `wd-config-provider` 加 `theme="dark"` |
| **样式覆盖** | 文档较少 | 新增 `custom-style` 详细指南 |
| **UnoCSS** | 无 | 提供 `@wot-ui/unocss-preset` |
| **Dialog vs MessageBox** | 存在 `wd-message-box` | 彻底移除 `wd-message-box`，全部替换为 `wd-dialog` + `useDialog` |

## 使用模式

1. **识别组件**: 确定用户感兴趣的组件。
2. **查阅参考**: 阅读 `references/<component-name>.md` 中的具体组件文档。
3. **提供示例**: 使用文档中的示例来指导用户。确保严格遵守参考中定义的 API（props, events）。

## 最佳实践

- **包名**: 所有导入来自 `@wot-ui/ui`，不再是 `wot-design-uni`。
- **自动引入**: npm 安装方式下，推荐通过 `WotResolver` 配合 `@uni-helper/vite-plugin-uni-components` 自动引入组件，或通过 `pages.json` easycom 正则配置（前缀 `@wot-ui/ui/components`）。
- **函数式调用**: Toast / Dialog / Notify / ImagePreview / VideoPreview 均需在页面中先声明对应组件实例（如 `<wd-dialog />`），再通过 `useXxx()` 调用。
- **ConfigProvider**: v2 新增 `theme`（`'light' | 'dark'`）和 `theme-vars`（`ConfigProviderThemeVars`）props，可局部覆盖主题变量，无需全局修改 CSS。
- **深色模式**: 需要在入口文件引入 `@wot-ui/ui/styles/theme/index.scss` 后，再通过 `wd-config-provider` 的 `theme` prop 切换。
- **类型**: 使用文档中显示的正确 TypeScript 接口；`ConfigProviderThemeVars` 可从 `@wot-ui/ui` 中导入。
- **v-model**: 注意支持 `v-model` 双向绑定的组件。
- **事件**: 注意某些事件可能具有特定参数（例如 `{ item, index }`）。
- **Cascader**: 省市区场景可直接配合 `@vant/area-data` 的 `useCascaderAreaData` 使用。
- **CLI 工具**: 可安装 `@wot-ui/cli`（`npm i -g @wot-ui/cli`）使用 `wot info/doc/demo/token` 等命令离线查询组件文档，或通过 `wot mcp` 启动 MCP Server 接入 AI 编辑器。
