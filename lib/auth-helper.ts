import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LocalizedError } from "@/lib/errors";

export async function requireSession(locale: string = "en") {
  const session = await auth();
  if (!session?.user?.email) {
    throw new LocalizedError("unauthorized", locale);
  }
  return session;
}

export async function requireUser(locale: string = "en") {
  const session = await requireSession(locale);
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    throw new LocalizedError("userNotFound", locale);
  }

  return user;
}
