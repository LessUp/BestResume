import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 查找用户
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        // 验证密码
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // 更新最后登录时间
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // 记录登录日志
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isMember: user.isMember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: (user as any).role,
          isMember: (user as any).isMember,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // We need to fetch the user to get the latest isMember status
        // or trust the token if we put it there. Let's keep it simple.
      }
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).isMember = (token as any).isMember;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
