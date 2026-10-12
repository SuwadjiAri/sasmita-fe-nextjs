'use client';

import { useEffect, useState, useMemo } from 'react';
import { Mail, MapPin, Award, BookOpen, ShieldCheck, Users, Feather } from 'lucide-react';
import api from '@/lib/api';

interface EditorialMember {
  id: number;
  section: 'penanggung_jawab' | 'pimpinan_redaksi' | 'dewan_redaksi' | 'tata_usaha';
  name: string;
  role_title?: string;
  roleTitle?: string;
  sub_rubrik?: string | null;
  subRubrik?: string | null;
  affiliation?: string | null;
  email?: string | null;
  sort_order?: number;
  sortOrder?: number;
  is_active?: boolean;
  isActive?: boolean;
}

const defaultMembers: EditorialMember[] = [
  {
    id: 1,
    section: 'penanggung_jawab',
    name: 'Dewan Pembina & Pengarah',
    role_title: 'Penanggung Jawab Umum & Kelembagaan',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: 'pembina@smita.id',
    sort_order: 1,
  },
  {
    id: 2,
    section: 'pimpinan_redaksi',
    name: 'Dr. Misbah Priagung Nursalim, S.S., M.Pd.',
    role_title: 'Pemimpin Redaksi / Penanggung Jawab Redaksi',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: 'redaksi@smita.id',
    sort_order: 2,
  },
  {
    id: 3,
    section: 'dewan_redaksi',
    name: 'Tim Kurator Sastra Liris',
    role_title: 'Kurator Puisi & Puitika',
    sub_rubrik: 'Puisi',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 10,
  },
  {
    id: 4,
    section: 'dewan_redaksi',
    name: 'Tim Kurator Prosa Kreatif',
    role_title: 'Kurator Cerpen & Prosa Fiksi',
    sub_rubrik: 'Cerpen',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 11,
  },
  {
    id: 5,
    section: 'dewan_redaksi',
    name: 'Dewan Editor Esai Sastra',
    role_title: 'Editor Esai Sastra & Telaah Kritis',
    sub_rubrik: 'Esai',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 12,
  },
  {
    id: 6,
    section: 'dewan_redaksi',
    name: 'Dewan Editor Opini Budaya',
    role_title: 'Editor Opini Publik & Dialektika Kebudayaan',
    sub_rubrik: 'Opini',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 13,
  },
  {
    id: 7,
    section: 'dewan_redaksi',
    name: 'Dewan Kurator Resensi Buku',
    role_title: 'Kurator Resensi & Kritik Buku',
    sub_rubrik: 'Resensi',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 14,
  },
  {
    id: 8,
    section: 'dewan_redaksi',
    name: 'Dewan Kurator Serial Novel',
    role_title: 'Kurator Serial Novel & Karya Panjang',
    sub_rubrik: 'Novel',
    affiliation: 'Sarana Media Informasi dan Sastra',
    sort_order: 15,
  },
  {
    id: 9,
    section: 'tata_usaha',
    name: 'Sekretariat Redaksi',
    role_title: 'Administrasi, Sirkulasi & Naskah',
    sub_rubrik: 'Administrasi & Naskah',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: 'admin@smita.id',
    sort_order: 20,
  },
  {
    id: 10,
    section: 'tata_usaha',
    name: 'Divisi Teknologi & Tata Rancang',
    role_title: 'Teknis Portal & Tata Artistik',
    sub_rubrik: 'Teknis & Tata Rancang',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: 'support@smita.id',
    sort_order: 21,
  },
  {
    id: 11,
    section: 'tata_usaha',
    name: 'Divisi Hubungan Kemitraan & Distribusi',
    role_title: 'Kemitraan, Publikasi & Distribusi',
    sub_rubrik: 'Kemitraan & Distribusi',
    affiliation: 'Sarana Media Informasi dan Sastra',
    email: 'marketing@smita.id',
    sort_order: 22,
  },
];

