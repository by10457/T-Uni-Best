---
name: ucharts
description: 在 T-Uni-Best 中安装、使用或排查 uCharts/qiun-data-charts，包括 Vue 3 数据结构、Canvas 生命周期、主题、跨端差异和小程序包体积。普通数据展示或 Wot UI Table 不应触发。
---

# uCharts 跨端图表

## 先选接入形态

- `qiun-data-charts`：需要声明式组件、常见图表和较快交付时优先评估。
- `@qiun/ucharts`：需要直接控制 Canvas、实例和更细粒度生命周期时评估。

不要同时引入两套实现。安装或升级时同时加载 `uni-plugin-integration`，核对当前官方包名、版本、许可证和平台支持。

## 项目适配

- 使用 pnpm、Vue 3 Composition API 和 `<script setup lang="ts">`。
- 不直接编辑 `src/pages.json`、`src/manifest.json`；组件解析和 easycom 配置写入项目现有配置事实源。
- 图表外围布局遵循 `css-styling`；不要为图表引入另一套 UI 组件库。
- 图表主题色应来自项目现有设计变量，不在每个页面复制一套颜色。
- 读取 [references/integration.md](references/integration.md) 处理数据、生命周期和跨端验证。

## 性能边界

- 小程序端关注 Canvas 数量、数据点规模、动画和分包体积。
- 高频数据更新做节流或批量刷新，不因每个响应式字段变化重建图表。
- 页面隐藏/卸载后停止定时刷新并释放监听；避免在列表中无上限创建图表实例。
- 图表不可用时应提供加载、空数据和错误状态，关键业务数据最好保留可访问的文本摘要。

官方入口：

- uCharts：https://www.ucharts.cn/
- DCloud 插件：https://ext.dcloud.net.cn/plugin?id=271
