# Stage 1 — Build the React app
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Bake VITE_API_URL into the JS bundle at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built React files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (uses __PORT__ placeholder instead of $PORT to avoid shell issues)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy startup script that replaces __PORT__ with Railway's actual $PORT at runtime
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
