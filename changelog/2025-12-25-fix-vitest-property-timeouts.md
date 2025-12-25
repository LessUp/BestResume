# 2025-12-25 修复：Vitest property tests 超时

## 变更
- `app/[locale]/__tests__/floating-elements.property.test.tsx`
  - 为耗时较长的 property test 单独提高 `it(...)` 的 timeout（避免默认 5000ms 超时）
  - 显式从 `vitest` 导入 `vi`，修复 TypeScript 下 `vi` 未定义的报错

- `app/[locale]/__tests__/page.property.test.tsx`
  - 为耗时较长的 property test 单独提高 `it(...)` 的 timeout（避免默认 5000ms 超时）
  - 显式从 `vitest` 导入 `vi`，修复 TypeScript 下 `vi` 未定义的报错

## 结果
- `npm test` 不再因默认超时（5000ms）导致上述两条用例失败

## 后续
- 若测试机性能较弱或 CI 更慢，可再评估是否需要为 property tests 调整 `numRuns` 或做更细粒度的渲染优化
