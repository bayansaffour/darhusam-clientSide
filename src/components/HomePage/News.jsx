import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

export default function EnhancedNews() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const navigate = useNavigate();

  // رابط السيرفر من env
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/home/events`);
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(events.length / cardsToShow);

  const goToPrevPage = () => {
    setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const getVisibleEvents = () => {
    const startIdx = currentPage * cardsToShow;
    const endIdx = Math.min(startIdx + cardsToShow, events.length);
    return events.slice(startIdx, endIdx);
  };

  if (!events.length) {
    return (
      <div className="flex justify-center items-center h-65">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="rtl min-h-screen overflow-hidden">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-[#780C28] to-[#9A0C2E] text-white py-12 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-center mb-2">
            أحدث الأخبار والفعاليات
          </h1>
          <div className="w-24 h-1 bg-[#6E8E59] mx-auto mb-4"></div>
          <p className="text-center text-white/80 max-w-2xl mx-auto">
            اطلع على آخر أخبار ونشاطات دار الحسام للعمل الشبابي وكن على تواصل مع
            أحدث الفعاليات والمبادرات
          </p>
        </div>
      </header>

      {/* Carousel */}
      <div className="relative py-4 max-w-6xl mx-auto px-4">
        <div className="overflow-hidden">
          <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
            {getVisibleEvents().map(evt => (
              <div
                key={evt._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 flex flex-col transform hover:-translate-y-2"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img
                    src={
                      evt.imageUrl.startsWith("http")
                        ? evt.imageUrl
                        : `${apiBaseUrl}${evt.imageUrl}`
                    }
                    alt={evt.title}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-[#780C28] line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm flex-grow">
                    {evt.description.length > 100
                      ? `${evt.description.substring(0, 100)}…`
                      : evt.description}
                  </p>

                  <div className="bg-gradient-to-r from-[#780C28] to-[#a01040] text-white p-3 rounded-lg mb-4 text-center">
                    <div className="text-xs opacity-90">التاريخ</div>
                    <div className="text-lg font-bold">
                      {new Date(evt.date).toLocaleDateString("ar-EG")}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <div className="w-8 h-8 bg-[#780C28]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#780C28]" />
                      </div>
                      <div>
                        <span className="font-medium">المكان:</span> {evt.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <div className="w-8 h-8 bg-[#780C28]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[#780C28]" />
                      </div>
                      <div>
                        <span className="font-medium">الوقت:</span> {evt.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <div className="w-8 h-8 bg-[#780C28]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-[#780C28]" />
                      </div>
                      <div>
                        <span className="font-medium">السعة:</span> {evt.capacity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {events.length > cardsToShow && (
          <>
            <button
              onClick={goToPrevPage}
              className="absolute left-[-48px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#780C28] p-3 rounded-full shadow transition-all duration-300 hover:scale-105"
              aria-label="السابق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <button
              onClick={goToNextPage}
              className="absolute right-[-48px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#780C28] p-3 rounded-full shadow transition-all duration-300 hover:scale-105"
              aria-label="التالي"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === idx
                ? "bg-[#780C28] w-6"
                : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
