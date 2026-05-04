import React, { useState, useEffect } from 'react';
import { adminStore, Unit } from '../admin-store';
import { fetchAllUnits, addUnitData, updateUnitData, deleteUnitData } from '../firebaseService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Props {
  showSuccess: (msg: string) => void;
}

export default function UnitsManager({ showSuccess }: Props) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState<Omit<Unit, 'id'>>({
    name: '',
    description: '',
    details: []
  });
  const [detailsInput, setDetailsInput] = useState('');

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const firebaseUnits = await fetchAllUnits();
      if (firebaseUnits.length > 0) {
        setUnits(firebaseUnits);
      } else {
        const localUnits = adminStore.getAllUnits();
        setUnits(localUnits);
        for (const u of localUnits) {
          const { id, ...data } = u;
          await addUnitData(data);
        }
      }
    } catch (err) {
      console.error('Error loading units from Firebase:', err);
      setUnits(adminStore.getAllUnits());
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingId(unit.id);
    setForm({ name: unit.name, description: unit.description, details: unit.details });
    setDetailsInput(unit.details.join('\n'));
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      try {
        await deleteUnitData(id);
        adminStore.deleteUnit(id);
        showSuccess('تم حذف الوحدة بنجاح');
        await loadUnits();
      } catch (err) {
        console.error('Error deleting unit:', err);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSave = async () => {
    if (!form.name) return;
    
    const detailsList = detailsInput.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    
    try {
      if (editingId) {
        await updateUnitData(editingId, { name: form.name, description: form.description, details: detailsList });
        adminStore.updateUnit(editingId, form.name, form.description, detailsList);
        showSuccess('تم تحديث الوحدة بنجاح');
      } else {
        await addUnitData({ name: form.name, description: form.description, details: detailsList });
        adminStore.addUnit(form.name, form.description, detailsList);
        showSuccess('تم اضافة الوحدة بنجاح');
      }
    } catch (err) {
      console.error('Error saving unit:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
    
    setEditingId(null);
    setForm({ name: '', description: '', details: [] });
    setDetailsInput('');
    await loadUnits();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-900">إدارة الوحدات الميدانية</h2>
      
      <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200 shadow-sm">
        <h3 className="font-bold mb-4">{editingId ? 'تعديل وحدة' : 'إضافة وحدة جديدة'}</h3>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">اسم الوحدة</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="مثال: وحدة الجمرات"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">الوصف</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              placeholder="وصف الوحدة..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">تفاصيل التجهيزات (رقم/سطر جديد لكل تفصيل)</label>
            <textarea
              value={detailsInput}
              onChange={e => setDetailsInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md leading-relaxed"
              rows={4}
              placeholder={"تركيب 48 جهاز مكتبي\nتفعيل 21 هاتف شبكي"}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-bold shadow-sm">
            <Save size={18} />
            {editingId ? 'تحديث الوحدة' : 'إضافة الوحدة'}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ name: '', description: '', details: [] }); setDetailsInput(''); }} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-300 flex items-center gap-2 shadow-sm border border-slate-300">
              <X size={18} />
              إلغاء التعديل
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(u => (
          <div key={u.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg text-brand-blue">{u.name}</h4>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{u.description}</p>
            <div className="space-y-1 mt-4 border-t pt-4 border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-2">التفاصيل:</p>
              {u.details.map((d, i) => (
                <div key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {units.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
            لا توجد وحدات ميدانية
          </div>
        )}
      </div>
    </div>
  );
}
