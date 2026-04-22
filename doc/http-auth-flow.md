# HTTP 层认证机制文档

> 版本：v2.0 | 适用方案：`src/http/http.ts`（uni.request 封装方案）  
> 本文档描述该模板在**微信小程序**与 **H5**（含公众号内嵌）两个平台上的完整「静默登录 → Token 校验 → 无感刷新 → 异常兜底」闭环。

---

## 一、整体架构

```
用户发起请求
     │
     ▼
┌─────────────────────────────┐
│   interceptor.ts            │  ← uni.addInterceptor 全局拦截
│   拼接 baseUrl / query      │
│   挂载 Authorization Header │
└─────────────┬───────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│   http.ts - ensureAuthReady              │  ← 请求前认证门禁
│   ① ignoreAuth → 跳过                    │
│   ② hasLogin → 直接放行                   │
│   ③ 双Token → tryGetValidToken（两端通用）│
│   ④ 小程序端 → wxLogin 静默登录           │
│   ⑤ H5端（无法获取token）→ toLoginPage() + throw │
└──────────────────┬───────────────────────┘
                   │ 认证就绪（或 throw 中断）
                   ▼
            uni.request 发出
                   │
         ┌─────────┴─────────┐
         │ statusCode=401    │ 其他
         ▼                   ▼
   ┌───────────────┐  ┌──────────────────┐
   │  401 容错处理  │  │ 正常业务响应处理  │
   │ （平台分支）   │  └──────────────────┘
   └───────────────┘
```

---

## 二、涉及文件说明

| 文件 | 职责 |
|---|---|
| `src/http/interceptor.ts` | `uni.addInterceptor` 全局拦截，统一拼接 URL、挂载 Token Header |
| `src/http/http.ts` | 核心实现：认证门禁、并发控制、平台分支、401 容错、重试限制 |
| `src/http/types.ts` | 请求类型定义，含内部字段 `_retryCount` |
| `src/store/token.ts` | Token 状态管理：存储、过期判断、微信登录、刷新 Token |
| `src/utils/toLoginPage.ts` | 跳转登录页工具（H5 端 Token 无法无感恢复时使用） |

---

## 三、认证模式

通过环境变量 `VITE_AUTH_MODE` 区分两种 Token 策略：

```
VITE_AUTH_MODE=single   → 单 Token 模式（token + expiresIn）
VITE_AUTH_MODE=double   → 双 Token 模式（accessToken + refreshToken，各有独立过期时间）
```

> **重要**：Token 模式（单/双）与平台（小程序/H5）是两个独立维度。认证行为的核心分叉是**平台**，而非 Token 模式。Token 模式只影响刷新策略的细节。

---

## 四、请求前认证门禁（ensureAuthReady）

每次 `http()` 调用，都会先执行 `ensureAuthReady(options)`。**函数执行完毕后才发出请求**；如果 `throw`，请求直接被中断。

### 完整决策流程

```
1. options.ignoreAuth === true
   └─ 直接跳过，不做任何认证操作（适用于登录接口等）

2. tokenStore.hasLogin === true
   └─ 本地 Token 存在且未过期，直接放行

3. 双 Token 模式（isDoubleTokenMode，两端均执行）
   ├─ 如果已有刷新 Promise 在进行中 → await 等待（并发保护）
   ├─ 如果没有在刷新 → 启动 tryGetValidToken()
   │   └─ accessToken 过期 + refreshToken 未过期 → 自动调刷新接口
   └─ 刷新后再次检查 hasLogin，成功则放行

4. 微信小程序端（#ifdef MP-WEIXIN）
   ├─ 如果已有登录 Promise 在进行中 → return 等待（并发保护）
   └─ 否则启动 wxLogin()
       └─ getWxCode() → _wxLogin({ code }) → setTokenInfo() → fetchUserInfo()
       → 静默完成，用户无感知

5. H5端（#ifdef H5）
   └─ 走到这里表明无法无感获取 token：
       · 单 Token H5：无刷新机制，无法自动登录
       · 双 Token H5 但 refreshToken 已过期或不存在
   → toLoginPage()，throw 中断请求，不发出无效网络请求
```

### 并发控制关键变量

| 变量 | 作用 |
|---|---|
| `loggingIn` / `loginPromise` | 保证并发请求只触发一次微信静默登录 |
| `tokenRefreshing` / `tokenRefreshPromise` | 保证并发请求只触发一次 refreshToken 刷新 |

> **效果**：10 个请求同时发出时无 Token，只有第 1 个触发登录，其余 9 个 await 同一个 Promise，登录完成后全部自动继续。

---

## 五、Token 注入（interceptor.ts）

`uni.addInterceptor('request', ...)` 在每次请求发出前同步注入 Header：

```typescript
const token = tokenStore.updateNowTime().validToken
if (token) {
  options.header.Authorization = `Bearer ${token}`
}
```

> 因为 `ensureAuthReady` 已经异步等待 Token 就绪，拦截器执行时 Token 一定有效（或请求已被 throw 中断）。

---

## 六、响应后 401 容错

收到 401 响应（`statusCode === 401` 或 `code === 401`）后，**以平台为核心维度**进行分支处理：

### 6.1 认证接口本身返回 401 → 直接 reject

以下接口收到 401 直接 reject，**不进入重试队列**（防止循环）：

```
/auth/login
/auth/wxLogin
/auth/refreshToken
/auth/logout
```

### 6.2 H5 端 401 处理

