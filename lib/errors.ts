/**
 * Localized error handling system for BestResume platform
 * Provides internationalized error messages for both zh and en locales
 */

export type ErrorMessageKey =
    | "unauthorized"
    | "invalidToken"
    | "expiredToken"
    | "tokenUsed"
    | "emailExists"
    | "registrationFailed"
    | "sendEmailFailed"
    | "passwordTooShort"
    | "userNotFound"
    | "invalidCredentials"
    | "emailNotVerified"
    | "emailAlreadyVerified"
    | "emailVerifyFailed"
    | "invalidPassword"
    | "passwordMismatch"
    | "updateFailed"
    | "deleteFailed"
    | "resumeNotFoundOrUnauthorized"
    | "resumeSaveFailed"
    | "resumeDeleteFailed"
    | "resumeDuplicateFailed"
    | "resetPasswordFailed"
    | "unknownError";

type Locale = "zh" | "en";

const errorMessages: Record<Locale, Record<ErrorMessageKey, string>> = {
    zh: {
        unauthorized: "未授权",
        invalidToken: "无效的令牌",
        expiredToken: "令牌已过期",
        tokenUsed: "该令牌已被使用",
        emailExists: "该邮箱已被注册",
        registrationFailed: "注册失败，请稍后重试。",
        sendEmailFailed: "发送失败，请稍后重试",
        passwordTooShort: "密码长度至少8位",
        userNotFound: "用户不存在",
        invalidCredentials: "邮箱或密码不正确",
        emailNotVerified: "邮箱未验证",
        emailAlreadyVerified: "邮箱已验证",
        emailVerifyFailed: "邮箱验证失败，链接可能无效或已过期。",
        invalidPassword: "当前密码不正确",
        passwordMismatch: "两次输入的密码不一致",
        updateFailed: "更新失败",
        deleteFailed: "删除失败",
        resumeNotFoundOrUnauthorized: "简历不存在或无权访问",
        resumeSaveFailed: "保存简历失败，请稍后重试。",
        resumeDeleteFailed: "删除简历失败，请稍后重试。",
        resumeDuplicateFailed: "复制简历失败，请稍后重试。",
        resetPasswordFailed: "密码重置失败，链接可能无效或已过期。",
        unknownError: "发生未知错误",
    },
    en: {
        unauthorized: "Unauthorized",
        invalidToken: "Invalid token",
        expiredToken: "Token expired",
        tokenUsed: "Token has already been used",
        emailExists: "Email already registered",
        registrationFailed: "Registration failed. Please try again.",
        sendEmailFailed: "Failed to send, please try again",
        passwordTooShort: "Password must be at least 8 characters",
        userNotFound: "User not found",
        invalidCredentials: "Invalid email or password",
        emailNotVerified: "Email not verified",
        emailAlreadyVerified: "Email already verified",
        emailVerifyFailed: "Email verification failed. The link may be invalid or expired.",
        invalidPassword: "Current password is incorrect",
        passwordMismatch: "Passwords do not match",
        updateFailed: "Update failed",
        deleteFailed: "Delete failed",
        resumeNotFoundOrUnauthorized: "Resume not found or unauthorized",
        resumeSaveFailed: "Failed to save resume. Please try again.",
        resumeDeleteFailed: "Failed to delete resume. Please try again.",
        resumeDuplicateFailed: "Failed to duplicate resume. Please try again.",
        resetPasswordFailed: "Failed to reset your password. The link may be invalid or expired.",
        unknownError: "An unknown error occurred",
    },
};

/**
 * Get localized error message for a given key and locale
 */
export function getErrorMessage(
    key: ErrorMessageKey,
    locale: string = "en",
    params?: Record<string, string>
): string {
    const normalizedLocale = locale.startsWith("zh") ? "zh" : "en";
    let message = errorMessages[normalizedLocale][key] || errorMessages.en[key];

    // Replace parameters in message if provided
    if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
            message = message.replace(`{${paramKey}}`, paramValue);
        });
    }

    return message;
}

/**
 * LocalizedError class for throwing internationalized errors
 */
export class LocalizedError extends Error {
    public readonly messageKey: ErrorMessageKey;
    public readonly locale: string;
    public readonly params?: Record<string, string>;

    constructor(
        messageKey: ErrorMessageKey,
        locale: string = "en",
        params?: Record<string, string>
    ) {
        const localizedMessage = getErrorMessage(messageKey, locale, params);
        super(localizedMessage);
        this.name = "LocalizedError";
        this.messageKey = messageKey;
        this.locale = locale;
        this.params = params;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LocalizedError);
        }
    }

    /**
     * Get the localized error message
     */
    toLocalizedString(): string {
        return getErrorMessage(this.messageKey, this.locale, this.params);
    }

    /**
     * Convert to JSON representation
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            messageKey: this.messageKey,
            locale: this.locale,
            params: this.params,
        };
    }
}
