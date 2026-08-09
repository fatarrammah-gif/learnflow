FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies needed by some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first so Docker caches this layer
# (only re-installs packages when requirements.txt changes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the port Railway will assign via $PORT
EXPOSE 8000

# Start the FastAPI server
# --proxy-headers + --forwarded-allow-ips='*' — trust Railway's X-Forwarded-Proto
# so redirects (e.g. FastAPI's trailing-slash redirect) use https, not http.
# Without this, Uvicorn sees the internal http hop from Railway's edge and
# generates insecure redirect URLs, which browsers block as mixed content.
CMD uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1 --proxy-headers --forwarded-allow-ips='*'
