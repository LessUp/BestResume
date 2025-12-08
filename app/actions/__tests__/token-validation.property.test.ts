import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { hashToken, verifyToken, generateToken } from '@/lib/token-hash';

// Feature: platform-fixes, Property 17: Token validation uses hashing
// Validates: Requirements 11.3

describe('Token Validation Property Tests', () => {
    it('Property 17: For any token validation, the system should compare hashed values', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 32, maxLength: 64 }),
                (plainToken) => {
                    // Simulate token storage: hash the token before storing
                    const storedHash = hashToken(plainToken);

                    // Simulate token validation: hash the provided token and compare
                    const isValid = verifyToken(plainToken, storedHash);

                    // Verification should succeed when comparing the same token
                    return isValid === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 17b: Token validation should reject incorrect tokens', () => {
        fc.assert(
            fc.property(
                fc.tuple(
                    fc.string({ minLength: 32, maxLength: 64 }),
                    fc.string({ minLength: 32, maxLength: 64 })
                ).filter(([token1, token2]) => token1 !== token2),
                ([correctToken, wrongToken]) => {
                    // Store the hash of the correct token
                    const storedHash = hashToken(correctToken);

                    // Try to validate with a different token
                    const isValid = verifyToken(wrongToken, storedHash);

                    // Verification should fail when tokens don't match
                    return isValid === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 17c: Token validation should be consistent', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 32, maxLength: 64 }),
                (plainToken) => {
                    const storedHash = hashToken(plainToken);

                    // Validate the same token multiple times
                    const result1 = verifyToken(plainToken, storedHash);
                    const result2 = verifyToken(plainToken, storedHash);
                    const result3 = verifyToken(plainToken, storedHash);

                    // All validations should return the same result
                    return result1 === result2 && result2 === result3 && result1 === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 17d: Generated tokens should validate correctly', () => {
        fc.assert(
            fc.property(
                fc.constant(null), // No input needed, we generate tokens
                () => {
                    // Generate a token using the utility function
                    const plainToken = generateToken();

                    // Hash it for storage
                    const storedHash = hashToken(plainToken);

                    // Validate it
                    const isValid = verifyToken(plainToken, storedHash);

                    return isValid === true;
                }
            ),
            { numRuns: 100 }
        );
    });
});
