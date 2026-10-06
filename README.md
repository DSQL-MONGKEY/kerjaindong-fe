# Kerjaindong Web (Frontend)

Frontend portal lowongan kerja **Kerjaindong** — melayani tiga peran: pencari
kerja (job seeker), perusahaan (employer), dan admin (SYS_ADMIN).

Repo ini adalah bagian frontend dari dua repo:

| Repo | Isi |
|---|---|
| **kerjaindong-fe** (repo ini) | Antarmuka web: React 19 + Vite 8 + Tailwind CSS v4 |
| [kerjaindong-api](https://github.com/DSQL-MONGKEY/kerjaindong-api) | Backend REST: NestJS 11 + Prisma 6 + PostgreSQL (Supabase) |

Dibangun dari template TailAdmin React (MIT) yang telah dibersihkan dari
boilerplate demo dan disesuaikan dengan branding Kerjaindong.

## Stack

- React 19 + TypeScript (strict) + Vite 8
- Tailwind CSS v4 (theme di `src/index.css`, tanpa `tailwind.config`)
- React Router v8
- i18next — locale `id` (default) + `en`
- TanStack Query + React Hook Form + Zod

## Prasyarat

- **Git**
- **Node.js 22+** dan **pnpm 10+** (`npm install -g pnpm`)
- Backend **kerjaindong-api** beserta database PostgreSQL (Supabase) — lihat
  [README kerjaindong-api](https://github.com/DSQL-MONGKEY/kerjaindong-api)

## Setup

### 1. Clone repo

```bash
git clone https://github.com/DSQL-MONGKEY/kerjaindong-api.git
git clone https://github.com/DSQL-MONGKEY/kerjaindong-fe.git
cd kerjaindong-fe
```

### 2. Install dependency

```bash
pnpm install
```

### 3. Environment variables

Buat file `.env` di root repo ini dengan **menyalin variabel environment dari
Google Docs tim** (minta akses ke maintainer). File `.env` tidak di-commit —
jangan pernah push isinya ke GitHub.

Variabel yang dipakai frontend:

| Variabel | Wajib | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | Ya | Base URL API backend tanpa trailing slash. Dev: `http://localhost:3000/api/v1` |

Struktur/format lengkapnya bisa dilihat di [`.env.example`](./.env.example).

### 4. Siapkan dan jalankan backend

Frontend membutuhkan API yang berjalan. Ikuti panduan setup di
[kerjaindong-api](https://github.com/DSQL-MONGKEY/kerjaindong-api)
(env, migrasi database, seed, lalu `pnpm start:dev` pada port `3000`).

### 5. Jalankan frontend

```bash
pnpm dev        # http://localhost:3100
```

Port `3100` sudah masuk whitelist CORS backend secara default, jadi tidak perlu
konfigurasi tambahan.

## Verifikasi

1. API hidup: buka `http://localhost:3000/api/v1/health` → `{"status":"ok", ...}`.
2. Frontend hidup: buka `http://localhost:3100` → beranda dan daftar lowongan tampil.
3. Daftar akun baru lewat `/signup` atau login memakai akun dari Google Docs/seed,
   lalu cek area sesuai role:
   - `/dashboard` — pencari kerja (profil, resume, lamaran, lowongan tersimpan, perusahaan diikuti)
   - `/employer` — perusahaan (profil, lowongan, pelamar, anggota)
   - `/admin` — admin (verifikasi perusahaan, pengguna, moderasi lowongan, audit log)

## Perintah

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Dev server dengan hot reload di `http://localhost:3100` |
| `pnpm build` | Typecheck (`tsc -b`) + build produksi ke `dist/` |
| `pnpm preview` | Menjalankan hasil build secara lokal |
| `pnpm lint` | ESLint seluruh repo |

## Troubleshooting

- **Request gagal / CORS error** — pastikan backend berjalan di port `3000` dan
  `VITE_API_BASE_URL` di `.env` benar, lalu restart `pnpm dev` (Vite membaca
  `.env` saat start).
- **401 setelah refresh halaman** — sesi memakai access token in-memory + cookie
  refresh httpOnly; pastikan cookie tidak diblokir browser dan API diakses dari
  origin yang sama seperti saat login.
- **Port 3100 terpakai** — hentikan proses lain di port tersebut (Vite memakai
  `strictPort`, tidak pindah port otomatis).
- **404 saat refresh di production** — SPA butuh fallback ke `index.html`
  (sudah disediakan `vercel.json` untuk Vercel).

## Struktur folder

```
src/
├── App.tsx              # peta route (satu-satunya tempat registrasi route)
├── pages/               # halaman per area: Public, Seeker, Employer, Admin
├── components/          # komponen UI, auth guard, jobs, seeker, employer, admin
├── hooks/               # TanStack Query per domain (jobs, seeker, employer, admin)
├── context/             # Auth, Theme, Language, Sidebar
├── lib/                 # API client (http.ts), token store, tipe
└── locales/             # terjemahan id/en
```

## Dokumentasi

Catatan implementasi per fase ada di [`docs/`](./docs/):

- `FE-00-branding-cleanup.md` — pembersihan template & branding
- `FE-01-foundation.md` — API client, auth, guard, routing per role
- `FE-02-public-seeker-browsing.md` — halaman publik & daftar lowongan
- `FE-03-seeker-area.md` — area pencari kerja (profil, resume, lamaran)
- `FE-04-employer-area.md` — area perusahaan (lowongan, pelamar, member)
- `FE-05-admin-area.md` — backoffice admin
- `FE-06-polish.md` — i18n penuh, dark mode, SEO, aksesibilitas

Panduan kontributor/coding agent ada di [`AGENTS.md`](./AGENTS.md).

## Kredit

Template dasar: [TailAdmin React](https://tailadmin.com) — lisensi MIT,
lihat `LICENSE.md`.
