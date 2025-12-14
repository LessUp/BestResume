# 前端布局与交互问题清单
 
 > 本文件用于记录“前端问题的历史与现状”。
 > 
 > 说明：`app/[locale]/page.tsx` 的导航 i18n、移动菜单交互、Templates 标签等问题已在 2025-11-24 的相关变更中修复（见 `changelog/2025-11-24-*.md`）。
 > 
 > 当前项目已进入 **Serverless + Supabase(Postgres)** 重构阶段，新的整体计划见：`docs/supabase-serverless-refactor-plan.md`。
 
 ## 已修复（历史问题）
 
 ### Header 与导航
 - **状态**：已修复
 - **说明**：导航按钮文案已通过 `next-intl` 管理，移动端菜单已具备导航后关闭、resize 关闭、Esc/外部点击关闭等行为。
 
 ### Templates 区域本地化
 - **状态**：已修复
 - **说明**：Templates label 已使用 `HomePage.templatesSection.label` 等翻译 key。
 
 ### 首页浮动徽章定位
 - **状态**：已修复
 - **说明**：已用响应式 Tailwind 类替换固定像素偏移，减少窄屏遮挡/裁剪风险。
 
 ## 待处理（当前遗留问题）
 
 ### Auth 页面 i18n key 不一致
 - **现象**：`reset-password` / `verify-email` 页面使用了 `messages/*.json` 中不存在的 key，导致 fallback 或显示默认英文文案。
 - **建议**：统一所有页面使用的 key，并补齐 `messages/en.json`、`messages/zh.json`。
 
 ### 编辑器侧边栏与部分 toast 文案硬编码
 - **现象**：`components/resume/ResumeEditor.tsx`、`components/dashboard/ResumeCard.tsx`、`app/[locale]/auth/signin/page.tsx` 等存在硬编码中英文。
 - **建议**：统一收敛到 `messages/*.json`（例如 `Editor`/`Common` 分组），避免混用。
