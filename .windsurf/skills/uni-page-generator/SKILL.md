---
name: uni-page-generator
description: 基于项目规范快速生成 uni-app 页面
---

# uni-app 页面生成器

快速创建符合项目规范的 uni-app 页面。

## 使用场景

- 创建主包页面 (`src/pages/`)
- 创建分包页面 (`src/pages-**/`)
- 自动配置布局

## 页面模板

### 基础页面

```vue
<script setup lang="ts">
definePage({
  name: '页面名称',           // 路由 name，用于编程式导航
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '页面标题',
  },
})

const { handleBack } = useNavBack()

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

  <view class="">
    <!-- 页面内容 -->
  </view>
</template>
```

## 目录结构

```
src/
├── pages/              # 主包页面（TabBar 页面）
│   ├── index/
│   │   └── index.vue
│   └── about/
│       └── index.vue
├── pages-**/           # 分包页面
│   └── ...
```

## 创建步骤

1. **确定页面位置**
   - TabBar 页面 → `src/pages/{name}/index.vue`
   - 普通页面 → `src/pages-**/{name}/index.vue`

2. **使用 definePage 宏**
   - 配置 `name` 用于编程式导航
   - 配置 `style` 设置导航栏

## 注意事项

- 分包目录需在 `vite.config.ts` 的 `subPackages` 中注册
- 页面文件名固定为 `index.vue`
- 使用 UnoCSS 原子化样式
- 在图标的使用上，已经在项目中安装iconify，有一个carbon 图标库可以去查找使用
