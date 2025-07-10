// import { useState, useEffect } from "react";
// import {
//   ChevronRight,
//   ChevronLeft,
//   Calendar,
//   FileText,
//   Image,
//   Play,
//   Clock,
//   MapPin,
//   ArrowRight,
//   Users,
// } from "lucide-react";
// import Swal from "sweetalert2";

// // Main component
// export default function News() {
//   const [activeSection, setActiveSection] = useState("articles");
//   const [animationDirection, setAnimationDirection] = useState("right");
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   // Sample data - in a real app, this would come from an API or props
//   const articles = [
//     {
//       id: 1,
//       title: "تقرير عن المؤتمر السنوي",
//       date: "2025-04-15",
//       summary:
//         "ملخص للتقرير السنوي وأهم النقاط التي تمت مناقشتها خلال المؤتمر السنوي للعام 2025",
//       imageUrl: "/public/daaralhosam.jpg",
//       content:
//         "محتوى تفصيلي عن المؤتمر السنوي وأهم النقاط التي تمت مناقشتها. يشمل هذا التقرير تفاصيل عن المتحدثين الرئيسيين والموضوعات التي تمت تغطيتها والقرارات المهمة التي تم اتخاذها خلال المؤتمر.",
//       author: "محمد عبدالله",
//       readTime: "5 دقائق",
//     },
//     {
//       id: 2,
//       title: "مقال عن التطورات الأخيرة",
//       date: "2025-04-10",
//       summary:
//         "نظرة عامة على أحدث التطورات والتغييرات في المجال وتأثيرها على المستقبل",
//       imageUrl: "/public/daaralhosam.jpg",
//       content:
//         "تحليل شامل لأحدث التطورات والتغييرات في المجال. يتناول هذا المقال التوجهات الجديدة والتحديات المستقبلية والفرص المتاحة في ظل هذه التطورات المتسارعة.",
//       author: "سارة أحمد",
//       readTime: "4 دقائق",
//     },
//     {
//       id: 3,
//       title: "دراسة تحليلية جديدة",
//       date: "2025-04-01",
//       summary:
//         "نتائج الدراسة التحليلية الجديدة وتأثيرها على القطاع والتوصيات المقترحة",
//       imageUrl: "/public/daaralhosam.jpg",
//       content:
//         "عرض تفصيلي لنتائج الدراسة التحليلية الجديدة وتأثيرها على القطاع. تشمل هذه الدراسة بيانات إحصائية مهمة واستنتاجات رئيسية وتوصيات للتطوير المستقبلي.",
//       author: "فاطمة محمود",
//       readTime: "7 دقائق",
//     },
//   ];

//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "المؤتمر السنوي",
//       date: "2025-05-20",
//       location: "قاعة المؤتمرات الرئيسية",
//       time: "10:00 صباحاً",
//       imageUrl: "/public/daaralhosam.jpg",
//       description:
//         "انضم إلينا في المؤتمر السنوي لمناقشة أهم المستجدات والتحديات في المجال والاستماع إلى خبراء متخصصين.",
//       capacity: 30,
//       registered: 23,
//     },
//     {
//       id: 2,
//       title: "ورشة عمل تدريبية",
//       date: "2025-05-25",
//       location: "مركز التدريب",
//       time: "9:00 صباحاً",
//       imageUrl: "/public/daaralhosam.jpg",
//       description:
//         "ورشة عمل تدريبية متخصصة لتطوير المهارات المهنية وتعزيز الكفاءات في مجالات متعددة.",
//       capacity: 20,
//       registered: 15,
//     },
//     {
//       id: 3,
//       title: "لقاء مفتوح مع الخبراء",
//       date: "2025-06-05",
//       location: "القاعة الكبرى",
//       time: "1:00 ظهراً",
//       imageUrl: "/public/daaralhosam.jpg",
//       description:
//         "فرصة للتواصل المباشر مع خبراء المجال وطرح الأسئلة والاستفادة من تجاربهم وخبراتهم.",
//       capacity: 50,
//       registered: 42,
//     },
//   ]);

//   // دالة تأكيد الحضور
//   const handleRegistration = (event) => {
//     // التحقق من وجود أماكن متاحة
//     if (event.registered >= event.capacity) {
//       Swal.fire({
//         title: "عفواً",
//         text: "لا توجد أماكن متاحة لهذه الفعالية",
//         icon: "error",
//         confirmButtonText: "حسناً",
//         confirmButtonColor: "#780C28",
//       });
//       return;
//     }

