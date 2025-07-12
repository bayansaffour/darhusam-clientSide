import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(true);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const [programsRes, categoriesRes] = await Promise.all([
        axios.get(`${backendURL}/api/programs?includeDeleted=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${backendURL}/api/programs/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPrograms(programsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (editingProgram) {
        await axios.put(
          `${backendURL}/api/programs/${editingProgram._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${backendURL}/api/programs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setViewMode(true);
      setEditingProgram(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "فشل حفظ البرنامج");
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name || "",
      description: program.description || "",
      category: program.category || "",
      startDate: formatDateForInput(program.startDate),
      endDate: formatDateForInput(program.endDate),
    });
    setViewMode(false);
    setError("");
  };

  const handleSoftDelete = async (id) => {
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${backendURL}/api/programs/${id}/soft-delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "فشل أرشفة البرنامج");
    }
  };

  const handleRestore = async (id) => {
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${backendURL}/api/programs/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "فشل استعادة البرنامج");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      if (!window.confirm("هل أنت متأكد من الحذف النهائي لهذا البرنامج؟")) return;

      const token = localStorage.getItem("adminToken");
      await axios.delete(`${backendURL}/api/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "فشل حذف البرنامج");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#780C28]">إدارة البرامج</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {viewMode ? (
          <div>
            <button
              onClick={() => setViewMode(false)}
              className="mb-4 px-4 py-2 bg-[#780C28] text-white rounded hover:bg-[#600a21]"
            >
              إضافة برنامج جديد
            </button>
            <div className="grid gap-4">
              {programs.map((program) => (
                <div key={program._id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">{program.name}</h3>
                  <p className="text-gray-600">{program.description}</p>
                  <p className="text-sm text-gray-500">الفئة: {program.category}</p>
                  <p className="text-sm text-gray-500">من: {formatDateForInput(program.startDate)} إلى: {formatDateForInput(program.endDate)}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-blue-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleSoftDelete(program._id)}
                      className="text-yellow-600 hover:underline"
                    >
                      أرشفة
                    </button>
                    <button
                      onClick={() => handleDelete(program._id)}
                      className="text-red-600 hover:underline"
                    >
                      حذف نهائي
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <h3 className="text-lg font-semibold text-[#780C28]">بيانات البرنامج</h3>
            <input
              type="text"
              name="name"
              placeholder="اسم البرنامج"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="وصف البرنامج"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#780C28] text-white rounded hover:bg-[#600a21]"
              >
                {editingProgram ? "تحديث البرنامج" : "إضافة البرنامج"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode(true);
                  setEditingProgram(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPrograms;
