import { describe, it, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { RateLimiter } from '../rate-limit';

// Feature: platform-fixes, Property 14: Failed logins trigger blocking
// Validates: Requirements 10.1

describe('Rate Limiting Property Tests', () => {
    it('Property 14: For any IP address, when failed attempts exceed threshold, subsequent attempts should be blocked', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    ip: fc.ipV4(),
                    attempts: fc.integer({ min: 1, max: 20 }),
                }),
                async ({ ip, attempts }) => {
                    const maxAttempts = 5;
                    const limiter = new RateLimiter({
                        maxAttempts,
                        windowMs: 60000, // 1 minute
                        blockDurationMs: 300000, // 5 minutes
                    });

                    // Record failed attempts
                    for (let i = 0; i < attempts; i++) {
                        await limiter.recordAttempt(ip, false);
                    }

                    // Check if blocked
                    const { allowed } = await limiter.checkLimit(ip);

                    // Should be blocked if attempts >= maxAttempts
                    if (attempts >= maxAttempts) {
                        return !allowed;
                    } else {
                        return allowed;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 14b: For any IP address, successful login should reset the rate limit', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    ip: fc.ipV4(),
                    failedAttempts: fc.integer({ min: 1, max: 10 }),
                }),
                async ({ ip, failedAttempts }) => {
                    const limiter = new RateLimiter({
                        maxAttempts: 5,
                        windowMs: 60000,
                        blockDurationMs: 300000,
                    });

                    // Record some failed attempts
                    for (let i = 0; i < failedAttempts; i++) {
                        await limiter.recordAttempt(ip, false);
                    }

                    // Record a successful attempt
                    await limiter.recordAttempt(ip, true);

                    // Check that the IP is no longer blocked
                    const { allowed } = await limiter.checkLimit(ip);
                    return allowed === true;
                }
            ),
            { numRuns: 100 }
        );
    });
});