//     Swal.fire({
//       title: "تأكيد الحضور",
//       html: `هل ترغب بالتسجيل في فعالية <b>${event.title}</b>؟<br><br>
//              التاريخ: ${new Date(event.date).toLocaleDateString("ar-EG")}<br>
//              الوقت: ${event.time}<br>
//              المكان: ${event.location}`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "نعم، سجلني",
//       cancelButtonText: "إلغاء",
//       confirmButtonColor: "#6E8E59",
//       cancelButtonColor: "#780C28",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // تحديث عدد المسجلين
//         const updatedEvents = events.map((e) =>
//           e.id === event.id ? { ...e, registered: e.registered + 1 } : e
//         );
//         setEvents(updatedEvents);

//         Swal.fire({
//           title: "تم التسجيل بنجاح!",
//           text: `تم تسجيلك في فعالية ${event.title}`,
//           icon: "success",
//           confirmButtonText: "حسناً",
//           confirmButtonColor: "#780C28",
//         });
//       }
//     });
//   };

//   const media = [
//     {
//       id: 1,
//       type: "image",
//       title: "صورة من الفعالية السابقة",
//       url: "/public/daaralhosam.jpg",
//       description: "لقطات من الفعالية السابقة التي أقيمت في شهر مارس 2025",
//     },
//     {
//       id: 2,
//       type: "video",
//       title: "فيديو تعريفي",
//       url: "/public/daaralhosam.jpg",
//       thumbnail: "/public/daaralhosam.jpg",
//       description: "فيديو يستعرض أهم أنشطة وإنجازات العام الماضي",
//     },
//     {
//       id: 3,
//       type: "image",
//       title: "معرض الصور",
//       url: "/public/daaralhosam.jpg",
//       description: "صور مختارة من معرض الصور السنوي",
//     },
//     {
//       id: 4,
//       type: "image",
//       title: "أنشطة وفعاليات",
//       url: "/public/daaralhosam.jpg",
//       description: "توثيق للأنشطة والفعاليات المختلفة التي تم تنظيمها",
//     },
//   ];

//   // Function to handle tab change with animation direction
//   const changeSection = (section) => {
//     const sections = ["articles", "events", "media"];
//     const currentIndex = sections.indexOf(activeSection);
//     const newIndex = sections.indexOf(section);

//     setAnimationDirection(newIndex > currentIndex ? "right" : "left");
//     setActiveSection(section);

//     // Reset details view when changing sections
//     setShowDetails(false);
//   };

//   // Function to handle "اقرأ المزيد" click
//   const handleReadMore = (article) => {
//     setSelectedArticle(article);
//     setShowDetails(true);

//     // In a real app with React Router, you would use:
//     // history.push(`/articles/${article.id}`);
//     // or with React Router v6:
//     // navigate(`/articles/${article.id}`);
//   };

//   // Function to go back to article list
//   const handleBackToList = () => {
//     setShowDetails(false);
//   };

//   // Add an effect to set the document and body to full height
//   useEffect(() => {
//     // Set the html and body to full height
//     document.documentElement.style.height = "100%";
//     document.body.style.height = "100%";
//     document.body.style.margin = "0";
//     document.body.style.padding = "0";

//     return () => {
//       // Clean up when component unmounts
//       document.documentElement.style.height = "";
//       document.body.style.height = "";
//       document.body.style.margin = "";
//       document.body.style.padding = "";
//     };
//   }, []);

