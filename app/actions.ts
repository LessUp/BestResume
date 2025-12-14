"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LocalizedError } from "@/lib/errors";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";

export async function saveResume(
  data: ResumeData,
  title: string,
  id?: string,
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

    if (!user) throw new LocalizedError("userNotFound", locale);

    const content = JSON.stringify(data);

    if (id) {
      const existing = await prisma.resume.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== user.id) {
        throw new LocalizedError("resumeNotFoundOrUnauthorized", locale);
      }

      await prisma.resume.update({
        where: { id },
        data: {
          content,
          title,
        },
      });
      revalidatePath('/[locale]/dashboard', 'page');
      return { success: true, id };
    }

    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        title,
        content,
      },
    });
    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true, id: newResume.id };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("saveResume failed", error);
    throw new LocalizedError("resumeSaveFailed", locale);
  }
}

export async function getResumes() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      // We don't select content here to save bandwidth on listing
    }
  });

  return resumes;
}

export async function getResume(id: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  // Simple ownership check via email lookup -> user id
  // A more optimized way would be to store userId in session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!resume || !user || resume.userId !== user.id) {
    return null;
  }

  return {
    ...resume,
    data: JSON.parse(resume.content) as ResumeData
  };
}

export async function deleteResume(id: string, locale: string = "en") {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new LocalizedError("userNotFound", locale);

    const existing = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      throw new LocalizedError("resumeNotFoundOrUnauthorized", locale);
    }

    await prisma.resume.delete({
      where: { id },
    });

    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("deleteResume failed", error);
    throw new LocalizedError("resumeDeleteFailed", locale);
  }
}

export async function duplicateResume(id: string, locale: string = "en") {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new LocalizedError("unauthorized", locale);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new LocalizedError("userNotFound", locale);

    const existing = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      throw new LocalizedError("resumeNotFoundOrUnauthorized", locale);
    }

    const newTitle = `${existing.title} (Copy)`;

    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: newTitle,
        content: existing.content,
      },
    });

    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true, id: newResume.id };
  } catch (error) {
    if (error instanceof LocalizedError) throw error;
    console.error("duplicateResume failed", error);
    throw new LocalizedError("resumeDuplicateFailed", locale);
  }
}
