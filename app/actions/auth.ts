"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// 用户注册
export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  // 检查邮箱是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("该邮箱已被注册");
  }

  // 密码强度检查
  if (data.password.length < 8) {
    throw new Error("密码长度至少8位");
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
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "REGISTER",
    },
  });

  return { success: true, userId: user.id };
}

// 请求密码重置
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // 为了安全，不要透露邮箱是否存在
    return { success: true, message: "如果邮箱存在，重置链接已发送" };
  }

  // 生成重置令牌
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600000); // 1小时后过期

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // TODO: 发送重置邮件
  // 在实际生产环境中，需要集成邮件服务
  console.log(`Password reset token for ${email}: ${token}`);

  return { success: true, message: "如果邮箱存在，重置链接已发送" };
}

// 重置密码
export async function resetPassword(data: { token: string; newPassword: string }) {
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: data.token },
    include: { user: true },
  });

  if (!resetRecord) {
    throw new Error("无效的重置链接");
  }

  if (resetRecord.used) {
    throw new Error("该重置链接已被使用");
  }

  if (new Date() > resetRecord.expiresAt) {
    throw new Error("重置链接已过期");
  }

  // 密码强度检查
  if (data.newPassword.length < 8) {
    throw new Error("密码长度至少8位");
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
  await prisma.activityLog.create({
    data: {
      userId: resetRecord.userId,
      action: "RESET_PASSWORD",
    },
  });

  return { success: true };
}

// 验证邮箱（生成验证令牌）
export async function sendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("用户不存在");
  }

  if (user.emailVerified) {
    return { success: true, message: "邮箱已验证" };
  }

  // 生成验证令牌
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 86400000); // 24小时后过期

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  // TODO: 发送验证邮件
  console.log(`Verification token for ${email}: ${token}`);

  return { success: true, message: "验证邮件已发送" };
}

// 确认邮箱验证
export async function verifyEmail(token: string) {
  const verificationRecord = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationRecord) {
    throw new Error("无效的验证链接");
  }

  if (new Date() > verificationRecord.expires) {
    throw new Error("验证链接已过期");
  }

  // 更新用户邮箱验证状态
  await prisma.user.update({
    where: { email: verificationRecord.identifier },
    data: { emailVerified: new Date() },
  });

  // 删除验证令牌
  await prisma.verificationToken.delete({
    where: { token },
  });

  return { success: true };
}