| H5 场景 | 处理方式 |
|---|---|
| 单 Token H5 | `logout()` + `toLoginPage()` + `reject`，无重试 |
| 双 Token H5，**无** refreshToken | `logout()` + `toLoginPage()` + `reject`，无重试 |
| 双 Token H5，**有** refreshToken | **跳过 toLoginPage**，进入下方重试队列，调 `refreshToken` 接口无感恢复 |

> 公众号内嵌 H5 的 OAuth 授权需要页面跳转再回跳，会破坏页面栈，无法在代码逻辑中等待重授权，因此在无法刷新时直接跳转登录页，由用户完成登录后手动重新触发请求。

### 6.3 小程序端 401 处理

小程序所有场景均进入**无感重试队列**：

```
1. 检查 _retryCount（重试计数保护）
   └─ retryCount >= 1（已重试过一次仍 401）→ logout() + reject，彻底放弃

2. 将当前请求加入 taskQueue

3. 启动一次性容错 IIFE（refreshing 标记防止重复启动）：
   ├─ 有 refreshToken → 调 refreshToken 接口刷新 accessToken
   └─ 无 refreshToken → 降级为 wxLogin() 静默登录（#ifdef MP-WEIXIN）

4. 容错成功 → 释放队列，所有等待请求携带 _retryCount+1 重新发出
   容错失败 → logout() + 所有等待请求全部 reject
```

> **容错逻辑互斥**：有 refreshToken 时只调刷新接口，不调 wxLogin；无 refreshToken 时只调 wxLogin。不叠加调用，避免 wxLogin 已颁发新 Token 后立刻被旧 refreshToken 覆盖。

---

## 七、完整平台行为矩阵

### 请求前（ensureAuthReady）

| 平台 | Token 模式 | 状态 | 行为 |
|---|---|---|---|
| 任意 | 任意 | `ignoreAuth: true` | 跳过所有认证 |
| 任意 | 任意 | Token 有效 | 直接放行 |
| 任意 | 双 Token | accessToken 过期，refreshToken 有效 | 调刷新接口，更新后放行 |
| 小程序 | 单 Token | 无 Token | wxLogin 静默登录后放行 |
| 小程序 | 双 Token | 刷新失败 / 无 refreshToken | wxLogin 静默登录后放行 |
| **H5** | 单 Token | 无 Token | **toLoginPage() + throw，中断请求** |
| **H5** | 双 Token | 刷新失败 / refreshToken 过期 | **toLoginPage() + throw，中断请求** |

### 响应后 401 容错

| 平台 | Token 模式 | refreshToken | 行为 |
|---|---|---|---|
| **H5** | 单 Token | — | `toLoginPage()` + reject |
| **H5** | 双 Token | ❌ 无 | `toLoginPage()` + reject |
| **H5** | 双 Token | ✅ 有 | 进入刷新队列 → 调 refreshToken 接口 → 重试 |
| **小程序** | 单 Token | — | 进入刷新队列 → wxLogin → 重试 |
| **小程序** | 双 Token | ✅ 有 | 进入刷新队列 → 调 refreshToken 接口 → 重试 |
| **小程序** | 双 Token | ❌ 无 | 进入刷新队列 → wxLogin → 重试 |
| 任意 | 任意 | — | retryCount ≥ 1 → logout + reject（兜底） |

---

## 八、Token 过期判断逻辑（store/token.ts）

```
accessToken 过期判断：
  Date.now() >= uni.getStorageSync('accessTokenExpireTime')

refreshToken 过期判断（双 Token 模式）：
  Date.now() >= uni.getStorageSync('refreshTokenExpireTime')

hasLogin（对外暴露的登录状态）：
  hasLoginInfo && !isTokenExpired
  （Token 存在 + 未过期 = 当前有效登录态）
```

Token 写入时机：`setTokenInfo()` 被调用时，同步将 `Date.now() + expiresIn * 1000` 写入 storage，确保 App 重启后过期时间不丢失（配合 Pinia persist）。

---

## 九、使用规范

### 9.1 忽略鉴权（登录接口等）

```typescript
httpPost('/auth/wxLogin', { code }, undefined, undefined, { ignoreAuth: true })
```

### 9.2 忽略错误提示

```typescript
httpGet('/user/profile', undefined, undefined, { hideErrorToast: true })
```

### 9.3 禁止手动设置 `_retryCount`

`_retryCount` 是内部字段，由框架自动管理，**业务代码不得手动传入**。

---

## 十、注意事项

1. **认证分叉维度是平台，不是 Token 模式**。小程序始终走静默登录重试；H5 在无法刷新时始终跳转登录页。Token 模式（单/双）只影响刷新的具体方式。

2. **H5 双 Token 有 refreshToken 时可无感恢复**。只有在 refreshToken 也失效时，H5 才跳转登录页。

3. **认证接口本身收到 401 直接 reject**。`/auth/refreshToken`、`/auth/wxLogin` 等均在排除名单内，不会进入重试队列，避免死循环。

4. **每个请求最多重试 1 次**。`_retryCount >= 1` 时直接 logout + reject，防止极端情况下的无限循环。

5. **`alova.ts` 是备用实现，当前未启用**。项目实际走 `http.ts` 方案，两套不要混用，`alova.ts` 中的认证逻辑是占位符，不可用于生产。

6. **过期时间依赖本地 storage**：Pinia persist 保证内存状态，storage 保证 App 冷启动后过期时间准确。两者配合使用，不可单独依赖其中一个。
