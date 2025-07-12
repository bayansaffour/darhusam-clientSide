import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // قاعدة API من متغير البيئة (Vite)
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Right Side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#780C28]">
        <div className="w-full h-full flex items-center justify-center p-12">
          <img
            src="/public/daaralhosam.jpg"
            alt="Logo"
            className="max-w-md w-full object-contain"
          />
        </div>
      </div>

      {/* Left Side - Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="md:hidden flex justify-center mb-8">
            <img
              src="/public/daaralhosam.jpg"
              alt="Logo"
              className="h-24 object-contain"
            />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              إنشاء حساب جديد
            </h2>
            <p className="text-gray-600">
              قم بإنشاء حساب للوصول إلى جميع الخدمات
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  اسم المستخدم
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-right placeholder-gray-400 focus:outline-none focus:ring-[#780C28] focus:border-[#780C28] sm:text-sm"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-right placeholder-gray-400 focus:outline-none focus:ring-[#780C28] focus:border-[#780C28] sm:text-sm"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-right placeholder-gray-400 focus:outline-none focus:ring-[#780C28] focus:border-[#780C28] sm:text-sm"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  تأكيد كلمة المرور
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-right placeholder-gray-400 focus:outline-none focus:ring-[#780C28] focus:border-[#780C28] sm:text-sm"
                  placeholder="أعد إدخال كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#780C28] hover:bg-[#6E8E59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#780C28] transition-colors duration-300"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="font-medium text-[#780C28] hover:text-[#6E8E59] transition-colors duration-300">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
