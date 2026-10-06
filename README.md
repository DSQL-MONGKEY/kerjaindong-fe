# Kerjaindong Web

Frontend portal lowongan kerja **Kerjaindong** — melayani tiga peran: pencari
kerja (job seeker), perusahaan (employer), dan admin (SYS_ADMIN).

Dibangun dari template TailAdmin React (MIT) yang telah dibersihkan dari
boilerplate demo dan disesuaikan dengan branding Kerjaindong.

## Stack

- React 19 + TypeScript (strict) + Vite 8
- Tailwind CSS v4 (theme di `src/index.css`, tanpa `tailwind.config`)
- React Router v8
- i18next — locale `id` (default) + `en`
- TanStack Query + React Hook Form + Zod (fase FE-1)

## Menjalankan

```bash
pnpm install
pnpm dev        # http://localhost:3100 (sesuai CORS backend)
pnpm build      # tsc -b && vite build
pnpm lint
```

Backend API dev: `http://localhost:3000/api/v1`
(diatur lewat `VITE_API_BASE_URL` pada `.env`).

## Dokumentasi

Rencana dan catatan implementasi per fitur ada di [`docs/`](./docs/):

- `FE-00-branding-cleanup.md` — pembersihan template & branding
- `FE-01-foundation.md` — API client, auth, guard, routing per role
- `FE-02-public-seeker-browsing.md` — halaman publik & daftar lowongan
- `FE-03-seeker-area.md` — area pencari kerja (profil, resume, lamaran)
- `FE-04-employer-area.md` — area perusahaan (lowongan, pelamar, member)
- `FE-05-admin-area.md` — backoffice admin
- `FE-06-polish.md` — i18n penuh, dark mode, SEO, aksesibilitas

## Kredit

Template dasar: [TailAdmin React](https://tailadmin.com) — lisensi MIT,
lihat `LICENSE.md`.
