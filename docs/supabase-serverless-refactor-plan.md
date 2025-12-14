# BestResume：Serverless + Supabase(Postgres) 整合重构总计划

> 目标：将 BestResume 从“本地 SQLite（文件库）+ 单机思维”升级为 **Serverless + Supabase(Postgres)** 的可持续架构，并在此过程中完成工程化、文档与代码质量的系统性整合。

---

## 1. 背景与现状

当前仓库已具备：

- Next.js App Router（含 `[locale]` 多语言路由）
- NextAuth（Credentials）+ Prisma Adapter
- Prisma（当前 schema 为 `sqlite`）
- 邮件（Nodemailer）、token hash、activity log、property tests（Vitest + fast-check）
- Netlify 配置（`netlify.toml`）与 Dockerfile

关键问题（与“Serverless + Supabase”直接相关）：

- **SQLite 文件库不适合 Serverless**：函数实例无持久磁盘/不共享文件，并发写入锁冲突风险高。
- **内存型限流在 Serverless 下失效**：`RateLimiter` 目前是进程内 `Map`，多实例时无法共享状态。
- **Prisma 迁移历史与当前 schema 不一致**：现有 `prisma/migrations` 仍锁定 `sqlite`，且 migration 内容与当前 schema 已不匹配，需要重建迁移基线。

---

## 2. 目标架构（推荐落地形态）

- **Web Runtime**：Next.js（Node runtime）
- **Database**：Supabase Postgres（主库）
- **ORM**：Prisma（`provider = "postgresql"`）
- **Auth**：NextAuth（继续使用 Credentials + PrismaAdapter）
- **I18n**：next-intl（保持）
- **部署**：Serverless（优先：Netlify 继续沿用现有配置；也可兼容 Vercel）

关键约束：

- Serverless 环境必须做到“**无本地状态依赖**”（DB、限流、文件等）。
- Prisma 在连接池/Prepared Statement 方面要遵循 Supabase 的连接建议。

---

## 3. 迁移与部署关键决策（强制遵循）

### 3.1 Prisma 连接字符串策略（Supabase 官方建议）

- **`DATABASE_URL`**：用于运行时（Serverless）连接，使用 **Transaction pooler（端口 6543）**。
  - 必须追加 `pgbouncer=true`（关闭 prepared statements）。
- **`DIRECT_URL`**：用于 migration / deploy（`prisma migrate deploy`），使用 **Session pooler（端口 5432）**。

在 `schema.prisma` 中使用：

- `url = env("DATABASE_URL")`
- `directUrl = env("DIRECT_URL")`

### 3.2 环境变量管理

- 本地：优先使用 `.env`（Prisma CLI 默认读取，不提交）；如需本地覆盖可再使用 `.env.local`
- CI：使用占位值或 CI Postgres service
- 生产：在 Netlify/Vercel 配置 Secrets

### 3.3 数据与迁移基线

- 由于现有 migration 与 schema 不一致，且 provider 将从 sqlite 切到 postgresql：
  - **建议重建 migrations 基线**（新的 init migration），并将旧 sqlite 迁移作为历史参考（或归档）。

---

## 4. Supabase 侧准备（一次性工作）

### 4.1 创建 Supabase Project

- 进入 Supabase Dashboard：`https://supabase.com/dashboard`
- 选择/创建 Organization，然后点击 **New project**
- 填写：
  - Project name（例如：`bestresume`）
  - Database Password（建议使用密码管理器生成强密码）
  - Region（选择离用户更近的区域）
- 等待项目初始化完成（通常 1-3 分钟）

> 说明：该 Database Password 是默认 `postgres` 管理用户的密码。生产中我们将创建一个专用的 `prisma` 用户来连接数据库。

### 4.2 创建 Prisma 专用数据库用户（建议）

在 Supabase Dashboard 打开：**SQL Editor** -> **New query**，执行以下 SQL（来自 Supabase Prisma 官方文档，按需替换密码）：

```sql
-- Create custom user
create user "prisma" with password 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
grant "prisma" to "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

注意：

- `custom_password` 请替换为强密码（建议用密码管理器生成）
- `createdb` 主要用于本地开发阶段 `prisma migrate dev` 的 shadow database（生产环境我们会用 `prisma migrate deploy`）

### 4.3 获取两条连接串

- 在 Supabase Dashboard 点击右上角 **Connect**（或 Settings -> Database -> Connection string）
- 找到 Supavisor/Supabase Pooler 连接信息，并确认端口：
  - **Session pooler（5432）**：用于 migration（`DIRECT_URL`）
  - **Transaction pooler（6543）**：用于 Serverless runtime（`DATABASE_URL`，并追加 `pgbouncer=true`）

### 4.4 配置本地环境变量（必做）

- 复制 `.env.example` 为 `.env`（不提交）
- （可选）如你希望区分 Next.js 本地配置，再复制一份为 `.env.local`
- 填写以下变量：
  - `DATABASE_URL`：使用 **Transaction pooler（6543）**，并确保包含 `pgbouncer=true`
  - `DIRECT_URL`：使用 **Session pooler（5432）**
  - `NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`NEXT_PUBLIC_APP_URL`
  - （可选）SMTP 相关变量（否则邮件会以 console log 形式输出）

