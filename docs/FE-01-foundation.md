# FE-01 — Fondasi: API Client, Auth, Guard, Routing

**Status:** ✅ Selesai

## Tujuan

Menghubungkan frontend ke backend: HTTP client, sesi login (access token +
refresh cookie), routing per role, dan utilitas data dasar.

## Scope

- Dependency baru: `@tanstack/react-query`, `react-hook-form`, `zod`,
  `@hookform/resolvers`.
- HTTP client + token store + query client.
- AuthContext: login/register/logout/me + auto-refresh 401.
- Guard: `ProtectedRoute`, `RoleRoute` (JOB_SEEKER / EMPLOYER / SYS_ADMIN).
- Layout publik (header + footer) dan integrasi dashboard ke `AppLayout`.
- Route map baru di `App.tsx`.
- Hook `useRegions` (cascade provinsi → kota).

## Endpoint backend

| Method & path | Kegunaan |
|---|---|
| `POST /auth/register` | Daftar akun (auto-login) |
| `POST /auth/login` | Login (identifier email/username) |
| `POST /auth/refresh` | Perpanjang access token (cookie httpOnly) |
| `POST /auth/logout` | Cabut sesi |
| `GET /users/me` | Identitas + roles + status profil |
| `GET /regions?level=&parentCode=` | Data wilayah (cascade) |

## File yang disentuh (rencana)

| File | Isi |
|---|---|
| `src/lib/http.ts` | Fetch wrapper: base URL env, `credentials:"include"`, unwrap `{success,data}`, normalisasi error, retry refresh sekali pada 401 |
| `src/lib/token-store.ts` | Access token in-memory + subscriber |
| `src/lib/query-client.ts` | QueryClient default (retry, staleTime) |
| `src/context/AuthContext.tsx` | State sesi + aksi login/register/logout |
| `src/components/auth/ProtectedRoute.tsx` | Redirect ke `/signin` bila belum login |
| `src/components/auth/RoleRoute.tsx` | Redirect bila role tidak sesuai |
| `src/hooks/useRegions.ts` | Query provinsi/kota |
| `src/layout/PublicLayout.tsx` | Header/footer halaman publik |
| `src/components/common/PublicHeader.tsx`, `PublicFooter.tsx` | Komponen layout publik |
| `src/App.tsx`, `src/main.tsx` | Providers + route map baru |
| `src/components/auth/SignInForm.tsx`, `SignUpForm.tsx` | Hubungkan ke AuthContext + i18n |
| `src/components/header/UserDropdown.tsx` | Identitas asli + logout |

## Acceptance criteria

- [x] Login/register/logout nyata ke backend; token hanya in-memory.
- [x] Reload halaman tetap login (boot via query `/users/me` + auto-refresh 401).
- [x] 401 pada request biasa otomatis refresh sekali, lalu retry; gagal → ke `/signin`.
- [x] Route dashboard terlindungi; role salah diarahkan ke dashboard miliknya.
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Catatan

- Backend sudah menaruh refresh token di cookie `httpOnly`; FE tidak menyimpan
  refresh token.
- Single-flight refresh (`refreshPromise`) mencegah banyak panggilan refresh
  berbarengan saat StrictMode/banyak request 401.
- Boot sesi memakai TanStack Query (`["auth","me"]`) sehingga tidak ada
  `setState` di dalam effect; `login`/`register` mengisi cache, `logout`
  mengosongkannya.
- Tombol Google/X dan "forgot password" bawaan template dihapus (belum ada
  dukungan backend).
- Button primitive ditambah prop `type` agar bisa dipakai sebagai submit.
- Diverifikasi: `pnpm lint` 0 error, `pnpm build` sukses, dev server 3100
  menyajikan aplikasi (title Kerjaindong).
