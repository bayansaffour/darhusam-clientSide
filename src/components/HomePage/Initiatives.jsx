import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InitiativeSlider() {
  const navigate = useNavigate();

  const initiatives = [
    {
      id: 1,
      title: "مبادرة زدني علماً",
      description: "انطلقت المبادرة بتاريخ 31/8/2021، وتهدف إلى توعية الشباب وأفراد المجتمع في مختلف الجوانب القانونية.",
      image: "/m2.png"
    },
    {
      id: 2,
      title: "مبادرة لنجعل شتاءهم ادفأ",
      description: "أُطلقت هذه المبادرة بتاريخ 20/1/2022، كمبادرة تطوعية وطنية تهدف إلى توسيع نطاق حملاتها الخيرية لتشمل عدداً من مناطق وأحياء مدينة الزرقاء",
      image: "/m1.jpg"
    },
    {
      id: 3,
      title: "مبادرة الزرقاء بخير",
      description: "تم اطلاقها بتاريخ ٢٩/٣/٢٠٢٢ بمناسبة حلول شهر رمضان المبارك حيث هدفت الى توزيع المواد الغذائية لمستحقيها وإقامة إفطارات جماعيّة للأيتام والمسنين.",
      image: "/m3.jpg"
    },
    {
      id: 4,
      title: "مبادرة \"شارك\"",
      description: "تم إطلاق مبادرة \"شارك\" بتاريخ 4/2/2024، وهي مبادرة وطنية تهدف إلى تعزيز الوعي المجتمعي بأهمية المشاركة في العملية الانتخابية",
      image: "/m4.jpg"
    },
    {
      id: 5,
      title: "مبادرة الريادة والابتكار",
      description: "تم إطلاق مبادرة \"الريادة والابتكار\" بتاريخ 15/2/2024، وتهدف إلى تقديم برامج ومساقات تدريبية لتأهيل وتطوير مختلف شرائح المجتمع، مع التركيز بشكل خاص على فئة الشباب",
      image: "/m5.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(initiatives.length / cardsToShow);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleCards = () => {
    const startIdx = currentIndex * cardsToShow;
    const endIdx = Math.min(startIdx + cardsToShow, initiatives.length);
    return initiatives.slice(startIdx, endIdx);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 " dir="rtl">
      <h2 className="text-center text-4xl font-bold text-[#780C28]">مبادراتنا</h2>
      <div className="h-1 w-24 bg-[#6E8E59] mx-auto mt-3 mb-5 rounded-full"></div>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
            {getVisibleCards().map((initiative) => (
              <div
                key={initiative.id}
                className="w-full relative rounded-lg overflow-hidden shadow-lg group"
                style={{ maxWidth: '24rem' }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={initiative.image}
                    alt={initiative.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {initiative.title}
                      </h3>
                      <p className="text-white text-sm leading-relaxed line-clamp-4">
                        {initiative.description}
                      </p>
                    </div>
                    {/* ممكن تحط زر تفاصيل لو حابب */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التنقل */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-[#780C28]" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-[#780C28]" />
        </button>
      </div>

      {/* نقاط التصفح */}
      <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-[#780C28] w-6' : 'bg-gray-300'
            }`}
            aria-label={`الذهاب للشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
