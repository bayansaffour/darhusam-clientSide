import React, { useState } from "react";
import { UserCircle, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
  import { apiBaseUrl } from "../../utils/api"
const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalID: "",
    phone: "",
    alternatePhone: "",
    email: "",
    residence: "",
    educationLevel: "",
    major: "",
    previousExperience: false,
    previousRole: "",
    preferredField: "",
    skills: "",
    source: "",
    availability: "",
    confirmation: false
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "fullName",
      "nationalID",
      "phone",
      "email",
      "residence",
      "educationLevel",
      "preferredField",
      "availability"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "هذا الحقل مطلوب";
      }
    });

    if (formData.nationalID && !/^\d{10}$/.test(formData.nationalID)) {
      errors.nationalID = "الرقم الوطني يجب أن يتكون من 10 أرقام";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "رقم الهاتف يجب أن يتكون من 10 أرقام";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!formData.confirmation) {
      errors.confirmation = "يجب الموافقة على الشروط والأحكام";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('يرجى التحقق من جميع الحقول المطلوبة');
      return;
    }

    console.log('بيانات النموذج المرسلة:', formData);

    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/volunteer/submit`, formData);

      if (response.status === 201) {
        toast.success('تم التسجيل بنجاح');
        setFormData({
          fullName: "",
          nationalID: "",
          phone: "",
          alternatePhone: "",
          email: "",
          residence: "",
          educationLevel: "",
          major: "",
          previousExperience: false,
          previousRole: "",
          preferredField: "",
          skills: "",
          source: "",
          availability: "",
          confirmation: false
        });
        setFormErrors({});
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'حدث خطأ أثناء التسجيل');
      } else if (error.request) {
        toast.error('لم يتم الاتصال بالسيرفر. يرجى المحاولة مرة أخرى');
      } else {
        toast.error('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    return `w-full px-4 py-3 rounded-lg border text-[#780C28] bg-white ${
      formErrors[fieldName]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-[#780C28] focus:ring-[#780C28]'
    } focus:ring-2 transition-all duration-300 outline-none`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#780C28] px-8 py-6 text-white text-center">
            <h1 className="text-2xl font-bold">تسجيل متطوع</h1>
            <p className="mt-2">انضم إلينا كمتطوع وساهم في تطوير مجتمعنا</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="md:col-span-2">
                  <h2 className="text-[#780C28] font-bold text-lg mb-4 flex items-center">
                    <UserCircle size={20} className="ml-2" />
                    <span>المعلومات الشخصية</span>
                  </h2>
                  <div className="h-px bg-[#780C28]/30 mb-6"></div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={getInputClass("fullName")}
                    placeholder="الاسم الكامل"
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    الرقم الوطني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalID"
                    value={formData.nationalID}
                    onChange={handleChange}
                    className={getInputClass("nationalID")}
                    placeholder="الرقم الوطني"
                  />
                  {formErrors.nationalID && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.nationalID}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute right-3 top-3.5 text-[#780C28]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={getInputClass("phone")}
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    رقم هاتف بديل
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute right-3 top-3.5 text-[#780C28]" />
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      className={getInputClass("alternatePhone")}
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute right-3 top-3.5 text-[#780C28]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={getInputClass("email")}
                      placeholder="example@email.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Residence */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    مكان السكن <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute right-3 top-3.5 text-[#780C28]" />
                    <input
                      type="text"
                      name="residence"
                      value={formData.residence}
                      onChange={handleChange}
                      className={getInputClass("residence")}
                      placeholder="المدينة، الحي"
                    />
                  </div>
                  {formErrors.residence && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.residence}
                    </p>
                  )}
                </div>

                {/* Education Level */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    المستوى التعليمي <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className={getInputClass("educationLevel")}
                  >
                    <option value="">اختر المستوى التعليمي</option>
                    <option value="اعدادي">اعدادي</option>
                    <option value="ثانوي">ثانوي</option>
                    <option value="توجيهي">توجيهي</option>
                    <option value="بكالوريوس">بكالوريوس</option>
                    <option value="دراسات عليا">دراسات عليا</option>
                  </select>
                  {formErrors.educationLevel && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.educationLevel}
                    </p>
                  )}
                </div>

                {/* Major */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    التخصص
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className={getInputClass("major")}
                    placeholder="التخصص"
                  />
                </div>

                {/* Previous Experience */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="previousExperience"
                    checked={formData.previousExperience}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28]"
                  />
                  <label className="mr-2 block text-[#780C28] font-medium">
                    هل لديك خبرة سابقة في التطوع؟
                  </label>
                </div>

                {/* Previous Role */}
                {formData.previousExperience && (
                  <div>
                    <label className="block mb-2 font-medium text-[#780C28]">
                      الدور السابق
                    </label>
                    <input
                      type="text"
                      name="previousRole"
                      value={formData.previousRole}
                      onChange={handleChange}
                      className={getInputClass("previousRole")}
                      placeholder="الدور السابق"
                    />
                  </div>
                )}

                {/* Preferred Field */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    المجال المفضل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="preferredField"
                    value={formData.preferredField}
                    onChange={handleChange}
                    className={getInputClass("preferredField")}
                    placeholder="المجال المفضل"
                  />
                  {formErrors.preferredField && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.preferredField}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    المهارات
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    className={getInputClass("skills")}
                    placeholder="اذكر مهاراتك"
                  ></textarea>
                </div>

                {/* Availability */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    التوفر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className={getInputClass("availability")}
                    placeholder="أوقات توفرك"
                  />
                  {formErrors.availability && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.availability}
                    </p>
                  )}
                </div>

                {/* Source */}
                <div>
                  <label className="block mb-2 font-medium text-[#780C28]">
                    كيف سمعت عنا
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className={getInputClass("source")}
                    placeholder="كيف سمعت عنا"
                  />
                </div>

                {/* Confirmation */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleChange}
                      className={`w-4 h-4 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28] ${
                        formErrors.confirmation ? 'border-red-500' : ''
                      }`}
                    />
                    <label className="mr-2 block text-[#780C28] font-medium">
                      موافقة على الشروط والأحكام <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {formErrors.confirmation && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="ml-1" /> {formErrors.confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#780C28] text-white py-3 rounded-lg font-medium text-lg transition-colors duration-300 hover:bg-[#5e0a20] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
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
                    "تسجيل"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerForm;
