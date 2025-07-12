import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch } from "@headlessui/react";
import {
  Trash2,
  Undo,
  Plus,
  Edit3,
  Eye,
  Archive,
  RotateCcw,
} from "lucide-react";

const AdminSuccessStories = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    shortStory: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (viewMode) {
      fetchStories();
    }
  }, [viewMode]);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${backendURL}/api/success`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${backendURL}/api/success/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restore story");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${backendURL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem("adminToken");
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const storyData = {
        ...formData,
        imageUrl: finalImageUrl,
      };

      if (editingStory) {
        await axios.put(
          `${backendURL}/api/success/${editingStory._id}`,
          storyData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${backendURL}/api/success`, storyData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setViewMode(true);
      fetchStories();
      setEditingStory(null);
      setFormData({ name: "", imageUrl: "", shortStory: "" });
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save story");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      imageUrl: story.imageUrl,
      shortStory: story.shortStory,
    });
    setViewMode(false);
  };

  const handleSoftDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${backendURL}/api/success/${id}/soft-delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete story");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${backendURL}/api/success/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete story");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#780C28]">قصص النجاح</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {viewMode ? (
          <div>
            <button
              onClick={() => {
                setViewMode(false);
                setEditingStory(null);
                setFormData({ name: "", imageUrl: "", shortStory: "" });
                setImageFile(null);
              }}
              className="mb-4 px-4 py-2 bg-[#780C28] text-white rounded hover:bg-[#600a21]"
            >
              إضافة قصة جديدة
            </button>

            <div className="grid gap-4">
              {loading ? (
                <p>جاري التحميل...</p>
              ) : (
                stories.map((story) => (
                  <div key={story._id} className="bg-white p-4 rounded shadow">
                    <img
                      src={story.imageUrl}
                      alt={story.name}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <h3 className="text-xl font-semibold">{story.name}</h3>
                    <p className="text-gray-600">{story.shortStory}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(story)}
                        className="text-blue-600 hover:underline"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleSoftDelete(story._id)}
                        className="text-yellow-600 hover:underline"
                      >
                        أرشفة
                      </button>
                      <button
                        onClick={() => handleDelete(story._id)}
                        className="text-red-600 hover:underline"
                      >
                        حذف نهائي
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <h3 className="text-lg font-semibold text-[#780C28]">بيانات القصة</h3>
            <input
              type="text"
              name="name"
              placeholder="اسم صاحب القصة"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="shortStory"
              placeholder="ملخص القصة"
              value={formData.shortStory}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="معاينة"
                className="w-full h-48 object-cover rounded mt-2"
              />
            )}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-[#780C28] text-white rounded hover:bg-[#600a21]"
              >
                {uploading ? "جارٍ الحفظ..." : editingStory ? "تحديث القصة" : "إضافة القصة"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode(true);
                  setEditingStory(null);
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

export default AdminSuccessStories;
