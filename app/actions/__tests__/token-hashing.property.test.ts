import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { hashToken, generateToken } from '@/lib/token-hash';

// Feature: platform-fixes, Property 16: Tokens are hashed in storage
// Validates: Requirements 11.1, 11.2

describe('Token Hashing Property Tests', () => {
    it('Property 16: For any token generation, the stored token should be hashed, not plain text', () => {
        fc.assert(
            fc.property(
                fc.record({
                    email: fc.emailAddress(),
                    tokenType: fc.constantFrom('reset', 'verification'),
                }),
                (testData) => {
                    // Generate a plain token (what would be sent in email)
                    const plainToken = generateToken();

                    // Hash the token (what would be stored in database)
                    const hashedToken = hashToken(plainToken);

                    // Verify that:
                    // 1. Hashed token is different from plain token
                    // 2. Hashed token has expected length (SHA-256 hex = 64 chars)
                    // 3. Hashed token is deterministic (same input = same output)
                    const hashedAgain = hashToken(plainToken);

                    return (
                        plainToken !== hashedToken &&
                        hashedToken.length === 64 &&
                        hashedToken === hashedAgain &&
                        /^[a-f0-9]{64}$/.test(hashedToken) // Verify it's a valid hex string
                    );
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 16b: Different plain tokens should produce different hashes', () => {
        fc.assert(
            fc.property(
                fc.tuple(
                    fc.string({ minLength: 32, maxLength: 64 }),
                    fc.string({ minLength: 32, maxLength: 64 })
                ).filter(([token1, token2]) => token1 !== token2),
                ([token1, token2]) => {
                    const hash1 = hashToken(token1);
                    const hash2 = hashToken(token2);

                    // Different tokens should produce different hashes
                    return hash1 !== hash2;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 16c: Token hashing should be consistent across multiple calls', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 32, maxLength: 64 }),
                (plainToken) => {
                    // Hash the same token multiple times
                    const hash1 = hashToken(plainToken);
                    const hash2 = hashToken(plainToken);
                    const hash3 = hashToken(plainToken);

                    // All hashes should be identical
                    return hash1 === hash2 && hash2 === hash3;
                }
            ),
            { numRuns: 100 }
        );
    });
});
