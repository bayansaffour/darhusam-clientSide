// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from 'sweetalert2';

// const TrainingPrograms = () => {
//     const [category, setCategory] = useState("");
//     const [search, setSearch] = useState("");
//     const [programs, setPrograms] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedProgramId, setSelectedProgramId] = useState(null);
//     const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

//     useEffect(() => {
//         fetchPrograms();
//     }, [category, search]);

//     const fetchPrograms = async () => {
//         try {
//             const response = await axios.get("http://localhost:5000/api/programs/", {
//                 params: { category, search },
//             });
//             setPrograms(response.data);
//             const uniqueCategories = [...new Set(response.data.map((p) => p.category))];
//             setCategories(uniqueCategories);
//         } catch (error) {
//             console.error("خطأ أثناء جلب البرامج:", error);
//         }
//     };

//     const openRegisterForm = (programId) => {
//         setSelectedProgramId(programId);
//         setShowForm(true);
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost:5000/api/register/", {
//                 ...formData,
//                 programId: selectedProgramId,
//             });
//             Swal.fire({
//                 title: 'تم التسجيل بنجاح',
//                 text: 'شكراً لتسجيلك في البرنامج',
//                 icon: 'success',
//                 confirmButtonText: 'حسناً',
//                 confirmButtonColor: '#3085d6',
//                 timer: 3000
//             });

//             setShowForm(false);
//             setFormData({ name: "", email: "", phone: "" });
//         } catch (error) {
//             Swal.fire({
//                 title: 'خطأ!',
//                 text: 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى',
//                 icon: 'error',
//                 confirmButtonText: 'حسناً',
//                 confirmButtonColor: '#d33'
//             });
//         }
//     };

//     return (
//         <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen p-8 rtl">
//             <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="bg-[#780C28] text-white p-6">
//                     <h1 className="text-3xl font-bold text-center">برامج التدريب</h1>
//                 </div>
//                 {/* Filters */}
//                 <div className="p-6 bg-white">
//                     <div className="flex flex-col md:flex-row gap-4 mb-8">
//                         <div className="relative flex-1">
//                             <select
//                                 className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28] appearance-none"
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                             >
//                                 <option value="">كل الفئات</option>
//                                 {categories.map((cat, idx) => (
//                                     <option key={idx} value={cat}>{cat}</option>
//                                 ))}
//                             </select>
//                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                                 </svg>
//                             </div>
//                         </div>

//                         <div className="relative flex-1">
//                             <input
//                                 type="text"
//                                 className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
//                                 placeholder="ابحث عن برنامج..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                             <div className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Registration Form */}
//                     {showForm && (
//                         <div className="mb-8">
//                             <div className="bg-blue-50 border-l-4 border-[#780C28] p-4 mb-6 rounded-md">
//                                 <div className="flex">
//                                     <div className="flex-shrink-0 text-[#780C28]">
//                                         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div className="mr-3">
//                                         <p className="text-[#780C28] font-medium">الرجاء تعبئة النموذج للتسجيل في البرنامج</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <form
//                                 onSubmit={handleRegister}
//                                 className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
//                             >
//                                 <div className="mb-6">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                                         الاسم الكامل
//                                     </label>
//                                     <input
//                                         id="name"
//                                         type="text"
//                                         placeholder="أدخل الاسم الكامل"
//                                         value={formData.name}
//                                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-6">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                                         البريد الإلكتروني
//                                     </label>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         placeholder="example@domain.com"
//                                         value={formData.email}
//                                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-6">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
//                                         رقم الهاتف
//                                     </label>
//                                     <input
//                                         id="phone"
//                                         type="text"
//                                         placeholder="+966 XX XXX XXXX"
//                                         value={formData.phone}
//                                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
//                                     <button
//                                         type="button"
//                                         className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                                         onClick={() => setShowForm(false)}
//                                     >
//                                         إلغاء
//                                     </button>
//                                     <button 
//                                         type="submit" 
//                                         className="bg-[#780C28] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#753244] transition-colors"
//                                     >
//                                         تسجيل
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     )}

