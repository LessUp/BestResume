# 2025-12-18 简历编辑器表单/预览补齐 ResumeData 全字段（第二阶段）

## 变更
- 扩展简历编辑表单，补齐 `ResumeData` 缺失字段：
  - `BasicsForm`：新增 `basics.location`（地址/邮编/城市/地区/国家代码）与 `basics.profiles`（社交账号列表增删改）。
  - `WorkForm`：新增 `work.url` 与 `work.highlights`（按行输入）。
  - `EducationForm`：新增 `education.url` 与 `education.courses`（按行输入）。
  - `SkillsForm`：新增 `skills.level`（下拉选择）。
  - `ProjectsForm`：新增 `projects.roles` 与 `projects.highlights`（按行输入）。
  - 新增 `LanguagesForm`：支持 `languages` 的增删改（language/fluency）。
  - `components/resume/forms/*`

- 编辑器侧边栏导航新增「语言」入口，并接入 `LanguagesForm`。
  - `components/resume/ResumeEditor.tsx`

- 预览与模板渲染补齐新字段展示：
  - `ResumePreview` 透传 `languages`。
  - `StandardTemplate/ModernTemplate/MinimalTemplate`：新增 `languages` 区块，并补齐展示 `basics.profiles`、`work.url`、`education.url/courses`、`skills.level`、`projects.roles/highlights` 等字段。
  - `components/resume/ResumePreview.tsx`
  - `components/resume/templates/*`

- i18n 文案补齐：
  - 新增 `Editor.sectionLanguages`。
  - 补齐 `Resume.forms` 新字段的 label/placeholder/空状态文案。
  - 补齐 `Resume.templates` 新字段展示所需标签（courses/roles/languages）。
  - `messages/zh.json`、`messages/en.json`

- 数据兼容性：加载旧简历 JSON 时自动补齐缺失字段，避免新增受控表单出现 `undefined` 导致的受控/非受控切换警告。
  - `lib/store.ts`：`setResumeData` 内部增加 normalize 逻辑。

## 目的
- 让编辑器 UI 覆盖 `ResumeData` 的所有字段，保证「能编辑」与「预览可见」一致。
- 兼容历史数据，避免新增字段导致编辑器报错或输入异常。
