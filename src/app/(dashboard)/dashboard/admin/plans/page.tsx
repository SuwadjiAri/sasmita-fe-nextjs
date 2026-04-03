'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CreditCard, Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Save } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

interface Plan {
  id: number;
  name: string;
  slug: string;
  durationDays: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export default function AdminPlansPage() {
  const toast = useToast();
  const confirmDialog = useConfirm();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = () => {
    api.get('/admin/plans').then((res) => setPlans(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const resetForm = () => {
    setName(''); setDurationDays(''); setPrice(''); setDescription('');
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (plan: Plan) => {
    setName(plan.name);
    setDurationDays(String(plan.durationDays));
    setPrice(String(plan.price));
    setDescription(plan.description || '');
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (editingId) {
        await api.put(`/admin/plans/${editingId}`, { name, duration_days: parseInt(durationDays), price: parseInt(price), description });
        toast.show('Paket berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/plans', { name, duration_days: parseInt(durationDays), price: parseInt(price), description });
        toast.show('Paket berhasil dibuat', 'success');
      }
      resetForm();
      loadPlans();
    } catch {
      toast.show('Gagal menyimpan paket', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: number, current: boolean) => {
    await api.put(`/admin/plans/${id}`, { is_active: !current });
    loadPlans();
    toast.show(current ? 'Paket dinonaktifkan' : 'Paket diaktifkan', 'success');
  };

  const handleDelete = (id: number, planName: string) => {
    confirmDialog.show({
      title: 'Hapus Paket',
      message: `Apakah anda yakin ingin menghapus paket "${planName}"?`,
      confirmLabel: 'Ya, Hapus',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/plans/${id}`);
          loadPlans();
          toast.show('Paket berhasil dihapus', 'success');
        } catch {
          toast.show('Gagal menghapus paket', 'error');
        }
      },
    });
  };

  const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Paket Langganan</h1>
          <p className="text-gray-500 text-sm mt-1">{plans.length} paket</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Paket
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
            </div>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="misal: Bulanan" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (hari)</label>
                <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="misal: 30" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rupiah)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="misal: 15000" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Keuntungan paket ini" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
            <button type="submit" disabled={creating} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
              <Save className="w-4 h-4" />
              {creating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Paket'}
            </button>
          </form>
        </div>
      )}

      {/* Plans List */}
      {loading ? (
        <LoadingSpinner message="Memuat paket..." />
      ) : plans.length === 0 ? (
        <EmptyState icon="article" title="Belum ada paket langganan" description="Tambahkan paket untuk mulai monetisasi." />
      ) : (
        <div className="space-y-3 stagger-children">
          {plans.map((plan) => (
            <div key={plan.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                plan.isActive ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gray-200'
              }`}>
                <CreditCard className={`w-6 h-6 ${plan.isActive ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  {!plan.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Nonaktif</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold text-indigo-600">{formatRupiah(plan.price)}</span>
                  <span className="text-gray-400"> · {plan.durationDays} hari</span>
                  {plan.description && <span className="text-gray-400"> · {plan.description}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleToggle(plan.id, plan.isActive)} className={`p-2 rounded-xl transition-all ${plan.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={plan.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                  {plan.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => startEdit(plan)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(plan.id, plan.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Hapus">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
