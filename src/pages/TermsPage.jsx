import React from 'react';
import { useParams } from 'react-router-dom';
import TermsAndConditions from '../components/joinUs/TermsAndConditions';

const TermsPage = () => {
  const { type } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <TermsAndConditions type={type} />
      </div>
    </div>
  );
};

export default TermsPage; 