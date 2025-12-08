# Design Document

## Overview

This design document outlines the technical approach to fix critical issues in the BestResume platform. The fixes are organized into four phases following the principle of minimal changes while maximizing impact on user experience, code quality, and security.

The design follows a layered approach:
- **Presentation Layer**: Frontend UI fixes (i18n, mobile menu, responsive layout)
- **Authentication Layer**: Session management and auth flow improvements
- **Type Safety Layer**: TypeScript corrections and Next.js convention compliance
- **Security Layer**: Rate limiting, token hashing, and audit logging

## Architecture

### Component Organization

```
BestResume Platform
├── Frontend Layer
│   ├── Homepage Component (app/[locale]/page.tsx)
│   ├── Auth Pages (signin, signup, reset-password, verify-email)
│   └── Language Switcher Component
├── Authentication Layer
│   ├── NextAuth Configuration (auth.ts)
│   ├── Auth Server Actions (app/actions/auth.ts)
│   └── User Server Actions (app/actions/user.ts)
├── Data Layer
│   ├── Prisma Schema
│   └── Database Models (User, Session, Token, ActivityLog)
└── Infrastructure
    ├── Email Service (lib/email.ts)
    └── Rate Limiting Middleware
```

### Key Design Decisions

1. **Minimal Change Principle**: Preserve existing code structure and only modify what's necessary
2. **Backward Compatibility**: Ensure changes don't break existing functionality
3. **Progressive Enhancement**: Implement fixes in phases that can be deployed independently
4. **Type Safety First**: Fix TypeScript issues before runtime behavior changes
5. **Security by Default**: Hash tokens and log security events without requiring configuration

## Components and Interfaces

### 1. Frontend Components

#### Homepage Component Enhancement

**Location**: `app/[locale]/page.tsx`

**Changes**:
- Replace hard-coded navigation text with `t("nav.signIn")` and `t("nav.startFree")`
- Replace hard-coded "Templates" with `t("templatesSection.label")`
- Mobile menu already has proper event handlers (Escape, outside click, resize, navigation)
- Adjust floating badge positioning using responsive Tailwind classes

**Interface**:
```typescript
// No interface changes - component remains client component
// Uses existing hooks: useTranslations, useLocale, usePathname
```

#### Auth Pages (New Components)

**Reset Password Page**: `app/[locale]/auth/reset-password/page.tsx`
```typescript
interface ResetPasswordPageProps {
  searchParams: { token?: string }
}

// Displays form to enter new password
// Calls resetPassword server action
// Shows success/error feedback
```

**Verify Email Page**: `app/[locale]/auth/verify-email/page.tsx`
```typescript
interface VerifyEmailPageProps {
  searchParams: { token?: string }
}

// Automatically verifies token on mount
// Shows verification status
// Provides navigation to login
```

### 2. Authentication Layer

#### NextAuth Configuration Enhancement

**Location**: `auth.ts`

**Changes**:
```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      return {
        ...token,
        role: user.role,
        isMember: user.isMember,
      };
    }
    return token;
  },
  async session({ session, token }) {
    if (token.sub && session.user) {
      session.user.id = token.sub;
      // Add role and isMember to session
      (session.user as any).role = token.role;
      (session.user as any).isMember = token.isMember;
    }
    return session;
  },
}
```

**Rationale**: Session object should contain all user state needed by frontend to avoid additional database queries.

#### Server Actions Enhancement

**Location**: `app/actions/auth.ts`

**Changes**:
1. Email sending integration (already implemented, just needs SMTP config)
2. Token hashing for security
3. Internationalized error messages

**Token Hashing Strategy**:
```typescript
// Generate token
const plainToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");

// Store hashed version
await prisma.passwordReset.create({
  data: {
    userId: user.id,
    token: hashedToken,
    expiresAt,
  },
});

// Send plain token in email
const resetUrl = `${baseUrl}/${locale}/auth/reset-password?token=${plainToken}`;
```

