# 2025-12-14 CI 增加测试步骤

## 变更
- 更新 `.github/workflows/ci.yml`：
  - 增加 `npm run test`
  - 补齐 CI 运行所需的 `DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`NEXT_PUBLIC_APP_URL` 占位环境变量

## 目的
- 确保每次提交都能在 CI 中自动执行单测与构建，并避免因缺少环境变量导致的构建/测试失败。
