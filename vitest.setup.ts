import '@testing-library/jest-dom';

// Set up test environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret-key-for-testing-only';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
