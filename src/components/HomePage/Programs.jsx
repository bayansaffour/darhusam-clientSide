import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
  import { apiBaseUrl } from "../../utils/api"

export default function ProgramsSlider() {
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slidesPerView = isMobile ? 1 : 3;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/home/programs`);
        setPrograms(data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
  }, [apiBaseUrl]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (!programs.length) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i >= programs.length - slidesPerView ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [programs, slidesPerView]);

  const handlePrev = () => {
    setCurrentIndex(i => (i === 0 ? programs.length - slidesPerView : i - 1));
  };
  const handleNext = () => {
    setCurrentIndex(i => (i >= programs.length - slidesPerView ? 0 : i + 1));
  };

  if (!programs.length) {
    return (
      <div className="flex justify-center items-center h-64">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="relative py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 relative">
          <h2 className="text-4xl font-extrabold" style={{ color: "#780C28" }}>برامجنا</h2>
          <div className="h-1 w-24 bg-[#6E8E59] mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            مجموعة متنوعة من البرامج والمبادرات لخدمة المجتمع وتنمية قدرات الشباب
          </p>
        </div>

        <div className="relative">
          <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden px-4">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(${currentIndex * (100 / slidesPerView)}%)`,
              direction: 'rtl'
            }}>
              {programs.map(({ _id, name, description, category, startDate, endDate }) => (
                <div key={_id} className="px-3 py-2 flex-shrink-0" style={{ width: `${100 / slidesPerView}%` }}>
                  <div
                    onClick={() => console.log(`Navigate to ${_id}`)}
                    className="group relative h-80 rounded-xl cursor-pointer overflow-hidden shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 hover:shadow-xl border border-gray-200"
                  >
                    <div className="absolute top-0 left-0 w-0 h-1 bg-[#6E8E59] group-hover:w-full transition-all duration-500" />
                    <div className="absolute top-0 right-0 w-1 h-0 bg-[#6E8E59] group-hover:h-full transition-all duration-700" />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-[#6E8E59]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between p-6 pr-16">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#6E8E59] transition-colors duration-300">{name}</h3>
                          <div className="w-2 h-2 rounded-full bg-[#6E8E59] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 line-clamp-3">{description}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#6E8E59]" />
                          <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">القسم:</span> {category}</p>
                        </div>
                        <div className="bg-gradient-to-r from-[#6E8E59]/10 to-transparent rounded-lg p-3 border-r-2 border-[#6E8E59]">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#6E8E59]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold text-[#6E8E59]">الفترة الزمنية</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">البداية</p>
                              <p className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded shadow-sm">{startDate}</p>
                            </div>
                            <div className="flex-1 mx-3 border-t-2 border-dashed border-[#6E8E59] relative">
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#6E8E59] rounded-full"></div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">النهاية</p>
                              <p className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded shadow-sm">{endDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6E8E59]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(programs.length / slidesPerView) }).map((_, idx) => (
              <button key={idx}
                onClick={() => setCurrentIndex(idx * slidesPerView)}
                className={`h-2 w-2 mx-1 rounded-full ${Math.floor(currentIndex / slidesPerView) === idx ? 'bg-red-800' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/training-programs")}
            className="bg-[#6E8E59] hover:bg-red-800 text-white font-semibold py-3 px-10 rounded-lg shadow-md transition duration-300 group"
          >
            <span className="relative z-10">عرض كل البرامج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
