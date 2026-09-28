'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Bookmark, Share2, Eye, Clock, Lock, ChevronLeft, ChevronRight, ListOrdered, BookCheck, Type, Sun, Moon, Coffee } from 'lucide-react';
import BookmarkButton from '@/components/ui/BookmarkButton';
import ShareButtons from '@/components/ui/ShareButtons';
import AuthorCard from '@/components/ui/AuthorCard';
import CommentSection from '@/components/ui/CommentSection';
import PremiumGate from '@/components/ui/PremiumGate';
import ContentProtection from '@/components/ui/ContentProtection';

const API = process.env.NEXT_PUBLIC_API_URL || '';

interface Article {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPremium: boolean;
  publishedAt?: string;
  viewCount: number;
  editorName?: string;
}

interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

interface Chapter {
  index: number;
  title: string;
  content: string;
  isLocked: boolean;
}

export default function NovelView({
  article,
  author = null,
  kategoriName = 'Novel',
}: {
  article: Article;
  author?: Author | null;
  kategoriName?: string;
}) {
  const [activeTab, setActiveTab] = useState<'baca' | 'bab' | 'sinopsis'>('baca');
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);

  // Pengaturan Reader Imersif (Khas KBM App / GoodNovel)
  const [fontSize, setFontSize] = useState<number>(18); // 16, 18, 20, 22
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');

  // Parser Bab Otomatis dari konten novel
  const chapters: Chapter[] = useMemo(() => {
    const rawContent = article.content || '';

    // Cek apakah konten memuat pemisah bab (misal: "<h2>Bab", "<h3>Bab", "<h2>Bagian", "## Bab", dll)
    const chapterSplits = rawContent.split(/(?=<h[23][^>]*>(?:Bab|Bagian|Episode|\d+)[^<]*<\/h[23]>)/i);

    if (chapterSplits.length > 1) {
      return chapterSplits.map((chunk, idx) => {
        // Ambil judul bab dari tag header jika ada
        const match = chunk.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
        const title = match ? match[1].replace(/<[^>]+>/g, '').trim() : `Bab ${idx + 1}`;
        // Bab 1 biasanya gratis, bab selanjutnya mengikuti status isPremium
        const isLocked = article.isPremium && idx > 0;
        return {
          index: idx,
          title: title || `Bab ${idx + 1}`,
          content: chunk,
          isLocked,
        };
      });
    }

    // Jika naskah berupa satu bab utuh
    return [
      {
        index: 0,
        title: article.title,
        content: rawContent,
        isLocked: article.isPremium,
      },
    ];
  }, [article.content, article.title, article.isPremium]);

  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  const themeClasses = {
    light: 'bg-white text-tinta-900 border-tinta-200/70',
    sepia: 'bg-[#FAF6EE] text-[#2c2416] border-[#e8dfcf]',
    dark: 'bg-[#18181B] text-[#E4E4E7] border-white/10',
  };

  const readingBg = {
    light: 'bg-white text-tinta-900',
    sepia: 'bg-[#FAF6EE] text-[#2C2416]',
    dark: 'bg-[#18181B] text-[#E4E4E7]',
  };

  const wordCount = useMemo(() => {
    return article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  }, [article.content]);

  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const tanggalTerbit = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const scrollToReader = (chapterIndex = 0) => {
    setCurrentChapterIdx(chapterIndex);
    setActiveTab('baca');
    const el = document.getElementById('novel-reader-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10">
      {/* ── 1. BOOK SHOWCASE HERO (KBM & GoodNovel Style) ── */}
      <section className="relative overflow-hidden rounded-3xl bg-tinta-950 p-6 sm:p-10 text-white shadow-2xl border border-white/10">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 20%, #c08d3c 0, transparent 40%), radial-gradient(circle at 90% 80%, #3b526d 0, transparent 40%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-8 items-start">
          {/* Cover Buku Vertikal 3D */}
          <div className="mx-auto md:mx-0 w-full max-w-[240px]">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.15)] group">
              {article.coverImage ? (
                <img
                  src={`${API}${article.coverImage}`}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emas-800 via-tinta-900 to-tinta-950 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-emas-400 font-serif text-5xl mb-3 font-bold">
                    {article.title.charAt(0)}
                  </span>
                  <p className="font-serif text-lg font-semibold text-white/90 line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-xs text-emas-300/80 mt-2">{kategoriName}</p>
                </div>
              )}
              {/* Efek Garis Tulang Buku (Book Spine) */}
              <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/40 via-white/15 to-transparent pointer-events-none" />
              {/* Badge Akses */}
              <div className="absolute top-3 right-3">
                {article.isPremium ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emas-500 text-tinta-950 shadow-md">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-md">
                    Gratis
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info & Metadata Novel */}
          <div className="flex flex-col justify-between h-full space-y-5">
            <div>
              {/* Tag Kategori & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emas-400/20 text-emas-300 border border-emas-400/30">
                  {kategoriName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-tinta-200">
                  {chapters.length > 1 ? `${chapters.length} Bab Serial` : 'Naskah Lengkap'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-tinta-200">
                  {readTimeMinutes} menit baca
                </span>
              </div>

              {/* Judul Novel */}
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {article.title}
              </h1>

              {/* Penulis & Editor */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-tinta-300">
                {author && (
                  <Link
                    href={`/authors/${author.id}`}
                    className="flex items-center gap-2 text-white hover:text-emas-300 transition-colors"
                  >
                    {author.avatar ? (
                      <img
                        src={`${API}${author.avatar}`}
                        alt={author.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emas-400/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emas-700 text-white font-bold flex items-center justify-center text-xs">
                        {author.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-white">{author.name}</span>
                    <span className="text-xs text-emas-300 bg-white/10 px-2 py-0.5 rounded-full">Penulis</span>
                  </Link>
                )}
                {article.editorName && (
                  <span className="text-tinta-400 text-xs">
                    Editor: <strong className="text-tinta-200">{article.editorName}</strong>
                  </span>
                )}
                {tanggalTerbit && (
                  <span className="text-tinta-400 text-xs">Rilis: {tanggalTerbit}</span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-tinta-400">
                  <Eye className="w-3.5 h-3.5" /> {article.viewCount} pembaca
                </span>
              </div>

              {/* Sinopsis Singkat */}
              {article.excerpt && (
                <div className="mt-5 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <p className="font-serif text-sm sm:text-base leading-relaxed text-tinta-200 italic line-clamp-3">
                    &ldquo;{article.excerpt}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Bilah Tombol Aksi KBM/GoodNovel */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToReader(0)}
                className="btn-emas px-7 py-3 text-base font-semibold shadow-lg shadow-emas-900/40 hover:scale-[1.02] transition-transform flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Mulai Membaca
              </button>

              <button
                onClick={() => {
                  setActiveTab('bab');
                  const el = document.getElementById('novel-tabs-area');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn border border-white/20 text-white hover:bg-white/10 px-5 py-3 text-sm flex items-center gap-2"
              >
                <ListOrdered className="w-4 h-4" />
                Daftar Bab ({chapters.length})
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <BookmarkButton articleId={article.id} />
                <ShareButtons title={article.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TAB NAVIGASI KONTEN (BACA / DAFTAR BAB / SINOPSIS) ── */}
      <div id="novel-tabs-area" className="border-b border-tinta-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('baca')}
            className={`pb-3 text-base font-semibold transition-all relative ${
              activeTab === 'baca'
                ? 'text-emas-700'
                : 'text-tinta-500 hover:text-tinta-900'
            }`}
          >
            Ruang Membaca
            {activeTab === 'baca' && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emas-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bab')}
            className={`pb-3 text-base font-semibold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'bab'
                ? 'text-emas-700'
                : 'text-tinta-500 hover:text-tinta-900'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            Daftar Bab & Episode ({chapters.length})
            {activeTab === 'bab' && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emas-600 rounded-full" />
            )}
          </button>

          {article.excerpt && (
            <button
              onClick={() => setActiveTab('sinopsis')}
              className={`pb-3 text-base font-semibold transition-all relative ${
                activeTab === 'sinopsis'
                  ? 'text-emas-700'
                  : 'text-tinta-500 hover:text-tinta-900'
              }`}
            >
              Sinopsis Lengkap
              {activeTab === 'sinopsis' && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emas-600 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── 3. ISI KONTEN BERDASARKAN TAB ── */}
      {activeTab === 'bab' && (
        <section className="rounded-2xl border border-tinta-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-tinta-200/70">
            <div>
              <h3 className="font-serif text-xl font-bold text-tinta-900">Daftar Bab Novel</h3>
              <p className="text-xs text-tinta-500 mt-1">Pilih bab untuk langsung memulai membaca.</p>
            </div>
            <span className="text-xs font-medium text-tinta-600 bg-tinta-100 px-3 py-1 rounded-full">
              Total {chapters.length} Bab
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => scrollToReader(idx)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  currentChapterIdx === idx
                    ? 'border-emas-500 bg-emas-50/50 shadow-sm'
                    : 'border-tinta-200/70 hover:border-emas-300 hover:bg-tinta-50/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    currentChapterIdx === idx ? 'bg-emas-700 text-white' : 'bg-tinta-100 text-tinta-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      currentChapterIdx === idx ? 'text-emas-800' : 'text-tinta-900'
                    }`}>
                      {chap.title}
                    </p>
                    <p className="text-[11px] text-tinta-500 mt-0.5">
                      {chap.isLocked ? '⭐ Bab Premium' : '🔓 Bab Bebas'}
                    </p>
                  </div>
                </div>

                {chap.isLocked ? (
                  <span className="text-xs bg-yellow-100 text-yellow-800 p-1.5 rounded-lg flex items-center" title="Bab Premium">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    Buka
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'sinopsis' && article.excerpt && (
        <section className="rounded-2xl border border-tinta-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-tinta-900 mb-4">Sinopsis Karya</h3>
          <p className="font-serif text-lg leading-relaxed text-tinta-700 whitespace-pre-line">
            {article.excerpt}
          </p>
          <div className="mt-8 pt-6 border-t border-tinta-200/70">
            <button
              onClick={() => scrollToReader(0)}
              className="btn-emas px-6 py-2.5 text-sm"
            >
              Mulai Membaca Bab 1 &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── 4. RUANG BACA IMERSIF DENGAN PENGATURAN READER ── */}
      {activeTab === 'baca' && (
        <div id="novel-reader-area" className="space-y-6">
          {/* Toolbar Pengaturan Reader (Font, Ukuran, Tema Kertas) */}
          <div className={`sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-md backdrop-blur-lg ${themeClasses[theme]}`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Mode Baca
              </span>

              {/* Pemilih Ukuran Font */}
              <div className="flex items-center gap-1 border-l pl-3 border-current/20">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="px-2 py-1 rounded text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10"
                  title="Perkecil Teks"
                >
                  A-
                </button>
                <span className="text-xs font-mono font-medium px-1">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                  className="px-2 py-1 rounded text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10"
                  title="Perbesar Teks"
                >
                  A+
                </button>
              </div>

              {/* Pemilih Jenis Font */}
              <div className="flex items-center gap-1 border-l pl-3 border-current/20">
                <button
                  onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                  className="px-2.5 py-1 rounded text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-1"
                >
                  <Type className="w-3.5 h-3.5" />
                  {fontFamily === 'serif' ? 'Serif' : 'Sans'}
                </button>
              </div>
            </div>

            {/* Pemilih Tema Warna (Terang, Sepia Kertas, Mode Malam) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
                  theme === 'light' ? 'bg-white text-tinta-950 shadow font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                title="Tema Putih Bersih"
              >
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">Terang</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
                  theme === 'sepia' ? 'bg-[#EDE4D0] text-[#2c2416] shadow font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                title="Tema Kertas Hangat (Sepia)"
              >
                <Coffee className="w-4 h-4" />
                <span className="hidden sm:inline">Kertas</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
                  theme === 'dark' ? 'bg-[#27272A] text-white shadow font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                title="Tema Mode Malam"
              >
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Malam</span>
              </button>
            </div>
          </div>

          {/* Area Baca Teks Novel */}
          <section className={`rounded-3xl border p-6 sm:p-12 lg:p-16 shadow-lg transition-colors ${readingBg[theme]} ${themeClasses[theme]}`}>
            {/* Header Bab yang sedang aktif */}
            <div className="mb-8 pb-6 border-b border-current/15 text-center">
              <p className="text-xs uppercase tracking-widest font-semibold opacity-70 mb-2">
                {article.title}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                {currentChapter.title}
              </h2>
              {chapters.length > 1 && (
                <p className="text-xs opacity-60 mt-2">
                  Bab {currentChapterIdx + 1} dari {chapters.length} Bab
                </p>
              )}
            </div>

            {/* Isi Bacaan */}
            <ContentProtection>
              {currentChapter.isLocked ? (
                <PremiumGate>
                  <div
                    className={`prose max-w-none leading-relaxed transition-all ${
                      fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                    }`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                    dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                  />
                </PremiumGate>
              ) : (
                <div
                  className={`prose max-w-none leading-relaxed transition-all ${
                    fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                  }`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                  dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                />
              )}
            </ContentProtection>

            {/* Navigasi Bab (Sebelumnya / Selanjutnya) */}
            {chapters.length > 1 && (
              <div className="mt-14 pt-8 border-t border-current/15 flex items-center justify-between gap-4">
                <button
                  disabled={currentChapterIdx === 0}
                  onClick={() => scrollToReader(currentChapterIdx - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-current/20 text-sm font-medium disabled:opacity-30 disabled:pointer-events-none hover:bg-current/5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Bab Sebelumnya
                </button>

                <div className="text-xs opacity-60 hidden sm:block">
                  Bab {currentChapterIdx + 1} / {chapters.length}
                </div>

                <button
                  disabled={currentChapterIdx === chapters.length - 1}
                  onClick={() => scrollToReader(currentChapterIdx + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emas-700 text-white text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-emas-800 transition-all shadow-md"
                >
                  Bab Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── 5. KARTU PROFIL PENULIS & KOLOM KOMENTAR ── */}
      <div className="max-w-4xl mx-auto space-y-10 pt-6">
        <AuthorCard author={author} />
        <CommentSection articleId={article.id} />
      </div>
    </div>
  );
}
