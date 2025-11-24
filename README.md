# BestResume

一个基于 **Next.js**、**React**、**TypeScript**、**Tailwind CSS** 的在线简历 / 履历管理项目。

## 功能概览

- 在线创建、编辑和管理个人简历
- 支持多份简历配置（如不同岗位版本）
- 支持现代 UI 组件库与动效
- 计划集成账号系统与数据持久化（Prisma / NextAuth 等）

> 本 README 为基础版本，你可以根据实际业务继续补充「产品介绍」「设计规范」「接口文档」等内容。

## 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS、tailwind-merge、tailwindcss-animate
- **状态管理**: Zustand（见 `lib/store.ts` 等）
- **数据库 / ORM**: Prisma（`@prisma/client`）
- **认证**: NextAuth（beta 版本）

## 本地开发

### 环境要求

- Node.js 18+（建议使用 LTS 版本）
- npm / pnpm / yarn 任选其一

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
