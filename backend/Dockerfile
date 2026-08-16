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

# Only copy necessary files from builder
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts

# Use non-root user
USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
