# FE-06 — Polish

**Status:** ✅ Selesai (satu item opsional tersisa: Vitest — menunggu keputusan dependency)

## Tujuan

Merapikan kualitas akhir sebelum dianggap siap pakai.

## Yang diterapkan

- i18n `id` (default) + `en` untuk seluruh teks UI (brand, sidebar, header,
  auth, jobs, seeker, employer, admin, invitation), termasuk breadcrumb.
- Dark mode mengikuti pola template (kelas `dark:` pada seluruh komponen baru).
- `PageMeta` (title + description) di setiap halaman.
- Empty/loading/error state di semua list & form (skeleton, kartu error,
  tombol retry).
- Responsive: grid 1→2→3 kolom, sidebar mobile, tabel audit dengan overflow-x.
- **Code-splitting route**: seluruh halaman dimuat via `React.lazy` +
  `Suspense`; bundle utama turun dari ~731 kB menjadi ~358 kB (gzip 107 kB)
  tanpa warning ukuran chunk.
- **Auto-open submenu sidebar** mengikuti rute aktif, dengan override manual
  yang otomatis hangus saat pindah halaman (tanpa `setState` di effect).
- **Aksesibilitas** (audit bertarget):
  - Skip link "Lewati ke konten utama" + `id="main-content"` di layout publik
    dan dashboard.
  - Semua dialog (`ApplyDialog`, `ApplicantStatusDialog`, `AdminActionDialog`)
    memakai `role="dialog"`, `aria-modal`, `aria-labelledby`, dan bisa ditutup
    dengan tombol `Escape`.
  - Label form terhubung ke kontrol (`htmlFor`/`id`) termasuk semua `Select`
    (primitive `Select` kini menerima prop `id`).
  - `aria-current="page"` pada tautan sidebar aktif; `aria-expanded` pada
    tombol submenu dan dropdown notifikasi; `aria-label` pada tombol ikon
    (notifikasi, toggle password).
- Warning lint hanya `react-refresh/only-export-components` bawaan context dan
  catatan React Compiler pada `watch()` React Hook Form (informasional).

## Sisa opsional

- [ ] Vitest + React Testing Library untuk unit test komponen kritis
  (memerlukan persetujuan dependency baru).
- [ ] Audit aksesibilitas menyeluruh (fokus trap di dialog, kontras menyeluruh).
- [ ] Review salinan bahasa untuk kalimat panjang.

## Acceptance criteria

- [x] Tidak ada string UI hardcode pada halaman fitur (kecuali konten dari API).
- [x] Semua halaman memakai token warna/`dark:` variant.
- [x] `pnpm lint` 0 error, `pnpm build` sukses (tanpa warning chunk).

## Checklist

- [x] i18n audit (fitur FE-1 s/d FE-5)
- [x] Dark mode
- [x] SEO
- [x] State seragam
- [x] Responsive dasar
- [x] Aksesibilitas bertarget
- [x] Code-splitting route
- [x] Auto-open submenu sidebar
- [ ] (Opsional) Vitest
