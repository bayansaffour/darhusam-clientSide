import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const IndividualPartnerForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    residence: '',
    workField: '',
    supportType: '',
    supportReason: '',
    howDidYouHear: '',
    references: '',
    confirmation: false,
  });

  const validateForm = () => {
    const newErrors = {};
    Object.entries({
      fullName: 'الاسم الكامل',
      nationalId: 'رقم الهوية الوطنية',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      residence: 'العنوان',
      workField: 'مجال العمل',
      supportType: 'نوع الدعم',
      supportReason: 'سبب الدعم',
      howDidYouHear: 'كيف سمعت عنا',
      references: 'المراجع',
    }).forEach(([key, label]) => {
      if (!formData[key]) {
        newErrors[key] = `حقل ${label} مطلوب`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يتكون من 10 أرقام';
    }

    if (!formData.confirmation) {
      newErrors.confirmation = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('يرجى التحقق من جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${baseURL}/api/individual-partner/submit`, formData);
      toast.success('تم التسجيل بنجاح');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    return `w-full px-4 py-3 rounded-lg border text-[#780C28] bg-white ${
      errors[fieldName]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-[#780C28] focus:ring-[#780C28]'
    } focus:ring-2 transition-all duration-300 outline-none`;
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_10px_25px_rgba(120,12,40,0.2)] overflow-hidden">
          <div className="bg-[#780C28] px-8 py-6 text-white text-center">
            <h1 className="text-3xl font-bold">تسجيل شريك فردي</h1>
            <p className="mt-2">نرحب بانضمامك كشريك فردي في مبادراتنا</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6" dir="rtl">
            {Object.keys(formData).map((key) => {
              if (key === 'confirmation') return null;
              const labelMap = {
                fullName: 'الاسم الكامل',
                nationalId: 'رقم الهوية الوطنية',
                phone: 'رقم الهاتف',
                email: 'البريد الإلكتروني',
                residence: 'العنوان',
                workField: 'مجال العمل',
                supportType: 'نوع الدعم',
                supportReason: 'سبب الدعم',
                howDidYouHear: 'كيف سمعت عنا',
                references: 'المراجع',
              };
              const label = labelMap[key];
              return (
                <div key={key}>
                  <label className="block text-[#780C28] font-medium mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  {key === 'supportReason' || key === 'references' ? (
                    <textarea
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className={`${getInputClass(key)} min-h-[100px] resize-none`}
                    ></textarea>
                  ) : key === 'supportType' || key === 'howDidYouHear' ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className={getInputClass(key)}
                    >
                      <option value="">اختر</option>
                      {key === 'supportType' && (
                        <>
                          <option value="مالي">مالي</option>
                          <option value="مادي">مادي</option>
                          <option value="فني">فني</option>
                          <option value="لوجستي">لوجستي</option>
                        </>
                      )}
                      {key === 'howDidYouHear' && (
                        <>
                          <option value="socialMedia">وسائل التواصل الاجتماعي</option>
                          <option value="friend">صديق</option>
                          <option value="website">الموقع الإلكتروني</option>
                          <option value="other">أخرى</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      type={key === 'email' ? 'email' : key === 'phone' || key === 'nationalId' ? 'tel' : 'text'}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className={getInputClass(key)}
                    />
                  )}
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              );
            })}

            <div className="bg-white p-4 rounded-lg border border-[#780C28]/20">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="confirmation"
                  checked={formData.confirmation}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28]"
                  id="terms"
                />
                <label htmlFor="terms" className="text-[#780C28] select-none">
                  أوافق على الشروط والأحكام <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.confirmation && <p className="text-red-500 text-sm mt-2 mr-8">{errors.confirmation}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-[#780C28] text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#780C28] focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    جاري التسجيل...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    تسجيل
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IndividualPartnerForm;
