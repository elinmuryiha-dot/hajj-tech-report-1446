import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Image } from '../admin-store';
import { uploadImageData } from '../firebaseImageService';

interface ImageUploadFormProps {
  image?: Image;
  onSave: (title: string, description: string, url: string) => void;
  onCancel: () => void;
}

export default function ImageUploadForm({ image, onSave, onCancel }: ImageUploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description);
      setUrl(image.url);
      setPreview(image.url);
    }
  }, [image]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('يرجى إدخال عنوان الصورة');
      return false;
    }
    if (!description.trim()) {
      setError('يرجى إدخال وصف الصورة');
      return false;
    }
    if (!url.trim()) {
      setError('يرجى إدخال رابط الصورة');
      return false;
    }
    return true;
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setPreview(newUrl);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll create a data URL
      // In production, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleUrlChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Save to Firebase
      if (image?.id) {
        const { updateImageData } = await import('../firebaseImageService');
        await updateImageData(image.id, title, description, url);
      } else {
        await uploadImageData(title, description, url);
      }
      onSave(title, description, url);
    } catch (err: any) {
      console.error('Firebase Save Error:', err);
      if (err.message?.includes('size')) {
        setError('حجم الصورة كبير جداً بالنسبة لقاعدة البيانات (أكبر من 1MB). يرجى استخدام صورة أصغر أو رابط خارجي.');
      } else if (err.code === 'permission-denied') {
        setError('ليس لديك صلاحية الحفظ في قاعدة البيانات. يرجى التحقق من إعدادات Firestore rules.');
      } else {
        setError(`حدث خطأ أثناء الحفظ: ${err.message || 'خطأ غير معروف'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {image ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="relative">
              <p className="text-sm font-medium text-slate-700 mb-2">معاينة الصورة</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}

          {/* Image URL Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              رابط الصورة (URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-slate-300 rounded-lg py-2 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">أو قم بتحميل صورة من جهازك</p>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">
                اضغط هنا لتحميل صورة
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, GIF (الحد الأقصى 5MB)
              </p>
            </label>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              عنوان الصورة *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الصورة"
              className="w-full border border-slate-300 rounded-lg py-2 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              وصف الصورة *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف الصورة"
              rows={4}
              className="w-full border border-slate-300 rounded-lg py-2 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : image ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