**Error Message Strategy**:
```typescript
// Create error message helper
function getErrorMessage(key: string, locale: string): string {
  const messages = {
    zh: {
      unauthorized: "未授权",
      invalidToken: "无效的令牌",
      expiredToken: "令牌已过期",
      // ... more messages
    },
    en: {
      unauthorized: "Unauthorized",
      invalidToken: "Invalid token",
      expiredToken: "Token expired",
      // ... more messages
    }
  };
  return messages[locale]?.[key] || messages.en[key];
}
```

### 3. Rate Limiting System

**Location**: New file `lib/rate-limit.ts`

**Design**:
```typescript
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitStore {
  attempts: Map<string, { count: number; firstAttempt: number; blockedUntil?: number }>;
}

class RateLimiter {
  private store: RateLimitStore;
  
  async checkLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }>;
  async recordAttempt(identifier: string, success: boolean): Promise<void>;
  async reset(identifier: string): Promise<void>;
}
```

**Integration Point**: In `auth.ts` authorize callback, check rate limit before password verification.

### 4. Activity Log Enhancement

**Location**: `app/actions/auth.ts`, `app/actions/user.ts`

**Changes**:
```typescript
// Helper to extract request context
async function getRequestContext() {
  const headers = await import('next/headers').then(m => m.headers());
  return {
    ipAddress: headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown',
    userAgent: headers.get('user-agent') || 'unknown',
  };
}

// Usage in server actions
const context = await getRequestContext();
await prisma.activityLog.create({
  data: {
    userId: user.id,
    action: "LOGIN",
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  },
});
```

## Data Models

### Existing Models (No Changes Required)

The Prisma schema already supports all required fields:
- `User.role`, `User.isMember` for session enhancement
- `PasswordReset.token`, `PasswordReset.used` for reset flow
- `VerificationToken.token`, `VerificationToken.expires` for email verification
- `ActivityLog.ipAddress`, `ActivityLog.userAgent` for audit logging

### Token Hashing Migration

Since we're changing token storage from plain text to hashed:

**Strategy**: 
1. Update token generation to hash before storage
2. Update token validation to hash input before comparison
3. No database migration needed - new tokens will be hashed, old tokens will expire naturally

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several redundancies:
- Properties 4.2 and 4.3 both test JWT/session consistency - combined into single property
- Properties 11.1 and 11.2 both test token hashing - combined into single property covering all token types
- Properties 12.1 and 12.2 both test activity log context - combined into single property

### Frontend Internationalization Properties

**Property 1: Navigation text uses translations**
*For any* locale, all navigation buttons on the homepage should display text from the corresponding locale message file, not hard-coded strings.
**Validates: Requirements 1.1, 1.2**

**Property 2: Locale switching updates UI**
*For any* locale switch, all UI text including navigation should update to match the new locale within the same render cycle.
**Validates: Requirements 1.2**

### Mobile Menu Interaction Properties

**Property 3: Navigation closes mobile menu**
*For any* navigation event, if the mobile menu is open, it should automatically close.
**Validates: Requirements 2.1**

**Property 4: Outside clicks close mobile menu**
*For any* click event outside the mobile menu bounds, if the menu is open, it should close.
**Validates: Requirements 2.4**

### Responsive Layout Properties

**Property 5: Floating elements remain visible**
*For any* viewport width across all breakpoints, absolutely positioned floating elements should remain fully visible without clipping or overlapping critical content.
**Validates: Requirements 3.1, 3.4**

### Session Management Properties

**Property 6: Authentication populates session**
*For any* successful authentication, the resulting session object should contain role and isMember fields matching the authenticated user's database values.
**Validates: Requirements 4.1**

**Property 7: JWT and session consistency**
*For any* session access, the role and isMember values in the JWT token and session object should be identical.
**Validates: Requirements 4.2, 4.3**

### Password Reset Properties

**Property 8: Reset request sends email**
*For any* valid password reset request, the system should send an email containing a unique token that can be used exactly once within the expiration window.
**Validates: Requirements 5.1**

