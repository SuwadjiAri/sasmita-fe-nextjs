# QA & Integrasi FE-BE Summary — SASMITA.COM

## Status: Selesai
**Tanggal:** 3-4 April 2026

---

## 1. Backend API (sasmita-api)

### Deployment
- **URL:** https://api-devsasmita.cipangallery.my.id
- **Hosting:** Shared hosting cPanel (Rumahweb)
- **Auto Deploy:** GitHub Actions via FTP
- **Database:** MySQL (cipw9966_sasmita_db)
- **Migration:** Web-based via `/migrate.php?key=SECRET&action=migrate`

### Endpoints (45+)

#### Public (tanpa auth)
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | /health | Health check |
| POST | /auth/register | Registrasi |
| POST | /auth/login | Login (JWT) |
| POST | /auth/forgot-password | Generate reset token |
| POST | /auth/reset-password | Reset password |
| GET | /articles | List artikel published |
| GET | /articles/{slug} | Detail artikel |
| GET | /categories | List kategori |
| GET | /tags | List tag |
| GET | /articles/{id}/tags | Tag artikel |
| GET | /articles/{articleId}/comments | Komentar artikel |
| GET | /users/{id} | Profil penulis |
| GET | /subscription-plans | Paket langganan |
| GET | /ads/active | Iklan aktif |
| POST | /subscription/notification | Webhook Midtrans |

#### Authenticated (JWT required)
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | /me | Profil sendiri |
| PUT | /me | Update profil |
| POST | /auth/change-password | Ganti password |
| POST | /articles | Buat artikel |
| PUT | /articles/{id} | Edit artikel |
| DELETE | /articles/{id} | Hapus artikel |
| POST | /articles/{id}/submit | Submit untuk review |
| GET | /my/articles | Karya sendiri |
| POST | /articles/{id}/tags | Sync tag |
| POST | /articles/{articleId}/comments | Tambah komentar |
| DELETE | /comments/{id} | Hapus komentar |
| GET | /my/bookmarks | List bookmark |
| POST | /articles/{id}/bookmark | Toggle bookmark |
| GET | /articles/{id}/bookmark | Cek bookmark |
| GET | /notifications | List notifikasi |
| PUT | /notifications/{id}/read | Tandai dibaca |
| PUT | /notifications/read-all | Tandai semua dibaca |
| POST | /subscriptions | Buat langganan |
| GET | /my/subscription | Status + riwayat langganan |
| GET | /my/stats | Statistik penulis |
| GET | /my/articles/{id}/stats | Statistik per artikel |
| GET | /my/portfolio/pdf | Export portofolio PDF |
| POST | /upload/image | Upload gambar |
| POST | /upload/pdf | Upload PDF |

#### Redaksi
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | /redaksi/reviews | Artikel pending review |
| POST | /redaksi/reviews/{articleId} | Review (approve/revisi/tolak) |

#### Admin
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | /admin/categories | Buat kategori |
| PUT | /admin/categories/{id} | Edit kategori |
| DELETE | /admin/categories/{id} | Hapus kategori |
| GET | /admin/users | List users |
| PUT | /admin/users/{id}/role | Update role |
| GET | /admin/ads | List slot iklan |
| POST | /admin/ads | Buat slot iklan |
| PUT | /admin/ads/{id} | Edit slot iklan |
| DELETE | /admin/ads/{id} | Hapus slot iklan |
| GET | /admin/plans | List paket langganan |
| POST | /admin/plans | Buat paket |
| PUT | /admin/plans/{id} | Edit paket |
| DELETE | /admin/plans/{id} | Hapus paket |

### Database (13 tabel)
users, categories, articles, reviews, comments, tags, article_tag, subscription_plans, subscriptions, ad_placements, bookmarks, notifications, password_resets

### Bug Fixes Selama QA
| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `now()` not found | Laravel helper, bukan PHP native | Ganti ke `date('Y-m-d H:i:s')` |
| JWT 401 pada PUT/DELETE | try-catch terlalu luas di JwtAuthMiddleware | Pisahkan JWT decode dan handler execution |
| `$args` parameter error | PHP-DI Slim Bridge tidak inject `array $args` | Ganti ke named parameters |
| Comment tanggal 1 Jan 1970 | `timestamps = false`, model tidak refresh | Tambah `$model->fresh()` setelah create |
| Vendor permission denied | ZIP extract tidak jaga permission folder | Fix via PHP script `chmod 755` rekursif |

---

## 2. Frontend (sasmita-web)

### Setup
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP Client:** Axios
- **Editor:** Tiptap
- **Icons:** Lucide React
- **Payment:** Midtrans Snap.js
- **Package Manager:** Yarn
- **Node.js:** v22 LTS

### Halaman (23 pages)

#### Public (SSR)
| Route | Halaman | Status |
|-------|---------|--------|
| `/` | Beranda — hero, kategori, artikel terbaru | ✅ Eye-catching |
| `/articles/{slug}` | Detail artikel + komentar + bookmark + premium gate + ads | ✅ Eye-catching |
| `/categories` | Daftar kategori dengan emoji dan gradient | ✅ Eye-catching |
| `/categories/{slug}` | Artikel per kategori dengan hero banner | ✅ Eye-catching |
| `/search` | Pencarian + artikel terbaru default | ✅ Eye-catching |
| `/subscription` | Paket langganan 3 styles + smart redirect | ✅ Eye-catching |
| `/authors/{id}` | Profil penulis dengan banner gradient | ✅ Eye-catching |

#### Auth
| Route | Halaman | Status |
|-------|---------|--------|
| `/login` | Login + link lupa password + logo clickable | ✅ Eye-catching |
| `/register` | Registrasi + validasi | ✅ Eye-catching |
| `/forgot-password` | 2-step reset password | ✅ Eye-catching |

