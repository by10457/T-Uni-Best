---
name: css-styling
description: T-Uni-Best 项目 CSS 样式规范。凡是在 template 中写 class 属性、讨论布局方式、调整间距颜色、使用或查找图标、需要覆盖 Wot UI 组件默认样式、或者用户说"样式太丑了"/"这个按钮加点样式"/"图标怎么变颜色"等任何与样式视觉相关的需求时，都应加载此 skill，即便用户没有明确说"查样式规范"。
---

# CSS 样式编写规范

本项目使用 **UnoCSS 原子化 CSS** 作为唯一样式方案。编写样式前必须阅读并遵守本规范。

| 维度 | 规范要求 | 备注 |
| :--- | :--- | :--- |
| **样式引擎** | UnoCSS | 严格遵循 `uno.config.ts` 配置 |
| **组件库** | Wot UI | 优先使用组件库简化代码 |
| **图标** | Iconify (carbon) | 统一使用 Carbon 图标库 |
| **自定义 SVG** | i-my-icons-{name} | 放 `src/static/my-icons/` 目录 |

---

## 一、原子化优先原则（核心）

### ✅ 必须这样做
**所有布局、间距、颜色、字体均使用 UnoCSS 原子化类名**，直接写在 `class` 属性上。

```vue
<!-- ✅ 正确：完全使用原子化类名 -->
<view class="flex flex-col gap-3 px-4 py-3 bg-white rounded-xl">
  <text class="text-sm font-semibold text-gray-800">标题</text>
  <text class="text-xs text-gray-500 leading-relaxed">描述内容</text>
</view>
```

### ❌ 禁止这样做
**禁止在 `<style>` 块中为普通元素编写布局、间距、颜色等样式**。

```vue
<!-- ❌ 错误：不允许在 style 中写这些 -->
<view class="card">内容</view>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
}
</style>
```

---

## 二、`<style>` 块的唯一合法用途

`<style scoped>` 仅允许用于以下 **3 种场景**，其他任何情况都应改用原子化类名：

### 场景 1：覆盖第三方组件库内部样式

组件库（Wot UI 等）的内部 Shadow DOM 或深层 CSS 变量无法用原子化类名覆盖，此时可用 `:deep()`。

```vue
<style scoped>
/* ✅ 合法：覆盖 Wot UI 组件内部样式 */
:deep(.wd-button__text) {
  font-size: 28rpx;
  letter-spacing: 2rpx;
}

:deep(.wd-input__inner) {
  padding: 0 24rpx;
}

/* ✅ 合法：通过 CSS 变量覆盖主题 */
:deep(.wd-tabs) {
  --wot-tabs-nav-height: 88rpx;
}
</style>
```

### 场景 2：复杂伪类 / 伪元素

原子化类名无法表达的 `::before`、`::after`、`:nth-child()` 等。

```vue
<style scoped>
/* ✅ 合法：伪元素装饰线 */
.section-title::before {
  content: '';
  display: inline-block;
  width: 6rpx;
  height: 32rpx;
  background-color: var(--wot-color-theme, #0957DE);
  border-radius: 3rpx;
  margin-right: 12rpx;
  vertical-align: middle;
}
</style>
```

### 场景 3：动画 `@keyframes`

```vue
<style scoped>
/* ✅ 合法：自定义动画帧 */
@keyframes slide-up {
  from { transform: translateY(20rpx); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
```

---

## 三、UnoCSS 配置速查（`uno.config.ts`）

### 内置快捷类

| 类名 | 等效原子类 | 用途 |
|------|-----------|------|
| `center` | `flex justify-center items-center` | 居中布局 |

### 自定义字体大小

| 类名 | 字号 | 行高 |
|------|------|------|
| `text-2xs` | 20rpx | 28rpx |
| `text-3xs` | 18rpx | 26rpx |

### 主题色

| 类名 | 值 | 说明 |
|------|-----|------|
| `text-primary` | `var(--wot-color-theme, #0957DE)` | 跟随 Wot UI 主题色 |
| `bg-primary` | 同上 | 背景主题色 |

### 安全区域类（移动端适配）

| 类名 | 作用 |
|------|------|
| `p-safe` | 四边安全区 padding |
| `pt-safe` | 顶部安全区 padding |
| `pb-safe` | 底部安全区 padding |

### 支持的 Transformer

```vue
<!-- transformerVariantGroup：() 分组语法 -->
<view class="hover:(bg-gray-100 text-primary) focus:(ring-2 ring-primary)">

<!-- transformerDirectives：在 style 中使用 @apply -->
<style scoped>
.my-btn {
  @apply flex center px-6 py-2 rounded-lg text-primary;
}
</style>
```

---

## 四、图标使用规范

### Carbon 图标（首选）

使用 Iconify 的 `carbon` 图标集，通过原子化类名直接使用，**无需 import**。