> 说明：`.env.local` 不要提交到 Git；部署到 Netlify/Vercel 时，需要在平台环境变量中配置同名变量。

---

## 5. 重构里程碑与执行计划（按批次提交）

> 每个里程碑都要满足：
> 1) `npm run lint` 通过
> 2) `npm run test` 通过
> 3) `npm run build` 通过
> 4) 在 `changelog/` 记录变更

### Milestone A：文档与工程基线整理（低风险）

- 在 `docs/` 新增本计划文档（本文件）。
- 更新旧文档：
  - `docs/fix-roadmap.md`：从“修复路线图”升级为“重构路线图”，以 Supabase/Serverless 为核心。
  - `docs/frontend-issues.md`：将已修复的问题标记为已完成，并补充新的遗留问题（如 i18n 缺失 key）。
  - `README.md`：补齐 Supabase/Serverless 部署说明与环境变量说明。

交付物：

- 文档结构统一且不再包含与 SQLite/单机强绑定的误导描述。

### Milestone B：Prisma 切换到 Supabase Postgres（核心）

- 修改 `prisma/schema.prisma`：
  - datasource 从 `sqlite` 改为 `postgresql`
  - 增加 `directUrl = env("DIRECT_URL")`
- 迁移策略：
  - 重建 migrations（生成与当前 schema 一致的 init migration）
  - 处理旧的 sqlite migrations（归档/移除）
- 更新 `.gitignore`：确保 `prisma/dev.db`、`.env*` 不会被提交。

交付物：

- 项目可使用 Supabase Postgres 正常启动与运行。

### Milestone C：Serverless 适配（稳定性与安全）

- **限流**：将登录限流从“进程内 Map”升级为“可共享的存储后端”。
  - 推荐实现方式（择一）：
    - Upstash Redis（最贴合 Serverless）
    - Postgres 表实现（避免引入第三方，但会增加 DB 压力）
- **连接参数**：在文档中明确 `pgbouncer=true`、`connection_limit`、`pool_timeout` 等必要参数。

交付物：

- 多实例下限流行为一致且可控。

### Milestone D：Server Actions 整合重构（可维护性）

- 统一错误体系：`app/actions.ts` 的 `throw new Error("...")` 迁移到 `LocalizedError`。
- 统一鉴权与用户获取：抽取 `requireUser()` / `requireSession()` helper，减少重复查询。
- 清理 action 导出：避免 `app/actions.ts` 与 `app/actions/*` 双入口造成困惑。

交付物：

- Server Actions 边界清晰、重复逻辑下降、错误展示一致。

### Milestone E：前端 i18n 与 UI 文案一致性（体验）

- 修复 `messages/*.json` 与页面使用的 key 不匹配问题。
- 移除硬编码中文/英文（Editor Sidebar、SignIn features、ResumeCard 错误 toast 等）。

交付物：

- 中文/英文 UI 文案完全一致受控，避免 fallback。

### Milestone F：CI/CD 与部署流程（可持续交付）

- GitHub Actions：补齐 `npm run test`，并为 `DATABASE_URL` 提供 CI 方案：
  - 方案 1：CI Postgres service + `prisma migrate deploy`
  - 方案 2：最小化：只提供占位 `DATABASE_URL`，确保 build/test 不因缺少 env 失败
- Netlify/Vercel：明确迁移执行位置：
  - 建议在生产部署时执行 `prisma migrate deploy`（避免 preview 环境误触）。

交付物：

- 每次提交可自动验证 lint/test/build
- 生产发布流程可复现、可回滚

---

## 6. 验收清单（最终目标）

- 注册/登录/退出正常
- 创建/编辑/删除/复制简历正常（含自动保存）
- 密码重置与邮箱验证闭环正常
- Serverless 部署后（多实例）限流逻辑仍有效
- CI 通过，文档无过期描述

---

## 7. 回滚策略

- 数据层：Supabase 支持备份/导出；迁移采用 `prisma migrate`，避免手写 SQL。
- 应用层：每个 Milestone 独立合并；出现问题可回退到上一里程碑。

---

## 8. 你需要提供/确认的信息（开始实施前）

- 你最终部署平台：Netlify 还是 Vercel？（仓库已有 Netlify 配置，我将优先按 Netlify 落地）
- 你是否已创建 Supabase Project 并可在本地配置 `.env.local`：
  - `DATABASE_URL`（6543 + pgbouncer=true）
  - `DIRECT_URL`（5432）
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`

> 说明：你不需要把任何密钥发给我；只要你在本机/平台配置好环境变量，我就可以继续推进代码与迁移步骤。
