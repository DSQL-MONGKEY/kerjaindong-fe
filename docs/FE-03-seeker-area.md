# FE-03 — Area Pencari Kerja (Seeker)

**Status:** ✅ Selesai

## Tujuan

Dashboard job seeker: melengkapi profil, mengelola resume, melamar lowongan,
dan memantau status lamaran.

## Scope

- Dashboard ringkasan (status profil, jumlah lamaran, simpanan).
- Onboarding/edit profil + cascade provinsi & kota.
- Resume: list, tambah, edit, hapus, jadikan primary.
- Apply: pilih resume + cover letter dari detail lowongan.
- Lamaran saya: list + filter status + detail riwayat status (timeline).
- Withdraw lamaran.
- Saved jobs & followed companies.

## Endpoint backend

| Method & path | Kegunaan |
|---|---|
| `GET/POST /seeker-profile`, `GET/PATCH /seeker-profile/me` | Profil seeker |
| `GET/POST /resumes`, `GET/PATCH/DELETE /resumes/:id`, `POST /resumes/:id/primary` | Resume |
| `POST /jobs/:jobId/applications` | Melamar (sekali per lowongan) |
| `GET /applications/me`, `GET /applications/:id` | Lamaran + timeline |
| `POST /applications/:id/withdraw` | Batalkan |
| `POST/DELETE /jobs/:jobId/save`, `GET /saved-jobs` | Simpan lowongan |
| `POST/DELETE /companies/:companyId/follow`, `GET /followed-companies` | Follow company |

## File yang disentuh (rencana)

```
src/pages/Seeker/{Dashboard,Profile,Resumes,Applications,ApplicationDetail,SavedJobs,FollowedCompanies}.tsx
src/components/seeker/{ProfileForm,RegionCascade,ResumeCard,ResumeForm,ApplicationStatusBadge,ApplicationTimeline,ApplyDialog}.tsx
src/hooks/{useSeekerProfile,useResumes,useApplications,useSavedJobs,useFollowedCompanies}.ts
src/layout/AppSidebar.tsx (menu seeker)
src/App.tsx (rute /dashboard/*)
```

## Acceptance criteria

- [x] Profil & resume CRUD berjalan dengan validasi Zod.
- [x] Apply sekali per lowongan; duplikat menampilkan pesan 409 dari backend.
- [x] Timeline status lamaran tampil dari `history`.
- [x] Saved/follow idempotent (toggle).
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Checklist

- [x] Dashboard ringkasan (statistik lamaran/tersimpan/diikuti)
- [x] Profil + onboarding (cascade provinsi/kota)
- [x] Resume CRUD + primary
- [x] Apply flow (dialog pilih resume + cover letter)
- [x] Lamaran + timeline + withdraw
- [x] Saved jobs
- [x] Followed companies

## Catatan

- Dialog lamaran (`ApplyDialog`) menampilkan ajakan melengkapi profil bila
  `GET /seeker-profile/me` 404.
- Tombol simpan/ikuti hanya tampil untuk user terautentikasi ber-role
  `JOB_SEEKER`; status toggle bersifat lokal (belum ada endpoint "cek tersimpan").
- Submenu sidebar seeker ditampilkan setelah login; auto-open submenu mengikuti
  rute belum diterapkan (klik manual).
- Verifikasi: `pnpm lint` 0 error, `pnpm build` sukses.
