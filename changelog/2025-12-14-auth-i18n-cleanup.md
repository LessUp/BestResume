# 2025-12-14 认证流程 i18n 清理

## 变更
- 更新 `messages/en.json`、`messages/zh.json`：补齐 Auth/通用文案缺失的翻译 key（reset-password、verify-email 相关提示、登录/注册 features、通用删除/复制失败提示等）。
- 更新认证页面：移除对缺失 key 的无效 fallback（next-intl 缺 key 会抛错），统一使用 i18n key。
  - `app/[locale]/auth/reset-password/page.tsx`
  - `app/[locale]/auth/verify-email/page.tsx`
  - `app/[locale]/auth/signin/page.tsx`
  - `app/[locale]/auth/signup/page.tsx`
- 更新 `components/dashboard/ResumeCard.tsx`：将“删除中…”以及删除/复制失败 toast 文案改为使用 `Common` 翻译。

## 目的
- 消除硬编码与缺失翻译 key 导致的运行时报错/文案混用问题，保证中英文站点一致。
