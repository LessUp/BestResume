"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { getRequestContext } from "@/lib/request-context";
import { hashToken, generateToken } from "@/lib/token-hash";
import { LocalizedError } from "@/lib/errors";

// 用户注册
export async function registerUser(
  data: {
    email: string;
    password: string;
    name?: string;
  },
  locale: string = "en"
) {
  try {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new LocalizedError("emailExists", locale);
    }

    // 密码强度检查
    if (data.password.length < 8) {
      throw new LocalizedError("passwordTooShort", locale);
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || data.email.split("@")[0],
      },
    });

    // 记录活动日志
    const context = await getRequestContext();
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("registerUser failed", error);
    throw new LocalizedError("registrationFailed", locale);
  }
}

// 请求密码重置
export async function requestPasswordReset(email: string, locale: string) {
  try {
    const isZh = locale.startsWith("zh");
    const genericMessage = isZh
      ? "如果邮箱存在，重置链接已发送"
      : "If the email exists, a reset link has been sent";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // 为了安全，不要透露邮箱是否存在
      return { success: true, message: genericMessage };
    }

    // 生成重置令牌
    const plainToken = generateToken();
    const hashedToken = hashToken(plainToken);
    const expiresAt = new Date(Date.now() + 3600000); // 1小时后过期

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/${locale}/auth/reset-password?token=${plainToken}`;

    const subject = isZh ? "重置您的 BestResume 密码" : "Reset your BestResume password";
    const text = isZh
      ? `您请求重置 BestResume 账户密码，请点击以下链接完成重置（1 小时内有效）：\n${resetUrl}`
      : `You requested to reset your BestResume account password. Click the link below to continue (valid for 1 hour):\n${resetUrl}`;

    await sendEmail({
      to: email,
      subject,
      text,
    });

    return { success: true, message: genericMessage };
  } catch (error) {
    console.error("requestPasswordReset failed", error);
    throw new LocalizedError("sendEmailFailed", locale);
  }
}

// 重置密码
export async function resetPassword(
  data: { token: string; newPassword: string },
  locale: string = "en"
) {
  try {
    // Hash the provided token to compare with stored hash
    const hashedToken = hashToken(data.token);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new LocalizedError("invalidToken", locale);
    }

    if (resetRecord.used) {
      throw new LocalizedError("tokenUsed", locale);
    }

    if (new Date() > resetRecord.expiresAt) {
      throw new LocalizedError("expiredToken", locale);
    }

    // 密码强度检查
    if (data.newPassword.length < 8) {
      throw new LocalizedError("passwordTooShort", locale);
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // 标记令牌为已使用
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // 记录活动日志
    const context = await getRequestContext();
    await prisma.activityLog.create({
      data: {
        userId: resetRecord.userId,
        action: "RESET_PASSWORD",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("resetPassword failed", error);
    throw new LocalizedError("resetPasswordFailed", locale);
  }
}

// 验证邮箱（生成验证令牌）
export async function sendVerificationEmail(email: string, locale: string) {
  try {
    const isZh = locale.startsWith("zh");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new LocalizedError("userNotFound", locale);
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: isZh ? "邮箱已验证" : "Email already verified",
      };
    }

    // 生成验证令牌
    const plainToken = generateToken();
    const hashedToken = hashToken(plainToken);
    const expires = new Date(Date.now() + 86400000); // 24小时后过期

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/${locale}/auth/verify-email?token=${plainToken}`;

    const subject = isZh ? "验证您的 BestResume 邮箱" : "Verify your BestResume email";
    const text = isZh
      ? `请点击以下链接验证您的邮箱（24 小时内有效）：\n${verifyUrl}`
      : `Please click the link below to verify your email address (valid for 24 hours):\n${verifyUrl}`;

    await sendEmail({
      to: email,
      subject,
      text,
    });

    return { success: true, message: isZh ? "验证邮件已发送" : "Verification email sent" };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("sendVerificationEmail failed", error);
    throw new LocalizedError("sendEmailFailed", locale);
  }
}

// 确认邮箱验证
export async function verifyEmail(token: string, locale: string = "en") {
  try {
    // Hash the provided token to compare with stored hash
    const hashedToken = hashToken(token);

    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!verificationRecord) {
      throw new LocalizedError("invalidToken", locale);
    }

    if (new Date() > verificationRecord.expires) {
      throw new LocalizedError("expiredToken", locale);
    }

    // 更新用户邮箱验证状态
    await prisma.user.update({
      where: { email: verificationRecord.identifier },
      data: { emailVerified: new Date() },
    });

    // 删除验证令牌
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("verifyEmail failed", error);
    throw new LocalizedError("emailVerifyFailed", locale);
  }
}
