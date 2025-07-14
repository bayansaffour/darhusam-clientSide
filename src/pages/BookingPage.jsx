import React, { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../../src/utils/api";
const BookingForm = ({ hall, selectedDate, bookedTimes, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${apiBaseUrl}/api/bookings`, {
        ...formData,
        hallId: hall.id,
        date: selectedDate,
      });

      onBookingSuccess();
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        notes: "",
        time: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال الحجز");
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = hall.availableTimes.filter(
    (time) => !bookedTimes[selectedDate]?.includes(time)
  );

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#780C28] mb-4">نموذج الحجز لـ {hall.name}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">الاسم الكامل</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">الملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">اختر الوقت</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">-- اختر وقتًا --</option>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))
            ) : (
              <option disabled>لا يوجد أوقات متاحة في هذا اليوم</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#780C28] text-white py-3 rounded-md hover:bg-[#780C28]/90 transition"
        >
          {loading ? "جاري الإرسال..." : "إرسال الحجز"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