**Property 9: Password reset round-trip**
*For any* valid reset token, submitting a new password should update the user's password in the database and mark the token as used, preventing reuse.
**Validates: Requirements 5.3, 5.6**

### Email Verification Properties

**Property 10: Verification request sends email**
*For any* email verification request for an unverified user, the system should send an email containing a unique token.
**Validates: Requirements 6.1**

**Property 11: Email verification round-trip**
*For any* valid verification token, submitting it should set the user's emailVerified timestamp and delete the token from the database.
**Validates: Requirements 6.3**

### Error Handling Properties

**Property 12: Errors are localized**
*For any* server action error in a given locale context, the error message should be in the appropriate language for that locale.
**Validates: Requirements 7.1, 7.3, 7.4**

### Cache Invalidation Properties

**Property 13: Data changes trigger revalidation**
*For any* resume or user settings modification, the system should call revalidatePath with a pattern matching the locale-aware route structure.
**Validates: Requirements 9.1, 9.4**

### Rate Limiting Properties

**Property 14: Failed logins trigger blocking**
*For any* IP address or user account, when failed login attempts exceed the configured threshold within the time window, subsequent login attempts should be blocked until the lockout period expires.
**Validates: Requirements 10.1**

**Property 15: Failed logins are logged**
*For any* failed login attempt, the system should create an ActivityLog entry with the action, IP address, and user agent.
**Validates: Requirements 10.2, 10.4**

### Token Security Properties

**Property 16: Tokens are hashed in storage**
*For any* password reset or email verification token generation, the database should store only the hashed version, never the plain text token.
**Validates: Requirements 11.1, 11.2**

**Property 17: Token validation uses hashing**
*For any* token validation attempt, the system should hash the provided token and compare it against the stored hash, not compare plain text values.
**Validates: Requirements 11.3**

### Activity Logging Properties

**Property 18: Logs include request context**
*For any* activity log creation, when IP address and user agent are available in the request headers, they should be included in the log entry.
**Validates: Requirements 12.1, 12.2**



## Error Handling

### Error Categories

1. **User Input Errors**: Invalid credentials, weak passwords, malformed data
2. **Token Errors**: Expired, invalid, or already-used tokens
3. **Rate Limit Errors**: Too many attempts from same IP or account
4. **System Errors**: Database failures, email service unavailable

### Error Handling Strategy

**Localized Error Messages**:
```typescript
// lib/errors.ts
export class LocalizedError extends Error {
  constructor(
    public messageKey: string,
    public locale: string = 'en',
    public params?: Record<string, string>
  ) {
    super(messageKey);
  }
  
  toLocalizedString(): string {
    return getErrorMessage(this.messageKey, this.locale, this.params);
  }
}

// Usage in server actions
throw new LocalizedError('auth.invalidCredentials', locale);
```

**Error Response Format**:
```typescript
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}
```

**Frontend Error Display**:
- Use toast notifications for transient errors
- Use inline form validation for input errors
- Use error pages for critical failures (expired tokens, etc.)

### Graceful Degradation

- If email service fails, log error but don't block user registration
- If rate limiter fails, allow request but log warning
- If activity log fails, don't block the primary action

## Testing Strategy

### Unit Testing

**Focus Areas**:
1. Token hashing and validation logic
2. Rate limiter state management
3. Error message localization
4. Request context extraction

**Example Unit Tests**:
```typescript
describe('Token Hashing', () => {
  it('should store hashed token in database', async () => {
    const plainToken = 'test-token-123';
    await generateResetToken(userId, plainToken);
    const stored = await prisma.passwordReset.findFirst({ where: { userId } });
    expect(stored.token).not.toBe(plainToken);
    expect(stored.token).toHaveLength(64); // SHA-256 hex length
  });
  
  it('should validate token using hash comparison', async () => {
    const plainToken = 'test-token-123';
    await generateResetToken(userId, plainToken);
    const isValid = await validateResetToken(plainToken);
    expect(isValid).toBe(true);
  });
});
```

### Property-Based Testing

**Testing Library**: We will use `fast-check` for JavaScript/TypeScript property-based testing.

