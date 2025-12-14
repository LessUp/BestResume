# BestResume

一个基于 **Next.js**、**React**、**TypeScript**、**Tailwind CSS** 的在线简历管理平台，生产环境采用 **Serverless + Supabase(Postgres)**（Prisma + NextAuth）。

## 功能概览

- 在线创建、编辑和管理个人简历（含自动保存）
- 支持多份简历配置（如不同岗位版本）
- 多语言（`zh` / `en`）
- 账号体系（NextAuth Credentials）
- 密码重置、邮箱验证（SMTP 可配置）
- 活动日志记录（用于审计与风控基础能力）

> 本 README 为基础版本，你可以根据实际业务继续补充「产品介绍」「设计规范」「接口文档」等内容。

## 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS、tailwind-merge、tailwindcss-animate
- **状态管理**: Zustand（见 `lib/store.ts` 等）
- **数据库**: Supabase Postgres
- **ORM**: Prisma（`@prisma/client`）
- **认证**: NextAuth（beta 版本）

## 本地开发

### 环境要求

- Node.js 20+（与 `netlify.toml`/Docker 默认版本保持一致）
- npm / pnpm / yarn 任选其一

### 环境变量

将 `.env.example` 复制为 `.env.local`，并填写必要变量（不要提交 `.env.local`）：

- `DATABASE_URL`：Supabase **Transaction pooler（6543）**，并追加 `pgbouncer=true`
- `DIRECT_URL`：Supabase **Session pooler（5432）**（用于 Prisma migrations）
- `NEXTAUTH_SECRET`、`NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- （可选）SMTP：`SMTP_HOST`、`SMTP_PORT`、`SMTP_USER`、`SMTP_PASS`、`EMAIL_FROM`

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn
```

### 启动开发服务器

```bash
npm run dev
```

默认会在 `http://localhost:3000` 启动开发环境（除非你在配置中修改了端口）。

### 构建与运行

```bash
# 生产构建
npm run build

# 启动生产服务（依赖上一步 build）
npm start

# 代码检查
npm run lint
```

### 测试

```bash
npm test
```

## 部署（Serverless）

- 本项目默认可使用 Netlify（仓库内已包含 `netlify.toml` 与 `@netlify/plugin-nextjs`）。
- 部署前需要在平台环境变量中配置：`DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL` 等。
- Prisma migrations 建议使用 `prisma migrate deploy` 在部署流程中执行（详情见 `docs/supabase-serverless-refactor-plan.md`）。

## 项目结构（示例）

以下仅为典型 Next.js + Tailwind 项目中常见的目录，你的实际结构可能略有不同：

- `app/` 或 `pages/`：页面与路由
- `components/`：通用 UI 组件
- `lib/`：工具函数、状态管理（如 `store.ts`）
- `prisma/`：Prisma schema 与迁移（如有）
- `public/`：静态资源

你可以根据当前项目的真实结构，补充或修改上述说明。

## 后续可优化方向

- 补充详细的产品介绍与功能列表
- 添加截图或录屏展示
- 说明部署方式（如 Vercel、Netlify 或自托管）
- 编写贡献指南（CONTRIBUTING）和代码规范
