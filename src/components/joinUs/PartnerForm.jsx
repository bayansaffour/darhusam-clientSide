import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationLocation: "",
    isLicensed: false,
    industry: "",
    director: { name: "", phone: "", email: "" },
    liaison: { name: "", phone: "", email: "" },
    partnershipType: "",
    duration: "",
    expectations: "",
    ourOffer: "",
    socialMedia: "",
    licenseImage: "",
    confirmation: false,
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.organizationName.trim()) 
        errors.organizationName = "اسم المؤسسة مطلوب";
      
      if (!formData.organizationLocation.trim()) 
        errors.organizationLocation = "موقع المؤسسة مطلوب";
      
      if (!formData.industry.trim()) 
        errors.industry = "مجال عمل المؤسسة مطلوب";
      
      if (formData.isLicensed && !formData.licenseImage)
        errors.licenseImage = "يرجى إرفاق صورة الترخيص";
    } else if (step === 2) {
      if (!formData.director.name.trim()) 
        errors["director.name"] = "اسم المدير مطلوب";
      
      if (!formData.director.phone.trim()) 
        errors["director.phone"] = "رقم هاتف المدير مطلوب";
      else if (!/^\d{10}$/.test(formData.director.phone.trim()))
        errors["director.phone"] = "رقم الهاتف يجب أن يتكون من 10 أرقام";
      
      if (!formData.director.email.trim()) 
        errors["director.email"] = "بريد المدير الإلكتروني مطلوب";
      else if (!/\S+@\S+\.\S+/.test(formData.director.email.trim()))
        errors["director.email"] = "الرجاء إدخال بريد إلكتروني صحيح";
      
      if (!formData.liaison.name.trim()) 
        errors["liaison.name"] = "اسم مسؤول التواصل مطلوب";
      
      if (!formData.liaison.phone.trim()) 
        errors["liaison.phone"] = "رقم هاتف مسؤول التواصل مطلوب";
      else if (!/^\d{10}$/.test(formData.liaison.phone.trim()))
        errors["liaison.phone"] = "رقم الهاتف يجب أن يتكون من 10 أرقام";
      
      if (!formData.liaison.email.trim()) 
        errors["liaison.email"] = "بريد مسؤول التواصل الإلكتروني مطلوب";
      else if (!/\S+@\S+\.\S+/.test(formData.liaison.email.trim()))
        errors["liaison.email"] = "الرجاء إدخال بريد إلكتروني صحيح";
    } else if (step === 3) {
      if (!formData.partnershipType.trim()) 
        errors.partnershipType = "نوع الشراكة مطلوب";
      
      if (!formData.duration.trim()) 
        errors.duration = "مدة الشراكة مطلوبة";
      
      if (!formData.confirmation)
        errors.confirmation = "يرجى تأكيد صحة المعلومات";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          licenseImage: "حجم الصورة يجب أن لا يتجاوز 2 ميجابايت"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setFormErrors({
          ...formErrors,
          licenseImage: "يرجى اختيار ملف صورة صالح"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData({
            ...formData,
            licenseImage: compressedImage,
          });
          
          if (formErrors.licenseImage) {
            setFormErrors({
              ...formErrors,
              licenseImage: "",
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/partner/submit", {
        ...formData,
        organizationName: formData.organizationName.trim(),
        organizationLocation: formData.organizationLocation.trim(),
        industry: formData.industry.trim(),
        director: {
          name: formData.director.name.trim(),
          phone: formData.director.phone.trim(),
          email: formData.director.email.trim()
        },
        liaison: {
          name: formData.liaison.name.trim(),
          phone: formData.liaison.phone.trim(),
          email: formData.liaison.email.trim()
        },
        partnershipType: formData.partnershipType.trim(),
        duration: formData.duration.trim()
      });

      if (response.status === 201) {
        toast.success("تم تسجيل طلب الشراكة بنجاح! سيتم التواصل معكم قريباً.");
        setFormData({
          organizationName: "",
          organizationLocation: "",
          isLicensed: false,
          industry: "",
          director: { name: "", phone: "", email: "" },
          liaison: { name: "", phone: "", email: "" },
          partnershipType: "",
          duration: "",
          expectations: "",
          ourOffer: "",
          socialMedia: "",
          licenseImage: "",
          confirmation: false,
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء التسجيل";
      toast.error(errorMessage);
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

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index + 1 === currentStep
                  ? "bg-[#780C28] text-white"
                  : index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-all duration-300`}
            >
              {index + 1 < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div
              className={`mt-2 text-xs font-medium ${
                index + 1 === currentStep
                  ? "text-[#780C28]"
                  : index + 1 < currentStep
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {index === 0
                ? "معلومات المؤسسة"
                : index === 1
                ? "بيانات الاتصال"
                : "تفاصيل الشراكة"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_10px_25px_rgba(120,12,40,0.2)] overflow-hidden">
          <div className="bg-[#780C28] px-8 py-6 text-white text-center">
            <h1 className="text-3xl font-bold">التسجيل كشريك</h1>
            <p className="mt-2">انضم إلينا كشريك استراتيجي وساهم معنا في إحداث الأثر الإيجابي</p>
          </div>

          <div className="p-8">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} dir="rtl">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      اسم المؤسسة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className={getInputClass("organizationName")}
                      placeholder="أدخل اسم المؤسسة أو الجهة"
                    />
                    {formErrors.organizationName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.organizationName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#780C28] font-medium mb-2">
                        موقع المؤسسة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="organizationLocation"
                        value={formData.organizationLocation}
                        onChange={handleChange}
                        className={getInputClass("organizationLocation")}
                        placeholder="المدينة / البلد"
                      />
                      {formErrors.organizationLocation && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.organizationLocation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-2">
                        مجال عمل المؤسسة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={getInputClass("industry")}
                        placeholder="مجال عمل المؤسسة الرئيسي"
                      />
                      {formErrors.industry && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.industry}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      روابط منصات التواصل الاجتماعي
                    </label>
                    <input
                      type="text"
                      name="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleChange}
                      className={getInputClass("socialMedia")}
                      placeholder="روابط حسابات التواصل الاجتماعي الخاصة بالمؤسسة"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#780C28]/20">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isLicensed"
                        checked={formData.isLicensed}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28]"
                      />
                      <label className="text-[#780C28] select-none">
                        هل المؤسسة مرخصة؟
                      </label>
                    </div>
                    
                    {formData.isLicensed && (
                      <div className="mt-4">
                        <label className="block text-[#780C28] font-medium mb-2">
                          صورة الترخيص <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="licenseImage"
                          accept="image/*"
                          onChange={handleFileChange}
                          className={`w-full px-4 py-3 rounded-lg border text-[#780C28] bg-white ${
                            formErrors.licenseImage
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-[#780C28] focus:ring-[#780C28]'
                          } focus:ring-2 transition-all duration-300 outline-none`}
                        />
                        {formErrors.licenseImage && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.licenseImage}</p>
                        )}
                        {formData.licenseImage && (
                          <div className="mt-2">
                            <img 
                              src={formData.licenseImage} 
                              alt="صورة الترخيص" 
                              className="h-32 object-contain border border-gray-300 rounded-lg p-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border border-[#780C28]/20 rounded-lg p-4">
                    <h4 className="text-[#780C28] font-medium mb-4">
                      معلومات مدير المؤسسة
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#780C28] font-medium mb-2">
                          اسم المدير <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="director.name"
                          value={formData.director.name}
                          onChange={handleChange}
                          className={getInputClass("director.name")}
                          placeholder="اسم مدير المؤسسة"
                        />
                        {formErrors["director.name"] && (
                          <p className="text-red-500 text-sm mt-1">{formErrors["director.name"]}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            رقم الهاتف <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="director.phone"
                            value={formData.director.phone}
                            onChange={handleChange}
                            className={getInputClass("director.phone")}
                            placeholder="07xxxxxxxx"
                          />
                          {formErrors["director.phone"] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors["director.phone"]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            البريد الإلكتروني <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="director.email"
                            value={formData.director.email}
                            onChange={handleChange}
                            className={getInputClass("director.email")}
                            placeholder="example@domain.com"
                          />
                          {formErrors["director.email"] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors["director.email"]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#780C28]/20 rounded-lg p-4">
                    <h4 className="text-[#780C28] font-medium mb-4">
                      معلومات مسؤول التواصل
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#780C28] font-medium mb-2">
                          اسم مسؤول التواصل <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="liaison.name"
                          value={formData.liaison.name}
                          onChange={handleChange}
                          className={getInputClass("liaison.name")}
                          placeholder="اسم الشخص المسؤول عن التواصل"
                        />
                        {formErrors["liaison.name"] && (
                          <p className="text-red-500 text-sm mt-1">{formErrors["liaison.name"]}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            رقم الهاتف <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="liaison.phone"
                            value={formData.liaison.phone}
                            onChange={handleChange}
                            className={getInputClass("liaison.phone")}
                            placeholder="07xxxxxxxx"
                          />
                          {formErrors["liaison.phone"] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors["liaison.phone"]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            البريد الإلكتروني <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="liaison.email"
                            value={formData.liaison.email}
                            onChange={handleChange}
                            className={getInputClass("liaison.email")}
                            placeholder="example@domain.com"
                          />
                          {formErrors["liaison.email"] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors["liaison.email"]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#780C28] font-medium mb-2">
                        نوع الشراكة <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        className={getInputClass("partnershipType")}
                      >
                        <option value="">اختر نوع الشراكة</option>
                        <option value="استراتيجية">شراكة استراتيجية</option>
                        <option value="تمويلية">شراكة تمويلية</option>
                        <option value="تطوعية">شراكة تطوعية</option>
                        <option value="تدريبية">شراكة تدريبية</option>
                        <option value="إعلامية">شراكة إعلامية</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                      {formErrors.partnershipType && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.partnershipType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-2">
                        مدة الشراكة المتوقعة <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={getInputClass("duration")}
                      >
                        <option value="">اختر المدة المتوقعة</option>
                        <option value="3 أشهر">3 أشهر</option>
                        <option value="6 أشهر">6 أشهر</option>
                        <option value="سنة">سنة</option>
                        <option value="سنتين">سنتين</option>
                        <option value="أكثر من سنتين">أكثر من سنتين</option>
                      </select>
                      {formErrors.duration && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      ماذا تتوقع من الشراكة؟
                    </label>
                    <textarea
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleChange}
                      rows="3"
                      className={getInputClass("expectations")}
                      placeholder="اذكر ما تتوقعه من هذه الشراكة وكيف يمكننا أن نساعدك"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      ماذا تقدم في هذه الشراكة؟
                    </label>
                    <textarea
                      name="ourOffer"
                      value={formData.ourOffer}
                      onChange={handleChange}
                      rows="3"
                      className={getInputClass("ourOffer")}
                      placeholder="اذكر ما يمكن لمؤسستك تقديمه في إطار هذه الشراكة"
                    ></textarea>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#780C28]/20">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="confirmation"
                        checked={formData.confirmation}
                        onChange={handleChange}
                        className={`w-5 h-5 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28] ${
                          formErrors.confirmation ? 'border-red-500' : ''
                        }`}
                      />
                      <label className="text-[#780C28] select-none">
                        أقر أن جميع المعلومات المقدمة صحيحة ودقيقة وأنني مخول بتمثيل المؤسسة في هذا الطلب
                        <span className="text-red-500"> *</span>
                      </label>
                    </div>
                    {formErrors.confirmation && (
                      <p className="text-red-500 text-sm mt-2 mr-8">{formErrors.confirmation}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="py-2 px-4 border border-[#780C28] rounded-lg text-md font-medium text-[#780C28] bg-white hover:bg-[#780C28]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#780C28] transition"
                  >
                    السابق
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="py-2 px-6 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-[#780C28] hover:bg-[#5e0a20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#780C28] transition"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-3 px-8 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-[#780C28] hover:bg-[#5e0a20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#780C28] transition ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
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
                        تسجيل طلب الشراكة
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              الحقول المميزة بـ <span className="text-red-500">*</span> حقول إلزامية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;