//                     {/* Programs List */}
//                     <div className="space-y-6">
//                         {programs.map((program) => (
//                             <div key={program._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                                 <div className="p-6">
//                                     <div className="flex justify-between items-start">
//                                         <div>
//                                             <h2 className="text-xl font-bold text-gray-800 mb-2">{program.name}</h2>
//                                             <div className="flex items-center text-gray-500 text-sm mb-3">
//                                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                                                 </svg>
//                                                 <span>{program.startDate} - {program.endDate}</span>
//                                             </div>
//                                             <p className="text-gray-600 mb-4">{program.description}</p>
//                                         </div>
//                                         <div className="ml-2">
//                                             <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
//                                                 {program.category}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <button
//                                         onClick={() => openRegisterForm(program._id)}
//                                         className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#780C28] hover:bg-[#8c374d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#780C28]"
//                                     >
//                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                                         </svg>
//                                         سجل الآن
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}

//                         {programs.length === 0 && (
//                             <div className="text-center py-10">
//                                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                 </svg>
//                                 <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد برامج مطابقة للبحث</h3>
//                                 <p className="mt-1 text-sm text-gray-500">جرب تغيير معايير البحث أو عرض جميع البرامج</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );      
// };

// export default TrainingPrograms;



import React, { useState, useEffect } from "react";

