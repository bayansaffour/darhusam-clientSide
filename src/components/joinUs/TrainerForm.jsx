import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TrainerForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalID: "",
    phone: "",
    alternatePhone: "",
    email: "",
    residence: "",
    educationField: "",
    trainingField: "",
    experienceYears: "",
    referees: [{ name: "", phone: "", email: "", position: "", residence: "" }],
    confirmation: false,
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.fullName) errors.fullName = "الاسم الرباعي مطلوب";
      if (!formData.nationalID) errors.nationalID = "الرقم الوطني مطلوب";
      else if (!/^\d{10}$/.test(formData.nationalID))
        errors.nationalID = "الرقم الوطني يجب أن يتكون من 10 أرقام";

      if (!formData.phone) errors.phone = "رقم الهاتف مطلوب";
      else if (!/^\d{10}$/.test(formData.phone))
        errors.phone = "رقم الهاتف يجب أن يتكون من 10 أرقام";

      if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone))
        errors.alternatePhone = "رقم الهاتف البديل يجب أن يتكون من 10 أرقام";

      if (!formData.email) errors.email = "البريد الإلكتروني مطلوب";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "الرجاء إدخال بريد إلكتروني صحيح";

      if (!formData.residence) errors.residence = "مكان السكن مطلوب";
    } else if (step === 2) {
      if (!formData.educationField) errors.educationField = "التخصص الدراسي مطلوب";
      if (!formData.trainingField) errors.trainingField = "مجال التدريب مطلوب";
      if (!formData.experienceYears) errors.experienceYears = "سنوات الخبرة مطلوبة";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleRefereeChange = (index, e) => {
    const { name, value } = e.target;
    const newReferees = [...formData.referees];
    newReferees[index] = { ...newReferees[index], [name]: value };
    
    setFormData({
      ...formData,
      referees: newReferees,
    });
  };

  const addReferee = () => {
    if (formData.referees.length < 3) {
      setFormData({
        ...formData,
        referees: [
          ...formData.referees,
          { name: "", phone: "", email: "", position: "", residence: "" }
        ],
      });
    }
  };

  const removeReferee = (index) => {
    if (formData.referees.length > 1) {
      const newReferees = [...formData.referees];
      newReferees.splice(index, 1);
      setFormData({
        ...formData,
        referees: newReferees,
      });
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

    if (!validateStep(currentStep)) {
      return;
    }

    if (!formData.confirmation) {
      setFormErrors({
        ...formErrors,
        confirmation: "يرجى تأكيد صحة المعلومات",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/submit`, formData);
      toast.success("تم تسجيل طلب التدريب بنجاح! سيتم التواصل معك قريباً.");
      setFormData({
        fullName: "",
        nationalID: "",
        phone: "",
        alternatePhone: "",
        email: "",
        residence: "",
        educationField: "",
        trainingField: "",
        experienceYears: "",
        referees: [{ name: "", phone: "", email: "", position: "", residence: "" }],
        confirmation: false,
      });
      setFormErrors({});
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التسجيل");
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
                ? "المعلومات الشخصية"
                : index === 1
                ? "المؤهلات"
                : "المراجع"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#780C28] px-8 py-6 text-white text-center">
            <h1 className="text-2xl font-bold">كن مدربًا معنا</h1>
            <p className="mt-2">انضم لفريق المدربين وشارك خبراتك مع الآخرين</p>
          </div>

          <div className="p-6">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} dir="rtl">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        الاسم الرباعي <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={getInputClass("fullName")}
                        placeholder="أدخل اسمك الرباعي"
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        الرقم الوطني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nationalID"
                        value={formData.nationalID}
                        onChange={handleChange}
                        className={getInputClass("nationalID")}
                        placeholder="0000000000"
                      />
                      {formErrors.nationalID && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.nationalID}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={getInputClass("phone")}
                        placeholder="07xxxxxxxx"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        رقم هاتف بديل
                      </label>
                      <input
                        type="text"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        className={getInputClass("alternatePhone")}
                        placeholder="07xxxxxxxx (اختياري)"
                      />
                      {formErrors.alternatePhone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.alternatePhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={getInputClass("email")}
                        placeholder="example@domain.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#780C28] font-medium mb-1">
                        مكان السكن <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className={getInputClass("residence")}
                        placeholder="المحافظة / المنطقة"
                      />
                      {formErrors.residence && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.residence}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#780C28] font-medium mb-1">
                      التخصص الدراسي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="educationField"
                      value={formData.educationField}
                      onChange={handleChange}
                      className={getInputClass("educationField")}
                      placeholder="أدخل تخصصك الدراسي"
                    />
                    {formErrors.educationField && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.educationField}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-1">
                      مجال التدريب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="trainingField"
                      value={formData.trainingField}
                      onChange={handleChange}
                      className={getInputClass("trainingField")}
                      placeholder="المجال الذي ترغب بالتدريب فيه"
                    />
                    {formErrors.trainingField && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.trainingField}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-1">
                      سنوات الخبرة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className={getInputClass("experienceYears")}
                    >
                      <option value="">عدد سنوات الخبرة كمدرب</option>
                      <option value="0">لا توجد خبرة سابقة</option>
                      <option value="6 اشهر-سنة">6 أشهر - سنة</option>
                      <option value="سنة – 3 سنوات">سنة – 3 سنوات</option>
                      <option value="اكثر من 3 سنوات">أكثر من 3 سنوات</option>
                    </select>
                    {formErrors.experienceYears && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.experienceYears}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#780C28] mb-2">
                    المراجع (اختياري)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    يمكنك إضافة حتى 3 مراجع يمكن الرجوع إليهم للاستفسار عن خبراتك السابقة
                  </p>

                  {formData.referees.map((referee, index) => (
                    <div
                      key={index}
                      className="border border-[#780C28]/20 rounded-lg p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#780C28]">
                          المرجع {index + 1}
                        </h4>
                        {formData.referees.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReferee(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#780C28] text-sm mb-1">
                            الاسم
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={referee.name}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-name-${index}`)}
                            placeholder="اسم المرجع"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] text-sm mb-1">
                            رقم الهاتف
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={referee.phone}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-phone-${index}`)}
                            placeholder="رقم هاتف المرجع"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] text-sm mb-1">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={referee.email}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-email-${index}`)}
                            placeholder="البريد الإلكتروني للمرجع"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] text-sm mb-1">
                            المسمى الوظيفي
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={referee.position}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-position-${index}`)}
                            placeholder="المسمى الوظيفي للمرجع"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[#780C28] text-sm mb-1">
                            مكان العمل
                          </label>
                          <input
                            type="text"
                            name="residence"
                            value={referee.residence}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-residence-${index}`)}
                            placeholder="مكان عمل المرجع"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.referees.length < 3 && (
                    <button
                      type="button"
                      onClick={addReferee}
                      className="px-4 py-2 bg-[#780C28] text-white rounded hover:bg-[#5a061b] transition"
                    >
                      إضافة مرجع جديد
                    </button>
                  )}

                  <div className="mt-6 flex items-center">
                    <input
                      type="checkbox"
                      id="confirmation"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleChange}
                      className="mr-2 accent-[#780C28]"
                    />
                    <label htmlFor="confirmation" className="text-[#780C28] select-none">
                      أؤكد صحة المعلومات المدخلة
                    </label>
                  </div>
                  {formErrors.confirmation && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.confirmation}</p>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    disabled={loading}
                  >
                    السابق
                  </button>
                )}

                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-2 bg-[#780C28] text-white rounded hover:bg-[#5a061b] transition"
                    disabled={loading}
                  >
                    التالي
                  </button>
                )}

                {currentStep === totalSteps && (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "جاري الإرسال..." : "إرسال"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerForm;
