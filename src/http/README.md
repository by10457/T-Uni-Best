# 请求库

项目提供 3 种请求方式：

- 简单版 `http`：路径 `src/http/http.ts`，当前项目的认证与请求主链路。
- `alova`：路径 `src/http/alova.ts`，备用实现。
- `vue-query`：路径 `src/http/vue-query.ts`，主要用于自动生成接口。

完整的跨端认证、双 Token 刷新和 401 容灾流程见
[`doc/http-auth-flow.md`](../../doc/http-auth-flow.md)。

## 基本使用

```ts
import { httpGet, httpPost } from '@/http/http'

interface IUserInfoRes {
  id: number
  nickname: string
}

export function getUserInfo() {
  return httpGet<IUserInfoRes>('/user/info')
}

export function updateUserInfo(data: Partial<IUserInfoRes>) {
  return httpPost('/user/update', data)
}
```

响应成功时返回业务 `data`。业务错误、登录失效、HTTP 状态异常和网络异常会统一
reject `HttpError`：

```ts
import type { HttpError } from '@/http/types'

try {
  const userInfo = await getUserInfo()
  console.log(userInfo.nickname)
} catch (error) {
  const httpError = error as HttpError
  console.log(httpError.type, httpError.message, httpError.statusCode)
}
```

## 自定义请求行为

登录、刷新 Token 等无需已有登录态的接口必须同时跳过认证门禁和访问令牌注入：

```ts
httpPost('/auth/login', data, undefined, undefined, {
  ignoreAuth: true,
  skipAccessToken: true,
})
```

`ignoreAuth` 只跳过请求前认证检查；`skipAccessToken` 保证登录和刷新请求不会携带旧的 `Authorization`。

如果调用方需要自行展示错误，可关闭 HTTP 层的默认提示：

```ts
httpGet<IUserInfoRes>('/user/info', undefined, undefined, {
  hideErrorToast: true,
})
```

`_retryCount` 是 401 容灾流程的内部字段，业务代码不得手动设置。
