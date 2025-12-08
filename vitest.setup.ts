import '@testing-library/jest-dom';
import path from 'path';

// Set up test environment variables
const dbPath = path.resolve(__dirname, 'prisma/dev.db');
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${dbPath}`;
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret-key-for-testing-only';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
