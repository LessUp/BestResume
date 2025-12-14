import '@testing-library/jest-dom';

// Set up test environment variables
const env = ((globalThis as any).process?.env ?? {}) as any;

env.DATABASE_URL =
    env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/bestresume_test?schema=public';
env.DIRECT_URL = env.DIRECT_URL || env.DATABASE_URL;
env.NEXTAUTH_SECRET = env.NEXTAUTH_SECRET || 'test-secret-key-for-testing-only';
env.NEXTAUTH_URL = env.NEXTAUTH_URL || 'http://localhost:3000';
env.NEXT_PUBLIC_APP_URL = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
