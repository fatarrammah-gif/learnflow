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

# Stage 2 — Serve with nginx (reliable, handles $PORT correctly)
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config that handles React Router + dynamic PORT
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway sets $PORT at runtime — nginx reads it via envsubst
CMD sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
