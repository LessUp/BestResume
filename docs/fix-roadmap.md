# BestResume 前端与后端修复路线图

> 目标：在 **最小改动原则** 下，逐步修复当前已知问题，提升稳定性、可维护性和体验。下列阶段可以按顺序实施，每个阶段都尽量局部、可回滚。

---

## Phase 1：前端首页与布局/交互修复（优先级：高）

聚焦 `app/[locale]/page.tsx` 和相关 UI 组件，修复已有 `docs/frontend-issues.md` 中列出的具体问题，并补充我在代码审查中发现的首页相关小问题。

### 1.1 Header 与导航国际化 & 行为修复

- **问题点**
  - 桌面端 & 移动端导航按钮文案未完全走 `next-intl`，在部分场景下会出现中英文混用或文案不随 locale 更新的问题。
  - 移动端菜单开关逻辑不够健壮（需要确认与现有代码保持一致或做最小必要增强）。
- **改动范围**
  - `app/[locale]/page.tsx` Header 区域（导航按钮、`LanguageSwitcher`、移动端菜单 toggle）。
- **计划改动**
  - 确保所有按钮与导航文案均通过 `useTranslations("HomePage")`/`messages/*.json` 管理，去除硬编码文案。
  - 保持现有 `useState` 控制 mobile menu 的结构不变，仅在不破坏设计的前提下增强：
    - 导航后自动关闭菜单。
    - 视口变为桌面宽度时关闭菜单。
    - 支持点击外部区域或按下 `Esc` 关闭菜单（这部分当前代码已经部分实现，如果与 docs 里描述有出入，将以**现有实现为准**，仅补最小缺失逻辑）。

### 1.2 Templates 区域本地化

- **问题点**
  - Templates 区域存在仍为英文的标题/标签，未完全通过 i18n 管理。
- **改动范围**
  - `app/[locale]/page.tsx` Templates section 区域。
- **计划改动**
  - 使用已有的 `HomePage.templatesSection.*` 翻译 key（如果缺失则按现有 messages 结构补充），替换硬编码的英文文案，保证中英文站点一致通过文案文件控制。

### 1.3 浮动徽章与预览卡片布局细节

- **问题点**
  - 预览卡片周围的浮动徽章与 badge 使用绝对定位和固定像素偏移，在窄屏幕或特定断点可能与其他内容重叠或被裁剪。
- **改动范围**
  - `app/[locale]/page.tsx` 中预览卡片与其周围 `absolute` + `translate` 布局的组件。
- **计划改动**
  - 在不改变视觉风格的前提下微调：
    - 将部分严格依赖固定像素的 `top`/`left`/`right` 偏移改为相对容器（如 `inset-x-4`, `bottom-4` 等，结合响应式类）以提升在不同屏宽下的适配能力。
    - 必要时使用 `lg:`、`md:` 前缀提供不同断点下的稍微不同偏移，避免小屏遮挡核心内容。

### 1.4 首页其它小问题巡检

- **问题点/检查项**
  - 检查首页所有按钮链接与 `locale` 的拼接是否一致（例如 `/{locale}/auth/signin`、`/{locale}/editor/demo` 等）。
  - 检查是否存在直接使用 `new Date()` 渲染年份等逻辑，对 SSR/CSR 行为不会产生水合问题（当前写法一般可接受，但会顺手确认）。
- **改动范围**
  - 仍然集中在 `app/[locale]/page.tsx`。
- **计划改动**
  - 若发现 locale 拼接不统一或路径有误，做最小修改保证链接正确。
  - 若发现潜在水合告警，必要时使用更安全的模式（例如在客户端 effect 中更新），但仅在确实有问题时改动。

---

## Phase 2：认证、会话与账号相关流程（优先级：中）

聚焦 `auth.ts`、`app/actions/auth.ts`、`app/actions/user.ts` 等，与 NextAuth/Prisma 相关的逻辑。

### 2.1 会话中会员信息/角色信息的使用方式

- **问题点**
  - `auth.ts` 中 `authorize` 已返回 `role` 和 `isMember` 字段，但 `callbacks.session` 只设置了 `session.user.id`，未将 `role` / `isMember` 等附加到 `session.user`，导致前端若直接读取 `session.user.isMember` 会拿不到数据。
- **改动范围**
  - `auth.ts` 的 NextAuth 配置。
