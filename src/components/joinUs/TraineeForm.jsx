import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraineeForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalID: "",
    phone: "",
    alternatePhone: "",
    email: "",
    residence: "",
    trainingField: "",
    previousExperience: false,
    experienceDetails: "",
    skills: "",
    contribution: "",
    source: "",
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
      if (!formData.trainingField) errors.trainingField = "مجال التدريب مطلوب";
      
      if (formData.previousExperience && !formData.experienceDetails)
        errors.experienceDetails = "يرجى توضيح تفاصيل خبرتك السابقة";
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/trainee/submit`, formData);
      toast.success("تم تسجيل طلب التدريب بنجاح! سيتم التواصل معك قريباً.");
      setFormData({
        fullName: "",
        nationalID: "",
        phone: "",
        alternatePhone: "",
        email: "",
        residence: "",
        trainingField: "",
        previousExperience: false,
        experienceDetails: "",
        skills: "",
        contribution: "",
        source: "",
        referees: [{ name: "", phone: "", email: "", position: "", residence: "" }],
        confirmation: false,
      });
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
                ? "معلومات التدريب"
                : "المراجع"}
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
            <h1 className="text-3xl font-bold">التسجيل كمتدرب</h1>
            <p className="mt-2">انضم إلى برامجنا التدريبية وطوّر مهاراتك</p>
          </div>

          <div className="p-8">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} dir="rtl">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#780C28] font-medium mb-2">
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
                      <label className="block text-[#780C28] font-medium mb-2">
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
                      <label className="block text-[#780C28] font-medium mb-2">
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
                      <label className="block text-[#780C28] font-medium mb-2">
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
                      <label className="block text-[#780C28] font-medium mb-2">
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
                      <label className="block text-[#780C28] font-medium mb-2">
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
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      مجال التدريب المطلوب <span className="text-red-500">*</span>
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
                    <label className="block text-[#780C28] font-medium mb-2">
                      المهارات الحالية
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows="3"
                      className={getInputClass("skills")}
                      placeholder="اذكر المهارات التي تمتلكها والتي تتعلق بمجال التدريب"
                    ></textarea>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#780C28]/20">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="previousExperience"
                        checked={formData.previousExperience}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28]"
                      />
                      <label className="text-[#780C28] select-none">
                        هل لديك خبرة سابقة في هذا المجال؟
                      </label>
                    </div>

                    {formData.previousExperience && (
                      <div className="mt-4">
                        <label className="block text-[#780C28] font-medium mb-2">
                          تفاصيل الخبرة السابقة <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="experienceDetails"
                          value={formData.experienceDetails}
                          onChange={handleChange}
                          rows="3"
                          className={getInputClass("experienceDetails")}
                          placeholder="اشرح خبرتك السابقة في هذا المجال"
                        ></textarea>
                        {formErrors.experienceDetails && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.experienceDetails}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      كيف يمكن للتدريب أن يساعدك؟
                    </label>
                    <textarea
                      name="contribution"
                      value={formData.contribution}
                      onChange={handleChange}
                      rows="3"
                      className={getInputClass("contribution")}
                      placeholder="اشرح كيف يمكن لهذا التدريب أن يساهم في تطوير مهاراتك أو حياتك المهنية"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[#780C28] font-medium mb-2">
                      كيف سمعت عنا؟
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className={getInputClass("source")}
                    >
                      <option value="">اختر مصدر المعرفة</option>
                      <option value="وسائل التواصل الاجتماعي">وسائل التواصل الاجتماعي</option>
                      <option value="الأصدقاء">الأصدقاء</option>
                      <option value="الفعاليات">الفعاليات</option>
                      <option value="البحث على الإنترنت">البحث على الإنترنت</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#780C28] mb-4">
                    المراجع (اختياري)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    يمكنك إضافة حتى 3 مراجع يمكن الرجوع إليهم للاستفسار عن مهاراتك أو خبراتك السابقة
                  </p>

                  {formData.referees.map((referee, index) => (
                    <div
                      key={index}
                      className="border border-[#780C28]/20 rounded-lg p-4 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
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
                          <label className="block text-[#780C28] font-medium mb-2">
                            رقم الهاتف
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={referee.phone}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-phone-${index}`)}
                            placeholder="07xxxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={referee.email}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-email-${index}`)}
                            placeholder="example@domain.com"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            الوظيفة
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={referee.position}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-position-${index}`)}
                            placeholder="الوظيفة"
                          />
                        </div>

                        <div>
                          <label className="block text-[#780C28] font-medium mb-2">
                            مكان السكن
                          </label>
                          <input
                            type="text"
                            name="residence"
                            value={referee.residence}
                            onChange={(e) => handleRefereeChange(index, e)}
                            className={getInputClass(`referee-residence-${index}`)}
                            placeholder="المحافظة / المنطقة"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.referees.length < 3 && (
                    <button
                      type="button"
                      onClick={addReferee}
                      className="text-[#780C28] border border-[#780C28] px-4 py-2 rounded-lg hover:bg-[#780C28] hover:text-white transition"
                    >
                      إضافة مرجع جديد
                    </button>
                  )}

                  <div className="mt-6">
                    <label className="flex items-center gap-2 text-[#780C28] select-none">
                      <input
                        type="checkbox"
                        name="confirmation"
                        checked={formData.confirmation}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#780C28] border-gray-300 rounded focus:ring-[#780C28]"
                      />
                      <span>
                        أؤكد أن جميع المعلومات المدخلة صحيحة وأنا مسؤول عن صحتها.
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {formErrors.confirmation && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.confirmation}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    السابق
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#780C28] text-white rounded-lg hover:bg-[#5a061c] transition"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg text-white transition ${
                      loading ? "bg-[#780C2880]" : "bg-[#780C28] hover:bg-[#5a061c]"
                    }`}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mx-auto"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      "إرسال"
                    )}
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

export default TraineeForm;
