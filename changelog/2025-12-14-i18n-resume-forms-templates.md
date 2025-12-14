# 2025-12-14 简历编辑表单/模板 i18n 清理

## 变更
- 更新 `messages/en.json`、`messages/zh.json`：新增 `Resume` 命名空间，补齐简历编辑表单与模板渲染所需文案。
  - `Resume.forms`：Basics/Work/Education/Skills/Projects 表单标题、字段名、空状态、placeholder 等
  - `Resume.templates`：模板区块标题与标签（Profile/Experience/Education/Projects/Skills/Technologies/GPA/Link 等）
- 更新简历编辑表单：移除硬编码英文文案，统一改为使用 `next-intl`（`useTranslations('Resume.forms')`）。
  - `components/resume/forms/BasicsForm.tsx`
  - `components/resume/forms/WorkForm.tsx`
  - `components/resume/forms/EducationForm.tsx`
  - `components/resume/forms/SkillsForm.tsx`
  - `components/resume/forms/ProjectsForm.tsx`
- 更新简历模板：移除硬编码英文标题/标签，统一改为使用 `next-intl`（`useTranslations('Resume.templates')`）。
  - `components/resume/templates/StandardTemplate.tsx`
  - `components/resume/templates/ModernTemplate.tsx`
  - `components/resume/templates/MinimalTemplate.tsx`

## 目的
- 让简历编辑与预览在中英文界面下文案一致、可维护，并减少硬编码导致的多语言缺失问题。
