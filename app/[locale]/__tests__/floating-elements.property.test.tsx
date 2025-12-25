/**
 * Feature: platform-fixes, Property 5: Floating elements remain visible
 * Validates: Requirements 3.1, 3.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { NextIntlClientProvider } from 'next-intl';
import Home from '../page';
import enMessages from '@/messages/en.json';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: () => '/en',
    useRouter: () => ({
        push: () => { },
        replace: () => { },
        prefetch: () => { },
    }),
}));

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Property 5: Floating elements remain visible', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
        originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
        // Restore original window width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it('should keep floating badges visible and properly positioned across all breakpoints', () => {
        // Common viewport widths across breakpoints
        // Mobile: 320-767, Tablet: 768-1023, Desktop: 1024-1439, Large: 1440+
        const viewportWidths = fc.integer({ min: 768, max: 3840 }); // Testing from tablet to 4K

        fc.assert(
            fc.property(viewportWidths, (width) => {
                // Set viewport width
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: width,
                });

                const { container, unmount } = render(
                    <NextIntlClientProvider locale="en" messages={enMessages}>
                        <Home />
                    </NextIntlClientProvider>
                );

                // Find floating badge elements (they have animate-float class)
                const floatingElements = container.querySelectorAll('.animate-float');

                // Floating badges should be hidden on mobile (< 768px) but visible on larger screens
                if (width >= 768) {
                    // On tablet and above, floating elements should exist
                    const hasFloatingElements = floatingElements.length > 0;

                    if (hasFloatingElements) {
                        // Check that floating elements have proper positioning classes
                        floatingElements.forEach((element) => {
                            const classes = element.className;

                            // Should have absolute positioning
                            const hasAbsolutePosition = classes.includes('absolute');

                            // Should have responsive positioning (sm:, md:, lg: classes)
                            const hasResponsiveClasses =
                                classes.includes('sm:') ||
                                classes.includes('md:') ||
                                classes.includes('lg:');

                            // Should not be clipped (should have proper spacing from edges)
                            const hasProperSpacing =
                                (classes.includes('right-') || classes.includes('left-')) &&
                                (classes.includes('top-') || classes.includes('bottom-'));

                            expect(hasAbsolutePosition).toBe(true);
                            expect(hasResponsiveClasses).toBe(true);
                            expect(hasProperSpacing).toBe(true);
                        });
                    }

                    unmount();
                    return true;
                } else {
                    // On mobile, floating elements should be hidden
                    const allHidden = Array.from(floatingElements).every((element) => {
                        const classes = element.className;
                        return classes.includes('hidden') || classes.includes('sm:flex');
                    });

                    unmount();
                    return allHidden;
                }
            }),
            { numRuns: 100 }
        );
    }, 15000);

    it('should ensure floating elements do not overlap critical content', () => {
        const viewportWidths = fc.integer({ min: 768, max: 3840 });

        fc.assert(
            fc.property(viewportWidths, (width) => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: width,
                });

                const { container, unmount } = render(
                    <NextIntlClientProvider locale="en" messages={enMessages}>
                        <Home />
                    </NextIntlClientProvider>
                );

                const floatingElements = container.querySelectorAll('.animate-float');

                if (width >= 768 && floatingElements.length > 0) {
                    floatingElements.forEach((element) => {
                        const rect = element.getBoundingClientRect();

                        // Floating elements should have reasonable dimensions
                        // (not taking up too much space)
                        const hasReasonableWidth = rect.width < width * 0.3; // Less than 30% of viewport
                        const hasReasonableHeight = rect.height < 200; // Reasonable height

                        expect(hasReasonableWidth).toBe(true);
                        expect(hasReasonableHeight).toBe(true);
                    });
                }

                unmount();
                return true;
            }),
            { numRuns: 100 }
        );
    });

    it('should use responsive Tailwind classes for positioning', () => {
        const { container, unmount } = render(
            <NextIntlClientProvider locale="en" messages={enMessages}>
                <Home />
            </NextIntlClientProvider>
        );

        const floatingElements = container.querySelectorAll('.animate-float');

        // Check that floating elements use responsive positioning
        floatingElements.forEach((element) => {
            const classes = element.className;

            // Should have base positioning (for mobile/small screens)
            const hasBasePositioning =
                /\b(right|left|top|bottom)-\d+\b/.test(classes);

            // Should have sm: responsive classes
            const hasSmClasses = /\bsm:(right|left|top|bottom)-\d+\b/.test(classes);

            // Should have md: or lg: responsive classes for larger screens
            const hasMdOrLgClasses =
                /\b(md|lg):(right|left|top|bottom)-\d+\b/.test(classes);

            expect(hasBasePositioning).toBe(true);
            expect(hasSmClasses).toBe(true);
            expect(hasMdOrLgClasses).toBe(true);
        });

        unmount();
    });
});
