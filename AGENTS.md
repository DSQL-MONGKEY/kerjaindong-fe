# AGENTS.md — Kerjaindong Web

> React 19 · Vite 8 · TypeScript strict · Tailwind CSS v4 · React Router v8 ·
> i18next (id/en) · TanStack Query + RHF + Zod (sejak FE-1)

Panduan untuk coding agent di repo `kerjaindong-fe` (frontend portal lowongan
kerja Kerjaindong). Dokumentasi per fase ada di `docs/`.

## Perintah

```
pnpm install
pnpm dev        # Vite dev server, port 3100 (strictPort; sesuai CORS backend)
pnpm build      # tsc -b && vite build
pnpm lint       # eslint .
```

Sebelum menyatakan tugas selesai: `pnpm lint && pnpm build` harus hijau.

## Environment

`.env` **tidak di-commit** (lihat `.gitignore`). Salin dari `.env.example`:

| Variabel | Keterangan |
|---|---|
| `VITE_API_BASE_URL` | Base URL API backend, default `http://localhost:3000/api/v1` |

Backend: repo `kerjaindong-api` (NestJS, Supabase). CORS backend sudah memuat
`http://localhost:3100`.

## Struktur folder

```
src/
├── App.tsx                  # route map (satu-satunya tempat registrasi route)
├── main.tsx                 # providers: Theme, Language, QueryClient, helmet
├── index.css                # Tailwind v4 @theme tokens + @utility + override pihak ketiga
├── pages/                   # komponen level route (PascalCase, default export)
│   ├── Home.tsx             # landing placeholder (FE-2 diisi lowongan)
│   ├── AuthPages/           # SignIn, SignUp, AuthPageLayout
│   └── OtherPage/           # NotFound
├── components/
│   ├── ui/                  # primitives: alert, avatar, badge, button, dropdown, modal, table
│   ├── form/                # primitives: Form, Label, Select, MultiSelect, input/, switch, date-picker
│   ├── common/              # BrandMark, PageMeta, PageBreadCrumb, ComponentCard, ScrollToTop,
│   │                        #   ThemeToggleButton, ThemeTogglerTwo, GridShape
│   ├── auth/                # SignInForm, SignUpForm
│   └── header/              # NotificationDropdown, UserDropdown
├── layout/                  # AppLayout (shell dashboard), AppSidebar, AppHeader, Backdrop
├── context/                 # ThemeContext, SidebarContext, LanguageContext
├── hooks/                   # useModal, useGoBack, useClickOutside
├── i18n/                    # index.ts (bootstrap), languages.ts
├── locales/                 # id/common.json, en/common.json
├── icons/                   # .svg + index.ts barrel (SVGR named export ReactComponent)
└── utils/                   # cn()
```

## Konvensi

### Routing
- Semua route didaftarkan di `src/App.tsx`. Jangan membuat router lain.
- Layout: halaman publik memakai header/footer publik (FE-2); area dashboard
  memakai `AppLayout` (sidebar + header).
- Guard peran (`ProtectedRoute`, `RoleRoute`) ditambahkan pada FE-1. Role:
  `JOB_SEEKER`, `EMPLOYER`, `SYS_ADMIN` (dari `GET /users/me`).
- File halaman PascalCase dengan default export.

### Komponen & styling
- Tailwind v4; **jangan** membuat `tailwind.config`. Token di `src/index.css`
  (`brand`, `gray`, `success`, `error`, `warning`, `font-outfit`, `shadow-theme-*`).
- Dark mode class-based: setiap elemen styled wajib punya varian `dark:`.
- **CSS logical properties wajib** (dukung RTL): `ms-*`/`me-*`, `ps-*`/`pe-*`,
  `start-*`/`end-*`, `border-s-*`/`border-e-*`, `text-start`/`text-end`.
- Ikon: tambahkan `.svg` ke `src/icons/` + export di `src/icons/index.ts`
  (SVGR). Jangan inline SVG baru.
- Branding: gunakan `BrandMark` (`src/components/common/BrandMark.tsx`) —
  wordmark sementara sampai aset logo resmi tersedia.
- SEO: setiap halaman merender `<PageMeta title=... description=... />` sebagai
  elemen pertama.
- Modal memakai `useModal` + `<Modal>`; jangan menambah state global baru tanpa
  kebutuhan jelas (pakai context yang ada).

### i18n
- Locale aktif: `id` (default) dan `en`; satu namespace `common`.
- Semua teks user-facing lewat `t()`; tambahkan key ke **kedua** file
  `src/locales/{id,en}/common.json`.
- Organisasi key per fitur: `t("jobs.filters.employmentType")` dsb.

### Data & API (sejak FE-1)
- HTTP client tunggal di `src/lib/http.ts` (fetch native, `credentials:"include"`):
  unwrap `{ success, data }` dan passthrough `{ message, data }`, normalisasi
  error `{ statusCode, message }`, auto-refresh sekali pada 401.
- Access token disimpan **in-memory** (`src/lib/token-store.ts`); refresh token
  di cookie `httpOnly` milik backend — jangan menyimpan token di localStorage.
- Server state via TanStack Query (key per resource + invalidasi setelah mutasi);
  form via React Hook Form + Zod.
- Endpoint & payload backend: `kerjaindong-api/docs/04-api-endpoints.md`.

## Don'ts

- Jangan install dependency baru tanpa persetujuan user.
- Jangan hapus `LICENSE.md` (atribusi MIT TailAdmin wajib dipertahankan).
- Jangan hardcode warna hex/pixel di `className` (kecuali opsi chart ApexCharts
  mengikuti palet `@theme`).
- Jangan pakai CSS-in-JS/CSS Modules/styled-components.
- Jangan menaruh halaman di luar `src/pages/` atau route di luar `src/App.tsx`.
- Jangan menghidupkan kembali halaman/komponen demo template.

## Fase & dokumentasi

Pelacakan implementasi per fitur ada di `docs/` (`FE-00` s/d `FE-06`).
Perbarui file fase terkait (status + catatan deviasi) setiap menyelesaikan
pekerjaan pada fase tersebut.
