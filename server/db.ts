// Automatically select the correct database client based on environment
// - Replit: Uses Neon serverless with WebSocket support
// - Docker/Local: Uses standard PostgreSQL client

const isReplit = process.env.REPL_ID !== undefined;

// Use dynamic import within an IIFE to handle async initialization
const initDb = async () => {
  if (isReplit) {
    // Replit environment: Use Neon serverless with WebSocket
    return await import('./db-neon.js');
  } else {
    // Docker/Local environment: Use standard PostgreSQL client
    return await import('./db-postgres.js');
  }
};

const dbModule = await initDb();

export const { pool, db } = dbModule;
