import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { LocalizedError, getErrorMessage } from '@/lib/errors';

// Feature: platform-fixes, Property 12: Errors are localized
// Validates: Requirements 7.1, 7.3, 7.4

describe('Error Localization Property Tests', () => {
    it('Property 12: For any error message key and locale, error messages should be in the appropriate language', () => {
        fc.assert(
            fc.property(
                fc.record({
                    messageKey: fc.constantFrom(
                        'unauthorized',
                        'invalidToken',
                        'expiredToken',
                        'tokenUsed',
                        'emailExists',
                        'passwordTooShort',
                        'userNotFound',
                        'invalidCredentials',
                        'emailNotVerified',
                        'emailAlreadyVerified',
                        'invalidPassword',
                        'passwordMismatch',
                        'updateFailed',
                        'deleteFailed',
                        'resumeNotFoundOrUnauthorized',
                        'resumeSaveFailed',
                        'resumeDeleteFailed',
                        'resumeDuplicateFailed',
                        'unknownError'
                    ),
                    locale: fc.constantFrom('en', 'zh', 'zh-CN', 'zh-TW', 'en-US', 'en-GB'),
                }),
                ({ messageKey, locale }) => {
                    // Get the error message using the helper function
                    const message = getErrorMessage(messageKey as any, locale);

                    // Determine expected language based on locale
                    const isZh = locale.startsWith('zh');

                    // Verify the message is not empty
                    const hasMessage = message.length > 0;

                    // Verify the message is in the correct language
                    // Chinese messages should contain Chinese characters
                    // English messages should not contain Chinese characters
                    const chineseCharRegex = /[\u4e00-\u9fa5]/;
                    const containsChinese = chineseCharRegex.test(message);
                    const languageMatches = isZh ? containsChinese : !containsChinese;

                    return hasMessage && languageMatches;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 12.1: For any LocalizedError thrown with a locale, the error message should match the locale', () => {
        fc.assert(
            fc.property(
                fc.record({
                    messageKey: fc.constantFrom(
                        'unauthorized',
                        'invalidToken',
                        'expiredToken',
                        'tokenUsed',
                        'emailExists',
                        'passwordTooShort',
                        'userNotFound',
                        'invalidCredentials'
                    ),
                    locale: fc.constantFrom('en', 'zh', 'zh-CN', 'en-US'),
                }),
                ({ messageKey, locale }) => {
                    // Create a LocalizedError
                    const error = new LocalizedError(messageKey as any, locale);

                    // Determine expected language
                    const isZh = locale.startsWith('zh');

                    // Verify error properties
                    const hasCorrectKey = error.messageKey === messageKey;
                    const hasCorrectLocale = error.locale === locale;
                    const hasMessage = error.message.length > 0;

                    // Verify the message is in the correct language
                    const chineseCharRegex = /[\u4e00-\u9fa5]/;
                    const containsChinese = chineseCharRegex.test(error.message);
                    const languageMatches = isZh ? containsChinese : !containsChinese;

                    // Verify toLocalizedString returns the same message
                    const localizedStringMatches = error.toLocalizedString() === error.message;

                    return (
                        hasCorrectKey &&
                        hasCorrectLocale &&
                        hasMessage &&
                        languageMatches &&
                        localizedStringMatches
                    );
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 12.2: For any locale, switching locales should produce different messages for the same error key', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(
                    'unauthorized',
                    'invalidToken',
                    'expiredToken',
                    'emailExists',
                    'passwordTooShort',
                    'userNotFound',
                    'resumeNotFoundOrUnauthorized',
                    'resumeSaveFailed',
                    'resumeDeleteFailed',
                    'resumeDuplicateFailed'
                ),
                (messageKey) => {
                    // Get messages in both locales
                    const zhMessage = getErrorMessage(messageKey as any, 'zh');
                    const enMessage = getErrorMessage(messageKey as any, 'en');

                    // Messages should be different (not the same text)
                    const messagesDiffer = zhMessage !== enMessage;

                    // Both should be non-empty
                    const bothNonEmpty = zhMessage.length > 0 && enMessage.length > 0;

                    // Chinese message should contain Chinese characters
                    const chineseCharRegex = /[\u4e00-\u9fa5]/;
                    const zhContainsChinese = chineseCharRegex.test(zhMessage);

                    // English message should not contain Chinese characters
                    const enNotChinese = !chineseCharRegex.test(enMessage);

                    return messagesDiffer && bothNonEmpty && zhContainsChinese && enNotChinese;
                }
            ),
            { numRuns: 100 }
        );
    });
});
