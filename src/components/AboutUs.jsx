import { useState } from "react";

export default function AboutUs() {
  // بيانات الفريق الإداري
  const teamMembers = [
    {
      name: "المحامي حسام الخصاونة",
      position: "المدير العام",
      image: new URL('../assets/حسام.JPG', import.meta.url).href,
    },
    {
      name: "محمد الخصاونة",
      position: "المدير الإداري",
      image: new URL('../assets/محمد.JPG', import.meta.url).href,
    }
  ];

  // بيانات الهيئة القانونية
  const legalTeam = [
    {
      name: "المحامي حمزة الشراونة",
      position: "محامي",
      image: new URL('../assets/حمزة (1).JPG', import.meta.url).href,
    },
    {
      name: "المحامي عدنان الخصاونة",
      position: "محامي",
      image: new URL('../assets/عدنان (1).JPG', import.meta.url).href,
    }
  ];

  // بيانات الشركاء
  const partners = [
    {
      name: "شركة الخصاونة لكافة الأعمال القانونية",
      logo: new URL('../assets/Screenshot 2025-06-02 155901.png', import.meta.url).href,
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* العنوان */}
      <div className="py-10 border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-[#780C28]">من نحن</h1>
          <p className="text-lg text-gray-700">
            شركة غير ربحية معنية بالتوعية القانونية في جميع المجالات السياسية والاقتصادية والثقافية والاجتماعية
          </p>
        </div>
      </div>

      {/* الرسالة والرؤية */}
      <div className="py-10 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-4">
          <div className="bg-white rounded-lg p-6 border text-right">
            <h2 className="text-2xl font-bold mb-2 text-[#780C28]">رسالتنا</h2>
            <p className="text-gray-700">تطوير وتعزيز الثقافة المعرفية لدى المواطنين حول حقوقه وواجباته والتي تعزز دوره الحقيقي من المواطنة الفاعلة.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border text-right">
            <h2 className="text-2xl font-bold mb-2 text-[#6E8E59]">رؤيتنا</h2>
            <p className="text-gray-700">ترسيخ القيم الوطنية بالوسطية والاعتدال تحت سيادة القانون لتطوير الحياة الديمقراطية.</p>
          </div>
        </div>
      </div>

      {/* الأهداف */}
      <div className="py-10 border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#780C28]">أهدافنا</h2>
          <p className="text-gray-700">
            تحقيق الوعي والمعرفة في كافة المجالات السياسية والاقتصادية والاجتماعية والثقافية وتمكين الشباب من خلال برامجنا المتاحة.
          </p>
        </div>
      </div>

      {/* المجالات */}
      <div className="py-10 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#780C28]">مجالاتنا</h2>
          <p className="text-gray-700">
            التدريب والتعليم وعمل الدراسات وعقد المؤتمرات ونقل المعرفة من اجل النهوض بالوطن وشبابه في ظل الكفاءات الوطنية.
          </p>
        </div>
      </div>

      {/* القيم */}
      <div className="py-10 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#780C28] text-center">قيمنا</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "النزاهة والشفافية", description: "نلتزم بأعلى معايير النزاهة والشفافية في جميع أعمالنا" },
              { title: "الإبداع والابتكار", description: "نسعى دائماً لإيجاد حلول مبتكرة لتحديات المجتمع" },
              { title: "التعاون والمشاركة", description: "نؤمن بقوة العمل الجماعي والتعاون مع جميع أطياف المجتمع" },
            ].map((value, idx) => (
              <div key={idx} className="bg-gray-50 border rounded-lg p-4 text-center">
                <h3 className="text-lg font-bold text-[#780C28] mb-2">{value.title}</h3>
                <p className="text-gray-700 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الفريق الإداري */}
      <div className="py-10 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#780C28] text-center">الفريق الإداري</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-4 flex flex-col items-center text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-3 border" />
                <h3 className="text-lg font-bold text-[#780C28]">{member.name}</h3>
                <p className="text-[#6E8E59] text-sm mb-2">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الهيئة القانونية */}
      <div className="py-10 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#780C28] text-center">الهيئة القانونية</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {legalTeam.map((member, idx) => (
              <div key={idx} className="bg-gray-50 border rounded-lg p-4 flex flex-col items-center text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-3 border" />
                <h3 className="text-lg font-bold text-[#780C28]">{member.name}</h3>
                <p className="text-[#6E8E59] text-sm mb-2">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الشركاء */}
      <div className="py-10 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#780C28]">الشركاء</h2>
          {partners.map((partner, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <img src={partner.logo} alt={partner.name} className="w-40 h-40 object-contain mb-3" />
              <h3 className="text-lg font-bold text-[#780C28]">{partner.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
