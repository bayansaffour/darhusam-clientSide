

import React, { useState, useEffect } from "react";
import HallCard from "../components/HallCard";
import BookingForm from "../components/BookingForm";

const halls = [
  {
    id: 1,
    name: "قاعة 1",
    capacity: 100,
    specs: "نظام صوتي متطور، إضاءة احترافية، شاشة عرض",
    image: "/hall1.jpg",
    availableTimes: ["09:00", "12:00", "15:00", "18:00"],
  },
  {
    id: 2,
    name: "قاعة 2",
    capacity: 150,
    specs: "مكيف هواء، كراسي مريحة، طاولات قابلة للتعديل",
    image: "/hall2.jpg",
    availableTimes: ["10:00", "13:00", "16:00", "19:00"],
  },
];

const BookingPage = () => {
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookedTimes, setBookedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchBookedTimes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/booked-times"
      );
      if (!response.ok) {
        throw new Error("فشل في الحصول على الأوقات المحجوزة");
      }
      const data = await response.json();
      setBookedTimes(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching booked times:", error);
      setError("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedTimes();
  }, []);

  const handleBookingSuccess = () => {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-300 text-green-800 px-6 py-3 rounded-md shadow-lg z-50 flex items-center";
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">تم إرسال طلب الحجز بنجاح!</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s ease";
      setTimeout(() => notification.remove(), 500);
    }, 5000);

    setSelectedHall(null);
    fetchBookedTimes();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-10 mb-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#780C28]  mb-3">حجز القاعات</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          اختر إحدى قاعاتنا المميزة وقم بحجزها في الوقت المناسب لك. نوفر لك
          قاعات مجهزة بأحدث التقنيات لمناسباتك المختلفة.
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-2">
          اختر التاريخ
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full max-w-xs p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#780C28] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {halls.map((hall) => (
            <HallCard
              key={hall.id}
              hall={hall}
              bookedTimes={bookedTimes[hall.id]?.[selectedDate] || []}
              selectedDate={selectedDate}
              onSelect={() => {
                setSelectedHall(hall);
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }}
            />
          ))}
        </div>
      )}

      {selectedHall && (
        <div id="booking-form">
          <BookingForm
            hall={selectedHall}
            bookedTimes={bookedTimes[selectedHall.id] || {}}
            selectedDate={selectedDate}
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default BookingPage;