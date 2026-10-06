# FE-00 — Branding & Cleanup Template

**Status:** ✅ Selesai

## Tujuan

Membersihkan boilerplate demo template TailAdmin React dan menggantinya dengan
branding **Kerjaindong**, sehingga menyisakan shell aplikasi yang bersih sebagai
fondasi fase berikutnya.

## Scope

- Hapus seluruh halaman & komponen demo template.
- Pertahankan design-system primitives, ikon, layout shell, konteks, dan lisensi.
- Rebrand: nama paket, HTML meta, favicon, wordmark, locale default Indonesia.
- Konfigurasi dev server (port 3100, cocok dengan CORS backend) dan env API.

## Yang dihapus

| Kategori | Item |
|---|---|
| Halaman demo | `pages/UiElements/*`, `pages/Tables`, `pages/Forms`, `pages/Charts`, `pages/Dashboard`, `pages/Calendar.tsx`, `pages/UserProfiles.tsx`, `pages/OtherPage/Blank.tsx` |
| Komponen demo | `components/ecommerce/*`, `components/calendar/*`, `components/charts/*`, `components/tables/*`, `components/UserProfile/*`, `components/form/form-elements/*`, `components/form/group-input/*`, `components/common/{ChartTab,VectorMap}.tsx`, `components/ui/{images,videos}/*`, `layout/SidebarWidget.tsx` |
| Aset demo | `public/images/{brand,product,cards,chat,carousel,grid-image,task,video-thumb,country,icons,logo}`, `banner.png`, `favicon.png`, `package-lock.json` |

## Yang dipertahankan

- `LICENSE.md` (wajib, atribusi MIT TailAdmin).
- Primitives: `components/ui/{alert,avatar,badge,button,dropdown,modal,table}`,
  `components/form/*`, `icons/*` + barrel SVGR.
- Common: `BrandMark` (baru), `PageMeta`, `PageBreadCrumb`, `ComponentCard`,
  `ScrollToTop`, `ThemeToggleButton`, `ThemeTogglerTwo`, `GridShape`.
- Layout: `AppLayout`, `AppSidebar`, `AppHeader`, `Backdrop`.
- Konteks: `ThemeContext`, `SidebarContext`, `LanguageContext`.
- Aset yang masih dipakai: `public/images/{error,shape,user}`, `favicon.ico`.

## File yang disentuh

| File | Perubahan |
|---|---|
| `src/components/common/BrandMark.tsx` | **Baru** — wordmark "Kerjaindong" (sementara, mudah diganti saat aset logo siap) |
| `src/pages/Home.tsx` | **Baru** — landing placeholder ber-branding (diisi pada FE-2) |
| `src/App.tsx` | Ditulis ulang — route `/`, `/signin`, `/signup`, `*` |
| `src/layout/AppSidebar.tsx` | Ditulis ulang — nav minimal ("Beranda"), BrandMark, animasi submenu CSS grid, tanpa SidebarWidget |
| `src/layout/AppHeader.tsx` | Namespace i18n diperbaiki (`header.*`), BrandMark mobile |
| `src/components/header/UserDropdown.tsx` | Ditulis ulang — placeholder statis + pemilih bahasa (di-wire auth pada FE-1) |
| `src/pages/AuthPages/AuthPageLayout.tsx` | Wordmark + tagline Kerjaindong |
| `src/pages/AuthPages/{SignIn,SignUp}.tsx` | PageMeta Kerjaindong |
| `src/pages/OtherPage/NotFound.tsx` | Rebrand + i18n |
| `src/i18n/index.ts`, `src/i18n/languages.ts` | Locale `id` (default) + `en`, dukungan tipe `Locale` |
| `src/icons/flag-id.svg`, `src/icons/index.ts` | Ikon bendera Indonesia |
| `src/locales/{id,en}/common.json` | Kamus baru yang ramping (brand, sidebar, header, userDropdown, home, notFound) |
| `src/context/{ThemeContext,LanguageContext}.tsx` | Refactor agar lolos rule `react-hooks/set-state-in-effect`; LanguageContext memakai sumber locale bersama |
| `src/svg.d.ts` | Ganti `require()` dengan `import type` |
| `index.html`, `package.json`, `vite.config.ts`, `.env(.example)`, `.gitignore`, `README.md`, `AGENTS.md` | Rebrand, port 3100, env, dokumentasi |

## Acceptance criteria

- [x] Tidak ada halaman/komponen/aset demo yang tersisa (kecuali aset error/shape/user).
- [x] Branding "Kerjaindong" tampil (title, favicon, wordmark, landing, auth, 404).
- [x] Locale default `id`, tersedia `en`, dropdown bahasa berfungsi.
- [x] Dev server port 3100 (strict) sesuai `CORS_ORIGINS` backend.
- [x] `pnpm lint` 0 error, `pnpm build` sukses.

## Catatan

- 3 warning `react-refresh/only-export-components` pada context files adalah
  bawaan pola context; tidak mengganggu build.
- Tombol/route dashboard belum ada; ditambahkan pada FE-1.
- `README.md` template diganti; atribusi lisensi tetap di `LICENSE.md`.
