import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Activity, MapPin, Images, GitBranch } from 'lucide-react';
import SettingsManager from './SettingsManager';
import StatsManager from './StatsManager';
import UnitsManager from './UnitsManager';
import OrgChartManager from './OrgChartManager';
import ImageCard from './ImageCard';
import ImageUploadForm from './ImageUploadForm';
import { adminStore, Image } from '../admin-store';
import { fetchAllImages, uploadImageData, updateImageData, deleteImageData } from '../firebaseService';
import { AlertCircle, Trash2, Plus } from 'lucide-react';

type Tab = 'dashboard' | 'images' | 'stats' | 'units' | 'orgchart' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('images');
  const [successMessage, setSuccessMessage] = useState('');

  // Image Management State
  const [images, setImages] = useState<Image[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem('admin-authenticated')) {
      navigate('/admin');
    }
    loadImages();
  }, [navigate]);

  const loadImages = async () => {
    const firebaseImages = await fetchAllImages();
    setImages(firebaseImages);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    navigate('/admin');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Image Handlers
  const handleAddImage = () => { setEditingImage(null); setIsFormOpen(true); };
  const handleEditImage = (image: Image) => { setEditingImage(image); setIsFormOpen(true); };
  const handleSaveImage = async (title: string, description: string, url: string) => {
    try {
      if (editingImage) {
        await updateImageData(editingImage.id, title, description, url);
        adminStore.updateImage(editingImage.id, title, description, url);
        showSuccess('تم تحديث الصورة بنجاح');
      } else {
        await uploadImageData(title, description, url);
        adminStore.addImage(title, description, url);
        showSuccess('تم إضافة الصورة بنجاح');
      }
    } catch (err) {
      console.error('Error saving image to Firebase:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
    setIsFormOpen(false);
    setEditingImage(null);
    loadImages();
  };
  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImageData(id);
      adminStore.deleteImage(id);
      showSuccess('تم حذف الصورة بنجاح');
    } catch (err) {
      console.error('Error deleting from Firebase:', err);
      alert('حدث خطأ أثناء الحذف من قاعدة البيانات');
    }
    setDeleteConfirm(null);
    loadImages();
  };

  return (
    <div className="flex h-screen bg-slate-50" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button onClick={() => setActiveTab('images')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'images' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Images className="w-5 h-5" /> معرض الصور
          </button>
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Activity className="w-5 h-5" /> أرقام التشغيل
          </button>
          <button onClick={() => setActiveTab('units')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'units' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <MapPin className="w-5 h-5" /> الوحدات الميدانية
          </button>
          <button onClick={() => setActiveTab('orgchart')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'orgchart' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <GitBranch className="w-5 h-5" /> الهيكل التنظيمي
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> إعدادات الموقع
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (simplified for brevity) */}
        <header className="md:hidden bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-slate-200">
           <h1 className="text-xl font-bold">لوحة التحكم</h1>
           <button onClick={handleLogout} className="text-red-600"><LogOut className="w-5 h-5"/></button>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-10">
          
          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2">
             <button onClick={() => setActiveTab('images')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'images' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>معرض الصور</button>
             <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>أرقام التشغيل</button>
             <button onClick={() => setActiveTab('units')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'units' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>الوحدات الميدانية</button>
             <button onClick={() => setActiveTab('orgchart')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'orgchart' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>الهيكل التنظيمي</button>
             <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>إعدادات الموقع</button>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 max-w-2xl">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              {successMessage}
            </div>
          )}

          {/* Tab Content Router */}
          {activeTab === 'settings' && <SettingsManager showSuccess={showSuccess} />}
          {activeTab === 'stats' && <StatsManager showSuccess={showSuccess} />}
          {activeTab === 'units' && <UnitsManager showSuccess={showSuccess} />}
          {activeTab === 'orgchart' && <OrgChartManager showSuccess={showSuccess} />}
          {activeTab === 'images' && (
            <div>
               <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">معرض الصور</h2>
                  <p className="text-slate-500">إجمالي الصور: {images.length}</p>
                </div>
                <button onClick={handleAddImage} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <Plus className="w-5 h-5" /> إضافة صورة جديدة
                </button>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onEdit={handleEditImage}
                      onDelete={(id) => setDeleteConfirm(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center border-dashed border-2 border-slate-200">
                  <Images className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">لا توجد صور</h3>
                  <button onClick={handleAddImage} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4">
                    <Plus className="w-5 h-5" /> إضافة أول صورة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Image Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">تأكيد الحذف</h3>
            </div>
            <p className="text-slate-600 mb-6">هل أنت متأكد من حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">إلغاء</button>
              <button onClick={() => handleDeleteImage(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Form */}
      {isFormOpen && (
        <ImageUploadForm
          image={editingImage || undefined}
          onSave={handleSaveImage}
          onCancel={() => { setIsFormOpen(false); setEditingImage(null); }}
        />
      )}
    </div>
  );
}
