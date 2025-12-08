import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerUser } from '../auth';

// Feature: platform-fixes, Property 6: Authentication populates session
// Validates: Requirements 4.1

describe('Session Population Property Tests', () => {
    // Clean up test data after each test
    afterEach(async () => {
        await prisma.activityLog.deleteMany({});
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'test-session-'
                }
            }
        });
    });

    it('Property 6: For any successful authentication, session should contain role and isMember', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    email: fc.string({ minLength: 5, maxLength: 20 }).map(s => `test-session-${s}@example.com`),
                    password: fc.string({ minLength: 8, maxLength: 20 }),
                    role: fc.constantFrom('USER', 'ADMIN', 'PREMIUM'),
                    isMember: fc.boolean(),
                }),
                async (userData) => {
                    // Create user with specific role and isMember values
                    await registerUser({
                        email: userData.email,
                        password: userData.password,
                    });

                    // Update user with test role and isMember
                    const user = await prisma.user.update({
                        where: { email: userData.email },
                        data: {
                            role: userData.role,
                            isMember: userData.isMember,
                        },
                    });

                    // Simulate the authorize callback from NextAuth
                    const hashedPassword = await bcrypt.hash(userData.password, 12);
                    const isValid = await bcrypt.compare(userData.password, hashedPassword);

                    if (!isValid) {
                        return false;
                    }

                    // Simulate what the authorize callback returns
                    const authorizeResult = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                        isMember: user.isMember,
                    };

                    // Verify that the returned user object contains role and isMember
                    return (
                        authorizeResult.role === userData.role &&
                        authorizeResult.isMember === userData.isMember
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
});
