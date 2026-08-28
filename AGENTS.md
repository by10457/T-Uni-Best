# T-Uni-Best AI 协作入口

本项目基于 unibest 二次开发，默认技术栈为 uni-app、Vue 3、TypeScript、Vite 5、UnoCSS、Pinia 和 Wot UI v2。

## 开始任务前

1. 完整读取 `.agents/AGENTS.md`，了解本项目的架构和不可绕过约束。
2. 完整读取 `.agents/skills/SKILL.md`，按任务场景加载命中的专项 skill。
3. 修改前运行 `git status --short`，不得覆盖或回退用户已有改动。
4. 只读取命中 skill 的正文和当前任务需要的 references，不要一次加载整个知识库。

## 核心边界

- Wot UI v2 是默认且唯一的业务 UI 组件库；不得因参考 UniApp 资料而引入 uView、uView Pro 或 uni-ui。
- `pages.config.ts`、`manifest.config.ts` 和页面内 `definePage` 是配置事实源，不直接修改生成的 `src/pages.json`、`src/manifest.json` 和 `src/types/*.d.ts`。
- 平台差异优先使用 uni-app 条件编译；业务请求统一经过 `src/http`，不得绕过既有认证与错误处理。
- 包管理器固定使用 pnpm。新增依赖、插件或云能力前先确认 Vue 3、Vite 和目标平台兼容性。

## 常用验证

```bash
pnpm format:check
pnpm lint
pnpm type-check
pnpm test:run
pnpm build:h5
pnpm build:mp
```

按改动风险选择最小充分验证；涉及平台、插件、广告、云能力或图表时，至少构建实际目标平台。
