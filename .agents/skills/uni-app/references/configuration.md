# 配置、路由与生成物

## 事实源映射

| 需求 | 修改位置 | 不修改 |
| --- | --- | --- |
| 页面标题、导航栏、页面级配置 | 页面内 `definePage` | `src/pages.json` |
| 全局页面配置、tabBar 投影 | `pages.config.ts`、项目现有 tabbar 配置 | 生成后的 JSON |
| App、小程序、H5 manifest | `manifest.config.ts` | `src/manifest.json` |
| 分包根目录 | `vite.config.ts` 的 UniPages 配置 | 生成后的 pages 列表 |
| 组件自动引入 | `vite.config.ts`、现有 resolver/easycom 事实源 | 生成声明 |

## 页面和分包

- 创建页面时同时加载 `uni-page-generator`，遵循 T-Uni-Best 的 `index.vue` 和分包目录约定。
- 主包放 `src/pages`，非首屏业务优先放 `src/pages-*` 分包。
- 新增分包根目录才修改 Vite 的 `subPackages`；已有分包内加页面不要重复注册根目录。
- 生成路由和声明后，用 `pnpm type-check` 检查路由类型。

## manifest 与权限

- 先确认能力属于 H5、小程序还是 App，再放到对应平台配置下。
- App 权限、SDK、原生插件配置不能推断为小程序配置，反之亦然。
- AppID、广告位、服务地址和密钥不要硬编码到源码；按现有 env 或安全配置机制处理。

## 验证

配置变更至少执行目标平台构建。跨端公共配置应分别验证受影响平台，不能只凭 H5 开发环境判断小程序结果。