- **计划改动**
  - 设计一个简单、一致的策略：
    - 要么在 `jwt` 和 `session` 回调中同步 `role`、`isMember` 到 token 和 session，供前端直接使用；
    - 要么明确约定「所有用户状态都通过 `getCurrentUser` server action 查询」，并在文档/代码注释中说明，避免未来混用。
  - 目标是在不大改业务代码的前提下，让会员体系的读写路径简单、清晰。

### 2.2 密码重置 & 邮箱验证的闭环

- **问题点**
  - `app/actions/auth.ts` 中 `requestPasswordReset` 与 `sendVerificationEmail` 只生成 token 并 `console.log`，未实际发送邮件，也缺少前端承接页面，整体流程为半成品。
- **改动范围**
  - `app/actions/auth.ts`
  - 将新增少量前端页面，如：`/reset-password`、`/verify-email` 对应的 page（具体路径以现有路由为准，遵守最小改动）。
- **计划改动**
  - 接入一个最简邮件发送方案（可优先支持开发环境，如通过环境变量配置 SMTP）。
  - 新增前端页面：
    - 用户点击邮件链接携带 token 打开页面；
    - 页面调用 `resetPassword` / `verifyEmail` 完成操作，并给出用户友好的反馈 UI。

### 2.3 用户设置相关 server actions 巡检

- **问题点/检查项**
  - `app/actions/user.ts` 中更新用户资料、偏好、密码等逻辑需要确认错误处理与权限检查是否完整，一些错误消息中英文混用。
- **改动范围**
  - `app/actions/user.ts`。
- **计划改动**
  - 检查所有 action：
    - 是否都在读取 session 后再访问数据库；
    - 错误抛出是否会在前端被合理捕获并展示给用户；
    - 必要时统一错误信息风格（中文/英文）或预留 i18n 接入点。

---

## Phase 3：类型、路由与缓存相关的小问题（优先级：中）

### 3.1 `params` 类型声明与 Next.js 约定不一致

- **问题点**
  - 在 `app/[locale]/layout.tsx`、`app/[locale]/dashboard/page.tsx` 中，`params` 被声明为 `Promise<{ locale: string }>`，并在代码中 `await params`，这与 Next.js App Router 的约定不符（实际传入的是同步对象）。
- **改动范围**
  - `app/[locale]/layout.tsx`
  - `app/[locale]/dashboard/page.tsx`
- **计划改动**
  - 将 `params` 类型改为标准的 `{ locale: string }`，移除不必要的 `await`，保持逻辑行为不变，仅修正类型与调用方式。

### 3.2 `revalidatePath('/dashboard')` 与多语言路由不匹配

- **问题点**
  - `app/actions.ts` 中在保存/删除/复制简历后调用 `revalidatePath('/dashboard')`，但实际页面路径为 `/[locale]/dashboard`。
  - 若该页面本身是动态渲染，`revalidatePath` 可能并无实质效果，但该不一致容易造成困惑。
- **改动范围**
  - `app/actions.ts`。
- **计划改动**
  - 根据实际路由策略决定：
    - 若 Dashboard 完全走动态渲染：可以考虑移除多余的 `revalidatePath` 调用；
    - 若需要静态缓存：改为根据当前 locale 拼接正确路径并调用，或使用 pattern。

---

## Phase 4：安全性与健壮性增强（优先级：低）

这些改进不会立刻影响功能正确性，但能提升在生产环境下的安全性与稳定性。

### 4.1 登录防爆破与节流

- 在 Credentials 登录流程中加入简单的节流/失败计数逻辑，例如：
  - 同一 IP 或账号在短时间内多次失败时短暂锁定；
  - 记录失败次数并在 ActivityLog 中标记高风险行为。

### 4.2 Token 存储安全性

- 对密码重置与邮箱验证 token 考虑只存储哈希值，而非明文 token，提高数据库泄露情况下的安全性。

### 4.3 活动日志信息完善

- 在创建 ActivityLog 时补充 IP / User-Agent 等字段（在适当的层次获取，避免牵连过多模块），便于后续审计与风控。

---

## 执行顺序建议

1. **Phase 1**：先修复首页的 i18n、导航行为和布局问题，影响面直观且对用户体验提升最大。
2. **Phase 2**：补齐认证/账号相关流程，特别是会话信息的一致性和密码重置/邮箱验证闭环。
3. **Phase 3**：修正类型/路由/缓存的小问题，提升长期可维护性，减少未来踩坑概率。
4. **Phase 4**：根据实际上线需求分批引入安全增强措施。

后续我将按以上顺序依次在代码中实施最小必要改动，每完成一个 Phase，会在本文件或对应 issue 文档中简要记录变更摘要。