//   return (
//     <div
//       className="flex flex-col h-screen bg-gray-50"
//       style={{ direction: "rtl" }}
//     >
//       {/* Main Header */}
//       <div
//         className="px-6 py-4 flex justify-center items-center shadow-md"
//         style={{ backgroundColor: "#6E8E59" }}
//       >
//         <h2 className="text-2xl font-bold text-white">الأخبار والفعاليات</h2>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-6xl mx-auto px-4 flex justify-center">
//           <div className="flex space-x-6 space-x-reverse">
//             <button
//               onClick={() => changeSection("articles")}
//               className={`px-6 py-4 flex items-center gap-2 transition-all relative ${
//                 activeSection === "articles"
//                   ? "text-gray-800 font-medium"
//                   : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               <FileText size={18} />
//               <span>المقالات والتقارير</span>
//               {activeSection === "articles" && (
//                 <div
//                   className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
//                   style={{ backgroundColor: "#780C28" }}
//                 ></div>
//               )}
//             </button>
//             <button
//               onClick={() => changeSection("events")}
//               className={`px-6 py-4 flex items-center gap-2 transition-all relative ${
//                 activeSection === "events"
//                   ? "text-gray-800 font-medium"
//                   : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               <Calendar size={18} />
//               <span>الفعاليات القادمة</span>
//               {activeSection === "events" && (
//                 <div
//                   className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
//                   style={{ backgroundColor: "#780C28" }}
//                 ></div>
//               )}
//             </button>
//             <button
//               onClick={() => changeSection("media")}
//               className={`px-6 py-4 flex items-center gap-2 transition-all relative ${
//                 activeSection === "media"
//                   ? "text-gray-800 font-medium"
//                   : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               <Image size={18} />
//               <span>الصور والفيديو</span>
//               {activeSection === "media" && (
//                 <div
//                   className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
//                   style={{ backgroundColor: "#780C28" }}
//                 ></div>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content Area - Takes remaining height */}
//       <div className="flex-1 relative overflow-hidden">
//         {/* Articles Section */}
//         <div
//           className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${
//             activeSection === "articles"
//               ? "translate-x-0 opacity-100"
//               : animationDirection === "right"
//               ? "translate-x-full opacity-0"
//               : "-translate-x-full opacity-0"
//           } ${showDetails ? "hidden" : "block"}`}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//             {articles.map((article) => (
//               <div
//                 key={article.id}
//                 className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
//                 style={{ borderTop: "4px solid #780C28" }}
//               >
//                 <div className="relative">
//                   <img
//                     src={article.imageUrl}
//                     alt={article.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div
//                     className="absolute bottom-0 right-0 px-3 py-1 text-xs text-white font-medium rounded-tl-md"
//                     style={{ backgroundColor: "#780C28" }}
//                   >
//                     {new Date(article.date).toLocaleDateString("ar-EG")}
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <div className="flex items-center text-sm text-gray-500 mb-2">
//                     <span className="flex items-center">
//                       <Clock size={14} className="ml-1" />
//                       {article.readTime}
//                     </span>
//                     <span className="mx-2">•</span>
//                     <span>{article.author}</span>
//                   </div>
//                   <h3
//                     className="text-xl font-bold mb-2"
//                     style={{ color: "#6E8E59" }}
//                   >
//                     {article.title}
//                   </h3>
//                   <p className="text-gray-600">{article.summary}</p>
//                   <div className="mt-4 flex justify-end">
//                     <button
//                       onClick={() => handleReadMore(article)}
//                       className="text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
//                       style={{ color: "#780C28" }}
//                     >
//                       <span>اقرأ المزيد</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Article Details View */}
//         {activeSection === "articles" && showDetails && selectedArticle && (
//           <div className="absolute inset-0 bg-white overflow-auto animate-fadeIn p-6">
//             <div className="max-w-4xl mx-auto">
//               <button
//                 onClick={handleBackToList}
//                 className="mb-6 flex items-center gap-2 text-sm rounded-lg hover:bg-gray-100 py-2 px-3 transition-colors"
//                 style={{ color: "#6E8E59" }}
//               >
//                 <ChevronRight size={16} />
//                 <span>العودة إلى قائمة المقالات</span>
//               </button>

//               <div className="relative mb-6">
//                 <img
//                   src={selectedArticle.imageUrl}
//                   alt={selectedArticle.title}
//                   className="w-full h-64 object-cover rounded-lg shadow-md"
//                 />
//                 <div
//                   className="absolute bottom-4 right-4 px-3 py-1 text-xs text-white font-medium rounded-md shadow-md"
//                   style={{ backgroundColor: "#780C28" }}
//                 >
//                   {new Date(selectedArticle.date).toLocaleDateString("ar-EG")}
//                 </div>
//               </div>

//               <h1
//                 className="text-3xl font-bold mb-4"
//                 style={{ color: "#6E8E59" }}
//               >
//                 {selectedArticle.title}
//               </h1>

