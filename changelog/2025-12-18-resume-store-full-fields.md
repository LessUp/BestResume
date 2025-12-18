# 2025-12-18 Resume Store 补齐全字段编辑能力（第一阶段）

## 变更
- 扩展 Zustand `useResumeStore`：
  - 新增 `updateMeta`（支持 `themeColor`、`versionName` 等元信息更新，并刷新 `lastModified`）
  - 新增 `basics.location` 更新方法 `updateBasicsLocation`
  - 新增 `basics.profiles` 的增删改：`addProfile` / `updateProfile` / `removeProfile`
  - 新增 `languages` 的增删改：`addLanguage` / `updateLanguage` / `removeLanguage`
  - 在模板、基础信息、工作/教育/技能/项目变更时统一刷新 `meta.lastModified`
  - `lib/store.ts`

## 目的
- 为后续补齐表单 UI 与模板渲染打基础，确保 `ResumeData` 的所有字段在前端都有可编辑入口，并能正确触发自动保存与变更检测。
