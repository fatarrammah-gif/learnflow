FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# VITE_API_URL must be set as a Railway build variable so Vite bakes it into the JS bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Install serve to host the static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the built dist/ folder
CMD serve dist --single -l ${PORT:-3000} --no-clipboard