**Configuration**: Each property test should run a minimum of 100 iterations to ensure adequate coverage of the input space.

**Test Tagging**: Each property-based test must include a comment with the format:
```typescript
// Feature: platform-fixes, Property 1: Navigation text uses translations
```

**Key Properties to Test**:

1. **Locale Consistency** (Property 1, 2):
```typescript
// Feature: platform-fixes, Property 1: Navigation text uses translations
fc.assert(
  fc.property(
    fc.constantFrom('en', 'zh'),
    (locale) => {
      const { getByRole } = render(<HomePage />, { locale });
      const signInButton = getByRole('button', { name: /sign in|登录/i });
      const expectedText = locale === 'zh' ? '登录' : 'Sign In';
      return signInButton.textContent === expectedText;
    }
  ),
  { numRuns: 100 }
);
```

2. **Session Consistency** (Property 6, 7):
```typescript
// Feature: platform-fixes, Property 7: JWT and session consistency
fc.assert(
  fc.property(
    fc.record({
      email: fc.emailAddress(),
      role: fc.constantFrom('USER', 'ADMIN', 'PREMIUM'),
      isMember: fc.boolean(),
    }),
    async (userData) => {
      const user = await createTestUser(userData);
      const session = await authenticate(user.email, 'password');
      return (
        session.user.role === userData.role &&
        session.user.isMember === userData.isMember
      );
    }
  ),
  { numRuns: 100 }
);
```

3. **Token Round-Trip** (Property 9, 11):
```typescript
// Feature: platform-fixes, Property 9: Password reset round-trip
fc.assert(
  fc.property(
    fc.record({
      email: fc.emailAddress(),
      newPassword: fc.string({ minLength: 8, maxLength: 50 }),
    }),
    async ({ email, newPassword }) => {
      const user = await createTestUser({ email });
      const { token } = await requestPasswordReset(email, 'en');
      await resetPassword({ token, newPassword });
      
      // Verify password changed
      const canLogin = await verifyPassword(email, newPassword);
      // Verify token marked as used
      const tokenRecord = await prisma.passwordReset.findFirst({
        where: { userId: user.id },
      });
      
      return canLogin && tokenRecord.used === true;
    }
  ),
  { numRuns: 100 }
);
```

4. **Rate Limiting** (Property 14):
```typescript
// Feature: platform-fixes, Property 14: Failed logins trigger blocking
fc.assert(
  fc.property(
    fc.record({
      ip: fc.ipV4(),
      attempts: fc.integer({ min: 5, max: 20 }),
    }),
    async ({ ip, attempts }) => {
      const limiter = new RateLimiter({ maxAttempts: 5, windowMs: 60000 });
      
      // Make failed attempts
      for (let i = 0; i < attempts; i++) {
        await limiter.recordAttempt(ip, false);
      }
      
      // Check if blocked
      const { allowed } = await limiter.checkLimit(ip);
      return attempts >= 5 ? !allowed : allowed;
    }
  ),
  { numRuns: 100 }
);
```

