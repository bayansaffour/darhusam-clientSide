import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function AboutUsSection() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="bg-white py-16 lg:py-24" dir="rtl ">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main container with diagonal design */}
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Left section with image */}
                        <div className="md:w-2/5 relative">
                            {/* Diagonal overlay */}
                            <div
                                className="absolute top-0 right-0 bottom-0 left-0 z-10"
                                style={{
                                    background: `linear-gradient(135deg, transparent 0%, transparent 50%, #780C28 50%, #780C28 100%)`,
                                    opacity: 0.95
                                }}
                            ></div>

                            {/* City image */}
                            <div className="h-full">
                                <img
                                    src="https://images.pexels.com/photos/461049/pexels-photo-461049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="صورة"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Logo on bottom left */}
                            <div className="absolute bottom-6 left-6 z-20 bg-white p-2 rounded-full w-16 h-16 flex items-center justify-center">
                                <div className="text-2xl font-bold flex items-center justify-center">
                                    <span style={{ color: '#780C28' }}>م</span>
                                    <span style={{ color: '#6E8E59' }}>ن</span>
                                </div>
                            </div>
                        </div>

                        {/* Right content section */}
                        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between relative">
                            {/* Diagonal element on top */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 z-0"
                                style={{
                                    background: `linear-gradient(135deg, #780C28 0%, #780C28 100%, transparent 100%)`,
                                    opacity: 0.1
                                }}
                            ></div>

                            {/* Header */}
                            <div>
                                <h2 className="text-5xl font-bold mb-6" style={{ color: '#780C28' }}>
                                    من <br />نحن
                                </h2>
                                <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#6E8E59' }}></div>
                            </div>

                            {/* Content */}
                            <div className="z-10">
                                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                                    <strong>
                                        شركة غير ربحية معنية بالتوعية القانونية في جميع المجالات السياسية والاقتصادية والثقافية والاجتماعية
                                    </strong>
                                </p>

                                <p className="text-base text-gray-800 leading-relaxed mb-8">
                                   نهدف الى تحقيق الوعي والمعرفة في كافة المجالات السياسية والاقتصادية والاجتماعية والثقافية وتمكين الشباب من خلال برامجنا المتاحة.
                                     </p>


                                {/* Button */}
                                <div className="mt-4">
                                    <a
                                        href="about"
                                        className="group inline-flex items-center text-lg font-medium transition-all duration-300"
                                        style={{
                                            color: isHovered ? '#780C28' : '#6E8E59',
                                            textDecoration: 'none'
                                        }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        <span>تفاصيل أكثر</span>
                                        <ArrowLeft
                                            className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                                            size={20}
                                            style={{ color: isHovered ? '#780C28' : '#6E8E59' }}
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Bottom border */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-white to-white">
                                <div className="w-1/3 h-full" style={{ backgroundColor: '#780C28' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}