#### Dashboard (CSR)
| Route | Halaman | Status |
|-------|---------|--------|
| `/dashboard` | Overview + stat cards + quick actions | ✅ Eye-catching |
| `/dashboard/articles` | Karya saya + status/premium badges + filter + pagination | ✅ Eye-catching |
| `/dashboard/articles/create` | Tulis artikel (Tiptap + cover + PDF + tag + premium toggle) | ✅ Eye-catching |
| `/dashboard/articles/{id}/edit` | Edit artikel | ✅ Eye-catching |
| `/dashboard/bookmarks` | Artikel bookmark | ✅ Eye-catching |
| `/dashboard/subscription` | Status + pilih paket + Midtrans + riwayat transaksi | ✅ Eye-catching |
| `/dashboard/statistics` | Statistik + export PDF | ✅ Eye-catching |
| `/dashboard/notifications` | Notifikasi color-coded + click redirect | ✅ Eye-catching |
| `/dashboard/profile` | Edit profil + ganti password | ✅ Eye-catching |
| `/dashboard/reviews` | Review artikel + preview konten + premium badge | ✅ Eye-catching |
| `/dashboard/admin/users` | Kelola pengguna + search + pagination | ✅ Eye-catching |
| `/dashboard/admin/categories` | CRUD kategori | ✅ Eye-catching |
| `/dashboard/admin/plans` | CRUD paket langganan | ✅ Eye-catching |
| `/dashboard/admin/ads` | CRUD slot iklan | ✅ Eye-catching |

### Reusable Components
| Component | Fungsi |
|-----------|--------|
| Toast | Notifikasi success/error/info (replace semua alert) |
| ConfirmModal | Dialog konfirmasi (replace semua confirm) |
| LoadingSpinner | Branded spinner dengan PenLine icon |
| EmptyState | Ilustrasi halaman kosong |
| Pagination | Page numbers + per-page selector |
| TiptapEditor | WYSIWYG editor dengan toolbar icons |
| BookmarkButton | Toggle bookmark dengan star icon |
| CommentSection | Form + list komentar chat-bubble style |
| PremiumGate | Paywall gradient dengan Crown icon |
| AdSlot | Render iklan aktif per posisi |

### UI/UX Features
- Navbar dark theme (slate-900) — konsisten semua kondisi
- Dashboard sidebar dark theme — kontras dengan main content
- Avatar dropdown (profile + logout) — tidak perlu scroll
- Bell notification badge di header + sidebar
- Pending review badge (kuning) di sidebar redaksi
- Cursor pointer global untuk semua button/link
- Stagger animation pada card lists
- Card hover effect (translateY + shadow)
- Responsive semua device (mobile + desktop)

### Bug Fixes Selama QA
| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Tiptap SSR error | `immediatelyRender` default true | Set `immediatelyRender: false` |
| Logout "Memuat..." stuck | Tidak redirect setelah logout | Tambah `router.push('/login')` |
| Hooks order error saat logout | useEffect setelah conditional return | Pindahkan semua hooks sebelum `if (!user) return` |
| Search tidak reset | `searched` state tidak direset saat clear | Reset `searched = false` saat input kosong |
| Navbar transparan tidak terbaca | Glass effect opacity terlalu rendah | Ganti ke dark navbar solid |
| Tailwind override cursor | Default cursor tidak berlaku | Tambah `!important` di globals.css |
| Midtrans redirect ke example.com | Finish URL belum di-set | Tambah callbacks.finish di Snap params |

---

## 3. Integrasi FE ↔ BE

### Payment Flow (Midtrans)
```
User pilih paket (public/dashboard)
    → ConfirmModal ("Yakin berlangganan?")
    → POST /subscriptions (create transaction)
    → Midtrans Snap popup (QRIS/VA/Credit Card)
    → Webhook → POST /subscription/notification
    → Status update → active
    → User akses artikel premium
```

### Article Flow
```
Penulis tulis artikel → status: draft
    → Klik "Ajukan" → status: pending
    → Redaksi review (baca konten, lihat premium badge)
        → Setujui → status: published → notifikasi hijau
        → Minta revisi → status: revision → notifikasi kuning
        → Tolak → status: draft → notifikasi merah
    → Penulis terima notifikasi → klik → redirect ke edit/articles
```

### Notification Flow
```
Redaksi review artikel
    → Backend create notification (type: review, reference: article)
    → Frontend badge count update (polling 30 detik)
    → User klik notifikasi → mark read + redirect ke artikel
```

### Subscription Check
```
User buka artikel premium
    → PremiumGate cek GET /my/subscription
    → has_active: true → tampil konten
    → has_active: false → gradient paywall + CTA langganan
```

---

## 4. Akun Test

| Email | Password | Role |
|-------|----------|------|
| admin@sasmita.com | admin123 | Admin + Redaksi |
| redaksi@sasmita.com | redaksi123 | Redaksi |
| penulis@unpam.ac.id | penulis123 | Member |

### Midtrans Sandbox Test Card
| Field | Value |
|-------|-------|
| Card Number | 4811 1111 1111 1114 |
| Expiry | 01/29 |
| CVV | 123 |
| OTP | 112233 |

---

## 5. Known Limitations
- Dark mode dihapus (incomplete, teks tenggelam)
- Hosting shared tidak support PUT/DELETE header secara native (fix: JWT middleware fallback)
- FTP deploy kadang timeout (fix: increase timeout 120s + workflow_dispatch)
- Proteksi konten (anti-copy, anti-screenshot) belum diimplementasikan
- Email notification belum ada (forgot password return token langsung)
