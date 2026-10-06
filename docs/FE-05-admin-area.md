# FE-05 — Area Admin (Backoffice)

**Status:** ✅ Selesai

## Tujuan

Backoffice untuk role `SYS_ADMIN`: verifikasi perusahaan, kelola pengguna,
moderasi lowongan, dan audit log.

## Scope

- Verifikasi company: list + filter status/verifikasi, aksi VERIFIED/REJECTED/PENDING + catatan.
- Users: pencarian, suspend/reactivate (konfirmasi), indikator role.
- Moderasi job: list + filter status/company, aksi PAUSED/ARCHIVED/PUBLISHED.
- Audit log: tabel dengan filter entityType/entityId/actor + pagination.

## Endpoint backend

| Method & path | Kegunaan |
|---|---|
| `GET /admin/companies`, `PATCH /admin/companies/:id/verification` | Verifikasi |
| `GET /admin/users`, `PATCH /admin/users/:id/status` | Kelola user |
| `GET /admin/jobs`, `PATCH /admin/jobs/:id/status` | Moderasi |
| `GET /admin/audit-logs` | Audit trail |

## File yang disentuh (rencana)

```
src/pages/Admin/{Companies,Users,Jobs,AuditLogs}.tsx
src/components/admin/{VerificationDialog,UserStatusDialog,JobModerationDialog,AuditLogTable}.tsx
src/hooks/{useAdminCompanies,useAdminUsers,useAdminJobs,useAuditLogs}.ts
src/layout/AppSidebar.tsx (menu admin)
src/App.tsx (rute /admin/*)
```

## Acceptance criteria

- [x] Hanya SYS_ADMIN yang bisa mengakses (RoleRoute).
- [x] Setiap aksi memakai dialog konfirmasi + catatan opsional.
- [x] Tabel audit menampilkan actor, aksi, entity, waktu.
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Checklist

- [x] Verifikasi company
- [x] Kelola user
- [x] Moderasi job
- [x] Audit log

## Catatan

- Rute: `/admin` (redirect ke `/admin/companies`), `/admin/companies`,
  `/admin/users`, `/admin/jobs`, `/admin/audit-logs`.
- Dialog aksi generik (`AdminActionDialog`) mendukung opsi status + catatan dan
  menampilkan pesan error backend (mis. tidak bisa menonaktifkan diri sendiri /
  SYS_ADMIN terakhir).
- Audit log menampilkan `entityId` terpotong 8 karakter (UUID penuh tersedia
  dari API).
- Verifikasi: `pnpm lint` 0 error, `pnpm build` sukses.
