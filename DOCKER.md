# Docker тохиргооны заавар

## Image build хийх

Орчны хувьсагчуудыг ашиглан Docker image build хийх:

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

## Контейнер ажиллуулах

### Чухал: Backend URL тохиргоо

Хэрвээ **`ECONNREFUSED` алдаа** гарвал ихэнхдээ backend URL нь `localhost` эсвэл `127.0.0.1`-ыг зааж байдагтай холбоотой. Docker контейнер дотор `localhost` нь **контейнер өөрийг нь** заадаг бөгөөд таны host машин биш.

#### Хувилбар 1: Backend нь host машин дээр ажиллаж байгаа үед

**Linux дээр:**
```bash
# Use host.docker.internal or the host's IP address
# In your .env file, set:
NEXT_PUBLIC_BACKEND=http://172.17.0.1:8000
# OR use host.docker.internal (requires Docker 20.10+)
NEXT_PUBLIC_BACKEND=http://host.docker.internal:8000
```

**Mac/Windows дээр:**
```bash
# Use host.docker.internal
NEXT_PUBLIC_BACKEND=http://host.docker.internal:8000
```

**Host руу сүлжээний хандалттайгаар ажиллуулах:**
```bash
docker run -p 3000:3000 --add-host=host.docker.internal:host-gateway --env-file .env lms-frontend
```

#### Хувилбар 2: Backend нь өөр Docker контейнерт (Docker Compose)

`docker-compose.yml` файл үүсгэнэ:

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

Дараа нь backend URL дээр service name-ийг ашиглана:
```bash
NEXT_PUBLIC_BACKEND=http://backend:8000
```

#### Хувилбар 3: Гадаад (external) backend

Хэрвээ backend тань public URL эсвэл IP-ээр гаднаас нэвтрэх боломжтой бол:
```bash
NEXT_PUBLIC_BACKEND=http://your-backend-ip:8000
# OR
NEXT_PUBLIC_BACKEND=https://api.yourdomain.com
```

## Орчны хувьсагчууд (Environment Variables)

### Build-time үед шаардлагатай хувьсагчууд (NEXT_PUBLIC_*)

Эдгээр хувьсагчууд нь **build хийх үед** JavaScript bundle дотор “шингэж” ордог:

- `NEXT_PUBLIC_BACKEND_URL` - Backend-ийн бүрэн URL
- `NEXT_PUBLIC_BACKEND` - Backend API base URL
- `NEXT_PUBLIC_SOCKET_URL` - WebSocket URL

### Runtime үед шаардлагатай хувьсагчууд

Эдгээр хувьсагчууд контейнерийг ажиллуулах үед `--env-file`-ээр дамжина:

- `FRAPPE_CLIENT_ID` - OAuth client ID
- `FRAPPE_CLIENT_SECRET` - OAuth client secret

## Алдаа засвар (Troubleshooting)

### Алдаа: `ECONNREFUSED`

- Backend URL дээр `localhost` эсвэл `127.0.0.1` ашиглаагүй эсэхийг шалгана
- Mac/Windows дээр `host.docker.internal`, Linux дээр host IP ашиглана
- Backend чинь үнэхээр ажиллаж байгаа, хандалт нээлттэй (port, firewall) эсэхийг шалгана

### Алдаа: `undefined.auth.get_me`

- Image-ээ `NEXT_PUBLIC_*` хувьсагчдыг build аргумент болгон тохируулж **дахин build** хийнэ
- Build хийх үед бүх `NEXT_PUBLIC_*` хувьсагчууд зөв утгатайгаар өгөгдсөн эсэхийг нягтална

### Алдаа: Module not found during build

- `devDependencies` бүгд суусан эсэхийг шалга (build хийхэд шаардлагатай)
- `npm ci` команд `NODE_ENV=production` тохиргоогүй үед (эсвэл devDependencies алгасагдаагүй эсэхийг) шалгаж ажиллуулна