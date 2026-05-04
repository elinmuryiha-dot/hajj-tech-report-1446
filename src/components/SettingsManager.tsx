import React, { useState } from 'react';
import { adminStore, GlobalSettings } from '../admin-store';
import { saveSettings } from '../firebaseService';
import { Save, Upload, User, Lock } from 'lucide-react';

interface Props {
  showSuccess: (msg: string) => void;
}

export default function SettingsManager({ showSuccess }: Props) {
  const [settings, setSettings] = useState<GlobalSettings>(adminStore.getSettings());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSaveImages = async () => {
    adminStore.updateSettings(settings);
    try {
      await saveSettings(settings);
    } catch (err) {
      console.error('Error saving settings to Firebase:', err);
    }
    showSuccess('تم حفظ إعدادات الصور بنجاح');
  };

  const handleSaveCredentials = () => {
    if (!username.trim() || !password.trim()) {
      alert('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    adminStore.updateCredentials(username.trim(), password.trim());
    showSuccess('تم تحديث بيانات الدخول بنجاح');
    setUsername('');
    setPassword('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSettings({ ...settings, logoUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSettings({ ...settings, heroImageUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Account Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">بيانات الدخول (Admin)</h2>
        </div>
        
        <p className="text-sm text-slate-500 mb-6 font-medium">قم بتحديث اسم المستخدم وكلمة المرور للوحة التحكم. تذكر هذه البيانات جيداً لتتمكن من الدخول لاحقاً.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم المستخدم الجديد</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: admin"
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="ltr"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="ltr"
              />
            </div>
          </div>

          <button
            onClick={handleSaveCredentials}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold w-full justify-center mt-2"
          >
            <Save className="w-5 h-5" />
            تحديث بيانات الدخول
          </button>
        </div>
      </div>

      {/* Hero & Logo Images */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-900">إعدادات الموقع (Logo & Hero)</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">رابط مسار الشعار (Logo)</label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
              dir="ltr"
            />
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-sm font-medium text-slate-700">اضغط هنا لتحميل صورة شعار من جهازك</span>
              </label>
            </div>

            {settings.logoUrl && (
              <div className="mt-2 text-center bg-slate-100 p-4 rounded-lg inline-block w-full border border-slate-200">
                 <span className="text-xs font-bold text-slate-400 block mb-2">معاينة الشعار</span>
                 <img src={settings.logoUrl} alt="Logo preview" className="h-12 object-contain mx-auto" />
              </div>
            )}
          </div>
          
          <hr className="border-slate-100" />
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">رابط الصورة الرئيسية (Hero Image)</label>
            <input
              type="text"
              value={settings.heroImageUrl}
              onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
              dir="ltr"
            />

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
                id="hero-upload"
              />
              <label htmlFor="hero-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-sm font-medium text-slate-700">اضغط هنا لتحميل صورة رئيسية من جهازك</span>
              </label>
            </div>

            {settings.heroImageUrl && (
              <div className="mt-2 text-center bg-slate-100 p-4 rounded-lg w-full border border-slate-200">
                 <span className="text-xs font-bold text-slate-400 block mb-2">معاينة الصورة الرئيسية</span>
                 <img src={settings.heroImageUrl} alt="Hero preview" className="w-full h-auto rounded-lg shadow-sm" />
              </div>
            )}
          </div>

          <button
            onClick={handleSaveImages}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold w-full justify-center mt-6"
          >
            <Save className="w-5 h-5" />
            حفظ إعدادات الصور
          </button>
        </div>
      </div>
    </div>
  );
}
