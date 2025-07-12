import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // استخدام متغير البيئة الخاص بـ Vite
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitSuccess(false);

    try {
      await axios.post(
        `${backendURL}/api/contact/submit`,
        formData
      );
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* عنوان الصفحة */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#780C28] mb-4">اتصل بنا</h1>
            <p className="text-gray-600">نحن هنا للإجابة على استفساراتكم</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* معلومات الاتصال */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-[#780C28] mb-6">معلومات الاتصال</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-[#780C28] ml-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">البريد الإلكتروني</h3>
                    <a href="mailto:DAR.ALHUSSAM2021@GMAIL.COM" className="text-gray-600 hover:text-[#780C28]">
                      DAR.ALHUSSAM2021@GMAIL.COM
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-[#780C28] ml-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">رقم الهاتف</h3>
                    <a href="tel:0775898878" className="text-gray-600 hover:text-[#780C28]">
                      0775898878
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-[#780C28] ml-4 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">العنوان</h3>
                    <p className="text-gray-600">
                      الزرقاء الوسط التجاري مقابل بنك الاتحاد
                    </p>
                  </div>
                </div>
              </div>

              {/* خرائط جوجل */}
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-4">موقعنا على الخريطة</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.1234567890123!2d36.12345678901234!3d32.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDA3JzI0LjQiTiAzNsKwMDcnMjQuNCJF!5e0!3m2!1sen!2sjo!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* نموذج الاتصال */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-[#780C28] mb-6">نموذج تواصل مباشر</h2>

              {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                  تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28]/50"
                    placeholder="اكتب رسالتك هنا"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#780C28] text-white py-3 rounded-lg font-medium text-lg transition-colors duration-300 hover:bg-[#780C28]/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    'جاري الإرسال...'
                  ) : (
                    <>
                      <Send className="ml-2" size={20} />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
