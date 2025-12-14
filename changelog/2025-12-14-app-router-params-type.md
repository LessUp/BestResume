# 2025-12-14 App Router params 类型修正

## 变更
- 修正以下页面/布局中 `params`（以及部分 `searchParams`）的类型声明：从 `Promise<...>` 调整为 Next.js App Router 约定的同步对象，并移除不必要的 `await`。
  - `app/[locale]/layout.tsx`
  - `app/[locale]/dashboard/page.tsx`
  - `app/[locale]/settings/page.tsx`
  - `app/[locale]/editor/[id]/page.tsx`

## 目的
- 避免与 Next.js App Router 参数传递约定不一致导致的类型错误与潜在运行时误解。
