# ---------------------------------------------------------
# TracIt Frontend - Dockerfile (FULL FILE REPLACEMENT)
# ---------------------------------------------------------

FROM node:18-alpine AS builder

# Install build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# ---------------------------------------------------------
# Copy entire frontend source code including .env
# ---------------------------------------------------------
COPY . .

# ---------------------------------------------------------
# Build Next.js in production mode
# ---------------------------------------------------------
RUN npm run build

# ---------------------------------------------------------
# Runtime image
# ---------------------------------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy build output from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
