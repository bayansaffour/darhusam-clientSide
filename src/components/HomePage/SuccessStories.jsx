import React, { useState, useEffect } from "react";
import { Star, ArrowRight, Heart, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessStoriesCards() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/home/success-stories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setStories(data.slice(0, 3));
        } else {
          setStories([]);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#780C28] mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#780C28]/10 to-[#6E8E59]/10 animate-pulse"></div>
            </div>
            <p className="mt-6 text-xl text-gray-600 font-medium">جارٍ تحميل قصص الإلهام...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <p className="text-gray-500 mt-2">نعتذر عن الإزعاج، يرجى المحاولة مرة أخرى</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">قريباً...</h3>
            <p className="text-gray-500 text-lg">لا توجد قصص نجاح متاحة حالياً</p>
            <p className="text-gray-400 mt-2">نعمل على إضافة قصص ملهمة جديدة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* خلفيات زخرفية */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#780C28]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#6E8E59]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#780C28]/5 to-[#6E8E59]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-[#780C28] bg-clip-text text-transparent mb-4">
            قصص النجاح
          </h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            اكتشف قصص الإلهام والنجاح التي تحفزك لتحقيق أحلامك
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#780C28] to-[#6E8E59] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* بطاقات القصص */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={story._id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#780C28] via-[#6E8E59] to-[#780C28] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px]">
                <div className="w-full h-full bg-white rounded-3xl"></div>
              </div>

              {/* صورة القصة */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
                <img
                  src={
                    story.imageUrl?.startsWith("http")
                      ? story.imageUrl
                      : `${apiBaseUrl}${story.imageUrl}`
                  }
                  alt={story.name}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg z-20">
                  <Star className="w-5 h-5 text-[#780C28] fill-current" />
                </div>
              </div>

              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-[#780C28] to-[#6E8E59] rounded-full shadow-sm"></div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#780C28] transition-colors duration-300">
                    {story.name}
                  </h3>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {story.shortStory}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/success-stories`)}
                    className="inline-flex items-center gap-2 text-[#6E8E59] font-semibold hover:text-[#780C28] transition-colors duration-300 group/btn"
                  >
                    <span>اقرأ المزيد</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#780C28]/30 rounded-full"></div>
                    <div className="w-2 h-2 bg-[#6E8E59]/30 rounded-full"></div>
                    <div className="w-2 h-2 bg-[#780C28]/30 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#780C28] via-[#6E8E59] to-[#780C28] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
