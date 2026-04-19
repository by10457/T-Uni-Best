# Wot UI CSS 变量速查表

覆盖 Wot UI 组件默认样式时，优先通过 CSS 变量修改。以下是常用变量列表。

## 按钮 (Button)

| 变量 | 作用 |
|------|------|
| `--wot-button-border-radius` | 圆角 |
| `--wot-button-normal-height` | 默认高度 |
| `--wot-button-normal-font-size` | 字体大小 |
| `--wot-button-padding-left` | 左内边距 |
| `--wot-button-padding-right` | 右内边距 |

## 输入框 (Input / Textarea)

| 变量 | 作用 |
|------|------|
| `--wot-input-border-radius` | 圆角 |
| `--wot-input-height` | 高度 |
| `--wot-input-padding` | 内边距 |
| `--wot-input-font-size` | 字体大小 |
| `--wot-input-placeholder-color` | placeholder 颜色 |

## 标签页 (Tabs)

| 变量 | 作用 |
|------|------|
| `--wot-tabs-nav-height` | 导航栏高度 |
| `--wot-tabs-nav-active-color` | 激活项颜色 |
| `--wot-tabs-nav-inactive-color` | 未激活项颜色 |
| `--wot-tabs-nav-bar-color` | 底部指示线颜色 |
| `--wot-tabs-nav-bar-height` | 底部指示线高度 |

## 单元格 / 列表 (Cell)

| 变量 | 作用 |
|------|------|
| `--wot-cell-padding` | 内边距 |
| `--wot-cell-title-font-size` | 主标题字号 |
| `--wot-cell-value-font-size` | 副文本字号 |
| `--wot-cell-title-color` | 主标题颜色 |
| `--wot-cell-value-color` | 副文本颜色 |

## 导航栏 (Navbar)

| 变量 | 作用 |
|------|------|
| `--wot-navbar-height` | 导航栏高度 |
| `--wot-navbar-title-font-size` | 标题字号 |
| `--wot-navbar-title-color` | 标题颜色 |
| `--wot-navbar-background` | 背景色 |

## 弹出层 (Popup)

| 变量 | 作用 |
|------|------|
| `--wot-popup-border-radius` | 圆角（底部弹出时常用） |
| `--wot-popup-background` | 背景色 |
| `--wot-popup-padding` | 内边距 |

## 全局主题

| 变量 | 作用 |
|------|------|
| `--wot-color-theme` | 主题色（主色调） |
| `--wot-color-theme-light` | 主题浅色 |
| `--wot-color-theme-dark` | 主题深色 |

## 使用示例

```vue
<style scoped>
/* 针对当前页面的按钮覆盖 */
:deep(.wd-button) {
  --wot-button-border-radius: 16rpx;
  --wot-button-normal-height: 88rpx;
}

/* 针对标签页的覆盖 */
:deep(.wd-tabs) {
  --wot-tabs-nav-height: 88rpx;
  --wot-tabs-nav-active-color: #0957DE;
}
</style>
```

> 更多变量请查阅：[Wot UI 官方文档 - 主题定制](https://wot-design-uni.cn/guide/custom-theme.html)
