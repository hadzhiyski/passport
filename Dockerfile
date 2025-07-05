# ---- Base Node ----
FROM node:22-alpine AS base
WORKDIR /app

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies ----
FROM base AS deps
# Install minimal dependencies needed for native modules
RUN apk add --no-cache libc6-compat && \
    apk upgrade --no-cache

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies with npm
RUN npm install --omit=dev && \
    # Remove npm cache to reduce image size and attack surface
    npm cache clean --force

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY . .

# Install all dependencies for build (including dev dependencies)
RUN npm install && \
    npm run build && \
    npm cache clean --force

# ---- Production ----
FROM node:22-alpine AS runner
WORKDIR /app

# Update packages
RUN apk upgrade --no-cache && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=deps /app/node_modules ./node_modules

# Set the correct permissions
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Environment variables must be redefined at run time
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run the application
CMD ["node", "server.js"]
