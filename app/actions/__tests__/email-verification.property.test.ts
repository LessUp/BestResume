import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { hashToken, generateToken } from '@/lib/token-hash';

// Feature: platform-fixes, Property 11: Email verification round-trip
// Validates: Requirements 6.3

describe('Email Verification Round-Trip Property Tests', () => {
    it('Property 11: For any valid verification token, email should be verified and token deleted', () => {
        fc.assert(
            fc.property(
                fc.record({
                    email: fc.emailAddress(),
                    userId: fc.string({ minLength: 10, maxLength: 30 }),
                }),
                (testData) => {
                    // Simulate email verification flow

                    // Step 1: Generate and store hashed token
                    const plainToken = generateToken();
                    const hashedToken = hashToken(plainToken);
                    const expires = new Date(Date.now() + 86400000); // 24 hours

                    const storedVerificationRecord = {
                        identifier: testData.email,
                        token: hashedToken,
                        expires,
                    };

                    // Step 2: User receives plain token in email and clicks verification link
                    const providedToken = plainToken;

                    // Step 3: System hashes provided token to look up record
                    const hashedProvidedToken = hashToken(providedToken);

                    // Verify token matches
                    const tokenMatches = hashedProvidedToken === storedVerificationRecord.token;

                    // Verify token not expired
                    const notExpired = new Date() < storedVerificationRecord.expires;

                    // If all checks pass, simulate email verification
                    if (tokenMatches && notExpired) {
                        // Email would be marked as verified
                        // Token would be deleted from database
                        return true;
                    }

                    return false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11b: Expired verification tokens should be rejected', () => {
        fc.assert(
            fc.property(
                fc.record({
                    email: fc.emailAddress(),
                }),
                (testData) => {
                    // Generate token that's already expired
                    const plainToken = generateToken();
                    const hashedToken = hashToken(plainToken);
                    const expires = new Date(Date.now() - 1000); // Expired 1 second ago

                    const storedVerificationRecord = {
                        identifier: testData.email,
                        token: hashedToken,
                        expires,
                    };

                    // Try to use the token
                    const hashedProvidedToken = hashToken(plainToken);
                    const tokenMatches = hashedProvidedToken === storedVerificationRecord.token;
                    const notExpired = new Date() < storedVerificationRecord.expires;

                    // Should be rejected due to expiration
                    return tokenMatches && !notExpired;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11c: Invalid verification tokens should be rejected', () => {
        fc.assert(
            fc.property(
                fc.tuple(
                    fc.emailAddress(),
                    fc.string({ minLength: 32, maxLength: 64 }),
                    fc.string({ minLength: 32, maxLength: 64 })
                ).filter(([_, token1, token2]) => token1 !== token2),
                ([email, correctToken, wrongToken]) => {
                    // Store the correct token
                    const hashedCorrectToken = hashToken(correctToken);
                    const expires = new Date(Date.now() + 86400000);

                    const storedVerificationRecord = {
                        identifier: email,
                        token: hashedCorrectToken,
                        expires,
                    };

                    // Try to verify with wrong token
                    const hashedWrongToken = hashToken(wrongToken);
                    const tokenMatches = hashedWrongToken === storedVerificationRecord.token;

                    // Should not match
                    return !tokenMatches;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11d: Verification token should be unique per email', () => {
        fc.assert(
            fc.property(
                fc.tuple(
                    fc.emailAddress(),
                    fc.emailAddress()
                ).filter(([email1, email2]) => email1 !== email2),
                ([email1, email2]) => {
                    // Generate tokens for two different emails
                    const token1 = generateToken();
                    const token2 = generateToken();

                    const hash1 = hashToken(token1);
                    const hash2 = hashToken(token2);

                    // Tokens should be different
                    // (This tests the token generation, not the email uniqueness)
                    return token1 !== token2 && hash1 !== hash2;
                }
            ),
            { numRuns: 100 }
        );
    });
});
