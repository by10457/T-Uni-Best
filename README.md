# T-Uni-Best

面向 AI 协作开发的 `uni-app` 业务模板，适合快速搭建微信小程序、H5 与 App 项目。

本项目基于优秀的开源项目 [unibest](https://unibest.tech/) 二次开发而来，继承了 `uni-app + Vue3 + TypeScript + Vite + UnoCSS + Wot UI + z-paging` 的现代前端工程能力，并在登录认证、Token 容灾、配套后端、AI 开发上下文与代码规范工具链上做了模板化增强。

如果你希望让 AI 更快理解项目边界、遵守工程规范，并在小程序 / H5 业务开发中稳定地产出页面、接口、样式和组件代码，这个模板就是为这个目标准备的。

---

## 项目来源与致谢

`T-Uni-Best` 站在 [unibest](https://unibest.tech/) 的基础能力之上继续演进。

`unibest` 是一个非常完整的 `uni-app` 开发模板，内置了约定式路由、layout 布局、请求封装、请求拦截、登录拦截、UnoCSS、i18n 多语言、代码提示、自动格式化、统一配置和代码片段等能力，让 `uni-app` 项目可以脱离重度 IDE 依赖，通过命令行和 VSCode 获得更现代的开发体验。

感谢 `unibest` 作者 **菲鸽** 与相关贡献者。本项目保留并尊重原项目的基础设计与 MIT 开源精神，二次开发的目标不是替代原项目，而是在它的模板基础上继续补齐“业务开发 + 配套后端 + AI 协作”的实践链路。

相关链接：

- unibest 文档：[https://unibest.tech/](https://unibest.tech/)
- T-Uni-Best 仓库：[https://github.com/by10457/T-Uni-Best](https://github.com/by10457/T-Uni-Best)
- 配套后端 T-Uni-Java：[https://github.com/by10457/T-Uni-Java](https://github.com/by10457/T-Uni-Java)

## 适用场景

- 微信小程序业务项目，需要更稳的静默登录、Token 刷新和 401 容灾处理。
- H5 / 公众号内嵌页面，需要保留明确的登录页兜底与 Token 失效处理。
- 多端 `uni-app` 项目，希望保留 `unibest` 的工程化能力，同时拥有可直接对接的 Java 后端模板。
- 希望 AI 代理参与日常业务开发，并通过内置 skills 约束页面生成、样式规范、组件使用和代码行为。
- 希望项目默认具备统一 lint、format、VSCode 工作区设置和提交前检查链路。

## 核心能力

### 基础工程能力

- `uni-app` + `Vue3` + `TypeScript` + `Vite`
- `UnoCSS` 原子化样式
- `Wot UI` 组件库
- `z-paging` 列表分页能力
- 约定式路由与页面配置
- layout 布局能力
- 请求封装、请求拦截、登录拦截
- Pinia 状态管理与持久化
- i18n 多语言基础能力
- VSCode 友好的代码提示、代码片段和工作区配置

### 登录认证与 HTTP 容灾增强

本项目重点增强了 `src/http/http.ts`、`src/http/interceptor.ts` 与 `src/store/token.ts` 相关认证链路，尤其关注微信小程序场景：

- 请求前统一执行认证门禁，支持 `ignoreAuth` 跳过登录接口等特殊请求。
- 支持单 Token 与双 Token 模式，双 Token 下可通过 refreshToken 无感刷新 accessToken。
- 使用共享 Promise 控制并发登录与并发刷新，避免多个请求同时触发多次 `wx.login` 或多次刷新 Token。
- 微信小程序端优先静默登录，尽量保持用户操作连续性。
- H5 端在无法无感恢复 Token 时明确跳转登录页，避免继续发出无效请求。
- 401 响应进入平台化容灾流程，带重试计数保护，避免死循环。

详细设计、流程图、平台行为矩阵和注意事项请阅读：[HTTP 层认证机制文档](doc/http-auth-flow.md)。

### 配套后端模板

前端模板推荐搭配 [T-Uni-Java](https://github.com/by10457/T-Uni-Java) 使用。

`T-Uni-Java` 是面向“微信小程序服务端 + 可选管理后台”的多模块 Java 模板，提供：

- 小程序登录与 Token 鉴权
- 用户基础模型
- MyBatis-Plus、Redis、Knife4j、微信小程序 SDK
- 可选七牛云、OpenIM、微信支付等基础能力
- 可选管理后台后端
- 面向 AI 的后端上下文文档与 skills

前端仍然可以独立使用；后端项目是推荐配套，不是强制依赖。

### AI 开发资产

本项目内置 `.agents/skills`，用于给 AI 代理提供项目级上下文和操作规范：

| Skill                | 作用                                                          |
| -------------------- | ------------------------------------------------------------- |
| `coding-guidelines`  | 编码行为准则，减少过度工程化、无关重构和不可验证改动          |
| `css-styling`        | T-Uni-Best 样式规范，约束 UnoCSS、Wot UI、图标和样式覆盖方式  |
| `uni-page-generator` | 生成符合项目规范的 `uni-app` 页面和分包页面                   |
| `wot-ui`             | Wot UI v2 组件库参考，辅助组件 API、事件、slot 和常见问题查询 |
| `ui-ux-pro-max`      | UI/UX 设计参考，用于复杂页面设计和视觉规范推导                |

这些 skills 的目标是让 AI 不只是“能写代码”，而是能按本项目既有风格、目录边界和验证方式稳定开发。

### 代码规范与格式化

本项目已引入 `oxlint + oxfmt`：

- `Oxfmt` 负责主格式化流程。
- `Oxlint` 负责主 JS / TS / Vue script 检查。
- `ESLint` 保留为 Vue、JSON/YAML、uni-app 相关规则的补充检查。
- VSCode 工作区默认使用 Oxc formatter，减少格式器之间来回改动。

常用命令：

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm lint:fix
```

## 平台兼容性

继承自 `unibest` 的多端能力，主要面向：

| H5   | iOS  | Android | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
| ---- | ---- | ------- | ---------- | ---------- | ---------- | ------------ | ---------- | ---------- |
| 支持 | 支持 | 支持    | 支持       | 支持       | 支持       | 支持         | 支持       | 支持       |

不同 UI 组件或平台 API 的实际表现可能存在差异，具体以 `uni-app`、Wot UI 与目标平台文档为准。

## 环境要求

建议使用：

- Node.js `>= 20`
- pnpm `>= 9`
- VSCode + Vue Official
- TypeScript `>= 5`
- 微信开发者工具（开发微信小程序时需要）
- HBuilderX（开发 App 或发行 App 时按需使用）

## 快速开始

安装依赖：

```bash
pnpm install
```

启动 H5：

```bash
pnpm dev:h5
```

启动微信小程序：

```bash
pnpm dev:mp
```

微信小程序编译产物默认位于：

```text
dist/dev/mp-weixin
```

使用微信开发者工具导入该目录即可预览。

如果你在 WSL 中开发，并且发现 Windows 上的微信开发者工具无法检测到 `dist/dev/mp-weixin`
目录变化，导致小程序不能自动刷新到最新编译结果，可以使用项目内置的同步脚本：

```bash
sh ./rsync.sh
```

推荐流程：

1. 在 WSL 中先运行 `pnpm dev:mp-weixin` 或 `pnpm dev:mp`。
2. 另开一个 WSL 终端，在项目根目录运行 `sh ./rsync.sh` 并保持脚本运行。
3. 脚本会把 `dist/dev/mp-weixin` 同步到 Windows 桌面的 `mp/<项目名>-mp-weixin` 目录。
4. 微信开发者工具导入桌面 `mp` 目录下同步出来的小程序项目。

## 常用命令

| 命令                | 说明                           |
| ------------------- | ------------------------------ |
| `pnpm dev:h5`       | 启动 H5 开发服务               |
| `pnpm dev:mp`       | 启动微信小程序开发构建         |
| `pnpm dev:app`      | 启动 App 开发构建              |
| `pnpm build:h5`     | 构建 H5                        |
| `pnpm build:mp`     | 构建微信小程序                 |
| `pnpm build:app`    | 构建 App                       |
| `pnpm type-check`   | 执行 TypeScript / Vue 类型检查 |
| `pnpm format`       | 使用 Oxfmt 格式化              |
| `pnpm format:check` | 检查格式化状态                 |
| `pnpm lint`         | 执行格式检查、Oxlint 和 ESLint |
| `pnpm lint:fix`     | 自动格式化并尝试修复 lint 问题 |
| `pnpm upload:mp`    | 执行微信小程序上传脚本         |

## 发布构建

H5：

```bash
pnpm build:h5
```

构建产物位于 `dist/build/h5`，可部署到 Nginx、对象存储或其他静态托管服务。如果最终不是部署在站点根目录，请调整 `manifest.config.ts` 中的 `h5.router.base`。

微信小程序：

```bash
pnpm build:mp
```

构建产物位于 `dist/build/mp-weixin`，可通过微信开发者工具上传，也可按需使用项目内的上传脚本。

App：

```bash
pnpm build:app
```

构建后可按 `uni-app` / HBuilderX 的 App 云打包流程继续发行。

## 目录结构

```text
.
├── .agents/skills              # 面向 AI 代理的项目技能与上下文
├── doc                         # 项目补充文档
├── env                         # 环境变量配置
├── scripts                     # 项目辅助脚本
├── src
│   ├── api                     # API 请求入口
│   ├── http                    # HTTP 封装、拦截、认证容灾
│   ├── layouts                 # 页面布局
│   ├── pages                   # 主包页面
│   ├── pages-*                 # 分包页面
│   ├── service                 # OpenAPI 生成或服务类型相关代码
│   ├── store                   # Pinia 状态管理
│   ├── tabbar                  # 自定义 TabBar
│   └── utils                   # 通用工具
├── eslint.config.mjs           # ESLint 补充检查配置
├── oxfmt.config.ts             # Oxfmt 格式化配置
├── oxlint.config.ts            # Oxlint 检查配置
├── pages.config.ts             # 页面与路由配置
├── manifest.config.ts          # uni-app manifest 配置
└── uno.config.ts               # UnoCSS 配置
```

## 环境变量与本地配置

项目环境变量位于 `env/` 目录。公开仓库中应避免提交真实密钥、真实小程序 AppID、私钥等本地敏感配置。

建议：

- 将可公开的默认值放在已跟踪的 env 文件中。
- 将本机开发使用的真实值放在本地私有 env 文件中。
- 提交前确认没有把真实密钥、私钥或生产环境配置推送到公开仓库。

## 与 unibest 的关系

本项目不是从零开始的脚手架，而是基于 `unibest` 的二次开发模板，并持续关注 `unibest` 项目的更新优化。

保留并继承的重点：

- 多端 `uni-app` 工程基础
- Vue3 / TypeScript / Vite 工程链路
- UnoCSS 与 Wot UI 组合
- 约定式路由、layout、请求封装、登录拦截等基础能力

二次开发增强的重点：

- 更完整的微信小程序静默登录与 Token 容灾链路
- 可搭配使用的 Java 后端模板
- 面向 AI 协作开发的 skills 与项目规范
- 基于 Oxc 的统一格式化与 lint 工作流
- 更适合作为业务项目起点的 README、文档与上下文组织方式

再次感谢 `unibest` 原作者与社区贡献者。

## 参考文档

- [unibest 文档](https://unibest.tech/)
- [HTTP 层认证机制文档](doc/http-auth-flow.md)
- [AI skills 目录](.agents/skills)
- [T-Uni-Java 后端模板](https://github.com/by10457/T-Uni-Java)

## License

本项目遵循 [MIT License](https://opensource.org/license/mit/)。

本项目基于 `unibest` 二次开发，原项目版权归原作者及贡献者所有；二次开发部分由本项目维护者继续维护并开源。
