'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import {
  DollarSign, TrendingUp, CheckCircle, Clock,
  Search, Printer, RefreshCw, Calendar, CreditCard
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface FinanceSummary {
  gross_revenue: number;
  this_month_revenue: number;
  total_success: number;
  total_pending: number;
  total_cancelled: number;
  average_order_value: number;
}

interface TransactionItem {
  id: number;
  order_id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  plan_id: number;
  plan_name: string;
  plan_duration: number;
  amount: number;
  formatted_amount: string;
  payment_type: string;
  status: string;
  started_at: string | null;
  expired_at: string | null;
  created_at: string;
}

export default function AdminFinancePage() {
  const toast = useToast();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const loadSummary = useCallback(() => {
    setSummaryLoading(true);
    api.get('/admin/finance/summary')
      .then((res) => {
        setSummary(res.data.data);
      })
      .catch(() => {
        toast.show('Gagal memuat ringkasan keuangan', 'error');
      })
      .finally(() => setSummaryLoading(false));
  }, [toast]);

  const loadTransactions = useCallback((p: number, pp: number, status: string, sDate: string, eDate: string, q: string) => {
    setLoading(true);
    const query = new URLSearchParams({
      page: p.toString(),
      per_page: pp.toString(),
      status: status !== 'all' ? status : '',
      start_date: sDate,
      end_date: eDate,
      search: q,
    });

    api.get(`/admin/finance/transactions?${query.toString()}`)
      .then((res) => {
        setTransactions(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
      })
      .catch(() => {
        toast.show('Gagal memuat data transaksi arus kas', 'error');
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadTransactions(page, perPage, statusFilter, startDate, endDate, search);
  }, [loadTransactions, page, perPage, statusFilter, startDate, endDate, search]);

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilter = () => {
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setSearch('');
    setPage(1);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bagian Cetak Dokumen Resmi - Hanya Muncul Saat Di-Print */}
      <div className="hidden print:block border-b-2 border-tinta-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-tinta-900 tracking-wide uppercase">
              Sarana Media Informasi dan Sastra (SMITA.ID)
            </h1>
            <p className="text-xs text-tinta-600 mt-1">
              Jl Raya Puspitek Buaran No 46, Serpong, Tangerang Selatan - Banten 15316
            </p>
            <p className="text-xs text-tinta-500 font-sans">
              Laporan Keuangan & Rekapitulasi Arus Kas Penerbitan Digital Sastra
            </p>
          </div>
          <div className="text-right text-xs text-tinta-600 font-mono">
            <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p>Status Data: Resmi Terverifikasi</p>
          </div>
        </div>
      </div>

      {/* Header Halaman (Layar Interaktif) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <p className="label-mikro">Manajemen Keuangan</p>
          <h1 className="mt-1 text-2xl font-serif font-bold text-tinta-900">Laporan Keuangan</h1>
          <p className="mt-1 text-sm text-tinta-500">
            Rekapitulasi pendapatan kotor, transaksi paket langganan pembaca, dan arus kas Midtrans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSummary}
            className="btn-tinta text-xs flex items-center gap-1.5 py-2 px-3"
            title="Muat ulang ringkasan"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Muat Ulang
          </button>

          <button
            onClick={handlePrint}
            className="btn-emas text-xs flex items-center gap-1.5 py-2 px-4 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak Laporan Keuangan
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Keuangan Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="kartu p-5 border border-emas-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emas-800 uppercase tracking-wider">Total Pendapatan</span>
            <span className="p-2 rounded-xl bg-emas-100 text-emas-800">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-serif font-bold text-tinta-900">
            {summaryLoading ? '...' : formatRupiah(summary?.gross_revenue || 0)}
          </p>
          <p className="mt-1 text-[11px] text-tinta-400">Akumulasi seluruh transaksi langganan terverifikasi</p>
        </div>

        {/* Omset Bulan Ini */}
        <div className="kartu p-5 border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Bulan Berjalan</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-serif font-bold text-emerald-950">
            {summaryLoading ? '...' : formatRupiah(summary?.this_month_revenue || 0)}
          </p>
          <p className="mt-1 text-[11px] text-tinta-400">Penerimaan kas masuk bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Transaksi Sukses */}
        <div className="kartu p-5 border border-tinta-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tinta-600 uppercase tracking-wider">Transaksi Sukses</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-tinta-900">
            {summaryLoading ? '...' : summary?.total_success || 0}
          </p>
          <p className="mt-1 text-[11px] text-tinta-400">Langganan aktif &amp; berhasil terbayar</p>
        </div>

        {/* Transaksi Pending */}
        <div className="kartu p-5 border border-tinta-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tinta-600 uppercase tracking-wider">Menunggu / Batal</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-tinta-900">
            {summaryLoading ? '...' : `${summary?.total_pending || 0} / ${summary?.total_cancelled || 0}`}
          </p>
          <p className="mt-1 text-[11px] text-tinta-400">Status pending vs dibatalkan/kedaluwarsa</p>
        </div>
      </div>

      {/* Bilah Filter dan Pencarian (Layar Interaktif) */}
      <div className="kartu p-4 space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter status transaksi"
              className="kolom-isian text-xs py-2 px-3 w-full sm:w-auto"
            >
              <option value="all">Semua Status Transaksi</option>
              <option value="active">Berhasil / Aktif</option>
              <option value="pending">Menunggu Pembayaran (Pending)</option>
              <option value="cancelled">Dibatalkan / Kedaluwarsa</option>
            </select>

            {/* Filter Rentang Tanggal */}
            <div className="flex items-center gap-1.5 text-xs text-tinta-600">
              <Calendar className="h-3.5 w-3.5 text-tinta-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                aria-label="Tanggal awal"
                className="kolom-isian text-xs py-1.5 px-2"
                title="Tanggal Mulai"
              />
              <span className="text-tinta-400">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                aria-label="Tanggal akhir"
                className="kolom-isian text-xs py-1.5 px-2"
                title="Tanggal Selesai"
              />
            </div>

            {(statusFilter !== 'all' || startDate || endDate || search) && (
              <button
                onClick={handleResetFilter}
                className="text-xs text-red-600 hover:text-red-800 underline px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Kotak Pencarian */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tinta-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari ID pesanan, nama, email..."
              aria-label="Cari transaksi"
              className="kolom-isian w-full pl-9 pr-3 py-2 text-xs sm:w-72"
            />
          </div>
        </div>
      </div>

      {/* Tabel Rincian Transaksi */}
      <div className="kartu overflow-hidden border border-tinta-200/80">
        <div className="p-4 border-b border-tinta-100 flex items-center justify-between bg-latar/40">
          <p className="text-xs font-semibold text-tinta-800">
            Daftar Transaksi Arus Kas ({meta.total} catatan ditemukan)
          </p>
          <span className="text-[11px] text-tinta-400 font-sans">
            Menampilkan halaman {meta.page} dari {meta.last_page}
          </span>
        </div>

        {loading ? (
          <div className="p-12">
            <LoadingSpinner message="Memuat arus kas transaksi..." />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto h-10 w-10 text-tinta-300 mb-2" />
            <p className="font-semibold text-tinta-700">Belum ada catatan transaksi</p>
            <p className="text-xs text-tinta-400 mt-1">Data transaksi langganan akan otomatis tercatat saat pembaca melakukan pembayaran.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-tinta-100 bg-latar text-tinta-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">ID Pesanan &amp; Tanggal</th>
                  <th className="p-3.5">Nama &amp; Akun Pelanggan</th>
                  <th className="p-3.5">Paket Langganan</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5 text-right">Nominal</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5">Masa Berlaku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tinta-100 text-tinta-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-latar/50 transition-colors">
                    <td className="p-3.5 font-mono text-[11px]">
                      <span className="font-bold text-tinta-900 block">{tx.order_id}</span>
                      <span className="text-tinta-400 text-[10px]">{formatDate(tx.created_at)}</span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-tinta-900">{tx.user_name}</p>
                      <p className="text-tinta-400 text-[11px] truncate max-w-[200px]">{tx.user_email}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block font-medium text-tinta-900">{tx.plan_name}</span>
                      <span className="text-[10px] text-tinta-400 block">{tx.plan_duration} hari akses</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-tinta-100 font-mono text-[10px] text-tinta-700 uppercase">
                        {tx.payment_type || 'Midtrans'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-semibold text-tinta-900">
                      {tx.formatted_amount}
                    </td>
                    <td className="p-3.5 text-center">
                      {tx.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          Sukses / Aktif
                        </span>
                      ) : tx.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          <Clock className="h-3 w-3 text-amber-600" />
                          Menunggu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
                          Batal / Expired
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-[11px] text-tinta-500">
                      {tx.started_at && tx.expired_at ? (
                        <span>
                          {new Date(tx.started_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })} s/d{' '}
                          {new Date(tx.expired_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-tinta-100 print:hidden">
          <Pagination
            page={meta.page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
          />
        </div>
      </div>

      {/* Tanda Tangan Pengesahan Laporan - Hanya Muncul Saat Print */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-12 mt-12 border-t border-tinta-300 text-xs">
        <div className="text-center">
          <p className="text-tinta-600">Mengetahui,</p>
          <p className="font-semibold text-tinta-900 mt-1">Pemimpin Redaksi SMITA.ID</p>
          <div className="h-16" />
          <p className="font-bold underline text-tinta-900">( Dr. Misbah Priagung Nursalim, S.S., M.Pd. )</p>
          <p className="text-tinta-500 text-[10px]">Penanggung Jawab Lembaga Penerbitan</p>
        </div>

        <div className="text-center">
          <p className="text-tinta-600">Serpong, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p className="font-semibold text-tinta-900 mt-1">Pengelola Administrasi &amp; Keuangan</p>
          <div className="h-16" />
          <p className="font-bold underline text-tinta-900">( Arif Suwadji )</p>
          <p className="text-tinta-500 text-[10px]">Tata Usaha &amp; Kemitraan Digital</p>
        </div>
      </div>
    </div>
  );
}
