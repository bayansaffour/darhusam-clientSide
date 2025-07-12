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

  const backendURL = process.env.REACT_APP_BACKEND_URL;

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

  return ({/*
    // ... نفس JSX كما في كودك السابق بدون أي تعديل آخر ...
    // يمكنك استخدام نفس JSX الذي كتبته سابقًا بدون تغيير أي شيء في التصميم أو الوظائف
    */}
  );
};

export default AdminPrograms;
