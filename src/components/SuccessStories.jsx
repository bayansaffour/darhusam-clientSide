import { useEffect, useState } from "react";
import axios from "axios";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({ name: "", image: null, shortStory: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // لوحة الألوان
  const colors = {
    primary: "#4D7C4D",
    secondary: "#F5FAF5",
    accent: "#B3D1A3",
    contrast: "#65071E",
    lightAccent: "#E8F3E0",
  };

  // **التعديل هنا: استخدام VITE_BACKEND_URL من ملف البيئة**
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

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
    // ... باقي القصص كما هي
  ];

  // دالة لجلب القصص
  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/success`);
      if (response.data && response.data.length > 0) {
        setStories(response.data);
      } else {
        setStories(dummyStories);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("حدث خطأ أثناء تحميل قصص النجاح");
      setStories(dummyStories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const closeStoryDetails = () => setActiveStory(null);

  const handleSubmitInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setSubmitForm((prev) => ({ ...prev, image: files?.[0] || null }));
    } else {
      setSubmitForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitStory = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    try {
      let imageUrl = "";
      if (submitForm.image) {
        const formData = new FormData();
        formData.append("image", submitForm.image);
        const uploadRes = await axios.post(`${apiBaseUrl}/api/upload`, formData);
        imageUrl = uploadRes.data.imageUrl;
      }
      await axios.post(`${apiBaseUrl}/api/success`, {
        name: submitForm.name,
        imageUrl,
        shortStory: submitForm.shortStory,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccess(false);
        setSubmitForm({ name: "", image: null, shortStory: "" });
        fetchStories();
      }, 1800);
    } catch (err) {
      console.error(err);
      setSubmitError("حدث خطأ أثناء إرسال القصة. حاول مرة أخرى.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // باقي المكونات كما هي مع تعديل روابط الصور باستخدام apiBaseUrl:

  const HeroSection = () => (
    <div
      className="py-24 md:py-32 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('${apiBaseUrl}/api/placeholder/1600/800')`,
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
          <h1 className="text-white text-3xl md:text-5xl font-bold">قصص النجاح</h1>
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="text-white text-lg md:text-xl leading-relaxed">
            نماذج ملهمة صنعت التغيير ووجدت طريقها للنجاح من خلال برامج دار الحسام.
            تعرّفوا على قصص حقيقية غيرت حياة أصحابها وألهمت مجتمعنا.
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: `linear-gradient(to bottom, transparent, ${colors.secondary})` }}
      />
    </div>
  );

  const StoryCard = ({ story }) => {
    const imgSrc =
      story.imageUrl && story.imageUrl.startsWith("http")
        ? story.imageUrl
        : `${apiBaseUrl}/${story.imageUrl?.replace(/^\/+/, "")}`;

    return (
      <div
        className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-200 min-h-[320px]"
        role="button"
        tabIndex={0}
        onClick={() => setActiveStory(story)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setActiveStory(story);
        }}
        aria-label={`عرض قصة ${story.name}`}
      >
        <img
          src={imgSrc}
          alt={story.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 mb-4 shadow"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.jpg";
          }}
          loading="lazy"
        />
        <h2 className="text-lg font-bold text-gray-800 mb-2">{story.name}</h2>
        <p
          className="text-gray-500 text-sm mb-4 line-clamp-3"
          style={{ minHeight: 60 }}
          title={story.shortStory}
        >
          {story.shortStory}
        </p>
        <button
          className="px-5 py-2 rounded-full bg-[#4D7C4D] text-white text-sm font-medium hover:bg-[#3a5e3a] transition"
          onClick={(e) => {
            e.stopPropagation();
            setActiveStory(story);
          }}
          aria-label={`قراءة المزيد عن قصة ${story.name}`}
        >
          قراءة المزيد
        </button>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 border-4 border-gray-300 border-t-4 rounded-full animate-spin mb-4"
        style={{ borderTopColor: colors.primary }}
        aria-label="جاري التحميل"
      />
      <p className="text-gray-600 text-lg">جاري تحميل القصص...</p>
    </div>
  );

  const StoryModal = ({ story }) => {
    const imgSrc =
      story.imageUrl && story.imageUrl.startsWith("http")
        ? story.imageUrl
        : `${apiBaseUrl}/${story.imageUrl?.replace(/^\/+/, "")}`;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
        style={{ direction: "rtl" }}
        onClick={closeStoryDetails}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
      >
        <div
          className="bg-white rounded-2xl max-w-md w-full p-6 relative flex flex-col items-center text-center shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 left-3 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
            onClick={closeStoryDetails}
            aria-label="إغلاق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke={colors.primary}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={imgSrc}
            alt={story.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 mb-4 shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <h2 id="story-modal-title" className="text-xl font-bold text-gray-800 mb-2">
            {story.name}
          </h2>
          <p className="text-gray-600 mb-4 font-medium">{story.title}</p>
          <p className="text-gray-700 leading-relaxed mb-4 text-base">{story.fullStory || story.shortStory}</p>
          {story.testimonial && (
            <div className="bg-[#F5FAF5] rounded-lg p-4 text-gray-700 text-sm italic mb-2 border border-[#B3D1A3]">
              "{story.testimonial}"
            </div>
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
  };

  const SubmitStoryModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={() => setShowSubmitModal(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-story-title"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 relative flex flex-col items-center text-center shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 left-3 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          onClick={() => setShowSubmitModal(false)}
          aria-label="إغلاق"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke={colors.primary}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 id="submit-story-title" className="text-xl font-bold text-gray-800 mb-4">
          شارك قصتك الملهمة
        </h2>

        {submitSuccess ? (
          <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-2 font-medium animate-fade-in" role="alert">
            تم إرسال قصتك بنجاح! سيتم مراجعتها قريباً.
          </div>
        ) : (
          <form className="w-full space-y-4" onSubmit={handleSubmitStory}>
            <input
              type="text"
              name="name"
              required
              placeholder="اسمك"
              value={submitForm.name}
              onChange={handleSubmitInput}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D7C4D]"
              aria-label="اسمك"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleSubmitInput}
              className="w-full px-4 py-2 border rounded-lg"
              aria-label="رفع صورة"
            />
            <textarea
              name="shortStory"
              required
              placeholder="اكتب قصتك بإيجاز..."
              value={submitForm.shortStory}
              onChange={handleSubmitInput}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D7C4D] resize-none"
              aria-label="قصتك"
            />
            {submitError && (
              <div className="text-red-500 text-sm mb-2" role="alert">
                {submitError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-2 rounded-full bg-[#4D7C4D] text-white font-medium hover:bg-[#3a5e3a] transition"
              aria-busy={submitLoading}
            >
              {submitLoading ? "جاري الإرسال..." : "إرسال القصة"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error)
    return (
      <div className="py-16 text-center" role="alert">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div style={{ direction: "rtl" }}>
      <HeroSection />

      <section className="py-16" style={{ background: colors.secondary }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4 inline-block relative"
              style={{ color: colors.primary }}
            >
              قصص ملهمة من مجتمعنا
              <div className="w-full h-1 absolute bottom-0 left-0" style={{ background: colors.contrast }}></div>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              كل قصة تمثل رحلة فريدة من التحدي والإصرار والنجاح. تعرف على التجارب الملهمة التي غيرت حياة أصحابها وساهمت في بناء مجتمع أفضل.
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          <div
            className="mt-20 p-8 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.lightAccent})`,
              border: `1px solid ${colors.accent}`,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
              هل ترغب في مشاركة قصة نجاحك؟
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              نحن فخورون بكل قصة نجاح، ونرغب في مشاركتها مع مجتمعنا للإلهام وتشجيع الآخرين على تحقيق أحلامهم.
            </p>
            <button
              className="px-8 py-3 rounded-md text-white font-medium transition duration-300 hover:shadow-lg"
              style={{ background: colors.contrast }}
              onClick={() => setShowSubmitModal(true)}
              aria-haspopup="dialog"
              aria-controls="submit-story-modal"
            >
              شارك قصتك الآن
            </button>
          </div>
        </div>
      </section>

      {activeStory && <StoryModal story={activeStory} />}
      {showSubmitModal && <SubmitStoryModal />}
    </div>
  );
};

export default SuccessStories;
