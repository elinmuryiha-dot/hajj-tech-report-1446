import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { adminStore } from '../admin-store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (adminStore.verifyCredentials(username, password)) {
        // Store auth token in sessionStorage
        sessionStorage.setItem('admin-authenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('بيانات دخول غير صحيحة');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-slate-400">إدارة الصور والمحتوى</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-xl p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pr-10 pl-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pr-10 pl-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Demo Credentials Hint */}
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
            <p className="font-semibold mb-1">بيانات العرض التجريبي:</p>
            <p>اسم المستخدم: admin</p>
            <p>كلمة المرور: admin123</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'جاري الدخول...' : 'دخول'}
          </button>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200 mt-4"
          >
            العودة للصفحة الرئيسية
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          لوحة إدارة حصرية للمشرفين فقط
        </p>
      </div>
    </div>
  );
}
