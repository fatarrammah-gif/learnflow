FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Bake VITE_API_URL into the JS bundle at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the React app
COPY . .
RUN npm run build

# Use shell form CMD so $PORT is expanded correctly at runtime
CMD npx serve dist --single --listen ${PORT:-3000}
