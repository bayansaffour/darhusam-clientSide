import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Image } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminForms = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const navigate = useNavigate();

  // Form states
  const [articleForm, setArticleForm] = useState({
    title: "",
    date: "",
    summary: "",
    content: "",
    author: "",
    readTime: "5 دقائق",
    isFeatured: false,
    image: null,
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    capacity: "",
    isFeatured: false,
    image: null,
  });

  const [mediaForm, setMediaForm] = useState({
    title: "",
    description: "",
    type: "image",
    file: null,
  });

  const handleArticleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEventChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMediaChange = (e) => {
    const { name, value, type } = e.target;
    setMediaForm((prev) => ({
      ...prev,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const handleArticleImage = (e) => {
    setArticleForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleEventImage = (e) => {
    setEventForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", articleForm.title);
      formData.append("date", articleForm.date);
      formData.append("summary", articleForm.summary);
      formData.append("content", articleForm.content);
      formData.append("author", articleForm.author);
      formData.append("readTime", articleForm.readTime);
      formData.append("isFeatured", articleForm.isFeatured);
      if (articleForm.image) {
        formData.append("image", articleForm.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/news/articles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "تمت الإضافة بنجاح",
        text: "تمت إضافة المقال بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });

      setArticleForm({
        title: "",
        date: "",
        summary: "",
        content: "",
        author: "",
        readTime: "5 دقائق",
        isFeatured: false,
        image: null,
      });
    } catch (error) {
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء إضافة المقال",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
      console.error("Error adding article:", error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", eventForm.title);
      formData.append("date", eventForm.date);
      formData.append("time", eventForm.time);
      formData.append("location", eventForm.location);
      formData.append("description", eventForm.description);
      formData.append("capacity", eventForm.capacity);
      formData.append("isFeatured", eventForm.isFeatured);
      if (eventForm.image) {
        formData.append("image", eventForm.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/news/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "تمت الإضافة بنجاح",
        text: "تمت إضافة الفعالية بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });

      setEventForm({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        capacity: "",
        isFeatured: false,
        image: null,
      });
    } catch (error) {
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء إضافة الفعالية",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
      console.error("Error adding event:", error);
    }
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", mediaForm.title);
      formData.append("description", mediaForm.description);
      formData.append("type", mediaForm.type);
      formData.append("media", mediaForm.file);

      const response = await axios.post(
        "http://localhost:5000/api/news/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "تمت الإضافة بنجاح",
          text: "تمت إضافة الوسائط بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#780C28",
        });

        setMediaForm({
          title: "",
          description: "",
          type: "image",
          file: null,
        });
      } else {
        throw new Error(response.data.message || "حدث خطأ أثناء إضافة الوسائط");
      }
    } catch (error) {
      console.error("Error adding media:", error);
      let errorMessage = "حدث خطأ أثناء إضافة الوسائط";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.";
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        title: "خطأ",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ direction: "rtl" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          لوحة التحكم - إضافة محتوى جديد
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "articles"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            <FileText size={18} />
            مقالات
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "events"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            <Calendar size={18} />
            فعاليات
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "media"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            <Image size={18} />
            وسائط
          </button>
        </div>

        {/* Articles Form */}
        {activeTab === "articles" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#6E8E59" }}>
              إضافة مقال جديد
            </h2>
            <form onSubmit={handleArticleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    عنوان المقال
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={articleForm.title}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    name="date"
                    value={articleForm.date}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">المؤلف</label>
                  <input
                    type="text"
                    name="author"
                    value={articleForm.author}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    وقت القراءة
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={articleForm.readTime}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">
                    ملخص المقال
                  </label>
                  <textarea
                    name="summary"
                    value={articleForm.summary}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">
                    محتوى المقال
                  </label>
                  <textarea
                    name="content"
                    value={articleForm.content}
                    onChange={handleArticleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    صورة المقال
                  </label>
                  <input
                    type="file"
                    onChange={handleArticleImage}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    accept="image/*"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={articleForm.isFeatured}
                    onChange={handleArticleChange}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 text-gray-700">مقال مميز</label>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                إضافة المقال
              </button>
            </form>
          </div>
        )}

        {/* Events Form */}
        {activeTab === "events" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#6E8E59" }}>
              إضافة فعالية جديدة
            </h2>
            <form onSubmit={handleEventSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    عنوان الفعالية
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">الوقت</label>
                  <input
                    type="text"
                    name="time"
                    value={eventForm.time}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">المكان</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">السعة</label>
                  <input
                    type="number"
                    name="capacity"
                    value={eventForm.capacity}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={eventForm.isFeatured}
                    onChange={handleEventChange}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 text-gray-700">فعالية مميزة</label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">
                    وصف الفعالية
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    صورة الفعالية
                  </label>
                  <input
                    type="file"
                    onChange={handleEventImage}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    accept="image/*"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                إضافة الفعالية
              </button>
            </form>
          </div>
        )}

        {/* Media Form */}
        {activeTab === "media" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#6E8E59" }}>
              إضافة وسائط جديدة
            </h2>
            <form onSubmit={handleMediaSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    name="title"
                    value={mediaForm.title}
                    onChange={handleMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">النوع</label>
                  <select
                    name="type"
                    value={mediaForm.type}
                    onChange={handleMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">الوصف</label>
                  <textarea
                    name="description"
                    value={mediaForm.description}
                    onChange={handleMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">الملف</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    accept={mediaForm.type === "image" ? "image/*" : "video/*"}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                إضافة الوسائط
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminForms;
