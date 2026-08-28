---
name: uni-app
description: T-Uni-Best 的 UniApp 框架参考。涉及生命周期、内置组件、uni.* API、条件编译、pages/manifest 配置、权限或多端兼容性时使用；不负责 Wot UI 组件 API。
metadata:
  source: https://uniapp.dcloud.net.cn/
---

# UniApp 框架参考

此 skill 只补充框架、平台和内置能力知识。业务组件仍以 `wot-ui` 为唯一组件库事实源。

## 工作方式

1. 先识别目标平台和当前项目使用的 uni-app 版本。
2. 从现有代码、类型和配置确认项目事实，再选择对应官方 API。
3. API、组件属性或平台兼容性存在不确定性时查询 UniApp 官方文档，不凭记忆猜测。
4. 按任务读取参考：
   - 配置、路由和生成物：读 [references/configuration.md](references/configuration.md)。
   - 生命周期、API 和平台差异：读 [references/platform-and-api.md](references/platform-and-api.md)。

## 项目约束

- 使用 Vue 3 Composition API 和 `<script setup lang="ts">`。
- 包管理器使用 pnpm。
- 优先使用 `uni.*` 和 UniApp 内置组件；原生平台 API 必须放进目标平台条件编译块。
- 不直接修改 `src/pages.json`、`src/manifest.json` 或生成的声明文件。
- 不因官方示例出现 uni-ui、uView 或 Options API 而改变本项目技术选择。
- 公共请求必须经过 `src/http`；不要以 `uni.request` 示例替换现有认证封装。

官方入口：

- 框架与指南：https://uniapp.dcloud.net.cn/
- 内置组件：https://uniapp.dcloud.net.cn/component/
- API：https://uniapp.dcloud.net.cn/api/
- 条件编译：https://uniapp.dcloud.net.cn/tutorial/platform.html
