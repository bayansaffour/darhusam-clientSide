import React, { useState } from 'react';
import VolunteerForm from './VolunteerForm';
import TraineeForm from './TraineeForm';
import TrainerForm from './TrainerForm';
import PartnerForm from './PartnerForm';
import IndividualPartnerForm from './IndividualPartnerForm';

const AllForms = () => {
  const [activeForm, setActiveForm] = useState('volunteer');

  const forms = [
    { id: 'volunteer', title: 'متطوع', component: VolunteerForm },
    { id: 'trainee', title: 'متدرب', component: TraineeForm },
    { id: 'trainer', title: 'مدرب', component: TrainerForm },
    { id: 'partner', title: 'شريك مؤسسة', component: PartnerForm },
    { id: 'individual', title: 'شريك فردي', component: IndividualPartnerForm },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#780C28] mb-4">انضم إلينا</h1>
            <p className="text-gray-600">اختر نوع العضوية التي تريدها</p>
          </div>

          {/* Form Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {forms.map((form) => (
              <button
                key={form.id}
                onClick={() => setActiveForm(form.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeForm === form.id
                    ? 'bg-[#780C28] text-white'
                    : 'bg-white text-[#780C28] hover:bg-[#780C28]/10'
                }`}
              >
                {form.title}
              </button>
            ))}
          </div>

          {/* Active Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className={activeForm === form.id ? 'block' : 'hidden'}
              >
                <form.component />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllForms; 