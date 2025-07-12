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

// تعديل رابط الـ API ليكون متغير بيئي
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [articlesRes, eventsRes, mediaRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/news/articles`),
          axios.get(`${API_BASE_URL}/news/events`),
          axios.get(`${API_BASE_URL}/news/media`),
        ]);

        setArticles(articlesRes.data);
        setEvents(eventsRes.data);
        setMedia(mediaRes.data);

        setLoading({ articles: false, events: false, media: false });
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

    fetchAllData();
  }, []);

  const handleRegistration = async (event) => {
    if (event.registered >= event.capacity) {
      return Swal.fire({
        title: "عفواً",
        text: "لا توجد أماكن متاحة لهذه الفعالية",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#780C28",
      });
    }

    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
      try {
        const updatedEvent = await axios.put(
          `${API_BASE_URL}/news/events/${event._id}`,
          { registered: event.registered + 1 }
        );

        setEvents((prevEvents) =>
          prevEvents.map((e) => (e._id === event._id ? updatedEvent.data : e))
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
  };

  const changeSection = (section) => {
    const sections = ["articles", "events", "media"];
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(section);

    setAnimationDirection(newIndex > currentIndex ? "right" : "left");
    setActiveSection(section);
    setShowDetails(false);
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

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

  const LoadingSkeleton = ({ count = 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse"
        >
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
      ))}
    </div>
  );

  return (
    //... باقي الكود كما هو
    // (احتفظت بالباقي كما في الكود اللي أعطيتني إياه بدون تغيير)
  );
}
