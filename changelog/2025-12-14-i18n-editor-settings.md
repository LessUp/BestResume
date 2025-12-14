# 2025-12-14 编辑器/设置/语言切换 i18n 清理

## 变更
- 更新 `messages/en.json`、`messages/zh.json`：
  - `Common`：新增语言相关文案（`language/langZh/langEn`）、下拉占位（`selectPlaceholder`）
  - `Editor`：新增编辑器侧边栏与分区标题文案，以及默认标题模板（`defaultTitle`）
  - `Settings`：新增语言选项文案（`languageZh/languageEn`）
- 更新 `components/LanguageSwitcher.tsx`：移除硬编码“语言/Language/中文/EN”，改为使用 `Common` 翻译。
- 更新 `components/resume/ResumeEditor.tsx`：侧边栏（Design/Content/Templates/Personal/...）改为使用 `Editor` 翻译。
- 更新 `app/[locale]/editor/[id]/EditorClient.tsx`：保存简历的默认标题改为使用 `Editor.defaultTitle`/`Editor.untitled`。
- 更新 `components/settings/SettingsClient.tsx`：
  - 语言选项移除硬编码（中文/English），改为使用 `Settings.languageZh/languageEn`
  - 修正自定义 Select 初始显示（直接渲染当前 value 对应 label）
  - 会员计划默认值从硬编码 `Free` 改为使用 `Settings.free`
  - 移除未使用的 `SelectValue` 导入
- 更新 `components/ui/select.tsx`：默认 placeholder 从中文“选择...”改为英文“Select...”（避免英文界面出现中文默认文案）。

## 目的
- 进一步清理硬编码文案，确保多语言一致性，并避免 next-intl 因缺失 key 导致运行时异常。
