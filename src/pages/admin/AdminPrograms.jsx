import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  Calendar,
  List,
} from "lucide-react";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const [programsRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/programs?includeDeleted=true", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/programs/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPrograms(programsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      if (editingProgram) {
        await axios.put(
          `http://localhost:5000/api/programs/${editingProgram._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/programs", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setViewMode(true);
      fetchData();
      setEditingProgram(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save program");
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      category: program.category,
      startDate: program.startDate,
      endDate: program.endDate,
    });
    setViewMode(false);
  };

  const handleSoftDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `http://localhost:5000/api/programs/${id}/soft-delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh the list to update the UI
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive program");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `http://localhost:5000/api/programs/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh the list to update the UI
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restore program");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("هل أنت متأكد من الحذف النهائي لهذا البرنامج؟"))
        return;

      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); // Refresh the list after deletion
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete program");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#780C28]" />
            <h2 className="text-xl font-bold text-[#780C28]">إدارة البرامج</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setViewMode(true);
                setEditingProgram(null);
                setFormData({ name: "", description: "", category: "", startDate: "", endDate: "" });
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${viewMode ? 'bg-[#780C28] text-white' : 'bg-white text-[#780C28] border-[#780C28]'} transition`}
            >
              عرض البرامج
            </button>
            <button
              onClick={() => {
                setViewMode(false);
                setEditingProgram(null);
                setFormData({ name: "", description: "", category: "", startDate: "", endDate: "" });
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${!viewMode ? 'bg-[#780C28] text-white' : 'bg-white text-[#780C28] border-[#780C28]'} transition`}
            >
              إضافة برنامج
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
        )}

        {/* Main Content */}
        <div>
          {viewMode ? (
            <div className="bg-white rounded-lg shadow p-4">
              {loading ? (
                <div className="py-12 text-center text-gray-500">جاري التحميل...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-right">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 font-medium text-gray-700">اسم البرنامج</th>
                        <th className="px-4 py-2 font-medium text-gray-700">الوصف</th>
                        <th className="px-4 py-2 font-medium text-gray-700">الفئة</th>
                        <th className="px-4 py-2 font-medium text-gray-700">الفترة</th>
                        <th className="px-4 py-2 font-medium text-gray-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program._id} className={program.isDeleted ? 'bg-red-50 text-red-500' : ''}>
                          <td className="px-4 py-2 font-semibold">{program.name}</td>
                          <td className="px-4 py-2 max-w-xs truncate">{program.description}</td>
                          <td className="px-4 py-2">{program.category || 'بدون فئة'}</td>
                          <td className="px-4 py-2">{program.startDate} - {program.endDate}</td>
                          <td className="px-4 py-2 flex gap-2">
                            {!program.isDeleted ? (
                              <>
                                <button onClick={() => handleEdit(program)} className="px-3 py-1 rounded bg-gray-100 text-[#780C28] border border-[#780C28] text-xs">تعديل</button>
                                <button onClick={() => handleSoftDelete(program._id)} className="px-3 py-1 rounded bg-gray-100 text-yellow-700 border border-yellow-400 text-xs">أرشيف</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleRestore(program._id)} className="px-3 py-1 rounded bg-gray-100 text-green-700 border border-green-400 text-xs">استعادة</button>
                                <button onClick={() => handleDelete(program._id)} className="px-3 py-1 rounded bg-gray-100 text-red-700 border border-red-400 text-xs">حذف نهائي</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {programs.length === 0 && <div className="text-center text-gray-400 py-8">لا توجد برامج</div>}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4 max-w-xl mx-auto">
              <h3 className="text-lg font-bold text-[#780C28] mb-4">{editingProgram ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">اسم البرنامج</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 rounded px-3 py-2 focus:border-[#780C28] focus:ring-[#780C28]/20 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">الفئة</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
                    <option value="">اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">الوصف</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700 mb-1">تاريخ البدء</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700 mb-1">تاريخ الانتهاء</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => { setViewMode(true); setEditingProgram(null); setFormData({ name: '', description: '', category: '', startDate: '', endDate: '' }); }} className="px-5 py-2 bg-gray-100 text-gray-700 rounded border border-gray-200 text-sm">إلغاء</button>
                  <button type="submit" className="px-5 py-2 bg-[#780C28] text-white rounded text-sm">{editingProgram ? 'حفظ التعديلات' : 'إضافة البرنامج'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPrograms;
