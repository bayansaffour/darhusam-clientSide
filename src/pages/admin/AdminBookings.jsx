// components/Bookings/AdminBookings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, CalendarDays, Home, Trash2, Filter, X, Clock, Mail, Phone } from "lucide-react";
import Swal from 'sweetalert2';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [halls, setHalls] = useState([]);
  const [filters, setFilters] = useState({
    hallId: "",
    date: "",
    search: "",
  });

  useEffect(() => {
    fetchData();
    fetchHalls();
  }, [filters]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (filters.hallId) params.append("hallId", filters.hallId);
      if (filters.date) params.append("date", filters.date);
      if (filters.search) params.append("search", filters.search);

      const response = await axios.get(
        `http://localhost:5000/api/bookings?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:5000/api/bookings/unique-halls",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHalls(response.data);
    } catch (err) {
      console.error("Failed to fetch halls:", err);
      // Fallback to empty array if API fails
      setHalls([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد من حذف هذا الحجز؟',
        text: "لا يمكن التراجع عن هذا الإجراء!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#780C28',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف الحجز',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        await Swal.fire({
          title: 'تم الحذف!',
          text: 'تم حذف الحجز بنجاح.',
          icon: 'success',
          confirmButtonColor: '#780C28'
        });
        
        fetchData();
      }
    } catch (err) {
      Swal.fire({
        title: 'خطأ!',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف الحجز',
        icon: 'error',
        confirmButtonColor: '#780C28'
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      hallId: "",
      date: "",
      search: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#EAFAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#780C28] rounded-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#780C28]">إدارة الحجوزات</h2>
              <p className="text-gray-500 text-sm">عرض وإدارة جميع الحجوزات</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-400 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <CalendarDays className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:border-[#780C28] focus:ring-1 focus:ring-[#780C28]/50"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="بحث بالاسم أو الهاتف أو الإيميل"
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:border-[#780C28] focus:ring-1 focus:ring-[#780C28]/50"
              />
            </div>

            <button
              onClick={clearFilters}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 ml-2" />
              مسح الفلتر
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#780C28] border-t-transparent"></div>
              <p className="mt-3 text-gray-600">جاري تحميل الحجوزات...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد حجوزات متطابقة مع معايير البحث
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#780C28]/10 rounded-lg mt-1">
                          <CalendarDays className="text-[#780C28] w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.fullName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {booking.hallName}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="w-4 h-4 ml-1 text-[#780C28]" />
                              {booking.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 ml-1 text-[#780C28]" />
                              {booking.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 ml-1 text-[#780C28]" />
                              {booking.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 ml-1 text-[#780C28]" />
                              {booking.email}
                            </div>
                          </div>

                          {booking.notes && (
                            <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                              {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف الحجز"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
