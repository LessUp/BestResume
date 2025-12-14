"use server";

import { auth } from "@/auth";
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
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      bio: true,
      phone: true,
      location: true,
      website: true,
      company: true,
      jobTitle: true,
      role: true,
      theme: true,
      language: true,
      timezone: true,
      isMember: true,
      membershipType: true,
      membershipExpiry: true,
      createdAt: true,
    },
  });

  return user;
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
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    await prisma.user.update({
      where: { email: session.user.email },
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
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
    }

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
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    await prisma.user.update({
      where: { email: session.user.email },
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
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      throw new LocalizedError("userNotFound", locale);
    }

    // 验证当前密码
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new LocalizedError("invalidPassword", locale);
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { email: session.user.email },
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
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    await prisma.user.update({
      where: { email: session.user.email },
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
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

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
}

// 获取用户活动日志
export async function getUserActivityLogs(limit = 10) {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];

  const logs = await prisma.activityLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs;
}

// 删除账号
export async function deleteAccount(locale: string = "en") {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new LocalizedError("userNotFound", locale);

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
