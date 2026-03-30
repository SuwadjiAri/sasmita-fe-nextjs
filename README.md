# SASMITA Web (Frontend)

Frontend untuk **SASMITA.COM** — Platform Literasi Digital Karya Sastra dan Akademik Mahasiswa, Prodi Sastra Indonesia, Universitas Pamulang.

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| HTTP Client | Axios |
| Rich Text Editor | Tiptap |
| Icons | Lucide React |
| Payment UI | Midtrans Snap.js |
| Package Manager | Yarn |
| Node.js | v22 LTS |

## Struktur Project

```
src/
├── app/
│   ├── (public)/           # Halaman publik (SSR) — Navbar + Footer
│   │   ├── page.tsx              # / — Beranda
│   │   ├── articles/[slug]/      # /articles/:slug — Detail artikel
│   │   ├── categories/           # /categories — Daftar kategori
│   │   ├── categories/[slug]/    # /categories/:slug — Artikel per kategori
│   │   ├── search/               # /search — Pencarian
│   │   ├── subscription/         # /subscription — Paket langganan
│   │   └── authors/[id]/         # /authors/:id — Profil penulis
│   │
│   ├── (auth)/             # Halaman auth — Split layout
│   │   ├── login/                # /login
│   │   └── register/             # /register
│   │
│   └── (dashboard)/        # Dashboard (CSR) — Sidebar + auth guard
│       └── dashboard/
│           ├── page.tsx          # /dashboard — Overview + stats
│           ├── articles/         # CRUD artikel (Tiptap editor)
│           ├── bookmarks/        # Artikel yang di-bookmark
│           ├── subscription/     # Status langganan + Midtrans
│           ├── statistics/       # Statistik + export PDF
│           ├── notifications/    # Notifikasi
│           ├── profile/          # Edit profil
│           ├── reviews/          # Review artikel (Redaksi)
│           └── admin/            # Kelola users, kategori, iklan (Admin)
│
├── components/
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # TiptapEditor, BookmarkButton, CommentSection, PremiumGate
│
├── lib/
│   └── api.ts              # Axios client + JWT interceptor
│
├── stores/
│   └── auth-store.ts       # Zustand auth state
│
└── types/
    └── index.ts            # TypeScript interfaces
```

## Setup

```bash
# 1. Clone
git clone git@github.com:project-work-sasindo/sasmita-fe-nextjs.git
cd sasmita-fe-nextjs

# 2. Install dependencies
yarn install

# 3. Copy environment
cp .env.example .env.local
# Edit .env.local → sesuaikan API URL dan Midtrans client key

# 4. Jalankan dev server
yarn dev
```

Frontend berjalan di `http://localhost:3000`

## Halaman (22 pages)

### Public (SSR — SEO friendly)
| Route | Halaman |
|-------|---------|
| `/` | Beranda — hero, kategori, artikel terbaru |
| `/articles/:slug` | Detail artikel + komentar + bookmark |
| `/categories` | Daftar kategori |
| `/categories/:slug` | Artikel dalam kategori |
| `/search` | Pencarian artikel |
| `/subscription` | Paket langganan |
| `/authors/:id` | Profil penulis |

### Auth
| Route | Halaman |
|-------|---------|
| `/login` | Login |
| `/register` | Registrasi |

### Dashboard (CSR — JWT protected)
| Route | Halaman | Role |
|-------|---------|------|
| `/dashboard` | Overview + statistik | Member |
| `/dashboard/articles` | Karya saya | Member |
| `/dashboard/articles/create` | Tulis artikel (Tiptap) | Member |
| `/dashboard/articles/:id/edit` | Edit artikel | Member |
| `/dashboard/bookmarks` | Artikel di-bookmark | Member |
| `/dashboard/subscription` | Status + bayar langganan | Member |
| `/dashboard/statistics` | Statistik + export PDF | Member |
| `/dashboard/notifications` | Notifikasi | Member |
| `/dashboard/profile` | Edit profil | Member |
| `/dashboard/reviews` | Review artikel pending | Redaksi |
| `/dashboard/admin/users` | Kelola pengguna | Admin |
| `/dashboard/admin/categories` | Kelola kategori | Admin |
| `/dashboard/admin/ads` | Kelola slot iklan | Admin |

## Koneksi ke Backend

Frontend terhubung ke backend API via environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Pastikan backend (`sasmita-api`) sudah berjalan sebelum menjalankan frontend.

## Project Work

**Universitas Pamulang — Prodi Sastra Indonesia**

| Nama | Peran |
|------|-------|
| Alya | Project Manager |
| Arif | Backend Developer |
| Herdiansyah | Frontend Developer |
