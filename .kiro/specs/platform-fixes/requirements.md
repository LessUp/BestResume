# Requirements Document

## Introduction

BestResume 是一个基于 Next.js 16、React 19、TypeScript 和 Tailwind CSS 的在线简历管理平台。本需求文档旨在系统性地修复当前平台存在的前端国际化、认证流程、类型安全和安全性问题，提升用户体验、代码质量和系统稳定性。

## Glossary

- **System**: BestResume 平台
- **User**: 使用平台创建和管理简历的终端用户
- **Session**: 用户登录后的会话状态
- **Token**: 用于密码重置或邮箱验证的临时令牌
- **Locale**: 用户选择的语言环境（zh 或 en）
- **Mobile Menu**: 移动端导航菜单
- **ATS**: Applicant Tracking System，申请人跟踪系统
- **i18n**: 国际化（Internationalization）
- **NextAuth**: 身份认证库
- **Prisma**: 数据库 ORM
- **Server Action**: Next.js 服务器端操作函数

## Requirements

### Requirement 1: 前端国际化完整性

**User Story:** 作为一个国际用户，我希望看到完全本地化的界面，以便我能用母语流畅使用平台。

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display all navigation buttons using translations from the locale message files
2. WHEN a user switches locale THEN the System SHALL update all UI text including header navigation buttons to match the selected locale
3. WHEN a user views the templates section THEN the System SHALL display the section label using the translated key from message files
4. THE System SHALL NOT display any hard-coded Chinese or English text in locale-dependent UI components

### Requirement 2: 移动端菜单交互健壮性

**User Story:** 作为移动设备用户，我希望菜单能够正确响应我的操作，以便获得流畅的导航体验。

#### Acceptance Criteria

1. WHEN a user navigates to a different page THEN the System SHALL automatically close the mobile menu
2. WHEN the viewport width changes from mobile to desktop size THEN the System SHALL automatically close the mobile menu
3. WHEN a user presses the Escape key while the mobile menu is open THEN the System SHALL close the mobile menu
4. WHEN a user clicks outside the mobile menu area THEN the System SHALL close the mobile menu
5. THE System SHALL maintain existing mobile menu state management using React useState

### Requirement 3: 响应式布局优化

**User Story:** 作为使用不同设备的用户，我希望页面元素在各种屏幕尺寸下都能正确显示，以便获得一致的视觉体验。

#### Acceptance Criteria

1. WHEN a user views the homepage on narrow viewports THEN the System SHALL prevent floating badges from overlapping content or being clipped
2. WHEN the viewport width changes THEN the System SHALL adjust floating badge positions using responsive Tailwind classes
3. THE System SHALL use relative positioning units instead of fixed pixel offsets for floating elements where appropriate
4. WHEN displaying preview cards THEN the System SHALL ensure all absolutely positioned elements remain visible across breakpoints

### Requirement 4: 会话状态一致性

**User Story:** 作为已登录用户，我希望我的会员状态和角色信息在整个应用中保持一致，以便正确访问相应功能。

#### Acceptance Criteria

1. WHEN a user successfully authenticates THEN the System SHALL include role and isMember fields in the session object
2. WHEN a user accesses their session data THEN the System SHALL provide consistent role and membership information through both JWT token and session callbacks
3. THE System SHALL synchronize user role and membership status between the JWT token and session object
4. WHEN session data is accessed THEN the System SHALL ensure role and isMember fields are available without requiring additional database queries

### Requirement 5: 密码重置流程完整性

**User Story:** 作为忘记密码的用户，我希望能够通过邮件重置密码，以便重新访问我的账户。

#### Acceptance Criteria

1. WHEN a user requests password reset THEN the System SHALL send an email containing a valid reset link with token
2. WHEN a user clicks the reset link THEN the System SHALL display a password reset page with a form
3. WHEN a user submits a new password with valid token THEN the System SHALL update the password and mark the token as used
4. WHEN a user submits an expired or invalid token THEN the System SHALL display an appropriate error message
5. THE System SHALL send emails using configured SMTP settings from environment variables
6. WHEN password reset is successful THEN the System SHALL log the action in ActivityLog

### Requirement 6: 邮箱验证流程完整性

