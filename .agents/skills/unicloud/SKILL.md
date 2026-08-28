---
name: unicloud
description: 在 T-Uni-Best 中显式接入或维护 uniCloud 云数据库、云函数、云存储、云对象和权限规则时使用。默认 Java 后端任务不要加载，也不得自动迁移现有 src/http 业务。
---

# uniCloud 可选后端能力

uniCloud 不是 T-Uni-Best 默认后端。只有用户明确选择 uniCloud，或正在维护已有 uniCloud 目录时才使用本 skill。

## 架构边界

- 先确定使用阿里云、腾讯云或其他受支持云空间，以及开发、测试、生产环境。
- 明确哪些领域继续走配套 Java 后端，哪些由 uniCloud 承担；同一业务事实不要在两套后端重复维护。
- 不修改 `src/http` 的 Token、刷新或 401 流程来迎合单个云函数。
- 客户端不得持有云服务密钥、管理员凭证或绕过权限规则的能力。

## 按能力查阅

- 项目结构、环境和调用方式：官方总览 https://doc.dcloud.net.cn/uniCloud/
- 云数据库和 schema：https://doc.dcloud.net.cn/uniCloud/database.html
- 云函数：https://doc.dcloud.net.cn/uniCloud/cf-functions.html
- 云存储：https://doc.dcloud.net.cn/uniCloud/storage.html

相关 API 或控制台流程可能更新，实现前必须核对官方文档和当前云空间配置。

## 安全与数据

- 数据库默认最小权限；不要把演示用的宽松规则带入生产。
- 在云函数/云对象边界校验身份、参数和数据所有权。
- 敏感操作必须服务端授权，客户端返回值不能作为最终可信凭据。
- 为常用查询设计索引，并评估调用次数、存储、流量和云函数执行成本。
- 上传文件时校验大小、类型、归属和可访问范围；删除数据库记录时同步考虑孤立文件。

## 验证

至少验证权限拒绝、越权访问、异常重试、不同环境隔离和目标平台构建。涉及 schema、索引或数据迁移时，先说明回滚和兼容策略，不直接对生产数据执行破坏性操作。
