# WAD Capstone API

Backend proyek capstone Web Advanced Development yang dibangun dengan Node.js, Express, Prisma, dan Socket.IO. Aplikasi ini menyediakan autentikasi pengguna, manajemen task, notifikasi real-time, serta dokumentasi API via Swagger.

## Fitur Utama

- Autentikasi dengan JWT dan refresh token
- CRUD task lengkap (create, read, update, delete)
- Filter, sorting, dan pagination task
- Worklogs / durasi task
- Real-time event via Socket.IO
- Dokumentasi API Swagger

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.IO
- Joi untuk validasi input
- Swagger UI / Swagger JSDoc

## Setup Lokal

### 1. Prasyarat

Pastikan perangkat telah terpasang:

- Node.js 18+
- PostgreSQL
- npm atau pnpm

### 2. Clone repository

```bash
git clone <repo-url>
cd wad-capstone
```

### 3. Install dependency

```bash
npm install
```

### 4. Siapkan environment

Buat file `.env` berdasarkan kebutuhan aplikasi:

```env
PORT=3005
NODE_ENV=development
APP_NAME=WAD Capstone API
APP_VERSION=1.0.0
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
```

### 5. Siapkan database

```bash
npx prisma migrate dev
# atau jika hanya ingin sinkronisasi schema lokal
npx prisma db push
```

### 6. Seed data (opsional)

```bash
npm run db:seed
```

### 7. Jalankan server

```bash
npm run dev
```

Server akan berjalan di:

```text
http://localhost:3005
```

### 8. Akses dokumentasi API

```text
http://localhost:3005/api/docs
```

## Endpoint API

Semua endpoint API berada di prefix `/api/v1` kecuali health check.

### Health

- `GET /health`

### Auth

- `POST /api/v1/auth/register` — registrasi user baru
- `POST /api/v1/auth/login` — login dan mendapatkan access token + refresh token
- `POST /api/v1/auth/refresh` — refresh access token
- `POST /api/v1/auth/logout` — revoke refresh token
- `GET /api/v1/auth/me` — informasi user yang sedang login (butuh token)

### Tasks

- `GET /api/v1/tasks` — daftar task dengan filter, sorting, pagination
- `POST /api/v1/tasks` — buat task baru
- `GET /api/v1/tasks/:id` — detail task berdasarkan ID
- `GET /api/v1/tasks/:id/worklogs` — melihat durasi dan timeline task
- `PUT /api/v1/tasks/:id` — replace task secara penuh
- `PATCH /api/v1/tasks/:id` — update sebagian task
- `DELETE /api/v1/tasks/:id` — hapus task

### Users

- `GET /api/v1/users/:userId/tasks` — melihat task milik user tertentu

### Admin

- `GET /api/v1/admin/users` — melihat seluruh user
- `PATCH /api/v1/admin/users/:id/role` — mengubah role user
- `GET /api/v1/admin/tasks` — melihat seluruh task dari semua user

## Event Socket.IO

Backend menyediakan koneksi Socket.IO yang memerlukan token JWT pada handshake.

### Autentikasi socket

Client harus mengirim token melalui:

```js
socket.auth = {
  token: "<jwt-access-token>",
};
```

### Event yang diterima dari client

- `ping` — health check sederhana, server akan mengembalikan `pong`

### Event yang dikirim dari server

- `users:online` — mengirim jumlah user yang sedang online
- `task:created` — saat task berhasil dibuat
- `task:updated` — saat task berhasil di-update
- `task:deleted` — saat task berhasil dihapus
- `notification` — notifikasi personal ke user tertentu

### Room yang digunakan

- `user:<userId>` — room personal untuk notifikasi user
- `tasks:global` — room global untuk broadcast perubahan task

## ERD Database

Struktur data utama aplikasi:

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER ||--o{ REFRESH_TOKEN : has
    CATEGORY ||--o{ TASK : categorizes

    USER {
      int id PK
      string name
      string email UK
      string password
      string role
      datetime createdAt
      datetime updatedAt
    }

    CATEGORY {
      int id PK
      string name UK
      string color
      datetime createdAt
    }

    TASK {
      int id PK
      string title
      string description
      string status
      string priority
      datetime dueDate
      datetime createdAt
      datetime updatedAt
      int userId FK
      int categoryId FK
    }

    REFRESH_TOKEN {
      int id PK
      string token UK
      int userId FK
      datetime expiresAt
      boolean isRevoked
      datetime createdAt
    }
```

### Ringkasan relasi

- Satu user dapat memiliki banyak task
- Satu user dapat memiliki banyak refresh token
- Satu category dapat digunakan oleh banyak task
- Task memiliki relasi opsional ke category

## Arsitektur Deployment

Arsitektur deployment yang disarankan untuk proyek ini adalah sebagai berikut:

```text
Client / Browser
        |
        v
   Nginx (reverse proxy)
        |
        +--> Frontend (React/Vite / static app)
        |
        +--> Backend (Node.js + Express + Prisma)
                 |
                 v
            Database (PostgreSQL)
```

### Alur deployment

1. Docker mengelola container frontend, backend, database, dan nginx
2. Frontend menerima request dari browser
3. Nginx men-dispatch request ke frontend atau backend sesuai path
4. Backend berkomunikasi dengan PostgreSQL melalui Prisma
5. Socket.IO berjalan pada backend dan dapat diakses melalui Nginx / reverse proxy

> Pada repo ini, struktur Docker belum disertakan, tetapi arsitektur di atas adalah target deployment yang sesuai dengan aplikasi backend ini.

## Struktur Folder

```text
src/
  controller/
  controllers/
  middleware/
  repositories/
  router/
  services/
  validators/
prisma/
  schema.prisma
  seed.js
```

## Catatan

- Pastikan PostgreSQL aktif sebelum menjalankan aplikasi
- Jika ada perubahan pada schema Prisma, jalankan migrasi sebelum menjalankan server
- Swagger akan otomatis ter-update saat server berjalan
