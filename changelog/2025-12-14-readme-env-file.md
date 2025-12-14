# 2025-12-14 README 环境变量说明修正

## 变更
- 更新 `README.md`：将环境变量文件说明从复制到 `.env.local` 修正为复制到 `.env`，并补充说明 Prisma CLI 默认读取 `.env`。

## 目的
- 避免本地执行 Prisma CLI（例如 migrate/generate）时因未读取到 `.env.local` 而导致连接串缺失。
