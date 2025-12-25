"use server";

import { requireUser } from "@/lib/auth-helper";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getRequestContext } from "@/lib/request-context";
import { LocalizedError } from "@/lib/errors";

// 用户资料类型
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  company: string | null;
  jobTitle: string | null;
  role: string;
  theme: string;
  language: string;
  timezone: string;
  isMember: boolean;
  membershipType: string | null;
  membershipExpiry: Date | null;
  createdAt: Date;
}

// 获取当前用户资料
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const user = await requireUser();
    
    // Convert to UserProfile type safely
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
      website: user.website,
      company: user.company,
      jobTitle: user.jobTitle,
      role: user.role,
      theme: user.theme,
      language: user.language,
      timezone: user.timezone,
      isMember: user.isMember,
      membershipType: user.membershipType,
      membershipExpiry: user.membershipExpiry,
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Return null for initial load if unauthorized/not found, 
    // rather than throwing error to client for this specific fetcher
    return null;
  }
}

// 更新用户资料
export async function updateUserProfile(
  data: {
    name?: string;
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
  },
  locale: string = "en"
) {
  try {
    const user = await requireUser(locale);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        website: data.website,
        company: data.company,
        jobTitle: data.jobTitle,
      },
    });

    // 记录活动日志
    const context = await getRequestContext();
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_PROFILE",
        details: JSON.stringify(data),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    revalidatePath('/[locale]/settings', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("updateUserProfile failed", error);
    throw new LocalizedError("updateFailed", locale);
  }
}

// 更新用户偏好设置
export async function updateUserPreferences(
  data: {
    theme?: string;
    language?: string;
    timezone?: string;
  },
  locale: string = "en"
) {
  try {
    const user = await requireUser(locale);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        theme: data.theme,
        language: data.language,
        timezone: data.timezone,
      },
    });

    revalidatePath('/[locale]/settings', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("updateUserPreferences failed", error);
    throw new LocalizedError("updateFailed", locale);
  }
}

// 修改密码
export async function changePassword(
  data: {
    currentPassword: string;
    newPassword: string;
  },
  locale: string = "en"
) {
  try {
    const user = await requireUser(locale);

    if (!user.password) {
      throw new LocalizedError("invalidPassword", locale); // Or appropriate error for no password set
    }

    // 验证当前密码
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new LocalizedError("invalidPassword", locale);
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 记录活动日志
    const context = await getRequestContext();
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "CHANGE_PASSWORD",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("changePassword failed", error);
    throw new LocalizedError("updateFailed", locale);
  }
}

// 更新头像
export async function updateAvatar(imageUrl: string, locale: string = "en") {
  try {
    const user = await requireUser(locale);

    await prisma.user.update({
      where: { id: user.id },
      data: { image: imageUrl },
    });

    revalidatePath('/[locale]/settings', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("updateAvatar failed", error);
    throw new LocalizedError("updateFailed", locale);
  }
}

// 获取用户统计数据
export async function getUserStats() {
  try {
    const user = await requireUser();

    const [totalResumes, publishedResumes, draftResumes, totalViews, totalDownloads] =
      await Promise.all([
        prisma.resume.count({ where: { userId: user.id } }),
        prisma.resume.count({ where: { userId: user.id, status: "published" } }),
        prisma.resume.count({ where: { userId: user.id, status: "draft" } }),
        prisma.resume.aggregate({
          where: { userId: user.id },
          _sum: { viewCount: true },
        }),
        prisma.resume.aggregate({
          where: { userId: user.id },
          _sum: { downloadCount: true },
        }),
      ]);

    return {
      totalResumes,
      publishedResumes,
      draftResumes,
      totalViews: totalViews._sum.viewCount || 0,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
    };
  } catch (error) {
    return null;
  }
}

// 获取用户活动日志
export async function getUserActivityLogs(limit = 10) {
  try {
    const user = await requireUser();

    const logs = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs;
  } catch (error) {
    return [];
  }
}

// 删除账号
export async function deleteAccount(locale: string = "en") {
  try {
    const user = await requireUser(locale);

    // 删除用户及其所有相关数据（级联删除已在schema中定义）
    await prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("deleteAccount failed", error);
    throw new LocalizedError("deleteFailed", locale);
  }
}
