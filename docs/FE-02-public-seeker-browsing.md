# FE-02 — Publik: Beranda, Lowongan, Profil Company

**Status:** ✅ Selesai

## Tujuan

Halaman yang bisa diakses tanpa login: beranda, daftar lowongan dengan filter,
detail lowongan, dan profil publik perusahaan.

## Scope

- Beranda: hero + lowongan terbaru + CTA daftar.
- Daftar lowongan `/jobs`: filter `q`, kota, tipe kerja, mode kerja, gaji;
  cursor "muat lebih banyak"; kartu lowongan (title, company, location, salary,
  job type).
- Detail `/jobs/:slug`: deskripsi, requirement, benefit, info gaji, profil
  singkat company, tombol lamar (redirect login bila anonim).
- Profil `/companies/:slug`: info perusahaan + lowongan yang sedang dibuka.
- Header publik + footer.

## Endpoint backend

| Method & path | Kegunaan |
|---|---|
| `GET /jobs` | Feed lowongan + filter + cursor |
| `GET /jobs/:slug` | Detail lowongan (viewCount bertambah) |
| `GET /companies/:slug` | Profil publik perusahaan |
| `GET /regions` | Opsi filter lokasi |

## File yang disentuh (rencana)

```
src/pages/Public/{Home,Jobs,JobDetail,CompanyProfile}.tsx
src/components/jobs/{JobCard,JobFilters,JobList,JobPagination}.tsx
src/components/company/CompanyHeader.tsx
src/layout/PublicLayout.tsx
src/hooks/useJobs.ts, src/hooks/usePublicCompany.ts
src/App.tsx
```

## Acceptance criteria

- [x] Anonim dapat browsing lowongan + filter + buka detail tanpa error.
- [x] Filter tersinkron ke query string (bisa di-share).
- [x] Kartu lowongan memuat title, company, location, salary, job type.
- [x] Empty/loading/error state jelas di semua list & detail.
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Checklist

- [x] Halaman beranda (hero + lowongan terbaru + CTA employer)
- [x] Daftar + filter (`q`, provinsi, kota, tipe, mode, gaji) + load more cursor
- [x] Detail lowongan (+ viewCount, tombol lamar mengarah ke login/dashboard)
- [x] Profil publik company + lowongan aktifnya
- [x] SEO `PageMeta` per halaman

## Catatan

- Filter provinsi → kota memakai `GET /regions` (cascade), nilai tersimpan di
  query string.
- Tombol "Lamar" sementara mengarah ke `/dashboard` (dialog lamaran penuh
  hadir di FE-3).
- Verifikasi: `pnpm lint` 0 error, `pnpm build` sukses.

## Perbaikan 2026-10-06

- CTA beranda: tombol "Daftar" (hero) dan seksi "Daftar sebagai Perusahaan"
  hanya tampil untuk pengunjung anonim; user login hanya melihat tombol
  "Lihat Lowongan".
