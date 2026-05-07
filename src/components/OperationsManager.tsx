import React, { useState, useEffect } from 'react';
import { adminStore, Operation } from '../admin-store';
import { fetchAllOperations, addOperationData, updateOperationData, deleteOperationData } from '../firebaseService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Props {
  showSuccess: (msg: string) => void;
}

export default function OperationsManager({ showSuccess }: Props) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Operation, 'id'>>({ title: '', description: '', order: 0 });

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      const firebaseOperations = await fetchAllOperations();
      if (firebaseOperations.length > 0) {
        setOperations(firebaseOperations.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        // Fallback to local store and seed Firebase
        const localOperations = adminStore.getAllOperations();
        setOperations(localOperations);
        for (const op of localOperations) {
          const { id, ...data } = op;
          await addOperationData(data);
        }
      }
    } catch (err) {
      console.error('Error loading operations from Firebase:', err);
      setOperations(adminStore.getAllOperations());
    }
  };

  const handleEdit = (op: Operation) => {
    setEditingId(op.id);
    setForm({ title: op.title, description: op.description, order: op.order || 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      try {
        await deleteOperationData(id);
        adminStore.deleteOperation(id);
        showSuccess('تم حذف العملية بنجاح');
        await loadOperations();
      } catch (err) {
        console.error('Error deleting operation:', err);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    
    try {
      if (editingId) {
        await updateOperationData(editingId, { title: form.title, description: form.description, order: form.order });
        adminStore.updateOperation(editingId, form.title, form.description);
        showSuccess('تم تحديث العملية بنجاح');
      } else {
        // Calculate max order to append at the end
        const nextOrder = operations.length > 0 ? Math.max(...operations.map(o => o.order || 0)) + 1 : 1;
        const newOpData = { title: form.title, description: form.description, order: form.order || nextOrder };
        
        await addOperationData(newOpData);
        adminStore.addOperation(newOpData.title, newOpData.description);
        showSuccess('تم اضافة العملية بنجاح');
      }
    } catch (err) {
      console.error('Error saving operation:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
    
    setEditingId(null);
    setForm({ title: '', description: '', order: 0 });
    await loadOperations();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-900">إدارة أبرز العمليات</h2>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-8 border border-slate-200">
        <h3 className="font-bold mb-4">{editingId ? 'تعديل عملية' : 'إضافة عملية جديدة'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">العنوان</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="مثال: تجهيز البنية التحتية"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">الترتيب</label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1">الوصف</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="تفاصيل العملية..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-bold">
            <Save size={16} />
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', order: 0 }) }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 flex items-center gap-2 text-sm">
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
              <th className="p-3 w-16">الترتيب</th>
              <th className="p-3 w-1/4">العنوان</th>
              <th className="p-3">الوصف</th>
              <th className="p-3 w-32">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {operations.map(op => (
              <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-bold">{op.order}</td>
                <td className="p-3 font-bold">{op.title}</td>
                <td className="p-3 text-sm text-slate-600">{op.description}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(op)} className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(op.id)} className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">لا توجد عمليات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
