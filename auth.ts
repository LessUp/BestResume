import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getRequestContext } from '@/lib/request-context';
import { RateLimiter, UpstashRateLimiter } from '@/lib/rate-limit';

// Create rate limiter instance
const loginRateLimiter = (() => {
  const config = {
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.LOGIN_WINDOW_MS || '900000'),
    blockDurationMs: parseInt(process.env.LOGIN_BLOCK_DURATION_MS || '900000'),
  };

  try {
    const hasUpstashUrl =
      !!process.env.UPSTASH_REDIS_REST_URL ||
      !!process.env.UPSTASH_KV_REST_API_URL ||
      !!process.env.KV_REST_API_URL;

    const hasUpstashToken =
      !!process.env.UPSTASH_REDIS_REST_TOKEN ||
      !!process.env.UPSTASH_KV_REST_API_TOKEN ||
      !!process.env.KV_REST_API_TOKEN;

    if (hasUpstashUrl && hasUpstashToken) {
      return new UpstashRateLimiter({ ...config, prefix: 'bestresume:login' });
    }
  } catch (err) {
    console.warn('Upstash rate limiter init failed, falling back to in-memory:', err);
  }

  return new RateLimiter(config);
})();

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

        // Get request context for rate limiting
        const context = await getRequestContext();
        const identifier = context.ipAddress;

        // Check rate limit before proceeding
        const { allowed, retryAfter } = await loginRateLimiter.checkLimit(identifier);
        if (!allowed) {
          console.warn(`Rate limit exceeded for IP: ${identifier}, retry after ${retryAfter}s`);
          return null;
        }

        // 查找用户
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          // Record failed attempt
          await loginRateLimiter.recordAttempt(identifier, false);

          // Log failed login attempt
          const attemptCount = await Promise.resolve(loginRateLimiter.getAttemptCount(identifier));
          const isHighRisk = attemptCount >= 3;

          if (user) {
            await prisma.activityLog.create({
              data: {
                userId: user.id,
                action: "FAILED_LOGIN",
                ipAddress: context.ipAddress,
                userAgent: context.userAgent,
                details: JSON.stringify({
                  reason: "invalid_password",
                  attemptCount,
                  highRisk: isHighRisk,
                }),
              },
            });
          }

          return null;
        }

        // 验证密码
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          // Record failed attempt
          await loginRateLimiter.recordAttempt(identifier, false);

          // Log failed login attempt with high-risk marker
          const attemptCount = await Promise.resolve(loginRateLimiter.getAttemptCount(identifier));
          const isHighRisk = attemptCount >= 3;

          await prisma.activityLog.create({
            data: {
              userId: user.id,
              action: "FAILED_LOGIN",
              ipAddress: context.ipAddress,
              userAgent: context.userAgent,
              details: JSON.stringify({
                reason: "invalid_password",
                attemptCount,
                highRisk: isHighRisk,
              }),
            },
          });

          return null;
        }

        // Record successful attempt (clears rate limit)
        await loginRateLimiter.recordAttempt(identifier, true);

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
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
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
          role: user.role,
          isMember: user.isMember,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isMember = token.isMember;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
