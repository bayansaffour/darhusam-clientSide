import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TermsAndConditions from './TermsAndConditions';

const termsTexts = {
  individual: '', // will be handled by TermsAndConditions
  partner: '', // will be handled by TermsAndConditions
  trainee: '', // will be handled by TermsAndConditions
  trainer: '', // will be handled by TermsAndConditions
  volunteer: '', // will be handled by TermsAndConditions
};

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

const TermsPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (agreed) {
      navigate(formsPaths[type]);
    }
  };

  if (!formsTitles[type]) {
    return <div className="text-center py-16 text-red-600 font-bold">نوع النموذج غير معروف!</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#780C28] text-center">الشروط والأحكام - {formsTitles[type]}</h1>
        <div className="mb-6 text-gray-700 leading-relaxed" style={{whiteSpace: 'pre-line'}}>
          <TermsAndConditions type={
            type === 'individual' ? 'individualPartner' : type
          } />
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
  );
};

export default TermsPage; 