import { describe, it, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Feature: platform-fixes, Property 13: Data changes trigger revalidation
// Validates: Requirements 9.1, 9.4

// Mock revalidatePath to track calls
const mockRevalidatePath = vi.fn();
vi.mock('next/cache', () => ({
    revalidatePath: mockRevalidatePath,
}));

// Mock auth to return a valid session
vi.mock('@/auth', () => ({
    auth: vi.fn(() => Promise.resolve({
        user: { email: 'test@example.com' }
    }))
}));

// Mock prisma
const mockPrisma = {
    user: {
        findUnique: vi.fn(() => Promise.resolve({ id: 'user-123' })),
        update: vi.fn(() => Promise.resolve({})),
    },
    resume: {
        create: vi.fn(() => Promise.resolve({ id: 'resume-123' })),
        update: vi.fn(() => Promise.resolve({})),
        delete: vi.fn(() => Promise.resolve({})),
        findUnique: vi.fn(() => Promise.resolve({
            id: 'resume-123',
            userId: 'user-123',
            title: 'Test Resume',
            content: '{}'
        })),
    },
    activityLog: {
        create: vi.fn(() => Promise.resolve({})),
    },
};

vi.mock('@/lib/prisma', () => ({
    default: mockPrisma,
}));

vi.mock('@/lib/request-context', () => ({
    getRequestContext: vi.fn(() => Promise.resolve({
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent'
    }))
}));

describe('Cache Revalidation Property Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Property 13: For any resume data modification, revalidatePath should be called with locale-aware pattern', async () => {
        // Import actions after mocks are set up
        const { saveResume, deleteResume, duplicateResume } = await import('@/app/actions');
        const { updateUserProfile, updateUserPreferences, updateAvatar } = await import('@/app/actions/user');

        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    resumeData: fc.record({
                        basics: fc.record({
                            name: fc.string({ minLength: 1, maxLength: 50 }),
                            email: fc.emailAddress(),
                        }),
                    }),
                    title: fc.string({ minLength: 1, maxLength: 100 }),
                    resumeId: fc.option(fc.string({ minLength: 10, maxLength: 30 })),
                    userProfile: fc.record({
                        name: fc.string({ minLength: 1, maxLength: 50 }),
                        bio: fc.option(fc.string({ maxLength: 500 })),
                    }),
                    userPreferences: fc.record({
                        theme: fc.constantFrom('light', 'dark'),
                        language: fc.constantFrom('en', 'zh'),
                    }),
                    avatarUrl: fc.webUrl(),
                }),
                async ({ resumeData, title, resumeId, userProfile, userPreferences, avatarUrl }) => {
                    // Reset mock call count
                    mockRevalidatePath.mockClear();

                    // Test resume operations
                    await saveResume(resumeData, title, resumeId);

                    // Verify revalidatePath was called with correct pattern for dashboard
                    const dashboardCalls = mockRevalidatePath.mock.calls.filter(
                        call => call[0] === '/[locale]/dashboard' && call[1] === 'page'
                    );

                    if (dashboardCalls.length === 0) {
                        return false;
                    }

                    // Test delete resume
                    if (resumeId) {
                        mockRevalidatePath.mockClear();
                        await deleteResume(resumeId);

                        const deleteCalls = mockRevalidatePath.mock.calls.filter(
                            call => call[0] === '/[locale]/dashboard' && call[1] === 'page'
                        );

                        if (deleteCalls.length === 0) {
                            return false;
                        }
                    }

                    // Test duplicate resume
                    if (resumeId) {
                        mockRevalidatePath.mockClear();
                        await duplicateResume(resumeId);

                        const duplicateCalls = mockRevalidatePath.mock.calls.filter(
                            call => call[0] === '/[locale]/dashboard' && call[1] === 'page'
                        );

                        if (duplicateCalls.length === 0) {
                            return false;
                        }
                    }

                    // Test user profile update
                    mockRevalidatePath.mockClear();
                    await updateUserProfile(userProfile, 'en');

                    const profileCalls = mockRevalidatePath.mock.calls.filter(
                        call => call[0] === '/[locale]/settings' && call[1] === 'page'
                    );

                    if (profileCalls.length === 0) {
                        return false;
                    }

                    // Test user preferences update
                    mockRevalidatePath.mockClear();
                    await updateUserPreferences(userPreferences, 'en');

                    const preferencesCalls = mockRevalidatePath.mock.calls.filter(
                        call => call[0] === '/[locale]/settings' && call[1] === 'page'
                    );

                    if (preferencesCalls.length === 0) {
                        return false;
                    }

                    // Test avatar update
                    mockRevalidatePath.mockClear();
                    await updateAvatar(avatarUrl, 'en');

                    const avatarCalls = mockRevalidatePath.mock.calls.filter(
                        call => call[0] === '/[locale]/settings' && call[1] === 'page'
                    );

                    return avatarCalls.length > 0;
                }
            ),
            { numRuns: 100 }
        );
    });
});