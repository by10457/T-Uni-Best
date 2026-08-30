# T-Uni-Best 项目约束

## 项目定位

T-Uni-Best 是基于 unibest 的多端业务模板，在原有工程能力上重点增强了 Wot UI v2、UnoCSS、登录认证、双 Token 刷新、HTTP 容灾、测试与 AI 协作规范。

主要目录：

```text
src/pages          主包页面
src/pages-*        分包页面
src/pages-redirect 登录、注册、404 等重定向目标页面
src/components     业务与通用组件
src/api            手写 API 请求入口
src/http           HTTP、认证与错误处理
src/store          Pinia 状态与业务编排
src/service        服务与生成类型
src/tabbar         自定义 TabBar
src/utils          跨业务通用工具
```

## 工程事实源

| 手工维护 | 生成结果 | 约束 |
| --- | --- | --- |
| 页面内 `definePage`、`pages.config.ts` | `src/pages.json`、路由类型 | 不手改生成结果 |
| `manifest.config.ts` | `src/manifest.json` | 不手改生成结果 |
| `src/components`、组件解析配置 | `src/types/components.d.ts` | 不手改声明 |
| auto-import 配置和源码 | `src/types/auto-import.d.ts` | 不手改声明 |

## 技术选择

- Vue 页面默认使用 `<script setup lang="ts">` 和 Composition API。
- 普通布局与视觉优先使用 UnoCSS；复杂覆盖遵循 `css-styling`。
- 业务组件优先 Wot UI v2；使用任何 `wd-*` API 前读取 `wot-ui`。
- 图标默认使用 Iconify Carbon；不为单一图标引入新的图标库。
- 业务 API 通过 `src/api` 调用 `src/http`，保留既有单/双 Token 和 401 容灾行为。
- uniCloud 是显式选择的可选后端，不与默认 Java 后端链路混用。

## 平台规则

- 编译期可确定的平台差异使用 `#ifdef` / `#ifndef`。
- 只有编译期无法确定时才读取 `uni.getSystemInfoSync().uniPlatform` 等运行时信息。
- 使用 `uni.*` 跨端 API；必须调用平台原生对象时，应限制在相应条件编译块并说明原因。
- H5、小程序和 App 的权限、生命周期、Canvas、原生组件层级不能假设一致。

## 修改与验证

- 只修改当前任务需要的文件，不顺手更换组件库、请求库或状态方案。
- 新增依赖前检查许可证、维护状态、包体积、tree-shaking 和目标平台支持。
- 页面与样式至少验证目标端；公共 API 和类型变更执行 lint、type-check 和相关测试。
- 第三方类型错误要与本次源码错误区分，不为让命令变绿而扩大修改范围。