**User Story:** 作为新注册用户，我希望能够验证我的邮箱地址，以便确认账户所有权并启用完整功能。

#### Acceptance Criteria

1. WHEN a user registers or requests email verification THEN the System SHALL send a verification email with a unique token
2. WHEN a user clicks the verification link THEN the System SHALL display an email verification page
3. WHEN a user submits a valid verification token THEN the System SHALL update the emailVerified field and delete the token
4. WHEN a user submits an expired or invalid token THEN the System SHALL display an appropriate error message
5. THE System SHALL send verification emails using configured SMTP settings
6. WHEN email verification is successful THEN the System SHALL provide user feedback and navigation options

### Requirement 7: 错误处理国际化

**User Story:** 作为用户，我希望看到符合我语言偏好的错误消息，以便理解问题并采取正确行动。

#### Acceptance Criteria

1. WHEN server actions throw errors THEN the System SHALL provide error messages that support internationalization
2. THE System SHALL NOT mix Chinese and English in error messages within the same user flow
3. WHEN authentication fails THEN the System SHALL return locale-appropriate error messages
4. WHEN user profile updates fail THEN the System SHALL display translated error messages based on user locale
5. THE System SHALL provide a consistent error handling pattern across all server actions

### Requirement 8: 类型安全性改进

**User Story:** 作为开发者，我希望代码具有正确的类型定义，以便减少运行时错误并提高代码可维护性。

#### Acceptance Criteria

1. WHEN Next.js passes params to page components THEN the System SHALL declare params as synchronous objects not Promises
2. THE System SHALL NOT use await on params objects in page components or layouts
3. WHEN defining route parameters THEN the System SHALL use the correct TypeScript types matching Next.js App Router conventions
4. THE System SHALL ensure all params type declarations are consistent across layout and page files

### Requirement 9: 缓存重新验证准确性

**User Story:** 作为用户，我希望在修改数据后能立即看到更新，以便确认操作成功。

#### Acceptance Criteria

1. WHEN resume data is modified THEN the System SHALL revalidate the correct locale-aware path pattern
2. WHEN calling revalidatePath THEN the System SHALL use path patterns that match the actual route structure including locale segments
3. THE System SHALL ensure cache invalidation works correctly for dynamically rendered pages
4. WHEN user settings are updated THEN the System SHALL revalidate the appropriate paths to reflect changes

### Requirement 10: 安全性增强 - 登录防护

**User Story:** 作为平台管理员，我希望系统能够防止暴力破解攻击，以便保护用户账户安全。

#### Acceptance Criteria

1. WHEN a user fails login attempts multiple times from the same IP THEN the System SHALL temporarily block further attempts
2. WHEN a user account experiences multiple failed login attempts THEN the System SHALL log the activity with high-risk markers
3. THE System SHALL implement rate limiting for authentication endpoints
4. WHEN suspicious login activity is detected THEN the System SHALL record IP address and user agent in ActivityLog
5. THE System SHALL allow configuration of maximum failed attempts and lockout duration through environment variables

### Requirement 11: 安全性增强 - Token 存储

**User Story:** 作为安全意识强的用户，我希望我的敏感令牌被安全存储，以便即使数据库泄露也不会直接暴露。

#### Acceptance Criteria

1. WHEN the System generates password reset tokens THEN the System SHALL store only hashed versions in the database
2. WHEN the System generates email verification tokens THEN the System SHALL store only hashed versions in the database
3. WHEN validating tokens THEN the System SHALL compare hashed values rather than plain text
4. THE System SHALL use cryptographically secure hashing algorithms for token storage
5. THE System SHALL maintain backward compatibility during token storage migration

### Requirement 12: 活动日志完整性

**User Story:** 作为平台管理员，我希望活动日志包含完整的上下文信息，以便进行安全审计和问题排查。

#### Acceptance Criteria

1. WHEN the System creates activity logs THEN the System SHALL include IP address when available
2. WHEN the System creates activity logs THEN the System SHALL include user agent information when available
3. THE System SHALL capture IP and user agent at the appropriate layer without excessive code changes
4. WHEN security-relevant actions occur THEN the System SHALL ensure complete audit trail information is recorded
5. THE System SHALL handle cases where IP or user agent information is unavailable gracefully

