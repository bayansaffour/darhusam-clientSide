import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiBaseUrl } from "../../utils/api"
const Setup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}/api/admin/setup`,
        {
          username: formData.username,
          password: formData.password
        }
      );
      navigate('/admin/login');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إنشاء حساب المشرف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#780C28]">إنشاء حساب المشرف</h1>
          <p className="text-gray-600 mt-2">قم بإنشاء حساب المشرف الأول</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#780C28] text-white py-3 rounded-lg font-medium text-lg transition-colors duration-300 hover:bg-[#780C28]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
