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
  const backendURL = process.env.REACT_APP_BACKEND_URL;

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

  // الباقي من الكود نفس تصميم واجهة المستخدم لديك ولا يحتاج لتعديل

  return (
    <div>
      {/* ... واجهة المستخدم كما في كودك السابق بدون تغيير ... */}
    </div>
  );
};

export default AdminSuccessStories;
