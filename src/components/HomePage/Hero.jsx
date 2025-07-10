import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function HeroSection() {
   const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative bg-white overflow-hidden" dir="rtl">
      {/* Background pattern/decoration */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute left-0 top-0 h-full w-1/4 sm:w-1/3 bg-opacity-20" 
             style={{ backgroundColor: '#780C28', opacity: 0.05 }}></div>
        <div className="absolute right-0 bottom-0 h-1/3 sm:h-1/2 w-1/3 sm:w-1/4 bg-opacity-10"
             style={{ backgroundColor: '#6E8E59', opacity: 0.05 }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-8 sm:py-12 md:py-16 lg:py-24">
          
          {/* Text content */}
          <div className="w-full lg:w-1/2 mb-8 sm:mb-10 lg:mb-0 text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight" style={{ color: '#780C28' }}>
              معًا نحو مواطنة فاعلة
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-1xl mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0" style={{ color: '#333' }}>
              تطوير وتعزيز الثقافة المعرفية لدى المواطنين حول حقوقهم وواجباتهم والتي تعزز دورهم الحقيقي من المواطنة الفاعلة
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <button
        className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 text-center"
        style={{ 
          backgroundColor: isHovered ? '#6E8E59' : '#780C28',
          color: 'white'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/training-programs')}   
      >
        اكتشف برامجنا
      </button>

      <button
        className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 border-2 border-[#780C28] text-[#780C28] hover:bg-[#780C28] hover:text-white text-center"
        onClick={() => navigate('/join-us')}   
      >
        سجل الآن
      </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="w-full lg:w-1/2 px-2 sm:px-0">
            <div 
              className="relative rounded-lg overflow-hidden shadow-xl mx-auto max-w-md sm:max-w-lg lg:max-w-none h-64 sm:h-80 md:h-96 lg:h-[400px]" 
              style={{ 
                borderColor: '#6E8E59',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <img 
                src="https://images.pexels.com/photos/5029919/pexels-photo-5029919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="صورة توضيحية للمواطنة فاعلة" 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 rounded-tr-full" 
                   style={{ backgroundColor: '#780C28' }}></div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-bl-full" 
                   style={{ backgroundColor: '#6E8E59' }}></div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-16 sm:h-20 lg:h-auto">
          <path 
            fill="#780C28" 
            fillOpacity="0.1" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,56C1248,48,1344,32,1392,24L1440,16L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
          />
          <path 
            fill="#6E8E59" 
            fillOpacity="0.1" 
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,69.3C672,75,768,85,864,80C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
          />
        </svg>
      </div>
    </div>
  );
}