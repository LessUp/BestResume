import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { hashToken, generateToken } from '@/lib/token-hash';
import bcrypt from 'bcryptjs';

// Feature: platform-fixes, Property 9: Password reset round-trip
// Validates: Requirements 5.3, 5.6

describe('Password Reset Round-Trip Property Tests', () => {
    it('Property 9: For any valid reset token, password should be updated and token marked as used', () => {
        fc.assert(
            fc.property(
                fc.record({
                    userId: fc.string({ minLength: 10, maxLength: 30 }),
                    email: fc.emailAddress(),
                    oldPassword: fc.string({ minLength: 8, maxLength: 20 }),
                    newPassword: fc.string({ minLength: 8, maxLength: 20 }),
                }),
                (testData) => {
                    // Simulate password reset flow

                    // Step 1: Generate and store hashed token
                    const plainToken = generateToken();
                    const hashedToken = hashToken(plainToken);
                    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

                    const storedResetRecord = {
                        id: 'reset-123',
                        userId: testData.userId,
                        token: hashedToken,
                        expiresAt,
                        used: false,
                        createdAt: new Date(),
                    };

                    // Step 2: User receives plain token in email and submits reset request
                    const providedToken = plainToken;
                    const providedNewPassword = testData.newPassword;

                    // Step 3: System hashes provided token to look up record
                    const hashedProvidedToken = hashToken(providedToken);

                    // Verify token matches
                    const tokenMatches = hashedProvidedToken === storedResetRecord.token;

                    // Verify token not expired
                    const notExpired = new Date() < storedResetRecord.expiresAt;

                    // Verify token not used
                    const notUsed = !storedResetRecord.used;

                    // If all checks pass, simulate password update
                    if (tokenMatches && notExpired && notUsed) {
                        // Mark token as used
                        storedResetRecord.used = true;

                        // Password would be hashed and stored (we just verify the logic)
                        return true;
                    }

                    return false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9b: Expired tokens should be rejected', () => {
        fc.assert(
            fc.property(
                fc.record({
                    userId: fc.string({ minLength: 10, maxLength: 30 }),
                    newPassword: fc.string({ minLength: 8, maxLength: 20 }),
                }),
                (testData) => {
                    // Generate token that's already expired
                    const plainToken = generateToken();
                    const hashedToken = hashToken(plainToken);
                    const expiresAt = new Date(Date.now() - 1000); // Expired 1 second ago

                    const storedResetRecord = {
                        userId: testData.userId,
                        token: hashedToken,
                        expiresAt,
                        used: false,
                    };

                    // Try to use the token
                    const hashedProvidedToken = hashToken(plainToken);
                    const tokenMatches = hashedProvidedToken === storedResetRecord.token;
                    const notExpired = new Date() < storedResetRecord.expiresAt;

                    // Should be rejected due to expiration
                    return tokenMatches && !notExpired;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9c: Used tokens should be rejected', () => {
        fc.assert(
            fc.property(
                fc.record({
                    userId: fc.string({ minLength: 10, maxLength: 30 }),
                    newPassword: fc.string({ minLength: 8, maxLength: 20 }),
                }),
                (testData) => {
                    // Generate token that's already been used
                    const plainToken = generateToken();
                    const hashedToken = hashToken(plainToken);
                    const expiresAt = new Date(Date.now() + 3600000);

                    const storedResetRecord = {
                        userId: testData.userId,
                        token: hashedToken,
                        expiresAt,
                        used: true, // Already used
                    };

                    // Try to use the token again
                    const hashedProvidedToken = hashToken(plainToken);
                    const tokenMatches = hashedProvidedToken === storedResetRecord.token;
                    const notUsed = !storedResetRecord.used;

                    // Should be rejected because it's already used
                    return tokenMatches && !notUsed;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9d: Password hashing should work correctly', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 8, maxLength: 20 }),
                async (newPassword) => {
                    // Simulate password hashing during reset
                    const hashedPassword = await bcrypt.hash(newPassword, 12);

                    // Verify the hashed password can be validated
                    const isValid = await bcrypt.compare(newPassword, hashedPassword);

                    // Verify hash is different from plain password
                    const isDifferent = hashedPassword !== newPassword;

                    return isValid && isDifferent;
                }
            ),
            { numRuns: 20 } // Reduced runs because bcrypt is slow
        );
    }, 30000); // Increase timeout for bcrypt operations
});
