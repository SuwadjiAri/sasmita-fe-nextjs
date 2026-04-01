# Commit Plan — sasmita-web Frontend

## Commit #1: `init: Next.js project setup with TypeScript, Tailwind, yarn`

Files:
- `package.json`
- `yarn.lock`
- `tsconfig.json`
- `next.config.ts`
- `next-env.d.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.env.local`
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `src/app/globals.css`

---

## Commit #2: `feat: add API client, types, and auth store`

Files:
- `src/lib/api.ts`
- `src/types/index.ts`
- `src/stores/auth-store.ts`

---

## Commit #3: `feat(ui): add layout components and reusable UI`

Files:
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/TiptapEditor.tsx`
- `src/components/ui/BookmarkButton.tsx`
- `src/components/ui/CommentSection.tsx`
- `src/components/ui/PremiumGate.tsx`

---

## Commit #4: `feat: add root layout and route group layouts`

Files:
- `src/app/layout.tsx`
- `src/app/(public)/layout.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(dashboard)/layout.tsx`

---

## Commit #5: `feat(public): add public pages (home, articles, categories, search, subscription, authors)`

Files:
- `src/app/(public)/page.tsx`
- `src/app/(public)/articles/[slug]/page.tsx`
- `src/app/(public)/articles/[slug]/ArticleContent.tsx`
- `src/app/(public)/categories/page.tsx`
- `src/app/(public)/categories/[slug]/page.tsx`
- `src/app/(public)/search/page.tsx`
- `src/app/(public)/subscription/page.tsx`
- `src/app/(public)/authors/[id]/page.tsx`

---

## Commit #6: `feat(auth): add login and register pages`

Files:
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

---

## Commit #7: `feat(dashboard): add member dashboard pages`

Files:
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/dashboard/articles/page.tsx`
- `src/app/(dashboard)/dashboard/articles/create/page.tsx`
- `src/app/(dashboard)/dashboard/articles/[id]/edit/page.tsx`
- `src/app/(dashboard)/dashboard/bookmarks/page.tsx`
- `src/app/(dashboard)/dashboard/subscription/page.tsx`
- `src/app/(dashboard)/dashboard/statistics/page.tsx`
- `src/app/(dashboard)/dashboard/notifications/page.tsx`
- `src/app/(dashboard)/dashboard/profile/page.tsx`

---

## Commit #8: `feat(dashboard): add redaksi and admin pages`

Files:
- `src/app/(dashboard)/dashboard/reviews/page.tsx`
- `src/app/(dashboard)/dashboard/admin/users/page.tsx`
- `src/app/(dashboard)/dashboard/admin/categories/page.tsx`
- `src/app/(dashboard)/dashboard/admin/ads/page.tsx`