export default function RedaksiPage() {
  const [members, setMembers] = useState<EditorialMember[]>(defaultMembers);

  useEffect(() => {
    let isMounted = true;
    api.get('/editorial')
      .then((res) => {
        if (isMounted && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setMembers(res.data.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const penanggungJawabList = useMemo(() => {
    return members.filter((m) => m.section === 'penanggung_jawab');
  }, [members]);

  const pimpinanRedaksiList = useMemo(() => {
    return members.filter((m) => m.section === 'pimpinan_redaksi');
  }, [members]);

  const dewanRedaksiList = useMemo(() => {
    return members.filter((m) => m.section === 'dewan_redaksi');
  }, [members]);

  const tataUsahaList = useMemo(() => {
    return members.filter((m) => m.section === 'tata_usaha');
  }, [members]);

  // Kelompokkan Dewan Redaksi berdasarkan sub_rubrik
  const dewanRedaksiByRubrik = useMemo(() => {
    const map = new Map<string, EditorialMember[]>();
    dewanRedaksiList.forEach((item) => {
      const rubrik = item.sub_rubrik || item.subRubrik || 'Umum';
      const list = map.get(rubrik) || [];
      list.push(item);
      map.set(rubrik, list);
    });
    return Array.from(map.entries());
  }, [dewanRedaksiList]);

  return (
    <div className="bg-latar min-h-screen">
      {/* Header */}
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="label-mikro text-emas-700">Media Sastra & Literasi Publik</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-tinta-900 sm:text-4xl">
            Susunan Dewan Redaksi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg leading-relaxed text-tinta-600">
            SMITA.ID diterbitkan sebagai wadah apresiasi, kurasi independen, dan publikasi opini publik,
            esai, serta karya sastra sebagai ruang bersuara generasi cakap-tulis di bawah naungan Sarana Media Informasi dan Sastra.
          </p>
        </div>
      </header>

      {/* Konten Struktur Redaksi */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-10">

          {/* 1. PENANGGUNG JAWAB (Paling Atas) */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <ShieldCheck className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Penanggung Jawab</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {penanggungJawabList.map((item) => (
                <div key={item.id} className="rounded-xl border border-tinta-100 bg-latar/30 p-5">
                  <p className="label-mikro text-tinta-500">{item.role_title || item.roleTitle || 'Penanggung Jawab'}</p>
                  <p className="mt-1 text-base font-semibold text-tinta-900">{item.name}</p>
                  <p className="text-sm text-tinta-600">{item.affiliation || 'Sarana Media Informasi dan Sastra'}</p>
                  {item.email && (
                    <p className="mt-1 text-xs text-emas-800 font-medium inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {item.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 2. PIMPINAN REDAKSI */}
          <section className="rounded-2xl border border-emas-300 bg-gradient-to-br from-white to-amber-50/30 p-8 shadow-xs ring-1 ring-emas-300/40">
            <div className="flex items-center gap-3 border-b border-emas-200/80 pb-4">
              <Award className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Pimpinan Redaksi</h2>
            </div>
            <div className="mt-6 space-y-5">
              {pimpinanRedaksiList.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tinta-950 font-serif text-2xl font-bold text-emas-300 shadow-sm">
                    {item.name.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-tinta-900">{item.name}</p>
                    <p className="text-sm text-tinta-600">
                      {item.role_title || item.roleTitle || 'Pemimpin Redaksi'} — {item.affiliation || 'Sarana Media Informasi dan Sastra'}
                    </p>
                    {item.email && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emas-800 font-medium">
                        <Mail className="h-3.5 w-3.5" />
                        {item.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. DEWAN REDAKSI (Bisa Lebih dari 1-2 Orang Masing-masing Rubrik) */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <BookOpen className="h-5 w-5 text-emas-700" />
              <div>
                <h2 className="text-xl font-semibold text-tinta-900">Dewan Redaksi & Kurator Sastra</h2>
                <p className="text-xs text-tinta-500 mt-0.5">
                  Tim kurator dan editor ahli independen untuk masing-masing rubrik sastra
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {dewanRedaksiByRubrik.map(([rubrik, memberList]) => (
                <div key={rubrik} className="rounded-xl border border-tinta-100 bg-latar/40 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-tinta-200/60 pb-2">
                    <span className="label-mikro text-emas-800 font-bold uppercase tracking-wider">
                      Rubrik {rubrik}
                    </span>
                    <span className="text-[11px] font-medium text-tinta-500">
                      {memberList.length} Kurator / Editor
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {memberList.map((m) => (
                      <div key={m.id} className="text-sm">
                        <p className="font-semibold text-tinta-900">{m.name}</p>
                        <p className="text-xs text-tinta-600">
                          {m.role_title || m.roleTitle || `Editor ${rubrik}`}
                        </p>
                        <p className="text-[11px] text-tinta-500">
                          {m.affiliation || 'Sarana Media Informasi dan Sastra'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. TATA USAHA DAN KEMITRAAN (Paling Bawah) */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Users className="h-5 w-5 text-emas-700" />
              <div>
                <h2 className="text-xl font-semibold text-tinta-900">Tata Usaha & Kemitraan</h2>
                <p className="text-xs text-tinta-500 mt-0.5">
                  Divisi operasional, administrasi penerbitan, teknologi, dan kemitraan publikasi
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {tataUsahaList.map((item) => (
                <div key={item.id} className="rounded-xl border border-tinta-100 bg-latar/30 p-4">
                  <p className="label-mikro text-tinta-500">
                    {item.sub_rubrik || item.subRubrik || 'Divisi Operasional'}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-tinta-900">{item.name}</p>
                  <p className="text-xs text-tinta-600">{item.role_title || item.roleTitle}</p>
                  {item.email && (
                    <p className="mt-1.5 text-xs text-tinta-600 font-mono">
                      Email: {item.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. ALAMAT SEKRETARIAT & KONTAK RESMI */}
          <section className="rounded-2xl border border-tinta-200/80 bg-tinta-950 p-8 text-white shadow-xs">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <MapPin className="h-5 w-5 text-emas-400" />
              <h2 className="text-xl font-semibold text-white">Alamat Sekretariat & Kontak Resmi</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm text-tinta-300">
              <div>
                <p className="font-semibold text-white">Sarana Media Informasi dan Sastra</p>
                <p className="mt-1 leading-relaxed">
                  Jl Raya Puspitek Buaran No 46 Kecamatan Serpong<br />
                  Kota Tangerang Selatan - Banten Kode Pos 15316
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-white">Layanan Elektronik</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emas-400 shrink-0" />
                  Redaksi: <a href="mailto:redaksi@smita.id" className="text-white hover:text-emas-300 underline">redaksi@smita.id</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emas-400 shrink-0" />
                  Administrasi: <a href="mailto:admin@smita.id" className="text-white hover:text-emas-300 underline">admin@smita.id</a>
                </p>
                <p className="flex items-center gap-2">
                  <Feather className="h-4 w-4 text-emas-400 shrink-0" />
                  Website Resmi: <a href="https://smita.id" className="text-white hover:text-emas-300 underline">https://smita.id</a>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
