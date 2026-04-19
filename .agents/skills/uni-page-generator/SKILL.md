---
name: uni-page-generator
description: 快速生成符合 T-Uni-Best 项目规范的 uni-app 页面。只要用户提到"新建页面"、"创建页面"、"搭一个页面"、"做个XXX页"、"加一个分包"、"新增路由"，或者需要初始化任何新的 .vue 页面文件时，都必须加载此 skill 获取标准模板和目录规范，不能凭记忆直接写。
allowed-tools: Bash(mkdir:*), Write, Read
---

# uni-app 页面生成器

快速创建符合 T-Uni-Best 项目规范的 uni-app 页面。

## 使用场景

- 创建主包 TabBar 页面（`src/pages/`）
- 创建分包页面（`src/pages-**/`）
- 初始化带自定义导航栏的标准页面

## 创建步骤

1. **确定页面位置**
   - TabBar 页面 → `src/pages/{name}/index.vue`
   - 普通业务页面 → `src/pages-{module}/{name}/index.vue`

2. **创建目录和文件**，使用以下标准模板

3. **注册分包**（分包页面需要）：在 `vite.config.ts` 的 `subPackages` 数组中添加分包路径

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
  <wd-navbar
    custom-style="background-color: #ffffff !important;"
    :bordered="false"
    safe-area-inset-top
    placeholder
    fixed
    left-arrow
    @click-left="handleBack"
  />

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
- 分包目录名必须以 `pages-` 开头，并在 `vite.config.ts` 中注册
- src目录下的`manifest.json` `pages.json` 不允许编写，此为编译阶段自动生成，相关配置需在 `manifest.config.ts` `pages.config.ts` 中编写

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
