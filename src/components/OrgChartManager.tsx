import React, { useState, useEffect } from 'react';
import { adminStore, OrgUnit } from '../admin-store';
import { fetchAllOrgUnits, addOrgUnitData, updateOrgUnitData, deleteOrgUnitData } from '../firebaseService';
import { Plus, Trash2, Edit2, Save, X, Building2 } from 'lucide-react';

interface Props {
  showSuccess: (msg: string) => void;
}

export default function OrgChartManager({ showSuccess }: Props) {
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', logoUrl: '' });

  useEffect(() => {
    loadOrgUnits();
  }, []);

  const loadOrgUnits = async () => {
    try {
      const firebaseOrgUnits = await fetchAllOrgUnits();
      if (firebaseOrgUnits.length > 0) {
        const sorted = firebaseOrgUnits.sort((a, b) => (a.order || 0) - (b.order || 0));
        setOrgUnits(sorted);
      } else {
        const localOrgUnits = adminStore.getAllOrgUnits();
        setOrgUnits(localOrgUnits);
        for (const u of localOrgUnits) {
          const { id, ...data } = u;
          await addOrgUnitData(data);
        }
      }
    } catch (err) {
      console.error('Error loading org units from Firebase:', err);
      setOrgUnits(adminStore.getAllOrgUnits());
    }
  };

  const handleEdit = (unit: OrgUnit) => {
    setEditingId(unit.id);
    setForm({ name: unit.name, logoUrl: unit.logoUrl });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      try {
        await deleteOrgUnitData(id);
        adminStore.deleteOrgUnit(id);
        showSuccess('تم حذف الوحدة بنجاح');
        await loadOrgUnits();
      } catch (err) {
        console.error('Error deleting org unit:', err);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSave = async () => {
    if (!form.name) return;

    try {
      if (editingId) {
        await updateOrgUnitData(editingId, { name: form.name, logoUrl: form.logoUrl });
        adminStore.updateOrgUnit(editingId, form.name, form.logoUrl);
        showSuccess('تم تحديث الوحدة بنجاح');
      } else {
        const maxOrder = orgUnits.reduce((max, u) => Math.max(max, u.order || 0), 0);
        await addOrgUnitData({ name: form.name, logoUrl: form.logoUrl, order: maxOrder + 1 });
        adminStore.addOrgUnit(form.name, form.logoUrl);
        showSuccess('تم إضافة الوحدة بنجاح');
      }
    } catch (err) {
      console.error('Error saving org unit:', err);
      alert('حدث خطأ أثناء الحفظ');
    }

    setEditingId(null);
    setForm({ name: '', logoUrl: '' });
    await loadOrgUnits();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', logoUrl: '' });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-2 text-slate-900">الهيكل التنظيمي</h2>
      <p className="text-slate-500 text-sm mb-6">إدارة الوحدات التابعة لقيادة الأدلة الجنائية</p>

      {/* Info box showing the fixed root node */}
      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue shrink-0">
          <Building2 size={24} />
        </div>
        <div>
          <p className="font-bold text-brand-blue text-sm">العقدة الرئيسية (ثابتة)</p>
          <p className="text-slate-600 text-sm">قيادة الأدلة الجنائية بمجمع الأمن العام بالعوالي</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200 shadow-sm">
        <h3 className="font-bold mb-4">{editingId ? 'تعديل وحدة' : 'إضافة وحدة جديدة'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">اسم الوحدة</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="مثال: وحدة الأدلة الجنائية بالجمرات"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">رابط الشعار (URL)</label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={e => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
        {form.logoUrl && (
          <div className="mb-4">
            <p className="text-sm font-bold text-slate-600 mb-2">معاينة الشعار:</p>
            <div className="w-16 h-16 border rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <img src={form.logoUrl} alt="preview" className="w-full h-full object-contain p-1" />
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-bold shadow-sm">
            <Save size={18} />
            {editingId ? 'تحديث الوحدة' : 'إضافة الوحدة'}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-300 flex items-center gap-2 shadow-sm border border-slate-300">
              <X size={18} />
              إلغاء التعديل
            </button>
          )}
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orgUnits.map((u, idx) => (
          <div key={u.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start mb-4">
              <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-sm font-black">{idx + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-center overflow-hidden">
              {u.logoUrl ? (
                <img src={u.logoUrl} alt={u.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Building2 size={24} className="text-brand-gold/50" />
              )}
            </div>
            <h4 className="font-bold text-sm text-slate-900 text-center leading-relaxed">{u.name}</h4>
          </div>
        ))}
        {orgUnits.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
            لا توجد وحدات في الهيكل التنظيمي
          </div>
        )}
      </div>
    </div>
  );
}
