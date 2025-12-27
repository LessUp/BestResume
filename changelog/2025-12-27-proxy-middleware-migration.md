# 2025-12-27 Proxy Middleware 迁移

## 变更
- 按 Next.js 16 指南停用 `middleware.ts`，仅保留 `proxy.ts`，避免启动时报错。

## 背景
- Next.js 16 要求从 middleware 迁移至 proxy，项目此前同时存在两个文件导致 `npm run dev` 无法继续。

## 风险
- 访问路径匹配全部由 `proxy.ts` 控制，如需额外拦截逻辑需在该文件维护。
