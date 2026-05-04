import React, { useState, useEffect } from 'react';
import { adminStore, Stat } from '../admin-store';
import { fetchAllStats, addStatData, updateStatData, deleteStatData } from '../firebaseService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Props {
  showSuccess: (msg: string) => void;
}

export default function StatsManager({ showSuccess }: Props) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Stat, 'id'>>({ label: '', value: 0, iconName: 'Activity', color: 'text-brand-blue' });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const firebaseStats = await fetchAllStats();
      if (firebaseStats.length > 0) {
        setStats(firebaseStats);
      } else {
        // Fallback to local store and seed Firebase
        const localStats = adminStore.getAllStats();
        setStats(localStats);
        for (const s of localStats) {
          const { id, ...data } = s;
          await addStatData(data);
        }
      }
    } catch (err) {
      console.error('Error loading stats from Firebase:', err);
      setStats(adminStore.getAllStats());
    }
  };

  const handleEdit = (stat: Stat) => {
    setEditingId(stat.id);
    setForm({ label: stat.label, value: stat.value, iconName: stat.iconName, color: stat.color });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
      try {
        await deleteStatData(id);
        adminStore.deleteStat(id);
        showSuccess('تم حذف الرقم بنجاح');
        await loadStats();
      } catch (err) {
        console.error('Error deleting stat:', err);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSave = async () => {
    if (!form.label || form.value === undefined) return;
    
    try {
      if (editingId) {
        await updateStatData(editingId, { label: form.label, value: form.value, iconName: form.iconName, color: form.color });
        adminStore.updateStat(editingId, form.label, form.value, form.iconName, form.color);
        showSuccess('تم تحديث الرقم بنجاح');
      } else {
        const newId = await addStatData({ label: form.label, value: form.value, iconName: form.iconName, color: form.color });
        adminStore.addStat(form.label, form.value, form.iconName, form.color);
        showSuccess('تم اضافة الرقم بنجاح');
      }
    } catch (err) {
      console.error('Error saving stat:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
    
    setEditingId(null);
    setForm({ label: '', value: 0, iconName: 'Activity', color: 'text-brand-blue' });
    await loadStats();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-900">إدارة الأرقام التشغيلية</h2>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-8 border border-slate-200">
        <h3 className="font-bold mb-4">{editingId ? 'تعديل رقم' : 'إضافة رقم جديد'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">الاسم (Label)</label>
            <input
              type="text"
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="مثال: أجهزة مكتبية"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">القيمة (Value)</label>
            <input
              type="number"
              value={form.value}
              onChange={e => setForm({ ...form, value: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">الأيقونة (Icon Name)</label>
            <input
              type="text"
              value={form.iconName}
              onChange={e => setForm({ ...form, iconName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Monitor, Printer..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">اللون (Color Class)</label>
            <select
              value={form.color}
              onChange={e => setForm({ ...form, color: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              dir="ltr"
            >
              <option value="text-brand-blue">text-brand-blue (أزرق)</option>
              <option value="text-brand-gold">text-brand-gold (ذهبي)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-bold">
            <Save size={16} />
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ label: '', value: 0, iconName: 'Activity', color: 'text-brand-blue' }) }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 flex items-center gap-2 text-sm">
              <X size={16} />
              إلغاء
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 border-b-2 border-slate-200">
              <th className="p-3">الاسم</th>
              <th className="p-3">القيمة</th>
              <th className="p-3">الأيقونة</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-bold">{s.label}</td>
                <td className="p-3 text-lg">{s.value}</td>
                <td className="p-3" dir="ltr">{s.iconName}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {stats.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">لا توجد إحصائيات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
