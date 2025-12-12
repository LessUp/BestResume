# Implementation Plan

- [x] 1. Phase 1: Frontend Internationalization and UI Fixes
  - Update homepage component to use translation keys for all UI text
  - Fix mobile menu interaction handlers
  - Adjust responsive layout for floating elements
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.4_

- [x] 1.1 Replace hard-coded navigation text with translation keys
  - Update desktop navigation buttons to use `t("nav.signIn")` and `t("nav.startFree")`
  - Update mobile navigation buttons to use same translation keys
  - Ensure LanguageSwitcher component is properly integrated
  - _Requirements: 1.1, 1.2_

- [x] 1.2 Fix templates section localization
  - Replace hard-coded "Templates" label with `t("templatesSection.label")`
  - Verify all template section text uses translation keys
  - _Requirements: 1.3_

- [x] 1.3 Verify and document mobile menu event handlers
  - Confirm Escape key handler closes menu (already implemented)
  - Confirm outside click handler closes menu (already implemented)
  - Confirm viewport resize handler closes menu (already implemented)
  - Confirm navigation handler closes menu (already implemented)
  - Document the existing implementation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 1.4 Adjust floating badge positioning for responsive layout
  - Update floating badges to use responsive Tailwind classes (sm:, md:, lg:)
  - Replace fixed pixel offsets with relative positioning where appropriate
  - Test at various breakpoints (mobile, tablet, desktop)
  - _Requirements: 3.1, 3.4_

- [x] 1.5 Write property test for locale consistency
  - **Property 1: Navigation text uses translations**
  - **Validates: Requirements 1.1, 1.2**

- [x] 1.6 Write property test for floating element visibility
  - **Property 5: Floating elements remain visible**
  - **Validates: Requirements 3.1, 3.4**

- [x] 2. Phase 2: Authentication and Session Management
  - Enhance NextAuth configuration for session state
  - Create password reset and email verification pages
  - Implement token hashing for security
  - Add request context to activity logs
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.3, 5.6, 6.1, 6.3, 12.1, 12.2_

- [x] 2.1 Update NextAuth callbacks to include role and isMember in session
  - Modify jwt callback to include ..............................role and isMember from user object
  - Modify session callback to add role and isMember to session.user
  - Update TypeScript types for session object
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.2 Write property test for session population
  - **Property 6: Authentication populates session**
  - **Validates: Requirements 4.1**

- [x] 2.3 Write property test for JWT and session consistency
  - **Property 7: JWT and session consistency**
  - **Validates: Requirements 4.2, 4.3**

- [x] 2.4 Create request context extraction helper
  - Create `lib/request-context.ts` with getRequestContext function
  - Extract IP address from x-forwarded-for or x-real-ip headers
  - Extract user agent from headers
  - Handle cases where headers are unavailable
  - _Requirements: 12.1, 12.2_

- [x] 2.5 Update activity log creation to include request context
  - Update all ActivityLog.create calls to include ipAddress and userAgent
  - Use getRequestContext helper in auth.ts
  - Use getRequestContext helper in app/actions/auth.ts
  - Use getRequestContext helper in app/actions/user.ts
  - _Requirements: 12.1, 12.2_

- [x] 2.6 Write property test for activity log context
  - **Property 18: Logs include request context**
  - **Validates: Requirements 12.1, 12.2**

- [x] 2.7 Implement token hashing utilities
  - Create `lib/token-hash.ts` with hashToken and verifyToken functions
  - Use crypto.createHash('sha256') for hashing
  - Ensure functions handle both plain and hashed tokens for migration
  - _Requirements: 11.1, 11.2, 11.3_

- [x] 2.8 Update password reset flow to use hashed tokens
  - Modify requestPasswordReset to hash token before storing
  - Store plain token in email, hashed token in database
  - Modify resetPassword to hash provided token before lookup
  - _Requirements: 11.1, 11.3_

- [x] 2.9 Update email verification flow to use hashed tokens
  - Modify sendVerificationEmail to hash token before storing
  - Store plain token in email, hashed token in database
  - Modify verifyEmail to hash provided token before lookup
  - _Requirements: 11.2, 11.3_

- [x] 2.10 Write property test for token hashing in storage
  - **Property 16: Tokens are hashed in storage**
  - **Validates: Requirements 11.1, 11.2**

- [x] 2.11 Write property test for token validation using hashing
  - **Property 17: Token validation uses hashing**
  - **Validates: Requirements 11.3**

- [x] 2.12 Create password reset page component
  - Create `app/[locale]/auth/reset-password/page.tsx`
  - Add form for new password input
  - Extract token from searchParams
  - Call resetPassword server action on submit
  - Display success/error messages
  - _Requirements: 5.2, 5.3_

- [x] 2.13 Create email verification page component
  - Create `app/[locale]/auth/verify-email/page.tsx`
  - Extract token from searchParams
  - Automatically call verifyEmail on mount
  - Display verification status
  - Provide navigation to login page
  - _Requirements: 6.2, 6.3_

