# 2025-12-14 Supabase 文档 env 文件说明修正

## 变更
- 更新 `docs/supabase-serverless-refactor-plan.md`：将本地环境变量文件建议从仅 `.env.local` 调整为优先使用 `.env`（Prisma CLI 默认读取），并补充可选的 `.env.local` 覆盖说明。

## 目的
- 避免后续执行 Prisma CLI（如 migrate/generate）时因未读取到 `.env.local` 而导致连接串缺失或误解。
