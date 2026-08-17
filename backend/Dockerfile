# Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# hadolint ignore=DL3018
RUN apk upgrade --no-cache && apk add --no-cache python3 make g++ && npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Copy package files and install production-only dependencies
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/dist ./dist

# hadolint ignore=DL3018
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev \
    && npx prisma generate \
    && apk del python3 make g++

# Use non-root user
USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