5. **Token Hashing** (Property 16, 17):
```typescript
// Feature: platform-fixes, Property 16: Tokens are hashed in storage
fc.assert(
  fc.property(
    fc.record({
      email: fc.emailAddress(),
      tokenType: fc.constantFrom('reset', 'verification'),
    }),
    async ({ email, tokenType }) => {
      const user = await createTestUser({ email });
      
      let plainToken: string;
      if (tokenType === 'reset') {
        const result = await requestPasswordReset(email, 'en');
        plainToken = result.token;
      } else {
        const result = await sendVerificationEmail(email, 'en');
        plainToken = result.token;
      }
      
      // Check database doesn't contain plain token
      const allTokens = await prisma.passwordReset.findMany();
      const allVerifications = await prisma.verificationToken.findMany();
      
      const hasPlainToken = 
        allTokens.some(t => t.token === plainToken) ||
        allVerifications.some(t => t.token === plainToken);
      
      return !hasPlainToken;
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

**Focus Areas**:
1. Complete auth flows (signup → verify email → login)
2. Password reset flow end-to-end
3. Mobile menu interactions across viewport changes
4. Locale switching with session persistence

### Edge Cases to Test

1. **Viewport Resize Edge Cases** (Property 5):
   - Test at exact breakpoint boundaries (768px, 1024px, etc.)
   - Test rapid resize events
   - Test orientation changes on mobile

2. **Token Expiration Edge Cases** (Property 9, 11):
   - Token expires exactly at validation time
   - Token used twice simultaneously
   - Token deleted while validation in progress

3. **Rate Limit Edge Cases** (Property 14):
   - Attempts exactly at threshold
   - Attempts from multiple IPs for same account
   - Time window boundary conditions

4. **Missing Context Edge Cases** (Property 18):
   - Request without IP headers
   - Request without user agent
   - Request with malformed headers

## Implementation Phases

### Phase 1: Frontend Fixes (High Priority)

**Estimated Effort**: 2-3 hours

**Tasks**:
1. Update homepage navigation to use translation keys
2. Update templates section label to use translation key
3. Adjust floating badge positioning with responsive classes
4. Verify mobile menu event handlers are working correctly

**Testing**: Manual testing in both locales, responsive testing at various breakpoints

**Risk**: Low - purely presentational changes

### Phase 2: Authentication & Session (Medium Priority)

**Estimated Effort**: 4-6 hours

**Tasks**:
1. Update NextAuth callbacks to include role and isMember in session
2. Create reset-password and verify-email pages
3. Implement token hashing for password reset and email verification
4. Add request context extraction helper
5. Update activity logs to include IP and user agent

**Testing**: Unit tests for token hashing, integration tests for auth flows

**Risk**: Medium - changes authentication flow, requires careful testing

### Phase 3: Error Handling & Localization (Medium Priority)

**Estimated Effort**: 3-4 hours

**Tasks**:
1. Create LocalizedError class and error message helper
2. Update all server actions to use localized errors
3. Update frontend to display localized error messages
4. Add error boundary components where needed

**Testing**: Test error scenarios in both locales

**Risk**: Low - improves existing error handling

### Phase 4: Security Enhancements (Low Priority)

**Estimated Effort**: 4-5 hours

**Tasks**:
1. Implement rate limiter class
2. Integrate rate limiting into auth flow
3. Add high-risk markers to activity logs
4. Configure rate limit parameters via environment variables

**Testing**: Property-based tests for rate limiter, integration tests for blocking behavior

**Risk**: Medium - could accidentally block legitimate users if misconfigured

### Phase 5: Type Safety & Cache Fixes (Low Priority)

**Estimated Effort**: 1-2 hours

**Tasks**:
1. Fix params type declarations in layout and page files
2. Update revalidatePath calls to use correct locale-aware patterns
3. Run TypeScript compiler to verify all type errors resolved

**Testing**: TypeScript compilation, manual testing of cache invalidation

**Risk**: Very Low - mostly type fixes, minimal runtime changes

## Deployment Strategy

1. **Phase 1** can be deployed independently - no backend changes
2. **Phase 2** requires database migration for token hashing - deploy with feature flag
3. **Phase 3** can be deployed independently - backward compatible
4. **Phase 4** should be deployed with monitoring - can be disabled via env vars
5. **Phase 5** can be deployed independently - no user-facing changes

## Monitoring & Rollback

**Metrics to Monitor**:
- Authentication success/failure rates
- Password reset completion rates
- Email verification completion rates
- Rate limit trigger frequency
- Error rates by type and locale

**Rollback Triggers**:
- Auth success rate drops below 95%
- Error rate increases by more than 50%
- Rate limiter blocks more than 5% of login attempts

**Rollback Plan**:
- Phase 1: Revert frontend changes via git
- Phase 2: Disable token hashing via feature flag, revert to plain tokens
- Phase 3: Revert to English-only errors temporarily
- Phase 4: Disable rate limiting via environment variable
- Phase 5: Revert type changes (no user impact)

