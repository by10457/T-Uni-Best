# 微信原生广告接入要点

实现前以微信官方当前文档和项目安装的 UniApp 类型为准。本页记录项目决策和生命周期，不替代最新 API 表。

## Banner / 信息流

使用 UniApp/微信小程序支持的广告组件并传入微信广告位 `unit-id`。组件必须处于 `MP-WEIXIN` 条件编译块，处理 `load` 和 `error` 事件；无填充时隐藏广告占位，避免页面留下异常空白。

## 激励视频

典型流程：

1. 页面就绪后创建一次广告实例并注册一次 `onLoad`、`onError`、`onClose`。
2. 用户主动点击时调用 `show()`。
3. `show()` 因素材未就绪失败时，可按官方模式执行一次 `load()` 后重试 `show()`，禁止无限重试。
4. `onClose` 检查是否完整观看；客户端只更新等待状态，最终奖励由可信业务接口幂等确认。
5. 页面卸载时调用对应 `offLoad`、`offError`、`offClose`（若当前平台版本支持），并清理引用。

示意代码：

```ts
// #ifdef MP-WEIXIN
const rewardedAd = uni.createRewardedVideoAd({ adUnitId })

const showRewardedAd = async () => {
  try {
    await rewardedAd.show()
  } catch {
    await rewardedAd.load()
    await rewardedAd.show()
  }
}
// #endif
```

不要照搬示意代码作为完整业务实现；还需要按当前类型补齐监听、并发点击保护、卸载清理和后端奖励确认。

## 插屏广告

- 只在自然场景切换、任务完成等不打断关键输入的位置展示。
- 实例初始化、加载和展示时机遵循当前微信基础库要求。
- 展示失败不得阻断原业务流程。

## 配置和后端

- 广告位 ID 可公开到客户端，但仍应集中配置，便于环境和小程序 AppID 隔离。
- 奖励接口携带业务幂等键，后端限制用户、广告场景、次数和重复领取。
- 日志只记录广告类型、错误码和业务场景，不记录 Token 或用户隐私数据。
