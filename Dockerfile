# Multi-stage build for NovaLearn LMS
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install all dependencies (including dev dependencies needed by vite.ts)
COPY package*.json ./
RUN npm ci

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY server ./server
COPY shared ./shared
COPY drizzle.config.ts ./

# Create videos directory for file storage
RUN mkdir -p /app/videos

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/auth/user', (r) => {process.exit(r.statusCode === 200 || r.statusCode === 401 ? 0 : 1)})"

# Use entrypoint script to run migrations before starting app
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