```vue
<!-- 基础用法 -->
<i class="i-carbon-home" />
<i class="i-carbon-user" />
<i class="i-carbon-arrow-left" />

<!-- 调整大小（使用 text-* 控制，因为图标继承 font-size） -->
<i class="i-carbon-search text-xl" />
<i class="i-carbon-close text-2xl text-gray-500" />

<!-- 调整颜色 -->
<i class="i-carbon-warning text-red-500" />
<i class="i-carbon-checkmark text-green-500" />
<i class="i-carbon-home text-primary" />
```

> **查找图标**：访问 [https://icones.js.org/collection/carbon](https://icones.js.org/collection/carbon) 搜索图标名称。
> 类名格式：`i-carbon-{icon-name}`，连字符连接。

### 动态图标（safelist）

动态绑定的图标类名不会被 UnoCSS 静态扫描，必须在 `uno.config.ts` 的 `safelist` 中预注册：

```ts
// uno.config.ts
safelist: ['i-carbon-code', 'i-carbon-home', 'i-carbon-user'],
```

```vue
<!-- 动态图标示例 -->
<i :class="`i-carbon-${iconName}`" />
<!-- ⚠️ iconName 对应的图标必须在 safelist 中 -->
```

### 本地自定义 SVG 图标

将 `.svg` 文件放入 `src/static/my-icons/` 目录，使用 `i-my-icons-{filename}` 调用：

```
src/static/my-icons/
├── logo.svg
└── custom-arrow.svg
```

```vue
<i class="i-my-icons-logo" />
<i class="i-my-icons-custom-arrow text-lg text-primary" />
```

**SVG 注意事项**：
- 文件中不含 `fill` 属性时自动填充 `currentColor`（继承文字颜色）
- `width`/`height` 属性自动修改为 `1em`（通过 `text-*` 控制大小）

---

## 五、组件库（Wot UI）样式覆盖规范

**即使使用组件库，也必须统一覆盖组件内部样式**，确保视觉风格一致，不能依赖组件库默认外观。

### 覆盖方式优先级

```
1. CSS 变量覆盖（推荐，影响范围可控）
2. :deep() 穿透覆盖（次选，用于精细调整）
3. 全局样式覆盖（慎用，仅用于全局统一）
```

### 方式 1：CSS 变量覆盖（推荐）

```vue
<style scoped>
/* 覆盖 Wot UI 的 CSS 变量，影响当前页面的组件实例 */
:deep(.wd-button) {
  --wot-button-border-radius: 16rpx;
  --wot-button-normal-height: 88rpx;
  --wot-color-theme: #0957DE;
}

:deep(.wd-input) {
  --wot-input-border-radius: 12rpx;
  --wot-input-padding: 0 24rpx;
}

:deep(.wd-tabs) {
  --wot-tabs-nav-height: 88rpx;
  --wot-tabs-nav-active-color: #0957DE;
}
</style>
```

### 方式 2：`:deep()` 穿透覆盖

```vue
<style scoped>
/* 覆盖具体元素样式 */
:deep(.wd-cell__title) {
  font-size: 30rpx;
  color: #1a1a1a;
}

:deep(.wd-cell__value) {
  font-size: 26rpx;
  color: #999;
}

/* 覆盖 popup 圆角 */
:deep(.wd-popup) {
  border-radius: 32rpx 32rpx 0 0;
}
</style>
```

### Wot UI CSS 变量速查

> 完整变量列表见 `references/wot-ui-css-vars.md`（按钮、输入框、标签页、单元格、导航栏、弹出层、全局主题）。
> 当用户询问某个具体组件的 CSS 变量时，读取该文件获取完整列表。

---

## 六、常见布局模式速查

```vue
<!-- 水平居中 -->
<view class="center">...</view>
<!-- 等效: flex justify-center items-center -->

<!-- 垂直列表 -->
<view class="flex flex-col gap-3">...</view>

<!-- 水平两端对齐 -->
<view class="flex justify-between items-center">...</view>

<!-- 卡片容器 -->
<view class="bg-white rounded-2xl p-4 shadow-sm">...</view>

<!-- 全屏底色页面 -->
<view class="min-h-screen bg-gray-50 p-4">...</view>

<!-- 固定底部 -->
<view class="fixed bottom-0 left-0 right-0 pb-safe bg-white border-t border-gray-100">...</view>

<!-- 文字截断 -->
<text class="truncate max-w-48">超长文字内容</text>

<!-- 渐变背景 -->
<view class="bg-gradient-to-br from-blue-500 to-blue-700">...</view>
```

---

## 七、自检清单

在提交代码前，逐项检查：

- [ ] 布局类（flex、grid、padding、margin）是否全部用原子化类？
- [ ] 颜色类（bg-、text-、border-）是否全部用原子化类？
- [ ] 字体大小（text-sm/base/lg）是否全部用原子化类？
- [ ] `<style>` 块是否**只**包含 `:deep()` 覆盖、伪元素、`@keyframes`？
- [ ] 使用的图标是否来自 `carbon` 库（`i-carbon-*`）？
- [ ] 动态绑定的图标是否已加入 `safelist`？
- [ ] 使用组件库时是否覆盖了与设计稿不符的默认样式？