//               <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
//                 <span className="flex items-center">
//                   <Clock size={14} className="ml-1" />
//                   {selectedArticle.readTime}
//                 </span>
//                 <span className="mx-2">•</span>
//                 <span>{selectedArticle.author}</span>
//               </div>

//               <div className="prose max-w-none">
//                 <p className="text-lg leading-relaxed mb-6">
//                   {selectedArticle.content}
//                 </p>

//                 {/* Additional content sections would go here */}
//                 <div
//                   className="bg-gray-50 p-6 rounded-lg my-8 border-r-4"
//                   style={{ borderRightColor: "#6E8E59" }}
//                 >
//                   <h3
//                     className="text-xl font-bold mb-3"
//                     style={{ color: "#780C28" }}
//                   >
//                     نقاط مهمة من المقال
//                   </h3>
//                   <ul className="list-disc list-inside space-y-2 mr-4">
//                     <li>النقطة الأولى المستخلصة من المقال</li>
//                     <li>النقطة الثانية المستخلصة والمعلومات الإضافية</li>
//                     <li>النقطة الثالثة والاستنتاجات المهمة</li>
//                   </ul>
//                 </div>

//                 <p className="text-lg leading-relaxed">
//                   هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم
//                   توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا
//                   النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف
//                   التى يولدها التطبيق.
//                 </p>
//               </div>

