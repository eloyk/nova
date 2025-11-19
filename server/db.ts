import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from 'ws';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Environment detection: Use Neon with WebSocket in Replit, standard pg in Docker
const isReplit = !!process.env.REPL_ID;

let pool: any;
let db: any;

if (isReplit) {
  // Replit: Use Neon serverless with WebSocket support
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
} else {
  // Docker/Local: Use standard PostgreSQL client
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };
