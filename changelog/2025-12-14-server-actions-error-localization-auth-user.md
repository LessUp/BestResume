# 2025-12-14 Server Actions 错误体系收敛（Auth/User）

## 变更
- 扩展 `LocalizedError` 错误键与文案：补齐注册/邮件发送/密码重置/邮箱验证等通用错误键。
  - `lib/errors.ts`
  - 新增：`registrationFailed`、`sendEmailFailed`、`resetPasswordFailed`、`emailVerifyFailed`
- 收敛 `auth` Server Actions 的错误处理：
  - `app/actions/auth.ts`
  - 对未知异常统一捕获并转换为 `LocalizedError`（避免泄漏底层异常信息）
- 收敛 `user` Server Actions 的错误处理：
  - `app/actions/user.ts`
  - 对未知异常统一捕获并转换为 `LocalizedError`（`updateFailed`/`deleteFailed`）

## 目的
- 让客户端侧统一只展示 `err.message` 即可获得稳定的多语言错误信息。
- 避免在 Server Actions 直接返回/抛出硬编码错误字符串或未处理的原始异常。
