# FE-04 — Area Perusahaan (Employer)

**Status:** ✅ Selesai

## Tujuan

Dashboard employer: mengelola profil perusahaan, tim, lowongan, dan pipeline
pelamar.

## Scope

- Onboarding perusahaan (buat company + profil owner) & edit profil.
- Kelola lowongan: list + filter status, buat (draft), edit, transisi
  publish/pause/close/archive, hapus draft.
- Pelamar per lowongan: list + filter status, detail pelamar (snapshot),
  tandai dilihat otomatis, ubah status + catatan (pipeline + history).
- Member perusahaan: daftar anggota, undang (ADMIN/RECRUITER), nonaktifkan.
- Halaman terima undangan `/invitations/:token`.

## Endpoint backend

| Method & path | Kegunaan |
|---|---|
| `POST /companies`, `GET/PATCH /companies/me` | Onboarding & profil |
| `POST/GET /companies/:companyId/jobs` | Buat/daftar lowongan |
| `GET /jobs/:id/manage`, `PATCH /jobs/:id`, `DELETE /jobs/:id` | Kelola lowongan |
| `POST /jobs/:id/{publish,pause,close,archive}` | Transisi status |
| `GET /jobs/:jobId/applications` | Daftar pelamar |
| `GET /applications/:id`, `PATCH /applications/:id/status` | Detail & pipeline |
| `GET /companies/:companyId/members`, `DELETE .../members/:userId` | Anggota |
| `POST/GET /companies/:companyId/invitations` | Undangan |
| `GET /invitations/:token`, `POST /invitations/accept` | Terima undangan |

## File yang disentuh (rencana)

```
src/pages/Employer/{Dashboard,CompanyProfile,Jobs,JobForm,JobDetail,Applicants,Members}.tsx
src/pages/Invitations/AcceptInvitation.tsx
src/components/employer/{CompanyForm,JobForm,JobStatusBadge,JobStatusActions,ApplicantTable,ApplicantStatusDialog,MemberTable,InviteMemberDialog}.tsx
src/hooks/{useCompany,useCompanyJobs,useJobManage,useApplicants,useMembers,useInvitations}.ts
src/layout/AppSidebar.tsx (menu employer)
src/App.tsx (rute /employer/*, /invitations/:token)
```

## Acceptance criteria

- [x] Employer baru bisa membuat company dan langsung posting lowongan.
- [x] Transisi status mengikuti aturan backend (tombol menyesuaikan status).
- [x] Pipeline pelamar menampilkan history dan menulis catatan.
- [x] Undangan: buat, preview publik, terima (email harus cocok).
- [x] Role internal (OWNER/ADMIN/RECRUITER) menyembunyikan aksi terlarang.
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Checklist

- [x] Onboarding & profil company
- [x] Manage lowongan + form
- [x] Pipeline pelamar + history
- [x] Member & undangan + accept page

## Catatan

- Rute: `/employer`, `/employer/company`, `/employer/jobs`,
  `/employer/jobs/new`, `/employer/jobs/:id/edit`,
  `/employer/jobs/:id/applicants`, `/employer/members`; halaman terima undangan
  publik di `/invitations/:token`.
- Karena belum ada pengiriman email, token undangan ditampilkan sebagai tautan
  di halaman Anggota untuk dibagikan manual.
- Aksi berbahaya (archive/hapus/nonaktifkan anggota) memakai konfirmasi
  `window.confirm`.
- Timeline status pelamar ditampilkan di sisi employer sebagai badge + catatan
  pada dialog; riwayat lengkap ada di sisi seeker (FE-3).
- Verifikasi: `pnpm lint` 0 error, `pnpm build` sukses.

## Perbaikan 2026-10-06

- Bug 403 saat onboarding: `GET /companies/me` backend kini mengembalikan 404
  saat user belum punya company (guard dilepas) sehingga form pembuatan profil
  tampil; halaman employer juga menoleransi 403/404 sebagai "belum punya
  company".
- Form profil perusahaan: nama owner wajib diisi dan otomatis di-prefill dari
  nama akun, mencegah `POST /companies` gagal karena field `firstName` kosong.
