import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Building2, GraduationCap, BookOpen, Heart } from 'lucide-react';
import TermsAndConditions from './TermsAndConditions';

const formsPaths = {
  individual: '/join-us/individual',
  partner: '/join-us/partner',
  trainee: '/join-us/trainee',
  trainer: '/join-us/trainer',
  volunteer: '/join-us/volunteer',
};

const formsTitles = {
  individual: 'شريك فردي',
  partner: 'شريك مؤسسة',
  trainee: 'متدرب',
  trainer: 'مدرب',
  volunteer: 'متطوع',
};

const JoinUsOptions = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const options = [
    {
      title: 'شريك فردي',
      description: 'انضم إلينا كشريك فردي وساهم في دعم رسالتنا',
      icon: <UserCircle size={24} className="text-[#780C28]" />,
      type: 'individual',
    },
    {
      title: 'شريك مؤسسة',
      description: 'تعاون معنا كشريك مؤسسة وكن جزءاً من نجاحنا',
      icon: <Building2 size={24} className="text-[#780C28]" />,
      type: 'partner',
    },
    {
      title: 'متدرب',
      description: 'تدرب معنا واكتسب خبرات جديدة في مجالك',
      icon: <GraduationCap size={24} className="text-[#780C28]" />,
      type: 'trainee',
    },
    {
      title: 'مدرب',
      description: 'شارك خبراتك مع الآخرين كمدرب محترف',
      icon: <BookOpen size={24} className="text-[#780C28]" />,
      type: 'trainer',
    },
    {
      title: 'متطوع',
      description: 'تطوع معنا وساهم في خدمة المجتمع',
      icon: <Heart size={24} className="text-[#780C28]" />,
      type: 'volunteer',
    },
  ];

  const handleOptionClick = (type) => {
    setSelectedType(type);
    setAgreed(false);
    setModalOpen(true);
  };

  const handleAgree = () => {
    setModalOpen(false);
    navigate(formsPaths[selectedType]);
  };

  // Map 'individual' to 'individualPartner' for TermsAndConditions
  const termsType = selectedType === 'individual' ? 'individualPartner' : selectedType;

  return (
    <div className="bg-gray-50 min-h-screen py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#780C28] mb-4">انضم إلينا</h1>
            <p className="text-gray-600">اختر الطريقة التي تريد بها الانضمام إلى دار حصام</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option.type)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#780C28] border-2 border-transparent"
              >
                <div className="flex items-center mb-4">
                  {option.icon}
                  <h2 className="text-xl font-bold text-[#780C28] mr-3">{option.title}</h2>
                </div>
                <p className="text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative animate-fadeIn" dir="rtl">
            <button
              className="absolute left-4 top-4 text-gray-400 hover:text-[#780C28] text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="إغلاق"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-[#780C28] mb-6 text-center">الشروط والأحكام - {formsTitles[selectedType]}</h2>
            <div className="max-h-[50vh] overflow-y-auto mb-6 pr-2">
              <TermsAndConditions type={termsType} />
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded focus:ring-[#780C28] text-[#780C28]"
              />
              <label htmlFor="agree" className="mr-2 text-sm">أوافق على جميع الشروط والأحكام</label>
            </div>
            <button
              onClick={handleAgree}
              disabled={!agreed}
              className="w-full bg-[#780C28] text-white py-3 rounded-lg font-medium text-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              أوافق وأكمل التسجيل
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinUsOptions; 