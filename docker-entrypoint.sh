#!/bin/sh
set -e

echo "🔄 Waiting for Neon Database to be ready..."

# Wait for Neon Database to be ready
until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1')
  .then(() => { pool.end(); process.exit(0); })
  .catch(() => { pool.end(); process.exit(1); });
" 2>/dev/null; do
  echo "⏳ Neon Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Neon Database is ready!"

echo "🔄 Running database migrations..."
npm run db:push

echo "🚀 Starting NovaLearn LMS..."
exec "$@"
