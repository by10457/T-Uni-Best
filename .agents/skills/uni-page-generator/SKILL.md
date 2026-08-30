---
name: uni-page-generator
description: T-Uni-Best 的 uni-app 页面与路由创建规范。只要新建或初始化 .vue 页面、创建主包/分包、增加路由、添加新的 src/pages-* 分包根目录，或用户说“新建页面”“搭一个页面”“新增路由”时都必须加载；修改现有页面但不创建路由时通常不触发。
---

# uni-app 页面生成器

创建符合当前仓库约定的 uni-app 页面。页面创建通常还会触发 `coding-guidelines` 和 `css-styling`；使用 Wot UI 时再加载 `wot-ui`。

## 使用场景

- 创建主包 TabBar 页面（`src/pages/`）
- 创建分包页面（`src/pages-**/`）
- 初始化带自定义导航栏的标准页面

## 创建步骤

1. **先检查现状**
   - 根据业务名称搜索 `src/pages-*` 中已有页面、占位页面、入口跳转和路由类型，不能只检查目标目录。
   - 查看相邻页面、`vite.config.ts` 的 `UniPages({ subPackages })` 和 `pages.config.ts`。
   - 已有同业务占位页面时直接在原路径实现，禁止另建同名页面规避占位文件。
   - 优先使用已有业务分包，不为单个页面随意创建分包。

2. **确定页面位置**
   - 主包页面 → `src/pages/{name}/index.vue`
   - 已有业务分包页面 → `src/pages-{module}/{name}/index.vue`
   - 登录、注册、404 等重定向目标 → 复用 `src/pages-redirect`
   - 目录归属以业务入口和现有分包职责为准。

3. **创建目录和文件**，参考最小模板并匹配相邻页面的数据流和导航方式。

4. **按需注册分包根目录**
   - 仅当新增 `src/pages-{module}` 根目录时，才加入 `vite.config.ts` 的 `subPackages`。
   - 在已有分包中新建页面无需重复注册。

## 标准页面模板

```vue
<script setup lang="ts">
// =================== 路由配置 ===================
definePage({
  name: '页面英文名称',           // 用于编程式导航的路由 name
  style: {
    navigationStyle: 'custom',    // 使用自定义导航栏
    navigationBarTitleText: '页面标题',
  },
})

// =================== 导入依赖 ===================
// import { xxx } from '@/api/xxx'

// =================== 类型定义 ===================
// interface XxxData { ... }

// =================== 变量声明 ===================
/** 返回上一页处理，全局统一 */
const { handleBack } = useNavBack()

// =================== 函数定义 ===================
// const handleXxx = () => { ... }

// =================== 事件监听 ===================
// watch(() => store.xxx, (val) => { ... })
// uni.$on('xxx', (params) => { ... })

// =================== 生命周期 ===================
// onLoad((options) => { ... })
// onShow(() => { ... })
// onMounted(() => { ... })
// onUnmounted(() => { ... })
</script>

<template>
  <!-- 自定义导航栏 -->
  <wd-navbar :bordered="false" safe-area-inset-top placeholder fixed left-arrow @click-left="handleBack" />

  <!-- 页面内容区域 -->
  <view class="page">
    <!-- TODO: 页面内容 -->
  </view>
</template>
```

## 目录结构参考

```
src/
├── pages/              # 主包页面（TabBar 页面）
│   ├── index/
│   │   └── index.vue
│   └── profile/
│       └── index.vue
└── pages-order/        # 分包：订单模块
    ├── list/
    │   └── index.vue
    └── detail/
        └── index.vue
```

## 注意事项

- 页面文件名固定为 `index.vue`
- `definePage` 的 `name` 字段用于 `uni.navigateTo({ name: '...' })` 编程式导航
- 样式优先使用 UnoCSS 原子化类名（如 `flex flex-col items-center p-4`）
- 图标使用 Iconify 的 carbon 图标库：`<i class="i-carbon-xxx" />`
- 分包目录名必须以 `pages-` 开头；只有新增分包根目录时才在 `vite.config.ts` 注册
- 禁止编写生成产物 `src/manifest.json`、`src/pages.json`；配置维护在 `manifest.config.ts`、`pages.config.ts` 和页面 `definePage`
- 不要把模板中的全部分区注释机械复制到短页面；保留真实分区，并按 `coding-guidelines` 为业务声明添加中文注释
- 完成后搜索旧路径和同名路由，确认入口、恢复跳转和业务文档指向唯一实现
- 导航栏颜色和页面背景应匹配相邻页面或现有主题配置，不在模板中硬编码白色

## 平台条件编译示例

```vue
<script setup lang="ts">
// #ifdef MP-WEIXIN
import { mpApi } from '@/utils/mp'
// #endif

const handleClick = () => {
  // #ifdef H5
  // H5 平台逻辑
  // #endif

  // #ifdef MP-WEIXIN
  // 微信小程序逻辑
  // #endif
}
</script>
```
