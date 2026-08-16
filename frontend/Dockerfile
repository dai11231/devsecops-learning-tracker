# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN apk upgrade --no-cache && npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Remove default nginx static assets and upgrade alpine packages
RUN apk upgrade --no-cache && \
    rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Setup non-root user for Nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
