# 2025-12-14 Server Actions 错误体系收敛（LocalizedError）

## 变更
- 扩展 `LocalizedError` 错误键：补齐简历相关错误键，并提供中英文错误文案。
  - `lib/errors.ts`
  - 新增：`resumeNotFoundOrUnauthorized`、`resumeSaveFailed`、`resumeDeleteFailed`、`resumeDuplicateFailed`
- 统一简历相关 Server Actions 的错误抛出方式：移除 `throw new Error("...")` 硬编码错误，改为抛出 `LocalizedError`。
  - `app/actions.ts`
  - 并在捕获到未知异常时，降级为对应的本地化错误（如 `resumeSaveFailed` 等）
- 端到端透传 `locale`：
  - 编辑器自动保存调用 `saveResume` 时传入 `locale`（确保错误信息语言正确）
    - `app/[locale]/editor/[id]/EditorClient.tsx`
  - Dashboard 删除/复制简历时传入 `locale`，并在失败 toast 中优先展示 `err.message`
    - `components/dashboard/ResumeCard.tsx`
- 扩展错误本地化属性测试覆盖：加入新增的简历错误键。
  - `app/actions/__tests__/error-localization.property.test.ts`

## 目的
- 消除 Server Actions 中的硬编码错误字符串，统一使用 `LocalizedError` 输出稳定的多语言错误信息。
- 让客户端/页面层统一只展示 `err.message`，减少重复翻译与错误提示不一致问题。