const TrainingPrograms = () => {
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        fetchPrograms();
    }, [category, search]);

    const fetchPrograms = async () => {
        try {
            const url = new URL("http://localhost:5000/api/programs/");
            if (category) url.searchParams.append('category', category);
            if (search) url.searchParams.append('search', search);

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
            const response = await fetch("http://localhost:5000/api/register/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    programId: selectedProgramId,
                }),
            });

            if (response.ok) {
                alert('تم التسجيل بنجاح! شكراً لتسجيلك في البرنامج');
                setShowForm(false);
                setFormData({ name: "", email: "", phone: "" });
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            alert('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى');
        }
    };

    return (
        <div className="bg-gradient-to-br from-white via-gray-50 to-white min-h-screen p-6 rtl">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#780C28] to-[#6E8E59] rounded-3xl shadow-2xl mb-8 overflow-hidden">
                    <div className="relative p-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#780C28]/90 to-[#6E8E59]/90"></div>
                        <div className="relative z-10 text-center">
                            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-wide">
                                برامج التدريب المتخصصة
                            </h1>
                            <p className="text-xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed">
                                استكشف مجموعة واسعة من البرامج التدريبية المصممة لتطوير مهاراتك وتعزيز قدراتك المهنية
                            </p>
                        </div>
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#780C28]/5 to-[#6E8E59]/5 p-8">
                        <h2 className="text-2xl font-bold text-[#780C28] mb-6 text-center">
                            البحث والتصفية
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="relative">
                                <label className="block text-[#780C28] text-lg font-bold mb-3">
                                    اختر الفئة
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white border-3 border-[#6E8E59]/20 text-gray-800 py-5 px-6 rounded-2xl focus:ring-4 focus:ring-[#6E8E59]/30 focus:border-[#6E8E59] appearance-none shadow-lg transition-all duration-300 text-lg font-medium hover:border-[#6E8E59]/40"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">جميع الفئات</option>
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6 text-[#6E8E59]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-[#780C28] text-lg font-bold mb-3">
                                    البحث في البرامج
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-white border-3 border-[#6E8E59]/20 text-gray-800 py-5 px-6 pl-16 rounded-2xl focus:ring-4 focus:ring-[#6E8E59]/30 focus:border-[#6E8E59] shadow-lg transition-all duration-300 text-lg font-medium hover:border-[#6E8E59]/40"
                                        placeholder="ابحث عن البرنامج المناسب لك..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center px-6 text-[#6E8E59]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                {showForm && (
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#780C28] to-[#6E8E59] p-6">
                                <div className="flex items-center text-white">
                                    <div className="bg-white/20 p-3 rounded-full ml-4">
                                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">تسجيل في البرنامج التدريبي</h3>
                                        <p className="text-white/90 text-lg">املأ البيانات المطلوبة لإتمام عملية التسجيل</p>
                                    </div>
                                </div>
                            </div>

                            <div onSubmit={handleRegister} className="p-8">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-[#780C28] text-lg font-bold mb-4" htmlFor="name">
                                            الاسم الكامل *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="أدخل اسمك الكامل"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-5 rounded-2xl border-3 border-[#6E8E59]/20 focus:outline-none focus:ring-4 focus:ring-[#6E8E59]/30 focus:border-[#6E8E59] transition-all duration-300 text-lg font-medium shadow-lg hover:border-[#6E8E59]/40"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[#780C28] text-lg font-bold mb-4" htmlFor="email">
                                            البريد الإلكتروني *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="example@domain.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-6 py-5 rounded-2xl border-3 border-[#6E8E59]/20 focus:outline-none focus:ring-4 focus:ring-[#6E8E59]/30 focus:border-[#6E8E59] transition-all duration-300 text-lg font-medium shadow-lg hover:border-[#6E8E59]/40"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[#780C28] text-lg font-bold mb-4" htmlFor="phone">
                                            رقم الهاتف *
                                        </label>
                                        <input
                                            id="phone"
                                            type="text"
                                            placeholder="+966 XX XXX XXXX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-6 py-5 rounded-2xl border-3 border-[#6E8E59]/20 focus:outline-none focus:ring-4 focus:ring-[#6E8E59]/30 focus:border-[#6E8E59] transition-all duration-300 text-lg font-medium shadow-lg hover:border-[#6E8E59]/40"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:justify-end gap-6">
                                    <button
                                        type="button"
                                        className="bg-white text-gray-700 px-10 py-4 rounded-2xl font-bold border-3 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg text-lg"
                                        onClick={() => setShowForm(false)}
                                    >
                                        إلغاء التسجيل
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleRegister}
                                        className="bg-gradient-to-r from-[#780C28] to-[#6E8E59] text-white px-10 py-4 rounded-2xl font-bold hover:from-[#8c1a34] hover:to-[#7a9c65] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                                    >
                                        تأكيد التسجيل
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Programs Grid */}
                <div className="grid gap-8">
                    {programs.map((program) => (
                        <div key={program._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                                    {/* Program Info */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#780C28] mb-4 group-hover:text-[#8c1a34] transition-colors duration-300">
                                                {program.name}
                                            </h3>

                                            <p className="text-gray-700 text-lg leading-relaxed">
                                                {program.description}
                                            </p>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-r from-[#6E8E59]/10 to-transparent p-4 rounded-xl border-r-4 border-[#6E8E59]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#6E8E59] p-2 rounded-lg">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#6E8E59]">الفئة</p>
                                                        <p className="font-bold text-gray-800">{program.category}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-[#780C28]/10 to-transparent p-4 rounded-xl border-r-4 border-[#780C28]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#780C28] p-2 rounded-lg">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#780C28]">المدة</p>
                                                        <div className="flex items-center text-[#6E8E59] text-sm mb-3 mt-2">                                                      
                                                            <span>
                                                                {program.startDate} - {program.endDate}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        {program.features && (
                                            <div className="bg-gray-50 p-6 rounded-2xl">
                                                <h4 className="font-bold text-[#780C28] mb-4 text-lg">مميزات البرنامج:</h4>
                                                <ul className="space-y-2">
                                                    {program.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                                                            <div className="w-2 h-2 bg-[#6E8E59] rounded-full"></div>
                                                            <span className="font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Registration Button */}
                                    <div className="lg:w-64 flex flex-col items-center">
                                            <button
                                                onClick={() => openRegisterForm(program._id)}
                                                className="w-full bg-[#780C28] text-white px-8 py-4 rounded-2xl font-bold hover:from-[#8c1a34] hover:to-[#7a9c65] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                                            >
                                                سجل الآن
                                            </button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Programs Message */}
                {programs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
                            <div className="w-24 h-24 bg-gradient-to-r from-[#780C28]/10 to-[#6E8E59]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-[#6E8E59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#780C28] mb-4">لا توجد برامج متاحة</h3>
                            <p className="text-gray-600 text-lg">لم يتم العثور على برامج تدريبية تطابق معايير البحث المحددة</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingPrograms;
