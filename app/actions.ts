"use server";

import prisma from "@/lib/prisma";
import { LocalizedError } from "@/lib/errors";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-helper";

export async function saveResume(
  data: ResumeData,
  title: string,
  id?: string,
  locale: string = "en"
) {
  try {
    const user = await requireUser(locale);

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
  try {
    // We use a simplified version of requireUser here (or just check session)
    // because getResumes usually returns empty array if not logged in, rather than throwing
    const user = await requireUser(); 
    
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
  } catch (error) {
    // If not authorized or user not found, return empty list
    return [];
  }
}

export async function getResume(id: string) {
  try {
    const user = await requireUser();

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume || resume.userId !== user.id) {
      return null;
    }

    return {
      ...resume,
      data: JSON.parse(resume.content) as ResumeData
    };
  } catch (error) {
    return null;
  }
}

export async function deleteResume(id: string, locale: string = "en") {
  try {
    const user = await requireUser(locale);

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
    const user = await requireUser(locale);

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
