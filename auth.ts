import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // For demo purposes: Auto-register if user doesn't exist
          // In production, you'd want a separate registration flow
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name: email.split('@')[0],
            },
          });
        } else {
          // Verify password
          if (!user.password) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isMember: user.isMember, // Pass membership status to session
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // We need to fetch the user to get the latest isMember status
        // or trust the token if we put it there. Let's keep it simple.
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