- [x] 2.14 Write property test for password reset round-trip
  - **Property 9: Password reset round-trip**
  - **Validates: Requirements 5.3, 5.6**

- [x] 2.15 Write property test for email verification round-trip
  - **Property 11: Email verification round-trip**
  - **Validates: Requirements 6.3**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Phase 3: Error Handling and Localization
  - Create localized error handling system
  - Update server actions to use localized errors
  - Update frontend to display localized errors
  - _Requirements: 7.1, 7.3, 7.4_

- [x] 3.1 Create LocalizedError class and error message helper
  - Create `lib/errors.ts` with LocalizedError class
  - Create getErrorMessage function with zh and en translations
  - Define common error message keys (unauthorized, invalidToken, etc.)
  - _Requirements: 7.1_

- [x] 3.2 Update authentication server actions to use localized errors
  - Update registerUser to throw LocalizedError
  - Update requestPasswordReset to throw LocalizedError
  - Update resetPassword to throw LocalizedError
  - Update sendVerificationEmail to throw LocalizedError
  - Update verifyEmail to throw LocalizedError
  - Pass locale parameter to error constructors
  - _Requirements: 7.3_

- [x] 3.3 Update user server actions to use localized errors
  - Update updateUserProfile to throw LocalizedError
  - Update updateUserPreferences to throw LocalizedError
  - Update changePassword to throw LocalizedError
  - Update updateAvatar to throw LocalizedError
  - Update deleteAccount to throw LocalizedError
  - _Requirements: 7.4_

- [x] 3.4 Write property test for error localization
  - **Property 12: Errors are localized**
  - **Validates: Requirements 7.1, 7.3, 7.4**

- [x] 3.5 Update frontend components to display localized errors
  - Update auth pages to catch and display LocalizedError messages
  - Add toast notification system for transient errors
  - Add inline form validation for input errors
  - _Requirements: 7.1_

- [-] 4. Phase 4: Security Enhancements - Rate Limiting
  - Implement rate limiting system
  - Integrate rate limiting into authentication flow
  - Add high-risk markers to activity logs
  - _Requirements: 10.1, 10.2, 10.4_

- [x] 4.1 Create rate limiter class
  - Create `lib/rate-limit.ts` with RateLimiter class
  - Implement in-memory store for rate limit tracking
  - Implement checkLimit method to verify if identifier is blocked
  - Implement recordAttempt method to track attempts
  - Implement reset method to clear attempts
  - Support configuration via constructor (maxAttempts, windowMs, blockDurationMs)
  - _Requirements: 10.1_

- [x] 4.2 Write property test for rate limiting
  - **Property 14: Failed logins trigger blocking**
  - **Validates: Requirements 10.1**

- [x] 4.3 Integrate rate limiting into authentication flow
  - Create rate limiter instance in auth.ts
  - Check rate limit before password verification in authorize callback
  - Record failed attempts after invalid password
  - Record successful attempts after valid password
  - Return appropriate error when rate limited
  - _Requirements: 10.1_

- [x] 4.4 Add high-risk markers to failed login activity logs
  - Update ActivityLog creation for failed logins to include details field
  - Add "high-risk" marker when multiple failures detected
  - Include attempt count in log details
  - _Requirements: 10.2, 10.4_

- [x] 4.5 Write property test for failed login logging
  - **Property 15: Failed logins are logged**
  - **Validates: Requirements 10.2, 10.4**

- [ ] 4.6 Add environment variable configuration for rate limiting
  - Add MAX_LOGIN_ATTEMPTS to .env.example
  - Add LOGIN_WINDOW_MS to .env.example
  - Add LOGIN_BLOCK_DURATION_MS to .env.example
  - Update rate limiter to read from environment variables with defaults
  - _Requirements: 10.1_

- [x] 5. Phase 5: Type Safety and Cache Fixes
  - Fix params type declarations in page components
  - Update revalidatePath calls to use correct patterns
  - Verify TypeScript compilation
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.4_

- [x] 5.1 Fix params type declarations in layout files
  - Update `app/[locale]/layout.tsx` to declare params as `{ locale: string }`
  - Remove await on params object
  - Verify TypeScript compilation succeeds
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5.2 Fix params type declarations in page files
  - Update `app/[locale]/dashboard/page.tsx` to declare params as `{ locale: string }`
  - Remove await on params object
  - Check other page files for similar issues
  - Verify TypeScript compilation succeeds
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5.3 Update revalidatePath calls for locale-aware routes
  - Update `app/actions.ts` to use pattern `/[locale]/dashboard` or dynamic locale
  - Verify revalidatePath is called after resume modifications
  - Verify revalidatePath is called after user settings updates
  - Test cache invalidation works correctly
  - _Requirements: 9.1, 9.4_

- [x] 5.4 Write property test for cache revalidation
  - **Property 13: Data changes trigger revalidation**
  - **Validates: Requirements 9.1, 9.4**

- [ ] 6. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

