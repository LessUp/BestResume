# 2025-12-18 Upstash 分布式登录限流

## 变更
- 新增 `UpstashRateLimiter`：基于 Upstash Redis/KV REST API 实现分布式限流（Serverless 兼容）。
  - `lib/rate-limit.ts`
- 登录限流在运行时自动选择实现：检测到 Upstash 环境变量则启用 Upstash，否则回退到内存 `RateLimiter`。
  - `auth.ts`
- 补齐 Upstash 相关环境变量占位。
  - `.env.example`

## 目的
- 解决 Serverless 多实例下进程内 Map 限流不一致的问题，保证 Netlify 部署环境的登录限流稳定可用。
