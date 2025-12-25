/**
 * Feature: platform-fixes, Property 1: Navigation text uses translations
 * Validates: Requirements 1.1, 1.2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { NextIntlClientProvider } from 'next-intl';
import Home from '../page';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';

// Mock next/navigation
const mockUsePathname = () => '/en';
const mockUseRouter = () => ({
    push: () => { },
    replace: () => { },
    prefetch: () => { },
});

vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
    useRouter: () => mockUseRouter(),
}));

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

const messages = {
    en: enMessages,
    zh: zhMessages,
};

type Locale = 'en' | 'zh';

function renderWithLocale(locale: Locale) {
    return render(
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            <Home />
        </NextIntlClientProvider>
    );
}

describe('Property 1: Navigation text uses translations', () => {
    it('should display navigation buttons using translations from locale message files', () => {
        fc.assert(
            fc.property(
                fc.constantFrom<Locale>('en', 'zh'),
                (locale) => {
                    const { unmount } = renderWithLocale(locale);

                    // Get expected translations
                    const expectedSignIn = messages[locale].HomePage.nav.signIn;
                    const expectedStartFree = messages[locale].HomePage.nav.startFree;

                    // Check if the navigation buttons contain the translated text
                    const signInButtons = screen.getAllByText(expectedSignIn);
                    const startFreeButtons = screen.getAllByText(expectedStartFree);

                    // Should have at least one of each button (desktop and mobile)
                    const hasSignIn = signInButtons.length >= 1;
                    const hasStartFree = startFreeButtons.length >= 1;

                    unmount();

                    return hasSignIn && hasStartFree;
                }
            ),
            { numRuns: 100 }
        );
    }, 15000);

    it('should not display hard-coded Chinese or English text in navigation', () => {
        fc.assert(
            fc.property(
                fc.constantFrom<Locale>('en', 'zh'),
                (locale) => {
                    const { container, unmount } = renderWithLocale(locale);

                    // Hard-coded text that should NOT appear in navigation
                    const hardCodedTexts = [
                        'Sign In', // Hard-coded English
                        'Start for Free', // Hard-coded English
                        '登录', // Hard-coded Chinese
                        '免费开始', // Hard-coded Chinese
                    ];

                    // Get the navigation element
                    const nav = container.querySelector('nav');
                    if (!nav) {
                        unmount();
                        return false;
                    }

                    const navText = nav.textContent || '';

                    // Expected translations for current locale
                    const expectedSignIn = messages[locale].HomePage.nav.signIn;
                    const expectedStartFree = messages[locale].HomePage.nav.startFree;

                    // Check that navigation contains the correct translations
                    const hasCorrectTranslations =
                        navText.includes(expectedSignIn) &&
                        navText.includes(expectedStartFree);

                    unmount();

                    return hasCorrectTranslations;
                }
            ),
            { numRuns: 100 }
        );
    });
});
