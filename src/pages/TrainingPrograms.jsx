


import React, { useState, useEffect } from "react";

const TrainingPrograms = () => {
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchPrograms();
    }, [category, search]);

    const fetchPrograms = async () => {
        try {
            const url = new URL(`${API_BASE_URL}/api/programs/`);
            if (category) url.searchParams.append("category", category);
            if (search) url.searchParams.append("search", search);

            const response = await fetch(url);
            const data = await response.json();

            setPrograms(data);
            const uniqueCategories = [...new Set(data.map((p) => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("خطأ أثناء جلب البرامج:", error);
        }
    };

    const openRegisterForm = (programId) => {
        setSelectedProgramId(programId);
        setShowForm(true);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, programId: selectedProgramId }),
            });

            if (response.ok) {
                alert("تم التسجيل بنجاح! شكراً لتسجيلك في البرنامج");
                setShowForm(false);
                setFormData({ name: "", email: "", phone: "" });
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            alert("حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى");
        }
    };

    return (
        <div className="min-h-screen p-6 rtl bg-gradient-to-br from-white via-gray-50 to-white">
            <div className="max-w-6xl mx-auto">
                {/* باقي الكود كما هو دون تعديل في التصميم */}
                {/* تأكد فقط أن API URL يستخدم VITE_BACKEND_URL كما في الأعلى */}
            </div>
        </div>
    );
};

export default TrainingPrograms;