//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h4
//                   className="text-lg font-bold mb-4"
//                   style={{ color: "#6E8E59" }}
//                 >
//                   مقالات ذات صلة
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {articles
//                     .filter((a) => a.id !== selectedArticle.id)
//                     .slice(0, 2)
//                     .map((article) => (
//                       <div
//                         key={article.id}
//                         className="flex gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//                         onClick={() => handleReadMore(article)}
//                       >
//                         <img
//                           src={article.imageUrl}
//                           alt={article.title}
//                           className="w-20 h-20 object-cover rounded"
//                         />
//                         <div>
//                           <h5
//                             className="font-bold"
//                             style={{ color: "#780C28" }}
//                           >
//                             {article.title}
//                           </h5>
//                           <p className="text-sm text-gray-600 line-clamp-2">
//                             {article.summary}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Events Section */}
//         <div
//           className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${
//             activeSection === "events"
//               ? "translate-x-0 opacity-100"
//               : animationDirection === "right"
//               ? "translate-x-full opacity-0"
//               : "-translate-x-full opacity-0"
//           }`}
//         >
//           <div className="p-6">
//             <h3 className="text-xl font-bold mb-6" style={{ color: "#6E8E59" }}>
//               جدول الفعاليات القادمة
//             </h3>
//             <div className="space-y-6">
//               {events.map((event) => (
//                 <div
//                   key={event.id}
//                   className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border-r-4 flex flex-col md:flex-row"
//                   style={{ borderRightColor: "#780C28" }}
//                 >
//                   <div className="md:w-1/3">
//                     <img
//                       src={event.imageUrl}
//                       alt={event.title}
//                       className="w-full h-48 object-cover"
//                     />
//                   </div>
//                   <div className="p-4 md:p-6 flex flex-1 flex-col md:flex-row items-start md:items-center gap-4">
//                     <div
//                       className="bg-gray-100 rounded-lg p-3 h-20 w-20 flex flex-col items-center justify-center shrink-0"
//                       style={{ backgroundColor: "#f8f5f5" }}
//                     >
//                       <span
//                         className="text-2xl font-bold"
//                         style={{ color: "#780C28" }}
//                       >
//                         {new Date(event.date).getDate()}
//                       </span>
//                       <span className="text-sm" style={{ color: "#6E8E59" }}>
//                         {new Date(event.date).toLocaleDateString("ar-EG", {
//                           month: "short",
//                         })}
//                       </span>
//                     </div>
//                     <div className="flex-1">
//                       <h4
//                         className="font-bold text-lg mb-2"
//                         style={{ color: "#6E8E59" }}
//                       >
//                         {event.title}
//                       </h4>
//                       <p className="text-gray-600 mb-3">{event.description}</p>
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
//                         <span className="flex items-center text-sm">
//                           <Clock size={14} className="ml-1" />
//                           {event.time}
//                         </span>
//                         <span className="flex items-center text-sm">
//                           <MapPin size={14} className="ml-1" />
//                           {event.location}
//                         </span>
//                         <span className="flex items-center text-sm">
//                           <Users size={14} className="ml-1" />
//                           {event.registered}/{event.capacity} مقاعد
//                         </span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleRegistration(event)}
//                       className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 text-white"
//                       style={{ backgroundColor: "#6E8E59" }}
//                     >
//                       <span>التسجيل</span>
//                       <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Media Section */}
//         <div
//           className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${
//             activeSection === "media"
//               ? "translate-x-0 opacity-100"
//               : animationDirection === "right"
//               ? "translate-x-full opacity-0"
//               : "-translate-x-full opacity-0"
//           }`}
//         >
//           <div className="p-6">
//             <h3 className="text-xl font-bold mb-6" style={{ color: "#6E8E59" }}>
//               معرض الصور والفيديو
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {media.map((item) => (
//                 <div
//                   key={item.id}
//                   className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
//                 >
//                   <img
//                     src={item.type === "video" ? item.thumbnail : item.url}
//                     alt={item.title}
//                     className="w-full h-64 object-cover"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
//                     {item.type === "video" && (
//                       <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
//                         <Play size={32} fill="#780C28" color="#780C28" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//                     <h4 className="text-white font-bold mb-1">{item.title}</h4>
//                     <p className="text-white text-sm opacity-80">
//                       {item.description}
//                     </p>
//                   </div>
//                   {item.type === "image" && (
//                     <div
//                       className="absolute top-3 left-3 bg-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
//                       style={{ color: "#6E8E59" }}
//                     >
//                       <Image size={18} />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



















import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileText,
  Image,
  Play,
  Clock,
  MapPin,
  ArrowRight,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import AdminForms from "./AdminForm";

// Main component
export default function News() {
  const [activeSection, setActiveSection] = useState("articles");
  const [animationDirection, setAnimationDirection] = useState("right");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState({
    articles: true,
    events: true,
    media: true,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await axios.get(
          "http://localhost:5000/api/news/articles"
        );
        setArticles(articlesRes.data);
        setLoading((prev) => ({ ...prev, articles: false }));

        // Fetch events
        const eventsRes = await axios.get(
          "http://localhost:5000/api/news/events"
        );
        setEvents(eventsRes.data);
        setLoading((prev) => ({ ...prev, events: false }));

        // Fetch media
        const mediaRes = await axios.get(
          "http://localhost:5000/api/news/media"
        );
        setMedia(mediaRes.data);
        setLoading((prev) => ({ ...prev, media: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "خطأ",
          text: "حدث خطأ أثناء جلب البيانات",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#780C28",
        });
      }
    };

    fetchData();
  }, []);

  // دالة تأكيد الحضور
  const handleRegistration = async (event) => {
    // التحقق من وجود أماكن متاحة
    if (event.registered >= event.capacity) {
      Swal.fire({
        title: "عفواً",
        text: "لا توجد أماكن متاحة لهذه الفعالية",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
      return;
    }

    Swal.fire({
      title: "تأكيد الحضور",
      html: `هل ترغب بالتسجيل في فعالية <b>${event.title}</b>؟<br><br>
             التاريخ: ${new Date(event.date).toLocaleDateString("ar-EG")}<br>
             الوقت: ${event.time}<br>
             المكان: ${event.location}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "نعم، سجلني",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#6E8E59",
      cancelButtonColor: "#780C28",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // تحديث عدد المسجلين في الخادم
          console.log("ali");
          const updatedEvent = await axios.put(
            `http://localhost:5000/api/news/events/${event._id}`,
            {
              registered: event.registered + 1,
            }
          );

          // تحديث حالة الفعاليات المحلية
          setEvents(
            events.map((e) => (e._id === event._id ? updatedEvent.data : e))
          );

          Swal.fire({
            title: "تم التسجيل بنجاح!",
            text: `تم تسجيلك في فعالية ${event.title}`,
            icon: "success",
            confirmButtonText: "حسناً",
            confirmButtonColor: "#780C28",
          });
        } catch (error) {
          console.error("Error registering for event:", error);
          Swal.fire({
            title: "خطأ",
            text: "حدث خطأ أثناء التسجيل",
            icon: "error",
            confirmButtonText: "حسناً",
            confirmButtonColor: "#780C28",
          });
        }
      }
    });
  };

  // Function to handle tab change with animation direction
  const changeSection = (section) => {
    const sections = ["articles", "events", "media"];
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(section);

    setAnimationDirection(newIndex > currentIndex ? "right" : "left");
    setActiveSection(section);

    // Reset details view when changing sections
    setShowDetails(false);
  };

  // Function to handle "اقرأ المزيد" click
  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setShowDetails(true);
  };

  // Function to go back to article list
  const handleBackToList = () => {
    setShowDetails(false);
  };

  // Add an effect to set the document and body to full height
  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = ({ count = 3 }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="animate-pulse">
              <div className="bg-gray-300 h-48 w-full"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4 mb-6"></div>
                <div className="h-8 bg-gray-300 rounded w-24 ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50 overflow-hidden"
      style={{ direction: "rtl" }}
    >
      {/* Main Header */}
      <div
        className="px-6 py-4 flex justify-center items-center shadow-md"
        style={{ backgroundColor: "#6E8E59" }}
      >
        <h2 className="text-2xl font-bold text-white">الأخبار والفعاليات</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-center">
          <div className="flex space-x-6 space-x-reverse">
            <button
              onClick={() => changeSection("articles")}
              className={`px-6 py-4 flex items-center gap-2 transition-all relative ${activeSection === "articles"
                  ? "text-gray-800 font-medium"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <FileText size={18} />
              <span>المقالات والتقارير</span>
              {activeSection === "articles" && (
                <div
                  className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
                  style={{ backgroundColor: "#780C28" }}
                ></div>
              )}
            </button>
            <button
              onClick={() => changeSection("events")}
              className={`px-6 py-4 flex items-center gap-2 transition-all relative ${activeSection === "events"
                  ? "text-gray-800 font-medium"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <Calendar size={18} />
              <span>الفعاليات القادمة</span>
              {activeSection === "events" && (
                <div
                  className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
                  style={{ backgroundColor: "#780C28" }}
                ></div>
              )}
            </button>
            <button
              onClick={() => changeSection("media")}
              className={`px-6 py-4 flex items-center gap-2 transition-all relative ${activeSection === "media"
                  ? "text-gray-800 font-medium"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <Image size={18} />
              <span>الصور والفيديو</span>
              {activeSection === "media" && (
                <div
                  className="absolute bottom-0 right-0 left-0 h-1 rounded-t-sm"
                  style={{ backgroundColor: "#780C28" }}
                ></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Takes remaining height */}
      <div className="flex-1 relative overflow-hidden">
        {/* Articles Section */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${activeSection === "articles"
              ? "translate-x-0 opacity-100"
              : animationDirection === "right"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            } ${showDetails ? "hidden" : "block"}`}
        >
          {loading.articles ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  style={{ borderTop: "4px solid #780C28" }}
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5000${article.imageUrl}`}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 px-3 py-1 text-xs text-white font-medium rounded-tl-md"
                      style={{ backgroundColor: "#780C28" }}
                    >
                      {new Date(article.date).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Clock size={14} className="ml-1" />
                        {article.readTime}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{article.author}</span>
                    </div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "#6E8E59" }}
                    >
                      {article.title}
                    </h3>
                    <p className="text-gray-600">{article.summary}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleReadMore(article)}
                        className="text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: "#780C28" }}
                      >
                        <span>اقرأ المزيد</span>
                        <ChevronLeft size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Article Details View */}
        {activeSection === "articles" && showDetails && selectedArticle && (
          <div className="absolute inset-0 bg-white overflow-auto animate-fadeIn p-6">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBackToList}
                className="mb-6 flex items-center gap-2 text-sm rounded-lg hover:bg-gray-100 py-2 px-3 transition-colors"
                style={{ color: "#6E8E59" }}
              >
                <ChevronRight size={16} />
                <span>العودة إلى قائمة المقالات</span>
              </button>

              <div className="relative mb-6">
                <img
                  src={`http://localhost:5000${selectedArticle.imageUrl}`}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div
                  className="absolute bottom-4 right-4 px-3 py-1 text-xs text-white font-medium rounded-md shadow-md"
                  style={{ backgroundColor: "#780C28" }}
                >
                  {new Date(selectedArticle.date).toLocaleDateString("ar-EG")}
                </div>
              </div>

              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: "#6E8E59" }}
              >
                {selectedArticle.title}
              </h1>

              <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                <span className="flex items-center">
                  <Clock size={14} className="ml-1" />
                  {selectedArticle.readTime}
                </span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.author}</span>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  {selectedArticle.content}
                </p>

                {/* Additional content sections would go here */}
                <div
                  className="bg-gray-50 p-6 rounded-lg my-8 border-r-4"
                  style={{ borderRightColor: "#6E8E59" }}
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "#780C28" }}
                  >
                    نقاط مهمة من المقال
                  </h3>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>النقطة الأولى المستخلصة من المقال</li>
                    <li>النقطة الثانية المستخلصة والمعلومات الإضافية</li>
                    <li>النقطة الثالثة والاستنتاجات المهمة</li>
                  </ul>
                </div>

                <p className="text-lg leading-relaxed">
                  هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم
                  توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا
                  النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف
                  التى يولدها التطبيق.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4
                  className="text-lg font-bold mb-4"
                  style={{ color: "#6E8E59" }}
                >
                  مقالات ذات صلة
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles
                    .filter((a) => a._id !== selectedArticle._id)
                    .slice(0, 2)
                    .map((article) => (
                      <div
                        key={article._id}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleReadMore(article)}
                      >
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div>
                          <h5
                            className="font-bold"
                            style={{ color: "#780C28" }}
                          >
                            {article.title}
                          </h5>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Section */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${activeSection === "events"
              ? "translate-x-0 opacity-100"
              : animationDirection === "right"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
        >
          {loading.events ? (
            <div className="p-6 space-y-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md border-r-4 flex flex-col md:flex-row"
                >
                  <div className="animate-pulse">
                    <div className="md:w-1/3 bg-gray-300 h-48"></div>
                    <div className="p-4 md:p-6 flex flex-1 flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="bg-gray-200 rounded-lg p-3 h-20 w-20"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="flex gap-4">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: "#6E8E59" }}
              >
                جدول الفعاليات القادمة
              </h3>
              <div className="space-y-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border-r-4 flex flex-col md:flex-row"
                    style={{ borderRightColor: "#780C28" }}
                  >
                    <div className="md:w-1/3">
                      <img
                        src={`http://localhost:5000${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4 md:p-6 flex flex-1 flex-col md:flex-row items-start md:items-center gap-4">
                      <div
                        className="bg-gray-100 rounded-lg p-3 h-20 w-20 flex flex-col items-center justify-center shrink-0"
                        style={{ backgroundColor: "#f8f5f5" }}
                      >
                        <span
                          className="text-2xl font-bold"
                          style={{ color: "#780C28" }}
                        >
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-sm" style={{ color: "#6E8E59" }}>
                          {new Date(event.date).toLocaleDateString("ar-EG", {
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-bold text-lg mb-2"
                          style={{ color: "#6E8E59" }}
                        >
                          {event.title}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                          <span className="flex items-center text-sm">
                            <Clock size={14} className="ml-1" />
                            {event.time}
                          </span>
                          <span className="flex items-center text-sm">
                            <MapPin size={14} className="ml-1" />
                            {event.location}
                          </span>
                          <span className="flex items-center text-sm">
                            <Users size={14} className="ml-1" />
                            {event.registered}/{event.capacity} مقاعد
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRegistration(event)}
                        className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 text-white"
                        style={{ backgroundColor: "#6E8E59" }}
                      >
                        <span>التسجيل</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out overflow-auto ${activeSection === "media"
              ? "translate-x-0 opacity-100"
              : animationDirection === "right"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
        >
          {loading.media ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden shadow-md h-64 bg-gray-300 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: "#6E8E59" }}
              >
                معرض الصور والفيديو
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.map((item) => (
                  <div
                    key={item._id}
                    className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    <img
                      src={
                        (item.type === "video" ? item.thumbnail : item.url).startsWith("http")
                          ? (item.type === "video" ? item.thumbnail : item.url)
                          : `http://localhost:5000${item.type === "video" ? item.thumbnail : item.url}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      {item.type === "video" && (
                        <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                          <Play size={32} fill="#780C28" color="#780C28" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h4 className="text-white font-bold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-white text-sm opacity-80">
                        {item.description}
                      </p>
                    </div>
                    {item.type === "image" && (
                      <div
                        className="absolute top-3 left-3 bg-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color: "#6E8E59" }}
                      >
                        <Image size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <AdminForms /> */}
    </div>
  );
}
