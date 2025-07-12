import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  MessageSquare,
  UserPlus,
  GraduationCap,
  Briefcase,
  Building2,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Calendar,
  BookOpen,
  Plus,
  ChevronLeft,
  CalendarDays,
  ChevronRight,
  Search,
  Bell,
  Settings,
  BarChart2,
  Video,
  FileText,
  Presentation,
  Newspaper,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import AdminForms from "../../components/NewsEvents/AdminForm";
import AdminSuccessStories from "./AdminSuccessStories";
import AdminPrograms from "./AdminPrograms";
import AdminBookings from "./AdminBookings";

const Dashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("statistics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "articles",
    file: null,
    thumbnailUrl: "",
    tags: "",
    isDownloadable: true,
    images: [],
    externalUrl: "",
  });
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "resources") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/resources`)
        .then((res) => setResources(res.data.data))
        .catch(() => setResources([]));
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    { id: "contacts", label: "الرسائل", icon: MessageSquare },
    { id: "volunteers", label: "المتطوعين", icon: Users },
    { id: "trainers", label: "المدربين", icon: UserPlus },
    { id: "trainees", label: "المتدربين", icon: GraduationCap },
    { id: "partners", label: "الشركاء", icon: Building2 },
    { id: "individual-partners", label: "الشركاء الأفراد", icon: Briefcase },
    { id: "news", label: "الأخبار والفعاليات", icon: Briefcase },
    { id: "success-stories", label: "قصص النجاح", icon: BookOpen },
    { id: "programs", label: "البرامج", icon: Calendar },
    { id: "resources", label: "الموارد", icon: BookOpen },
    { id: "bookings", label: "الحجوزات", icon: CalendarDays },
  ];

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newResource.title);
      formData.append("description", newResource.description);
      formData.append("category", newResource.category);

      if (newResource.category === 'articles') {
        if (!newResource.images || newResource.images.length === 0) {
          Swal.fire({
            title: "خطأ!",
            text: "يرجى تحميل صورة واحدة على الأقل للمقالة",
            icon: "error",
            confirmButtonText: "حسناً",
            confirmButtonColor: "#780C28",
          });
          return;
        }
        newResource.images.forEach((image) => {
          formData.append("images", image);
        });
      } else {
        if (newResource.file) {
          formData.append("images", newResource.file);
        } else if (newResource.externalUrl) {
          formData.append("externalUrl", newResource.externalUrl);
        } else {
          Swal.fire({
            title: "خطأ!",
            text: "يرجى رفع ملف أو إدخال رابط خارجي",
            icon: "error",
            confirmButtonText: "حسناً",
            confirmButtonColor: "#780C28",
          });
          return;
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resources`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "تمت الإضافة بنجاح!",
          text: "تم إضافة المورد بنجاح إلى المكتبة",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#780C28",
        });
        setNewResource({
          title: "",
          description: "",
          category: "articles",
          images: [],
          file: null,
          externalUrl: "",
        });
        setShowAddResourceModal(false);
        const resourcesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resources`);
        setResources(resourcesResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "حدث خطأ أثناء إضافة المورد",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لا يمكن التراجع عن حذف المورد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#780C28",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذف",
        cancelButtonText: "إلغاء",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/resources/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف المورد بنجاح",
            icon: "success",
            confirmButtonColor: "#780C28",
          });
          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/resources`)
            .then((res) => setResources(res.data.data))
            .catch(() => setResources([]));
        }
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "حدث خطأ أثناء حذف المورد",
        icon: "error",
        confirmButtonColor: "#780C28",
      });
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        Swal.fire({
          title: "خطأ!",
          text: "يرجى تسجيل الدخول مرة أخرى",
          icon: "error",
          confirmButtonColor: "#780C28",
        });
        navigate("/admin/login");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "تم الحذف!",
          text: response.data.message || "تم حذف الرسالة بنجاح",
          icon: "success",
          confirmButtonColor: "#780C28",
        });
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      let errorMessage = "حدث خطأ أثناء حذف الرسالة";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "خطأ!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#780C28",
      });
    }
  };

  const filterData = (data, query) => {
    if (!query) return data;
    query = query.toLowerCase();

    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#780C28] text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex mb-4" dir="rtl">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-gradient-to-b from-[#780C28] to-[#4A0719] shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">دار حسام</h2>
            <p className="text-white/70 text-sm mt-1">لوحة التحكم</p>
          </div>
         {/* ... باقي محتوى الـ JSX ... */}

          {/* Navigation Menu with improved scrolling */}
          <nav
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
            dir="rtl"
            style={{
              maxHeight: "calc(100vh - 180px)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
              direction: "ltr" // This will move the scrollbar to the right
            }}
          >
            <div className="p-4 space-y-2" style={{ direction: "rtl" }}> {/* Keep content RTL */}
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="ml-3" size={20} />
                  <span className="flex-1 text-right">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="ml-3" size={20} />
              <span className="flex-1 text-right">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mr-72">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-[#780C28]">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              {activeTab === "statistics" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#780C28] mb-6">
                    نظرة عامة
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        icon: MessageSquare,
                        label: "الرسائل",
                        value: stats?.stats.totalContacts,
                        color: "bg-blue-500",
                      },
                      {
                        icon: Users,
                        label: "المتطوعين",
                        value: stats?.stats.totalVolunteers,
                        color: "bg-green-500",
                      },
                      {
                        icon: UserPlus,
                        label: "المدربين",
                        value: stats?.stats.totalTrainers,
                        color: "bg-purple-500",
                      },
                      {
                        icon: GraduationCap,
                        label: "المتدربين",
                        value: stats?.stats.totalTrainees,
                        color: "bg-yellow-500",
                      },
                      {
                        icon: Building2,
                        label: "الشركاء المؤسسات",
                        value: stats?.stats.totalPartners,
                        color: "bg-red-500",
                      },
                      {
                        icon: Briefcase,
                        label: "الشركاء الأفراد",
                        value: stats?.stats.totalIndividualPartners,
                        color: "bg-indigo-500",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200"
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-3 rounded-xl ${stat.color} text-white`}
                          >
                            <stat.icon size={24} />
                          </div>
                          <div className="mr-4">
                            <p className="text-gray-500 text-sm">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "contacts" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      الرسائل
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في الرسائل..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الاسم
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الرسالة
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(stats?.contacts || [], searchQuery).map(
                          (contact) => (
                            <tr
                              key={contact._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {contact.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {contact.email}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {contact.phone}
                              </td>
                              <td className="px-6 py-4">
                                <div className="max-w-md">
                                  <div className="text-gray-600 line-clamp-2">
                                    {contact.message}
                                  </div>
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "تفاصيل الرسالة",
                                        text: contact.message,
                                        icon: "info",
                                        confirmButtonText: "حسناً",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }}
                                    className="text-[#780C28] text-sm hover:underline mt-1"
                                  >
                                    عرض كامل الرسالة
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleDeleteContact(contact._id)
                                    }
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "volunteers" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      المتطوعين
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في المتطوعين..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الاسم
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            المجال المفضل
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(stats?.volunteers || [], searchQuery).map(
                          (volunteer) => (
                            <tr
                              key={volunteer._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {volunteer.fullName}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {volunteer.email}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {volunteer.phone}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {volunteer.preferredField}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "تفاصيل المتطوع",
                                        html: `
                                        <div class="text-right">
                                          <p><strong>الاسم الكامل:</strong> ${
                                            volunteer.fullName
                                          }</p>
                                          <p><strong>رقم الهوية:</strong> ${
                                            volunteer.nationalID
                                          }</p>
                                          <p><strong>البريد الإلكتروني:</strong> ${
                                            volunteer.email
                                          }</p>
                                          <p><strong>رقم الهاتف:</strong> ${
                                            volunteer.phone
                                          }</p>
                                          <p><strong>رقم هاتف بديل:</strong> ${
                                            volunteer.alternatePhone ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>مكان السكن:</strong> ${
                                            volunteer.residence
                                          }</p>
                                          <p><strong>المستوى التعليمي:</strong> ${
                                            volunteer.educationLevel
                                          }</p>
                                          <p><strong>التخصص:</strong> ${
                                            volunteer.major || "غير متوفر"
                                          }</p>
                                          <p><strong>خبرة سابقة:</strong> ${
                                            volunteer.previousExperience
                                              ? "نعم"
                                              : "لا"
                                          }</p>
                                          <p><strong>الدور السابق:</strong> ${
                                            volunteer.previousRole ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>المجال المفضل:</strong> ${
                                            volunteer.preferredField
                                          }</p>
                                          <p><strong>المهارات:</strong> ${
                                            volunteer.skills || "غير متوفر"
                                          }</p>
                                          <p><strong>المصدر:</strong> ${
                                            volunteer.source || "غير متوفر"
                                          }</p>
                                          <p><strong>التوفر:</strong> ${
                                            volunteer.availability
                                          }</p>
                                        </div>
                                      `,
                                        confirmButtonText: "حسناً",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }}
                                    className="px-3 py-1 text-sm bg-[#780C28] text-white rounded hover:bg-opacity-90 transition-colors"
                                  >
                                    عرض
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const result = await Swal.fire({
                                          title: "هل أنت متأكد؟",
                                          text: "لا يمكن التراجع عن حذف المتطوع",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#780C28",
                                          cancelButtonColor: "#d33",
                                          confirmButtonText: "نعم، احذف",
                                          cancelButtonText: "إلغاء",
                                        });
//هنااااا
                                      if (result.isConfirmed) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/volunteer/${volunteer._id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );

                                          if (response.data.success) {
                                            await fetchDashboardData();
                                            Swal.fire({
                                              title: "تم الحذف!",
                                              text: "تم حذف المتطوع بنجاح",
                                              icon: "success",
                                              confirmButtonColor: "#780C28",
                                            });
                                          }
                                        }
                                      } catch (error) {
                                        Swal.fire({
                                          title: "خطأ!",
                                          text:
                                            error.response?.data?.message ||
                                            "حدث خطأ أثناء حذف المتطوع",
                                          icon: "error",
                                          confirmButtonColor: "#780C28",
                                        });
                                      }
                                    }}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === "news" && <AdminForms />}
              {activeTab === "success-stories" && <AdminSuccessStories />}
              {activeTab === "programs" && <AdminPrograms />}
              {activeTab === "bookings" && <AdminBookings />}

              {activeTab === "trainers" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      المدربين
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في المدربين..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الاسم
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            مجال التدريب
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(stats?.trainers || [], searchQuery).map(
                          (trainer) => (
                            <tr
                              key={trainer._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {trainer.fullName}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainer.email}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainer.phone}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainer.trainingField}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "تفاصيل المدرب",
                                        html: `
                                        <div class="text-right">
                                          <p><strong>الاسم الكامل:</strong> ${
                                            trainer.fullName
                                          }</p>
                                          <p><strong>رقم الهوية:</strong> ${
                                            trainer.nationalID
                                          }</p>
                                          <p><strong>البريد الإلكتروني:</strong> ${
                                            trainer.email
                                          }</p>
                                          <p><strong>رقم الهاتف:</strong> ${
                                            trainer.phone
                                          }</p>
                                          <p><strong>رقم هاتف بديل:</strong> ${
                                            trainer.alternatePhone ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>مكان السكن:</strong> ${
                                            trainer.residence
                                          }</p>
                                          <p><strong>المجال التعليمي:</strong> ${
                                            trainer.educationField
                                          }</p>
                                          <p><strong>مجال التدريب:</strong> ${
                                            trainer.trainingField
                                          }</p>
                                          <p><strong>سنوات الخبرة:</strong> ${
                                            trainer.experienceYears
                                          }</p>
                                          <p><strong>المراجع:</strong></p>
                                          ${trainer.referees
                                            .map(
                                              (referee) => `
                                            <div class="mr-4 mb-2">
                                              <p><strong>الاسم:</strong> ${
                                                referee.name
                                              }</p>
                                              <p><strong>الهاتف:</strong> ${
                                                referee.phone
                                              }</p>
                                              <p><strong>البريد الإلكتروني:</strong> ${
                                                referee.email
                                              }</p>
                                              <p><strong>المنصب:</strong> ${
                                                referee.position
                                              }</p>
                                              <p><strong>مكان السكن:</strong> ${
                                                referee.residence || "غير متوفر"
                                              }</p>
                                            </div>
                                          `
                                            )
                                            .join("")}
                                        </div>
                                      `,
                                        confirmButtonText: "حسناً",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }}
                                    className="px-3 py-1 text-sm bg-[#780C28] text-white rounded hover:bg-opacity-90 transition-colors"
                                  >
                                    عرض
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const result = await Swal.fire({
                                          title: "هل أنت متأكد؟",
                                          text: "لا يمكن التراجع عن حذف المدرب",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#780C28",
                                          cancelButtonColor: "#d33",
                                          confirmButtonText: "نعم، احذف",
                                          cancelButtonText: "إلغاء",
                                        });

                                        if (result.isConfirmed) {
                                      const response = await axios.delete(
  `${import.meta.env.VITE_BACKEND_URL}/api/trainer/${trainer._id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  }
);

                                          if (response.data.success) {
                                            await fetchDashboardData();
                                            Swal.fire({
                                              title: "تم الحذف!",
                                              text: "تم حذف المدرب بنجاح",
                                              icon: "success",
                                              confirmButtonColor: "#780C28",
                                            });
                                          }
                                        }
                                      } catch (error) {
                                        Swal.fire({
                                          title: "خطأ!",
                                          text:
                                            error.response?.data?.message ||
                                            "حدث خطأ أثناء حذف المدرب",
                                          icon: "error",
                                          confirmButtonColor: "#780C28",
                                        });
                                      }
                                    }}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "trainees" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      المتدربين
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في المتدربين..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الاسم
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            مجال التدريب
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(stats?.trainees || [], searchQuery).map(
                          (trainee) => (
                            <tr
                              key={trainee._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {trainee.fullName}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainee.email}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainee.phone}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {trainee.trainingField}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "تفاصيل المتدرب",
                                        html: `
                                        <div class="text-right">
                                          <p><strong>الاسم الكامل:</strong> ${
                                            trainee.fullName
                                          }</p>
                                          <p><strong>رقم الهوية:</strong> ${
                                            trainee.nationalID
                                          }</p>
                                          <p><strong>البريد الإلكتروني:</strong> ${
                                            trainee.email
                                          }</p>
                                          <p><strong>رقم الهاتف:</strong> ${
                                            trainee.phone
                                          }</p>
                                          <p><strong>رقم هاتف بديل:</strong> ${
                                            trainee.alternatePhone ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>مكان السكن:</strong> ${
                                            trainee.residence
                                          }</p>
                                          <p><strong>مجال التدريب:</strong> ${
                                            trainee.trainingField
                                          }</p>
                                          <p><strong>خبرة سابقة:</strong> ${
                                            trainee.previousExperience
                                              ? "نعم"
                                              : "لا"
                                          }</p>
                                          <p><strong>تفاصيل الخبرة:</strong> ${
                                            trainee.experienceDetails ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>المهارات:</strong> ${
                                            trainee.skills || "غير متوفر"
                                          }</p>
                                          <p><strong>المساهمة:</strong> ${
                                            trainee.contribution || "غير متوفر"
                                          }</p>
                                          <p><strong>المصدر:</strong> ${
                                            trainee.source || "غير متوفر"
                                          }</p>
                                          <p><strong>المراجع:</strong></p>
                                          ${trainee.referees
                                            .map(
                                              (referee) => `
                                            <div class="mr-4 mb-2">
                                              <p><strong>الاسم:</strong> ${
                                                referee.name
                                              }</p>
                                              <p><strong>الهاتف:</strong> ${
                                                referee.phone
                                              }</p>
                                              <p><strong>البريد الإلكتروني:</strong> ${
                                                referee.email
                                              }</p>
                                              <p><strong>المنصب:</strong> ${
                                                referee.position
                                              }</p>
                                              <p><strong>مكان السكن:</strong> ${
                                                referee.residence || "غير متوفر"
                                              }</p>
                                            </div>
                                          `
                                            )
                                            .join("")}
                                        </div>
                                      `,
                                        confirmButtonText: "حسناً",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }}
                                    className="px-3 py-1 text-sm bg-[#780C28] text-white rounded hover:bg-opacity-90 transition-colors"
                                  >
                                    عرض
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const result = await Swal.fire({
                                          title: "هل أنت متأكد؟",
                                          text: "لا يمكن التراجع عن حذف المتدرب",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#780C28",
                                          cancelButtonColor: "#d33",
                                          confirmButtonText: "نعم، احذف",
                                          cancelButtonText: "إلغاء",
                                        });

                                    if (result.isConfirmed) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/trainee/${trainee._id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );

                                          if (response.data.success) {
                                            await fetchDashboardData();
                                            Swal.fire({
                                              title: "تم الحذف!",
                                              text: "تم حذف المتدرب بنجاح",
                                              icon: "success",
                                              confirmButtonColor: "#780C28",
                                            });
                                          }
                                        }
                                      } catch (error) {
                                        Swal.fire({
                                          title: "خطأ!",
                                          text:
                                            error.response?.data?.message ||
                                            "حدث خطأ أثناء حذف المتدرب",
                                          icon: "error",
                                          confirmButtonColor: "#780C28",
                                        });
                                      }
                                    }}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                                  >

                                    
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "partners" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      الشركاء المؤسسات
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في الشركاء..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            اسم المؤسسة
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            نوع الشراكة
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(stats?.partners || [], searchQuery).map(
                          (partner) => (
                            <tr
                              key={partner._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {partner.organizationName}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {partner.director.email}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {partner.director.phone}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {partner.partnershipType}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: "تفاصيل الشريك",
                                        html: `
                                        <div class="text-right">
                                          <p><strong>اسم المؤسسة:</strong> ${
                                            partner.organizationName
                                          }</p>
                                          <p><strong>موقع المؤسسة:</strong> ${
                                            partner.organizationLocation
                                          }</p>
                                          <p><strong>مرخصة:</strong> ${
                                            partner.isLicensed ? "نعم" : "لا"
                                          }</p>
                                          <p><strong>الصناعة:</strong> ${
                                            partner.industry
                                          }</p>
                                          <p><strong>المدير:</strong></p>
                                          <div class="mr-4 mb-2">
                                            <p><strong>الاسم:</strong> ${
                                              partner.director.name
                                            }</p>
                                            <p><strong>الهاتف:</strong> ${
                                              partner.director.phone
                                            }</p>
                                            <p><strong>البريد الإلكتروني:</strong> ${
                                              partner.director.email
                                            }</p>
                                          </div>
                                          <p><strong>الموظف المسؤول:</strong></p>
                                          <div class="mr-4 mb-2">
                                            <p><strong>الاسم:</strong> ${
                                              partner.liaison.name
                                            }</p>
                                            <p><strong>الهاتف:</strong> ${
                                              partner.liaison.phone
                                            }</p>
                                            <p><strong>البريد الإلكتروني:</strong> ${
                                              partner.liaison.email
                                            }</p>
                                          </div>
                                          <p><strong>نوع الشراكة:</strong> ${
                                            partner.partnershipType
                                          }</p>
                                          <p><strong>المدة:</strong> ${
                                            partner.duration
                                          }</p>
                                          <p><strong>التوقعات:</strong> ${
                                            partner.expectations || "غير متوفر"
                                          }</p>
                                          <p><strong>عرضنا:</strong> ${
                                            partner.ourOffer || "غير متوفر"
                                          }</p>
                                          <p><strong>وسائل التواصل الاجتماعي:</strong> ${
                                            partner.socialMedia || "غير متوفر"
                                          }</p>
                                          <p><strong>المصدر:</strong> ${
                                            partner.source || "غير متوفر"
                                          }</p>
                                        </div>
                                      `,
                                        confirmButtonText: "حسناً",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }}
                                    className="px-3 py-1 text-sm bg-[#780C28] text-white rounded hover:bg-opacity-90 transition-colors"
                                  >
                                    عرض
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const result = await Swal.fire({
                                          title: "هل أنت متأكد؟",
                                          text: "لا يمكن التراجع عن حذف الشريك",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#780C28",
                                          cancelButtonColor: "#d33",
                                          confirmButtonText: "نعم، احذف",
                                          cancelButtonText: "إلغاء",
                                        });

                                     if (result.isConfirmed) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/volunteer/${volunteer._id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
  if (response.data.success) {
    await fetchDashboardData();
    Swal.fire({
      title: "تم الحذف!",
      text: "تم حذف المتطوع بنجاح",
      icon: "success",
      confirmButtonColor: "#780C28",
    });
  }
}

                                      } catch (error) {
                                        Swal.fire({
                                          title: "خطأ!",
                                          text:
                                            error.response?.data?.message ||
                                            "حدث خطأ أثناء حذف الشريك",
                                          icon: "error",
                                          confirmButtonColor: "#780C28",
                                        });
                                      }
                                    }}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "individual-partners" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      الشركاء الأفراد
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="بحث في الشركاء..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الاسم
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            البريد الإلكتروني
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            رقم الهاتف
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            مجال العمل
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filterData(
                          stats?.individualPartners || [],
                          searchQuery
                        ).map((partner) => (
                          <tr
                            key={partner._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">
                                {partner.fullName}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {partner.email}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {partner.phone}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {partner.workField}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: "تفاصيل الشريك",
                                      html: `
                                        <div class="text-right">
                                          <p><strong>الاسم الكامل:</strong> ${
                                            partner.fullName
                                          }</p>
                                          <p><strong>رقم الهوية:</strong> ${
                                            partner.nationalId
                                          }</p>
                                          <p><strong>البريد الإلكتروني:</strong> ${
                                            partner.email
                                          }</p>
                                          <p><strong>رقم الهاتف:</strong> ${
                                            partner.phone
                                          }</p>
                                          <p><strong>رقم هاتف بديل:</strong> ${
                                            partner.alternativePhone ||
                                            "غير متوفر"
                                          }</p>
                                          <p><strong>مكان السكن:</strong> ${
                                            partner.residence
                                          }</p>
                                          <p><strong>مجال العمل:</strong> ${
                                            partner.workField
                                          }</p>
                                          <p><strong>نوع الدعم:</strong> ${
                                            partner.supportType
                                          }</p>
                                          <p><strong>سبب الدعم:</strong> ${
                                            partner.supportReason
                                          }</p>
                                          <p><strong>كيف سمعت عنا:</strong> ${
                                            partner.howDidYouHear
                                          }</p>
                                          <p><strong>المراجع:</strong> ${
                                            partner.references
                                          }</p>
                                          <p><strong>وسائل التواصل الاجتماعي:</strong> ${
                                            partner.socialMedia || "غير متوفر"
                                          }</p>
                                        </div>
                                      `,
                                      confirmButtonText: "حسناً",
                                      confirmButtonColor: "#780C28",
                                    });
                                  }}
                                  className="px-3 py-1 text-sm bg-[#780C28] text-white rounded hover:bg-opacity-90 transition-colors"
                                >
                                  عرض
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const result = await Swal.fire({
                                        title: "هل أنت متأكد؟",
                                        text: "لا يمكن التراجع عن حذف الشريك",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#780C28",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "نعم، احذف",
                                        cancelButtonText: "إلغاء",
                                      });

                                     if (result.isConfirmed) {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/individual-partner/${partner._id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );

                                        if (response.data.success) {
                                          await fetchDashboardData();
                                          Swal.fire({
                                            title: "تم الحذف!",
                                            text: "تم حذف الشريك بنجاح",
                                            icon: "success",
                                            confirmButtonColor: "#780C28",
                                          });
                                        }
                                      }
                                    } catch (error) {
                                      Swal.fire({
                                        title: "خطأ!",
                                        text:
                                          error.response?.data?.message ||
                                          "حدث خطأ أثناء حذف الشريك",
                                        icon: "error",
                                        confirmButtonColor: "#780C28",
                                      });
                                    }
                                  }}
                                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#780C28]">
                      إدارة الموارد
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="بحث في الموارد..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                        />
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      <button
                        onClick={() => setShowAddResourceModal(true)}
                        className="flex items-center px-4 py-2 bg-[#780C28] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        <Plus size={20} className="ml-2" />
                        إضافة مورد جديد
                      </button>
                    </div>
                  </div>

                  {/* عرض الموارد في شكل بطاقات */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterData(resources, searchQuery).map((resource) => (
                      <div
                        key={resource._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        {/* صورة المورد */}
                        <div className="relative h-48 bg-gray-100">
                          {resource.images && resource.images.length > 0 ? (
                           <img
  src={
    resource.images[0].startsWith('http')
      ? resource.images[0]
      : `${import.meta.env.VITE_BACKEND_URL}${resource.images[0]}`
  }
  alt={resource.title}
  className="w-full h-full object-cover"
/>

                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              {resource.category === 'videos' && <Video className="w-12 h-12 text-gray-400" />}
                              {resource.category === 'pdf' && <FileText className="w-12 h-12 text-gray-400" />}
                              {resource.category === 'presentations' && <Presentation className="w-12 h-12 text-gray-400" />}
                              {resource.category === 'articles' && <Newspaper className="w-12 h-12 text-gray-400" />}
                            </div>
                          )}

                          
                          <div className="absolute top-2 right-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              resource.category === 'articles' ? 'bg-blue-100 text-blue-800' :
                              resource.category === 'videos' ? 'bg-red-100 text-red-800' :
                              resource.category === 'presentations' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {resource.category === 'articles' ? 'مقال' :
                               resource.category === 'videos' ? 'فيديو' :
                               resource.category === 'presentations' ? 'عرض تقديمي' : 'PDF'}
                            </span>
                          </div>
                        </div>

                        {/* محتوى المورد */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {resource.description}
                          </p>

                          {/* أزرار الإجراءات */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {resource.images && resource.images.length > 0 && (
                                <span className="text-sm text-gray-500">
                                  {resource.images.length} صورة
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteResource(resource._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* رسالة في حالة عدم وجود موارد */}
                  {filterData(resources, searchQuery).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <BookOpen size={48} className="mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد موارد
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery ? 'لم يتم العثور على موارد تطابق بحثك' : 'قم بإضافة مورد جديد للبدء'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl transform hover:scale-[1.02] transition-transform duration-200">
            <h3 className="text-2xl font-bold text-[#780C28] mb-6">
              إضافة مورد جديد
            </h3>
            <form onSubmit={handleAddResource}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value, images: [], file: null, externalUrl: '' })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                    required
                  >
                    <option value="articles">مقالات</option>
                    <option value="videos">فيديوهات</option>
                    <option value="presentations">عروض تقديمية</option>
                    <option value="pdf">ملفات PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                    rows="3"
                    required
                  />
                </div>

                {/* الحقول الديناميكية حسب التصنيف */}
                {newResource.category === 'articles' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصور
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 10) {
                          Swal.fire({
                            title: "خطأ!",
                            text: "يمكن تحميل 10 صور كحد أقصى",
                            icon: "error",
                            confirmButtonText: "حسناً",
                            confirmButtonColor: "#780C28",
                          });
                          return;
                        }
                        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
                        if (oversizedFiles.length > 0) {
                          Swal.fire({
                            title: "خطأ!",
                            text: "حجم كل صورة يجب أن لا يتجاوز 5 ميجابايت",
                            icon: "error",
                            confirmButtonText: "حسناً",
                            confirmButtonColor: "#780C28",
                          });
                          return;
                        }
                        setNewResource({ ...newResource, images: files, file: null, externalUrl: '' });
                      }}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      يمكنك اختيار حتى 10 صور. الحد الأقصى لحجم كل صورة هو 5 ميجابايت.
                    </p>
                  </div>
                )}

                {(newResource.category === 'videos' || newResource.category === 'pdf' || newResource.category === 'presentations') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {newResource.category === 'videos' ? 'ملف فيديو أو رابط يوتيوب' : newResource.category === 'pdf' ? 'ملف PDF أو رابط خارجي' : 'ملف عرض أو رابط خارجي'}
                    </label>
                    <input
                      type="file"
                      accept={
                        newResource.category === 'videos'
                          ? 'video/*'
                          : newResource.category === 'pdf'
                          ? 'application/pdf'
                          : '.pdf,.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                      }
                      onChange={(e) => {
                        setNewResource({ ...newResource, file: e.target.files[0], images: [], externalUrl: '' });
                      }}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200 mb-2"
                    />
                    <input
                      type="url"
                      placeholder={
                        newResource.category === 'videos'
                          ? 'أدخل رابط يوتيوب أو فيديو خارجي...'
                          : newResource.category === 'pdf'
                          ? 'أدخل رابط ملف PDF خارجي...'
                          : 'أدخل رابط ملف العرض (PDF/PPT) خارجي...'
                      }
                      value={newResource.externalUrl || ''}
                      onChange={(e) => setNewResource({ ...newResource, externalUrl: e.target.value, file: null, images: [] })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      يمكنك رفع ملف أو وضع رابط خارجي (مثل يوتيوب، جوجل درايف، ...)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#780C28] text-white rounded-xl hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
                >
                  إضافة المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
