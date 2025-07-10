import { useEffect, useState } from "react";
import axios from "axios";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({ name: '', image: null, shortStory: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Color scheme - refined palette
  const colors = {
    primary: "#4D7C4D", // Deeper green (more professional)
    secondary: "#F5FAF5", // Lighter background for better contrast
    accent: "#B3D1A3", // Softer green accent
    contrast: "#65071E", // Deeper red (more sophisticated)
    lightAccent: "#E8F3E0", // Very light accent for subtle highlights
  };

  // Real stories with placeholder images
  const dummyStories = [
    {
      _id: "1",
      name: "محمد علي",
      title: "صاحب مشروع ناجح",
      imageUrl: "/api/placeholder/400/300",
      shortStory:
        "بدعم من دار الحسام، استطاع محمد إنشاء مشروعه التجاري الخاص وتحقيق الاستقلال المالي.",
      fullStory:
        "بعد مشاركته في برنامج التدريب المهني الذي تقدمه دار الحسام، اكتسب محمد المهارات والمعرفة اللازمة لبدء مشروعه الخاص. تخطى العديد من التحديات بفضل الإرشاد المستمر والدعم الذي تلقاه خلال مرحلة التأسيس. الآن، يدير محمد متجراً ناجحاً للمنتجات العضوية المحلية ويوظف خمسة أشخاص من المجتمع، ويشارك خبراته مع الآخرين من خلال ورش العمل الدورية التي يقيمها بالتعاون مع دار الحسام.",
      testimonial:
        "لولا برامج دار الحسام لما استطعت تحويل حلمي إلى حقيقة. تعلمت كيف أؤسس مشروعي وأطوره بشكل مستدام.",
    },
    {
      _id: "2",
      name: "سارة أحمد",
      title: "مدربة حرف يدوية",
      imageUrl: "/api/placeholder/400/300",
      shortStory:
        "سارة وجدت الأمل من جديد بعد مشاركتها في برامج التأهيل المهني التي قدمتها دار الحسام.",
      fullStory:
        "واجهت سارة العديد من التحديات الشخصية والمهنية قبل التحاقها ببرامج دار الحسام. من خلال الدعم النفسي والتوجيه المهني المتخصص، استطاعت سارة اكتشاف مواهبها في مجال الحرف اليدوية وتطويرها. حصلت على شهادة معتمدة في تصميم المجوهرات التقليدية، وبدأت بإقامة معارض محلية لمنتجاتها. اليوم، تعمل سارة كمدربة في مجال الحرف اليدوية وتلهم العديد من النساء في المجتمع. افتتحت مؤخراً ورشة صغيرة خاصة بها، وأصبحت قصتها مصدر إلهام للكثيرين.",
      testimonial:
        "دار الحسام لم تقدم لي التدريب فحسب، بل منحتني الثقة والدعم لاكتشاف إمكاناتي الحقيقية. أنا فخورة بما حققته وأتطلع لمساعدة المزيد من النساء.",
    },
    {
      _id: "3",
      name: "خالد يوسف",
      title: "قائد مجتمعي",
      imageUrl: "/api/placeholder/400/300",
      shortStory:
        "بفضل الدورات التدريبية، أصبح خالد مدرباً معتمداً وقائداً مجتمعياً مميزاً.",
      fullStory:
        "بدأ خالد رحلته مع دار الحسام كمتطوع، ثم شارك في برنامج القيادة المجتمعية المتقدم. تعلم خالد مهارات التواصل الفعال واستراتيجيات بناء الفريق والتدريب المهني، وحصل على شهادات دولية معتمدة في التنمية المجتمعية. طور خالد برنامجاً خاصاً لتأهيل الشباب ودمجهم في سوق العمل، وقد نجح البرنامج في مساعدة أكثر من 100 شاب وشابة خلال العامين الماضيين. اليوم، يقود خالد مبادرات تطوعية مميزة ويساهم في تنمية قدرات الشباب من خلال شراكة استراتيجية مع دار الحسام.",
      testimonial:
        "تعلمت من دار الحسام أن القيادة الحقيقية تكمن في تمكين الآخرين. كل نجاح يحققه المتدربون معي هو مصدر فخر واعتزاز.",
    },
    {
      _id: "4",
      name: "ليلى حسن",
      title: "خبيرة تكنولوجيا المعلومات",
      imageUrl: "/api/placeholder/400/300",
      shortStory:
        "انتقلت ليلى من البطالة إلى العمل في مجال التكنولوجيا بفضل برامج التدريب المتخصصة.",
      fullStory:
        "كانت ليلى تعاني من البطالة لأكثر من عامين رغم حصولها على شهادة جامعية، حتى التحقت ببرنامج التدريب التقني المتقدم في دار الحسام. خلال ستة أشهر من التدريب المكثف، تعلمت ليلى مهارات البرمجة وتطوير المواقع الإلكترونية. استفادت من شبكة العلاقات المهنية للدار للحصول على فرصة تدريب عملي في إحدى الشركات التقنية، والتي تحولت لاحقاً إلى وظيفة دائمة. اليوم، تعمل ليلى كمطورة مواقع إلكترونية وتساهم بوقتها في تدريب الفتيات المهتمات بالمجال التقني.",
      testimonial:
        "التدريب التقني الذي قدمته دار الحسام فتح أمامي آفاقاً جديدة تماماً. أشعر بالفخر كوني امرأة عربية في مجال التكنولوجيا.",
    },
  ];

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/success");
        if (response.data && response.data.length > 0) {
          setStories(response.data);
        } else {
          setStories(dummyStories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("حدث خطأ أثناء تحميل قصص النجاح");
        setStories(dummyStories);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const closeStoryDetails = () => {
    setActiveStory(null);
  };

  // Handle form input changes
  const handleSubmitInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setSubmitForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setSubmitForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmitStory = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    try {
      let imageUrl = '';
      if (submitForm.image) {
        const formData = new FormData();
        formData.append('image', submitForm.image);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
        imageUrl = uploadRes.data.imageUrl;
      }
      await axios.post('http://localhost:5000/api/success', {
        name: submitForm.name,
        imageUrl,
        shortStory: submitForm.shortStory,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccess(false);
        setSubmitForm({ name: '', image: null, shortStory: '' });
        fetchStories();
      }, 1800);
    } catch (err) {
      setSubmitError('حدث خطأ أثناء إرسال القصة. حاول مرة أخرى.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Custom component for the hero section
  const HeroSection = () => (
    <div
      className="py-24 md:py-32 px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/api/placeholder/1600/800')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto relative z-10 text-center">
        <div
          className="inline-block px-6 py-3 mb-6 rounded-lg"
          style={{ background: `${colors.primary}99` }} 
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold">
            قصص النجاح
          </h1>
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="text-white text-lg md:text-xl leading-relaxed">
            نماذج ملهمة صنعت التغيير ووجدت طريقها للنجاح من خلال برامج دار
            الحسام. تعرّفوا على قصص حقيقية غيرت حياة أصحابها وألهمت مجتمعنا.
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: `linear-gradient(to bottom, transparent, ${colors.secondary})`,
        }}
      ></div>
    </div>
  );

  // Custom card component
  const StoryCard = ({ story }) => (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-200"
      style={{ minHeight: 320 }}
    >
      <img
        src={story.imageUrl && story.imageUrl.startsWith('http') ? story.imageUrl : `http://localhost:5000/${story.imageUrl?.replace(/^\/+/,'')}`}
        alt={story.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 mb-4 shadow"
        onError={e => { e.target.src = "/placeholder-image.jpg"; }}
      />
      <h2 className="text-lg font-bold text-gray-800 mb-2">{story.name}</h2>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3" style={{minHeight: 60}}>{story.shortStory}</p>
      <button
        className="px-5 py-2 rounded-full bg-[#4D7C4D] text-white text-sm font-medium hover:bg-[#3a5e3a] transition"
        onClick={() => setActiveStory(story)}
      >
        قراءة المزيد
      </button>
    </div>
  );

  // Custom loading component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 border-4 border-gray-300 border-t-4 rounded-full animate-spin mb-4"
        style={{ borderTopColor: colors.primary }}
      ></div>
      <p className="text-gray-600 text-lg">جاري تحميل القصص...</p>
    </div>
  );

  // Enhanced story modal
  const StoryModal = ({ story }) => (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      style={{ direction: "rtl" }}
      onClick={closeStoryDetails}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 relative flex flex-col items-center text-center shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 left-3 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          onClick={closeStoryDetails}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#4D7C4D"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img
          src={story.imageUrl && story.imageUrl.startsWith('http') ? story.imageUrl : `http://localhost:5000/${story.imageUrl?.replace(/^\/+/,'')}`}
          alt={story.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 mb-4 shadow"
          onError={e => { e.target.src = "/placeholder-image.jpg"; }}
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">{story.name}</h2>
        <p className="text-gray-600 mb-4" style={{fontWeight: 500}}>{story.title}</p>
        <p className="text-gray-700 leading-relaxed mb-4 text-base">{story.fullStory || story.shortStory}</p>
        {story.testimonial && (
          <div className="bg-[#F5FAF5] rounded-lg p-4 text-gray-700 text-sm italic mb-2 border border-[#B3D1A3]">"{story.testimonial}"</div>
        )}
        <button
          className="mt-2 px-6 py-2 rounded-full bg-[#4D7C4D] text-white text-sm font-medium hover:bg-[#3a5e3a] transition"
          onClick={closeStoryDetails}
        >
          إغلاق
        </button>
      </div>
    </div>
  );

  // Modal for submitting a story
  const SubmitStoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowSubmitModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 relative flex flex-col items-center text-center shadow-lg" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 left-3 bg-gray-100 rounded-full p-2 hover:bg-gray-200" onClick={() => setShowSubmitModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#4D7C4D"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">شارك قصتك الملهمة</h2>
        {submitSuccess ? (
          <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-2 font-medium animate-fade-in">تم إرسال قصتك بنجاح! سيتم مراجعتها قريباً.</div>
        ) : (
        <form className="w-full space-y-4" onSubmit={handleSubmitStory}>
          <input type="text" name="name" required placeholder="اسمك" value={submitForm.name} onChange={handleSubmitInput} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D7C4D]" />
          <input type="file" name="image" accept="image/*" onChange={handleSubmitInput} className="w-full px-4 py-2 border rounded-lg" />
          <textarea name="shortStory" required placeholder="اكتب قصتك بإيجاز..." value={submitForm.shortStory} onChange={handleSubmitInput} rows="4" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D7C4D] resize-none" />
          {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
          <button type="submit" disabled={submitLoading} className="w-full py-2 rounded-full bg-[#4D7C4D] text-white font-medium hover:bg-[#3a5e3a] transition">{submitLoading ? 'جاري الإرسال...' : 'إرسال القصة'}</button>
        </form>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ direction: "rtl" }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section
        className="py-16"
        style={{
          background: colors.secondary,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4 inline-block relative"
              style={{ color: colors.primary }}
            >
              قصص ملهمة من مجتمعنا
              <div
                className="w-full h-1 absolute bottom-0 left-0"
                style={{ background: colors.contrast }}
              ></div>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              كل قصة تمثل رحلة فريدة من التحدي والإصرار والنجاح. تعرف على
              التجارب الملهمة التي غيرت حياة أصحابها وساهمت في بناء مجتمع أفضل.
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          {/* Call to Action */}
          <div
            className="mt-20 p-8 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.lightAccent})`,
              border: `1px solid ${colors.accent}`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              هل ترغب في مشاركة قصة نجاحك؟
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              نحن فخورون بكل قصة نجاح، ونرغب في مشاركتها مع مجتمعنا للإلهام
              وتشجيع الآخرين على تحقيق أحلامهم.
            </p>
            <button
              className="px-8 py-3 rounded-md text-white font-medium transition duration-300 hover:shadow-lg"
              style={{ background: colors.contrast }}
              onClick={() => setShowSubmitModal(true)}
            >
              شارك قصتك الآن
            </button>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {activeStory && <StoryModal story={activeStory} />}
      {showSubmitModal && <SubmitStoryModal />}
    </div>
  );
};

export default SuccessStories;
