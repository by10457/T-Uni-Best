# T-Uni-Best 项目规范

基于 **uniapp + Vue3 + TypeScript + Vite5 + UnoCSS** 的跨平台开发框架（T-Uni-Best / unibest）。支持 H5、微信/支付宝小程序、APP 多平台，无需依赖 HBuilderX，支持命令行开发。

---

## 可用 Skills

遇到对应场景时，**主动加载对应 skill 文件**获取完整指南，不要凭记忆猜测细节：

| Skill | 路径 | 触发场景 |
|-------|------|---------|
| `uni-page-generator` | `.agents/skills/uni-page-generator/SKILL.md` | 创建新页面、新分包页面 |
| `css-styling` | `.agents/skills/css-styling/SKILL.md` | 编写或审查样式、使用图标、覆盖组件库样式 |
| `wot-ui` | `.agents/skills/wot-ui/SKILL.md` | 使用 Wot UI 组件、查询组件 API、排查组件问题 |
| `ui-ux-pro-max` | `.agents/skills/ui-ux-pro-max/SKILL.md` | 做 UI/UX 设计、生成设计系统、选色板字体 |
| `coding-guidelines` | `.agents/skills/coding-guidelines/SKILL.md` | 开始新功能、重构代码、review/调试代码 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | uni-app + Vue 3（Composition API） |
| 语言 | TypeScript（严格模式，禁止 `any`） |
| 构建 | Vite 5 |
| 样式 | UnoCSS（原子化优先）|
| 组件库 | **Wot UI**（默认组件库，详见 `wot-ui` skill） |
| 状态 | Pinia |
| 路由 | 约定式路由（`definePage` 宏自动生成 `pages.json`） |
| HTTP | 简单http / alova / @tanstack/vue-query（三选一） |
| 图标 | Iconify — carbon 图标库（`i-carbon-*`），可按需扩充 |

---

## 目录结构

```
src/
├── pages/          # 主包页面（TabBar 页面），每个页面固定为 index.vue
├── pages-**/       # 分包页面，需在 vite.config.ts subPackages 注册
├── components/     # 全局复用组件（PascalCase 命名）
├── layouts/        # 布局文件
├── api/            # API 接口定义（按功能模块拆分）
├── http/           # HTTP 请求封装（http.ts / alova.ts / vue-query.ts）
├── store/          # Pinia Store
├── tabbar/         # 自定义底部导航栏
├── style/          # 全局样式
└── App.ku.vue      # 全局根组件（替代 App.vue template）
```

核心配置文件：`vite.config.ts` / `pages.config.ts` / `manifest.config.ts` / `uno.config.ts`

---

## 开发命令

```bash
pnpm dev             # H5
pnpm dev:mp          # 微信小程序
pnpm dev:mp-alipay   # 支付宝/钉钉
pnpm dev:app         # APP
pnpm lint:fix        # 格式修复
pnpm type-check      # 类型检查
```

---

## 核心编码规范（摘要）

### Vue SFC 结构顺序
1. `<script setup lang="ts">` — 必须第一个
2. `<template>` — 必须第二个
3. `<style scoped>` — 最后（使用原子化类名时可省略）

脚本内代码顺序：导入依赖 → 类型定义 → 变量声明 → 函数定义 → 生命周期

### TypeScript
- 禁止 `any`，用 `interface` 定义对象类型，`type` 定义联合类型
- 导入类型使用 `import type` 语法

### 样式（详见 `css-styling` skill）
- **禁止**在 `<style>` 中写布局、间距、颜色等普通元素样式，一律用 UnoCSS 原子化类名
- `<style scoped>` 仅用于：① `:deep()` 覆盖组件库内部样式　② 伪元素　③ `@keyframes`
- **即使使用 Wot UI，也必须覆盖与设计稿不符的默认样式**

### uni-app
- 使用 `uni.xxx` API，禁止直接调用原生 API
- 平台差异使用条件编译：`// #ifdef MP-WEIXIN` / `// #endif`

### 代码注释
- 函数/变量/类/接口上方用 `/** */` JSDoc
- 函数内部关键逻辑用 `//`
- 关键 HTML 标签上方用 `<!-- -->`

### AI 行为准则（详见 `coding-guidelines` skill）
1. 编码前明确假设，不确定先问
2. 只实现被要求的功能，不加推测性扩展
3. 只改动必须改动的部分，不顺带优化相邻代码
4. 将任务转化为可验证目标，完成后自验证
