# Dockerfile for Next.js LMS Frontend Application

# Stage 1: Build the Next.js application
FROM node:24.13.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Accept build arguments for environment variables
# NEXT_PUBLIC_ variables are embedded at build time, so they must be available during build
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_BACKEND
ARG NEXT_PUBLIC_SOCKET_URL

# Set as environment variables for the build process
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application (NODE_ENV will be set to production by Next.js during build)
RUN npm run build

# Stage 2: Create the production image
FROM node:24.13.0-alpine AS runner

# Set the working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Note: FRAPPE_CLIENT_ID and FRAPPE_CLIENT_SECRET should be passed at runtime
# via --env-file or -e flags, not baked into the image for security

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Copy the built application (standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the port as an environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check (optional - remove if you don't have a health endpoint)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "server.js"]
