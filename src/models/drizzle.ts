import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/lib/schema';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in environment variables');
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});

export const db = drizzle(pool, { schema });
