# Dokumentasi Frontend Kerjaindong

Pelacakan implementasi frontend per fitur. Setiap fase punya satu file; status
diperbarui setiap fase selesai beserta catatan deviasi.

| Fase | Dokumen | Status |
|---|---|---|
| FE-0 | [Branding & cleanup template](./FE-00-branding-cleanup.md) | ✅ Selesai |
| FE-1 | [Fondasi: API client, auth, guard, routing](./FE-01-foundation.md) | ✅ Selesai |
| FE-2 | [Publik: beranda, daftar & detail lowongan, profil company](./FE-02-public-seeker-browsing.md) | ✅ Selesai |
| FE-3 | [Area pencari kerja](./FE-03-seeker-area.md) | ✅ Selesai |
| FE-4 | [Area perusahaan (employer)](./FE-04-employer-area.md) | ✅ Selesai |
| FE-5 | [Area admin](./FE-05-admin-area.md) | ✅ Selesai |
| FE-6 | [Polish: i18n penuh, dark mode, SEO, aksesibilitas](./FE-06-polish.md) | ✅ Selesai* |

Urutan yang disepakati: FE-0 → FE-1 → publik/seeker (FE-2, FE-3) → employer
(FE-4) → admin (FE-5) → polish (FE-6).

\* Sisa opsional pada FE-6: unit test Vitest + RTL (menunggu keputusan
dependency) dan audit aksesibilitas lanjutan.

## Konvensi status

- ⬜ Belum mulai · 🟨 Berjalan · ✅ Selesai · ⏸️ Ditunda
- Setiap file fase memuat: Tujuan · Scope · Endpoint backend · File yang
  disentuh · Langkah kerja · Acceptance criteria · Checklist status · Catatan.

## Referensi backend

- Kontrak endpoint + payload: `kerjaindong-api/docs/04-api-endpoints.md`
- Auth & keamanan: `kerjaindong-api/docs/03-auth.md`
- Skema data: `kerjaindong-api/docs/02-database.md`
