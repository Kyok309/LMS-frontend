# Docker Setup Guide

## Building the Image

Build the Docker image with environment variables:

```bash
./docker-build.sh
```

Or manually:

```bash
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL="your_backend_url" \
  --build-arg NEXT_PUBLIC_BACKEND="your_backend" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="your_socket_url" \
  -t lms-frontend .
```

## Running the Container

### Important: Backend URL Configuration

**If you get `ECONNREFUSED` errors**, it's likely because your backend URL uses `localhost` or `127.0.0.1`. Inside a Docker container, `localhost` refers to the container itself, not your host machine.

#### Solution 1: Backend on Host Machine

**On Linux:**
```bash
# Use host.docker.internal or the host's IP address
# In your .env file, set:
NEXT_PUBLIC_BACKEND=http://172.17.0.1:8000
# OR use host.docker.internal (requires Docker 20.10+)
NEXT_PUBLIC_BACKEND=http://host.docker.internal:8000
```

**On Mac/Windows:**
```bash
# Use host.docker.internal
NEXT_PUBLIC_BACKEND=http://host.docker.internal:8000
```

**Run with network access:**
```bash
docker run -p 3000:3000 --add-host=host.docker.internal:host-gateway --env-file .env lms-frontend
```

#### Solution 2: Backend in Another Container (Docker Compose)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL}
        NEXT_PUBLIC_BACKEND: ${NEXT_PUBLIC_BACKEND}
        NEXT_PUBLIC_SOCKET_URL: ${NEXT_PUBLIC_SOCKET_URL}
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - backend
    networks:
      - lms-network

  backend:
    # Your backend service configuration
    # ...
    networks:
      - lms-network

networks:
  lms-network:
    driver: bridge
```

Then use the service name as the backend URL:
```bash
NEXT_PUBLIC_BACKEND=http://backend:8000
```

#### Solution 3: External Backend

If your backend is accessible via a public URL or IP:
```bash
NEXT_PUBLIC_BACKEND=http://your-backend-ip:8000
# OR
NEXT_PUBLIC_BACKEND=https://api.yourdomain.com
```

## Environment Variables

### Required Build-Time Variables (NEXT_PUBLIC_*)
These are embedded into the JavaScript bundle at build time:
- `NEXT_PUBLIC_BACKEND_URL` - Full backend URL
- `NEXT_PUBLIC_BACKEND` - Backend API base URL
- `NEXT_PUBLIC_SOCKET_URL` - WebSocket URL

### Required Runtime Variables
These are passed at runtime via `--env-file`:
- `FRAPPE_CLIENT_ID` - OAuth client ID
- `FRAPPE_CLIENT_SECRET` - OAuth client secret

## Troubleshooting

### Error: `ECONNREFUSED`
- Check that your backend URL doesn't use `localhost` or `127.0.0.1`
- Use `host.docker.internal` (Mac/Windows) or host IP (Linux)
- Ensure backend is running and accessible
- Check firewall settings

### Error: `undefined.auth.get_me`
- Rebuild the image with `NEXT_PUBLIC_*` variables as build args
- Ensure all `NEXT_PUBLIC_*` variables are set during build

### Error: Module not found during build
- Ensure devDependencies are installed (they're needed for the build)
- Check that `npm ci` runs without `NODE_ENV=production` set

