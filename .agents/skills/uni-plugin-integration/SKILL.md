---
name: uni-plugin-integration
description: 在 T-Uni-Best 中评估、安装、升级或移除第三方 UniApp 插件。涉及 npm 包、uni_modules、插件市场、easycom、原生插件或依赖兼容性时使用；不用于选择新的 UI 组件库。
---

# UniApp 第三方插件接入

## 接入前检查

- 明确插件来源、许可证、维护状态、当前版本和官方文档。
- 确认支持 Vue 3、Vite、项目当前 uni-app 版本和全部目标平台。
- 检查是否要求 HBuilderX、原生 SDK、付费授权、云服务或额外隐私声明。
- 评估小程序主包体积、是否支持按需引入、是否包含不可 tree-shake 的大依赖。
- Wot UI 是唯一默认业务组件库；不得接入 uView、uView Pro、uni-ui 等替代组件库。

## 安装策略

- npm 包统一使用 pnpm，并提交 `package.json` 与 `pnpm-lock.yaml`。
- `uni_modules` 仅在插件没有可靠 npm 方案或官方明确推荐时使用；确认其源码是否应纳入版本控制。
- 不使用说明中的 `npm install`、`yarn` 或直接编辑生成 JSON；转换成项目现有 pnpm 和配置事实源。
- 不运行来源不明的安装脚本。涉及原生插件、证书、付费授权或外部账号时，先说明影响和所需权限。

## 集成位置

- 组件解析/easycom：修改项目现有 Vite/UniPages/组件解析事实源。
- 页面和分包：遵循 `uni-page-generator`。
- manifest：修改 `manifest.config.ts`。
- 平台差异：使用条件编译，避免不支持端打入无用代码。
- 插件网络调用仍需遵循项目认证、安全和隐私边界。

## 验证

安装后执行 lint、type-check 和插件相关测试，并构建每个受影响目标平台。检查小程序包体积、控制台警告、权限弹窗和真机行为。更新或移除插件时，同时清理其配置、类型、资源和锁文件引用。

参考入口：https://ext.dcloud.net.cn/ 、https://uniapp.dcloud.net.cn/plugin/
