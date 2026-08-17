# Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# hadolint ignore=DL3018,DL3017,DL3059
RUN apk upgrade --no-cache && apk add --no-cache python3 make g++ \
    && npm ci \
    && npx prisma generate

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
# Ensure production image has the same node_modules that were used to build
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Make sure node user can access the files
RUN chown -R node:node /usr/src/app

# Note: we copy node_modules from the builder stage to avoid running `npm ci` again
# in production which could produce different dependency resolutions. If you still
# need to run prisma generate in the production image, re-enable installation steps.

# hadolint ignore=DL3018,DL3017,DL3059
# (installation steps removed because node_modules are copied from builder)

# Use non-root user
USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
