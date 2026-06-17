# WAD Capstone API

## Deskripsi

API ini adalah backend proyek capstone Web Advanced Development berbasis Node.js, Express, dan Prisma. Aplikasi menyediakan autentikasi, CRUD task, dan pelacakan durasi task.

## Setup & Install

1. Clone repository:

```bash
git clone <repo-url>
cd wad-capstone
```

2. Install dependency:

```bash
npm install
```

3. Salin file environment:

```bash
cp .env.example .env
```

4. Sesuaikan nilai di `.env`:

```env
PORT=3005
NODE_ENV=development
APP_NAME=WAD Caption API
APP_VERSION=1.0.0
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=wadcapstone"
JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

5. Siapkan database PostgreSQL dan sinkronkan schema Prisma:

```bash
npx prisma db push
```

6. (Opsional) Seed data:

```bash
npm run db:seed
```

7. Jalankan server:

```bash
npm run dev
```

atau untuk production:

```bash
npm start
```

8. Buka dokumentasi Swagger:

```text
http://localhost:3005/api/docs
```

## Struktur API

### Info & Health

- `GET /health`
- `GET /api/info`

### Auth

Semua route auth dipasang di prefix `/api/v1/auth`.

- `POST /api/v1/auth/register` - registrasi user baru
- `POST /api/v1/auth/login` - login dan dapatkan access token + refresh token
- `POST /api/v1/auth/refresh` - update access token dengan refresh token
- `POST /api/v1/auth/logout` - logout dan batalkan refresh token
- `GET /api/v1/auth/me` - ambil data user aktif (butuh `Authorization: Bearer <token>`)

### Tasks

Semua route task dipasang di prefix `/api/v1/tasks`.

- `GET /api/v1/tasks` - list task dengan filter, sort, pagination
- `POST /api/v1/tasks` - buat task baru
- `GET /api/v1/tasks/{id}` - ambil task berdasarkan ID
- `GET /api/v1/tasks/{id}/worklogs` - ambil durasi dan detail waktu task
- `PUT /api/v1/tasks/{id}` - update seluruh task berdasarkan ID
- `PATCH /api/v1/tasks/{id}` - update sebagian task berdasarkan ID
- `DELETE /api/v1/tasks/{id}` - hapus task berdasarkan ID

### Users

Semua route user dipasang di prefix `/api/v1/users`.

- `GET /api/v1/users/{userId}/tasks` - ambil task milik user tertentu

## Environment Variables

Gunakan minimal variabel berikut di `.env`:

- `PORT`
- `NODE_ENV`
- `APP_NAME`
- `APP_VERSION`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`

## ERD Database

Tabel utama dan relasi:

- `users`
  - `id` (PK)
  - `name`
  - `email` (unique)
  - `password`
  - `createdAt`
  - `updatedAt`

- `categories`
  - `id` (PK)
  - `name` (unique)
  - `color`
  - `createdAt`

- `tasks`
  - `id` (PK)
  - `title`
  - `description`
  - `status` (`TODO`, `IN_PROGRESS`, `DONE`)
  - `priority` (`LOW`, `MEDIUM`, `HIGH`)
  - `dueDate`
  - `createdAt`
  - `updatedAt`
  - `userId` (FK ke `users.id`)
  - `categoryId` (nullable FK ke `categories.id`)

- `refresh_tokens`
  - `id` (PK)
  - `token` (unique)
  - `userId` (FK ke `users.id`)
  - `expiresAt`
  - `isRevoked`
  - `createdAt`

### Relasi utama

- `User` 1 --- \* `Task`
- `User` 1 --- \* `RefreshToken`
- `Category` 1 --- \* `Task`

## Prisma Schema

Tabel Prisma menggunakan model:

- `User` → tabel `users`
- `Category` → tabel `categories`
- `Task` → tabel `tasks`
- `RefreshToken` → tabel `refresh_tokens`

## Swagger

Dokumentasi API tersedia pada:

- `http://localhost:3005/api/docs`
- `http://localhost:3005/api/docs.json`

## Catatan

- Pastikan PostgreSQL berjalan dan `DATABASE_URL` benar.
- Jika route belum muncul di Swagger, restart server setelah perubahan file.
