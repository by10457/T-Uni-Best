# 生命周期、API 与平台差异

## 条件编译

编译期可确定的平台差异使用条件编译：

```ts
// #ifdef MP-WEIXIN
// 微信小程序专属代码
// #endif

// #ifdef H5
// H5 专属代码
// #endif
```

模板使用 `<!-- #ifdef ... -->`。只有平台不能在编译期确定时，才读取运行时系统信息。

常用标识：`H5`、`MP-WEIXIN`、`MP-ALIPAY`、`MP-BAIDU`、`MP-TOUTIAO`、`MP-QQ`、`MP-KUAISHOU`、`APP-PLUS`、`MP`。

## 生命周期选择

- 页面入口参数：`onLoad`。
- 每次页面显示时刷新：`onShow`。
- DOM、组件实例或 Canvas 就绪：根据目标端选择 `onReady` / `onMounted`，不能假设两者跨端时序完全一致。
- 页面卸载：清理广告、Canvas、定时器和事件监听。
- App 全局启动/切后台使用 App 生命周期，不把页面生命周期当成全局生命周期。

## API 决策

1. 优先使用 `uni.*` API。
2. 检查当前版本类型声明和官方平台兼容表。
3. Promise 与回调写法以当前 API 文档为准。
4. URL 参数、storage、第三方 SDK 回调和网络响应属于不可信边界，应在进入业务层前校验。
5. 原生组件如 Canvas、Map、Video、WebView 需要关注层级、权限和各端行为。

## 项目已有封装

- 网络请求：使用 `src/http`，不直接复制 `uni.request` 教程代码。
- 页面创建：使用 `uni-page-generator`。
- 视觉和 Wot UI：分别使用 `css-styling`、`wot-ui`。
- 平台能力失败必须有可理解的降级；不支持的平台应在编译期剔除或明确提示。
