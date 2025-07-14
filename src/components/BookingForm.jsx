import React, { useState } from "react";
  import { apiBaseUrl } from "../../src/utils/api"

const BookingForm = ({ hall, bookedTimes, selectedDate, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: selectedDate || "",
    time: "",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookedTimesForDate = bookedTimes[formData.date] || [];
    if (bookedTimesForDate.includes(formData.time)) {
      setMessage("الوقت المحدد محجوز، يرجى اختيار وقت آخر.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hallId: hall.id,
          hallName: hall.name,
        }),
      });

      if (response.ok) {
        setMessage("تم إرسال طلب الحجز بنجاح، وسيتم التواصل معك قريبًا.");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          date: "",
          time: "",
          notes: "",
        });
        onBookingSuccess();
      } else {
        setMessage("حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      setMessage("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimes = () => {
    const bookedTimesForDate = bookedTimes[formData.date] || [];
    return hall.availableTimes.map((time) => ({
      value: time,
      disabled: bookedTimesForDate.includes(time),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#780C28] text-center pb-2 border-b border-gray-200">
        نموذج حجز {hall.name}
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md text-center ${
            message.includes("نجاح")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
              placeholder="أدخل رقم الهاتف"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
            placeholder="example@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              التاريخ
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              الوقت
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.date}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
            >
              <option value="">اختر الوقت</option>
              {getAvailableTimes().map(({ value, disabled }) => (
                <option key={value} value={value} disabled={disabled}>
                  {value} {disabled ? "(محجوز)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            ملاحظات إضافية
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#780C28]"
            placeholder="أي ملاحظات إضافية تريد إضافتها"
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#6E8E59] hover:bg-[#5d7a4b] text-white py-3 px-6 rounded-md font-medium transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "جاري الإرسال..." : "إرسال الحجز"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
