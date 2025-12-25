# 2025-12-25 修复：提升 npm install（Prisma engines）稳定性

## 变更
- `package.json`
  - 增加 `engines.node` 约束为 `>=20 <21`，与 Netlify/Docker 默认 Node 版本保持一致
  - 增加 `install:retry` 脚本：设置 `PRISMA_ENGINES_MIRROR` 并提高 npm fetch 重试与超时阈值

- 新增 `.nvmrc`
  - 固定本地开发 Node 版本为 `20`

- 新增 `.npmrc`
  - 增强 npm 下载的重试与超时配置，缓解 `@prisma/engines` 在 `postinstall` 阶段因网络抖动导致的失败

## 结果
- 降低 `npm install` 在 `@prisma/engines` 下载阶段出现 `ECONNRESET` 的概率
- 统一开发/部署环境的 Node 版本预期

## 后续
- 若仍出现下载失败，可在网络受限环境下额外配置 `HTTPS_PROXY/HTTP_PROXY/NO_PROXY`
