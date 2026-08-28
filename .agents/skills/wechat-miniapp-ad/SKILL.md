---
name: wechat-miniapp-ad
description: 在 T-Uni-Best 中接入或排查微信小程序官方流量主广告，包括 Banner/信息流、激励视频、插屏广告、广告生命周期、失败降级和奖励安全。DCloud uni-ad 需求应先明确模式，不与微信原生广告混用。
---

# 微信小程序官方广告

## 先区分接入模式

- 微信官方流量主：广告位来自微信小程序后台，使用 `unit-id` 或 `adUnitId`，结算主体是微信。
- DCloud uni-ad：广告位通常使用 `adpid`，申请、插件和结算流程不同。

用户未明确时先确认接入哪一种；本 skill 默认处理微信官方流量主。不要把 `adpid` 和 `adUnitId` 互换。

## 实现流程

1. 确认小程序已满足流量主开通条件，并取得对应广告类型的广告位 ID。
2. 读取 [references/native-ads.md](references/native-ads.md)，按广告类型选择组件或 API。
3. 广告代码限制在 `MP-WEIXIN` 条件编译中；其他平台提供无副作用降级。
4. 广告位 ID 通过项目配置注入，不散落在页面源码，不提交密钥或后台凭证。
5. 广告加载失败、无填充、快速重复点击和页面卸载都必须有明确处理。

## 安全和体验

- 广告不能遮挡导航、主要操作或诱导误触。
- 激励行为必须由用户主动触发；未完整观看时不得在客户端直接发放最终奖励。
- 客户端 `isEnded` 只能作为交互信号。高价值奖励应由后端做幂等、次数限制、用户校验和服务端可信确认。
- 不保证每次都有广告填充；无广告属于正常分支，页面必须仍可使用或给出合理替代。
- 同一页面避免重复注册监听器；卸载时解除监听并释放页面持有的实例引用。

## 验证

至少执行微信小程序构建，并在真机验证加载、展示、关闭、未完整观看、无填充、弱网、重复点击和页面返回。开发者工具结果不能替代真机广告验证。

参考：

- UniApp 微信广告差异：https://uniapp.dcloud.net.cn/uni-ad/ad-weixin.html
- UniApp 激励视频 API：https://uniapp.dcloud.net.cn/uni-ad/ad-rewarded-video.html
- 微信小程序官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/
