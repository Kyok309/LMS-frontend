<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="public/workspace_premium_24dp_2B7FFF_FILL0_wght400_GRAD0_opsz24.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">LMS Frontend</h3>

  <p align="center">
    LMS системийн <strong>Front-end</strong> (Next.js) төсөл
    <br />
    <a href="DOCKER.md"><strong>Docker заавар »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    &middot;
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Агуулга</summary>
  <ol>
    <li>
      <a href="#системийн-тухай">Системийн тухай</a>
      <ul>
        <li><a href="#ашигласан-технологиуд">Ашигласан технологиуд</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#суулгах">Суулгах</a></li>
      </ul>
    </li>
    <li>
      <a href="#deployment">Deployment</a>
      <ul>
        <li><a href="#орчин-бэлдэх">Орчин бэлдэх</a></li>
        <li><a href="#docker-build">Docker build</a></li>
        <li><a href="#docker-run">Docker run</a></li>
      </ul>
    </li>
    <li><a href="#түгээмэл-алдаа--шийдлүүд">Түгээмэл алдаа / Шийдлүүд</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## Системийн тухай

Энэ repo нь LMS системийн **frontend** хэсэг бөгөөд Next.js дээр хийгдсэн.

<div align="center">
  <a href="#">
    <img src="public/login_background.jpg" alt="Screenshot" width="70%" height="70%">
  </a>
</div>

Frontend нь backend-тэй HTTP API болон socket холболтоор харилцана. Орчны тохиргоо нь голчлон `.env` / `.env.local` доторх хувьсагчуудаар хийгддэг.

### Ашигласан технологиуд

- Next.js (standalone build)
- React
- TailwindCSS
- NextAuth (Credentials provider)
- Docker

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- **Node.js >= 20.9.0**
- **npm** (repo дээр `package-lock.json` байгаа тул npm ашиглахыг зөвлөсөн)
- Backend API ажиллаж байгаа байх ( `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_BACKEND`-оор заана )

### Суулгах

1. Dependency суулгах

```bash
npm ci
```

2. Env файл үүсгэх

Локал хөгжүүлэлтэд `.env.local` (эсвэл `.env`) үүсгээд дараах хувьсагчуудыг тохируулна.

```bash
# Build-time (NEXT_PUBLIC_*)
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
NEXT_PUBLIC_BACKEND=https://api.example.com/api/method/lms
NEXT_PUBLIC_SOCKET_URL=https://socket.example.com

# Runtime (NextAuth refresh/revoke flow)
FRAPPE_CLIENT_ID=your_client_id
FRAPPE_CLIENT_SECRET=your_client_secret

# (зөвлөмж) NextAuth secret (production орчинд заавал)
AUTH_SECRET=replace-with-a-long-random-string
```

3. Development server асаах

```bash
npm run dev
```

Дараа нь браузераар `http://localhost:3000` нээнэ.

> Анхаарах зүйл: `NEXT_PUBLIC_*` хувьсагчууд нь **build хийх үед JS bundle дотор шингэдэг**. Тиймээс Docker image build хийсний дараа `NEXT_PUBLIC_*`-г өөрчилбөл **дахин build** хийх шаардлагатай.

<!-- Deployment -->
## Deployment

### Орчин бэлдэх

Deploy хийхэд **Docker Engine** суусан байх шаардлагатай.

### Docker build

Энэ repo дээр `Dockerfile` болон `docker-build.sh` скрипт байна. `docker-build.sh` нь заавал `.env` файлыг уншдаг тул Docker ашиглах бол төслийн root дээр `.env` үүсгээд дээрх хувьсагчуудыг тохируулна.

Скрипт ашиглах:

```bash
./docker-build.sh
```

Эсвэл гараар:

```bash
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
  --build-arg NEXT_PUBLIC_BACKEND="$NEXT_PUBLIC_BACKEND" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="$NEXT_PUBLIC_SOCKET_URL" \
  -t lms-frontend .
```

### Docker run

```bash
docker run -p 3000:3000 --env-file .env lms-frontend
```

#### Backend нь host дээр (Linux) ажиллаж байвал

Docker контейнер доторх `localhost` нь контейнер өөрийг нь заадаг тул backend-аа `localhost`-оор заавал **ECONNREFUSED** гарна.

Linux дээр ихэвчлэн:

- Backend-аа host gateway IP-гаар заах: `http://172.17.0.1:8000`
- Эсвэл `host.docker.internal` ашиглах (Docker 20.10+), мөн `--add-host` нэмэх

Жишээ:

```bash
# .env дотор:
NEXT_PUBLIC_BACKEND_URL=http://host.docker.internal:8000
NEXT_PUBLIC_BACKEND=http://host.docker.internal:8000/api/method/lms

# run:
docker run -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  --env-file .env \
  lms-frontend
```

<!-- TROUBLESHOOTING -->
## Түгээмэл алдаа / Шийдлүүд

### `ECONNREFUSED`

- `NEXT_PUBLIC_BACKEND*` дээр `localhost` / `127.0.0.1` ашигласан эсэхээ шалга
- Docker дээр host backend руу холбогдох бол `host.docker.internal` (эсвэл host IP) ашигла
- Backend ажиллаж байгаа эсэх, firewall/port нээлттэй эсэхийг шалга

### `undefined.auth.get_me` (эсвэл API undefined)

- `NEXT_PUBLIC_*` хувьсагчууд build үед шингэдэг тул **image-ээ дахин build** хий
- `.env` доторх `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_BACKEND`, `NEXT_PUBLIC_SOCKET_URL` гурав build үед өгөгдсөн эсэхийг шалга

### Refresh/Logout дээр OAuth алдаа

- `FRAPPE_CLIENT_ID` / `FRAPPE_CLIENT_SECRET` run үед дамжиж байгаа эсэх (`--env-file .env`) шалга

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

- Next.js
- NextAuth
- TailwindCSS
- Docker

<p align="right">(<a href="#readme-top">back to top</a>)</p>