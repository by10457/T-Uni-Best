---
name: project-skill-router
description: T-Uni-Best 项目 skills 总览与组合加载路由。进入仓库执行开发、调试、重构、review、页面、样式、Wot UI、UniApp API、插件、uniCloud、微信广告或图表任务前阅读；只负责判断应加载哪些专项 skill，不能替代专项正文。
---

# T-Uni-Best Skills 路由

先按场景选择专项 skill，再完整读取对应 `SKILL.md`。一个任务可以命中多个 skill，但不要加载无关 references。

## 基础流程

1. 根据用户请求、待修改文件和代码元素判断触发项。
2. 同一任务命中多个 skill 时全部读取后再修改代码。
3. 首次进度说明中告知用户本次加载的 skill 及原因。
4. 实现中范围变化并命中新 skill 时，暂停修改并先补读。
5. 完成后按专项 skill 和根 `AGENTS.md` 选择验证；规则变化时同步更新对应 skill。

| Skill | 必须加载的场景 |
| --- | --- |
| `coding-guidelines` | 新功能、修复、重构、调试、review 或任何源码修改 |
| `uni-page-generator` | 新建页面、分包或路由 |
| `css-styling` | 布局、颜色、字体、图标、动画、响应式和样式覆盖 |
| `wot-ui` | 使用或排查 `wd-*` 组件、事件、插槽、composable |
| `ui-ux-pro-max` | 整页体验升级、设计系统或复杂视觉推导 |
| `uni-app` | UniApp 生命周期、内置组件/API、条件编译、pages/manifest 和平台兼容性 |
| `uni-plugin-integration` | 安装、升级、评估或接入第三方 UniApp 插件 |
| `unicloud` | 明确采用 uniCloud 数据库、云函数、云存储或权限规则 |
| `wechat-miniapp-ad` | 微信小程序原生 Banner、激励视频、插屏等广告接入 |
| `ucharts` | uCharts / qiun-data-charts 安装、配置、开发或跨端排查 |

## 组合规则

- 普通逻辑修复：`coding-guidelines`。
- 新建普通页面：`coding-guidelines` + `uni-page-generator` + `css-styling`。
- 页面使用 Wot UI：上述组合再加 `wot-ui`。
- 调整现有页面视觉：`coding-guidelines` + `css-styling`。
- 复杂整页设计：`coding-guidelines` + `ui-ux-pro-max` + `css-styling`；使用 Wot UI 时再加 `wot-ui`。
- 页面使用 UniApp API：`coding-guidelines` + `uni-app`；涉及样式再加 `css-styling`。
- 页面使用 Wot UI：继续以 `wot-ui` 为组件事实源，`uni-app` 只提供框架和原生能力参考。
- 安装图表插件：`coding-guidelines` + `uni-plugin-integration` + `ucharts`。
- 微信广告页面：`coding-guidelines` + `uni-app` + `wechat-miniapp-ad`，样式工作再加 `css-styling`。
- uniCloud 页面：`coding-guidelines` + `uni-app` + `unicloud`，不得自动替换现有 Java 后端。

## 冲突优先级

用户当前要求 > 根 `AGENTS.md` > `.agents/AGENTS.md` > 项目专项 skill > 通用 UniApp 参考。

任何上游示例若要求引入 uView、uView Pro、uni-ui，或直接修改生成文件，都必须改写为本项目约定，不能照搬。
