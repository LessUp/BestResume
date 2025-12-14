# 2025-12-12 Serverless + Supabase 重构计划文档

## 变更
- 在 `docs/` 新增 `supabase-serverless-refactor-plan.md`：定义 BestResume 从 SQLite 迁移到 **Serverless + Supabase(Postgres)** 的总体架构与分阶段重构里程碑（连接串策略、迁移基线、Serverless 适配、CI/CD 等）。
- 更新 `docs/fix-roadmap.md`：将旧的“修复路线图”对齐为 **Serverless + Supabase(Postgres) 重构路线图**，并指向新计划文档作为权威来源。
- 更新 `docs/frontend-issues.md`：将历史已修复项与当前遗留问题分离，并对齐到 Supabase 重构阶段。
- 更新 `README.md`：对齐 Serverless + Supabase(Postgres) 架构，补齐环境变量、测试与部署说明。
- 新增 `.env.example`：提供 Supabase 连接串（`DATABASE_URL`/`DIRECT_URL`）、NextAuth、SMTP、限流等环境变量模板。
- 更新 `prisma/schema.prisma`：将 datasource provider 切换为 `postgresql`，并加入 `directUrl = env("DIRECT_URL")`。
- 更新 `prisma/migrations/migration_lock.toml`：将 provider 锁定为 `postgresql`（与 schema 保持一致）。
- 更新 `vitest.setup.ts`：为测试环境提供 Postgres 形式的默认 `DATABASE_URL`/`DIRECT_URL`，避免 provider 切换后因 URL/ENV 导致测试阶段失败。
- 更新 `.gitignore`：忽略 `prisma/dev.db` 及其 journal 文件，避免继续提交 SQLite 文件库。
- 新增 `prisma/migrations_sqlite_legacy/`：用于归档旧的 sqlite migrations。
- 更新 `docs/supabase-serverless-refactor-plan.md`：补充 Supabase 项目创建、Prisma 专用用户 SQL、连接串获取与本地环境变量配置步骤。

## 目的
- 为后续“数据库迁移 + Serverless 适配 + 文档与代码整合重构”提供统一、可执行的路线图。
