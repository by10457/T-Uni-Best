<p align="center">
  <a href="https://github.com/unibest-tech/unibest">
    <img width="160" src="./src/static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/unibest-tech/unibest" target="_blank">unibest - 最好的 uniapp 开发框架</a>
</h1>

<div align="center">
旧仓库 codercup 进不去了，star 也拿不回来，这里也展示一下那个地址的 star.

[![GitHub Repo stars](https://img.shields.io/github/stars/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)
[![GitHub forks](https://img.shields.io/github/forks/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)

</div>

<div align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![GitHub forks](https://img.shields.io/github/forks/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![star](https://gitee.com/feige996/unibest/badge/star.svg?theme=dark)](https://gitee.com/feige996/unibest/stargazers)
[![fork](https://gitee.com/feige996/unibest/badge/fork.svg?theme=dark)](https://gitee.com/feige996/unibest/members)
![node version](https://img.shields.io/badge/node-%3E%3D18-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/feige996/unibest)
![GitHub License](https://img.shields.io/github/license/feige996/unibest)

</div>

`unibest` —— 最好的 `uniapp` 开发模板，由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` + `wot-ui` + `z-paging` 构成，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式运行 `web`、`小程序` 和 `App`（编辑器推荐 `VSCode`，可选 `webstorm`）。

`unibest` 内置了 `约定式路由`、`layout布局`、`请求封装`、`请求拦截`、`登录拦截`、`UnoCSS`、`i18n多语言` 等基础功能，提供了 `代码提示`、`自动格式化`、`统一配置`、`代码片段` 等辅助功能，让你编写 `uniapp` 拥有 `best` 体验 （ `unibest 的由来`）。

![](https://raw.githubusercontent.com/andreasbm/readme/master/screenshots/lines/rainbow.png)

<p align="center">
  <a href="https://unibest.tech/" target="_blank">📖 文档地址(new)</a>
  <span style="margin:0 10px;">|</span>
  <a href="https://unibest-tech.github.io/hello-unibest" target="_blank">📱 DEMO 地址</a>
</p>

---

## 平台兼容性

| H5  | IOS | 安卓 | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
| --- | --- | ---- | ---------- | ---------- | ---------- | ------------ | ---------- | ---------- |
| √   | √   | √    | √          | √          | √          | √            | √          | √          |

注意每种 `UI框架` 支持的平台有所不同，详情请看各 `UI框架` 的官网，也可以看 `unibest` 文档。

## ⚙️ 环境

- node>=18
- pnpm>=7.30
- Vue Official>=2.1.10
- TypeScript>=5.0

## 新版分支

- main == base
- base --> base-i18n
- base-login --> base-login-i18n

## &#x1F4C2; 快速开始

执行 `pnpm create unibest` 创建项目
执行 `pnpm i` 安装依赖
执行 `pnpm dev` 运行 `H5`
执行 `pnpm dev:mp` 运行 `微信小程序`

## 📦 运行（支持热更新）

- web平台： `pnpm dev:h5`, 然后打开 [http://localhost:9000/](http://localhost:9000/)。
- weixin平台：`pnpm dev:mp` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。(如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个unibest项目导入到hbx，通过hbx的菜单来运行到对应的平台。)

## 🔗 发布

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`pnpm build:mp`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。(如果是 `安卓` 和 `鸿蒙` 平台，则不用这个方式，可以把整个unibest项目导入到hbx，通过hbx的菜单来发行到对应的平台。)

## 📄 License

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 菲鸽

---

## 🔧 二次开发优化内容

基于原unibest模板，本项目进行了以下关键优化：

### 🚀 HTTP请求模块增强

#### 1. **智能认证管理**

- 新增 `ensureAuthReady()` 函数，实现请求前统一认证检查
- 支持 `ignoreAuth` 参数，跳过特定请求的认证检查
- 自动处理token过期、刷新等认证逻辑

#### 2. **双Token并发安全**

- 实现Promise共享机制，防止多个请求同时刷新token
- 添加 `tokenRefreshing` 和 `tokenRefreshPromise` 状态控制
- 确保只有一个token刷新操作在进行，其他请求自动等待

#### 3. **小程序静默登录优化**

- 实现 `loginPromise` 共享，避免并发重复登录
- 支持 `loggingIn` 状态控制，保证单次执行
- 多个并发请求共享同一个登录结果

#### 4. **401错误容错处理**

- 移除强制跳转登录页面的逻辑
- 实现静默登录 + token刷新双重容错
- 优化用户体验，避免页面跳转中断操作
- 所有401请求自动加入队列等待恢复

#### 5. **完整的JSDoc注释**

- 为核心函数添加详细的技术文档
- 包含参数说明、返回值、使用示例等
- 提高代码可维护性和可读性

### 🔐 登录认证系统优化

#### 1. **API接口优化**

- 为登录、刷新token、退出登录等接口添加 `ignoreAuth: true`
- 避免认证接口陷入认证循环
- 更新API路径，统一添加 `/api` 前缀

#### 2. **用户体验优化**

- 注释掉登录成功/失败的toast提示
- 减少不必要的用户界面干扰
- 适合静默登录场景

#### 3. **类型定义扩展**

- 扩展 `IUserInfoRes` 接口，支持更多用户字段
- 包含 `uniqueId`、`avatarUrl`、`gender`、`bio` 等扩展信息
- 提高类型安全性

### 📱 小程序适配特性

- **条件编译**: 使用 `#ifdef MP-WEIXIN` 确保只在小程序端执行相关逻辑
- **平台适配**: 自动适配不同uni-app平台的特性差异
- **静默处理**: 优先静默登录，避免用户感知的登录流程

### 🎯 核心优势

1. **无感认证**: 用户几乎感受不到token过期和刷新的过程
2. **并发安全**: 多个请求同时触发认证时，只有一次实际操作
3. **容错友好**: 遇到错误时优先尝试恢复，而不是直接失败
4. **用户友好**: 移除强制页面跳转，保持用户操作连续性
5. **类型安全**: 完整的TypeScript类型定义和JSDoc注释

### 🔄 工作流程

```
用户发起请求
    ↓
ensureAuthReady() 检查认证状态
    ↓
如需认证 → 双token刷新 / 静默登录
    ↓
认证成功 → 执行HTTP请求
    ↓
遇到401 → 静默恢复认证 → 重试请求
    ↓
请求成功 → 返回数据
```
