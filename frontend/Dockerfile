FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Install serve to host the static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the built dist/ folder
CMD serve dist -l ${PORT:-3000} --no-clipboard
