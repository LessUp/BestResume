# BestResume Serverless + Supabase(Postgres) 重构路线图
 
 > 本路线图已与 `docs/supabase-serverless-refactor-plan.md` 对齐；后者是当前重构工作的**唯一权威执行计划**。
 
 ---
 
 ## Phase 0：准备与文档对齐（必须）
 
 - **目标**：统一“当前真实状态 vs. 目标状态”的描述，避免 SQLite/单机化误导。
 - **输出**：
   - `docs/supabase-serverless-refactor-plan.md`（总计划）
   - README、docs、.kiro/specs 的旧说明全部对齐到 Supabase 方案
 
 ---
 
 ## Phase 1：数据库迁移（SQLite → Supabase Postgres）
 
 - **目标**：将 Prisma datasource 从 `sqlite` 切换为 `postgresql`，并建立新的迁移基线。
 - **关键点**：
   - 使用 Supabase pooler 的 **Session(5432)** 作为 `DIRECT_URL`（migration 专用）
   - 使用 Supabase pooler 的 **Transaction(6543)** 作为 `DATABASE_URL`（Serverless runtime 专用），并追加 `pgbouncer=true`
 - **输出**：
   - `prisma/schema.prisma` 更新
   - migrations 重新基线化（与当前 schema 一致）
 
 ---
 
 ## Phase 2：Serverless 运行时适配（稳定性/安全）
 
 - **目标**：确保在多实例环境下依然正确。
 - **关键点**：
   - Prisma：`DATABASE_URL` / `DIRECT_URL` 分离策略落地
   - 构建期：确保 `prisma generate` 必然执行
   - 部署期：明确 `prisma migrate deploy` 的执行位置与策略（避免在 Preview 环境误触）
   - 限流：将登录限流从“进程内 Map”升级为“共享存储后端”（优先 Redis/KV，备选 Postgres 表）
 
 ---
 
 ## Phase 3：应用整合重构（可维护性/一致性）
 
 - **目标**：收敛重复逻辑，统一错误处理与 i18n。
 - **范围**：
   - Server Actions：鉴权/用户查找/错误返回结构统一
   - 前端：修复 i18n key 不存在导致的 fallback；清理硬编码中英文
   - Next.js 约定：修正 `params` 类型、避免 `Promise<...>` 误用
 
 ---
 
 ## Phase 4：CI/CD 与验收（可持续交付）
 
 - **目标**：每次提交都能自动验证、可回滚。
 - **范围**：
   - GitHub Actions：补齐 `npm run test`，并提供 CI Postgres 或 mock 策略
   - 部署：补齐 Netlify/Vercel 的环境变量清单与迁移策略
 
 ---
 
 ## 参考
 
 - `docs/supabase-serverless-refactor-plan.md`
 - `.kiro/specs/platform-fixes/*`（平台修复历史规格，已基本完成，后续以新架构计划为准）
