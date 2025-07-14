import { useState, useEffect } from "react";
  import { apiBaseUrl } from "../../utils/api"
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
          axios.get(`${apiBaseUrl}/news/articles`),
          axios.get(`${apiBaseUrl}/news/events`),
          axios.get(`${apiBaseUrl}/news/media`),
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
          `${apiBaseUrl}/news/events/${event._id}`,
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
    <div className="max-w-7xl mx-auto p-4">
      {/* القائمة الرئيسية للتبديل بين الأقسام */}
      <nav className="flex justify-center gap-6 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeSection === "articles" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeSection("articles")}
        >
          المقالات
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeSection === "events" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeSection("events")}
        >
          الفعاليات
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeSection === "media" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeSection("media")}
        >
          الوسائط
        </button>
      </nav>

      {/* عرض التفاصيل أو قائمة المقالات حسب الحالة */}
      {showDetails && activeSection === "articles" && selectedArticle ? (
        <article className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
          <p className="mb-4">{selectedArticle.content}</p>
          <button
            onClick={handleBackToList}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            العودة للقائمة
          </button>
        </article>
      ) : (
        <>
          {/* عرض قائمة المقالات */}
          {activeSection === "articles" && (
            <>
              {loading.articles ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <div
                      key={article._id}
                      className="bg-white rounded shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                      onClick={() => handleReadMore(article)}
                    >
                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-700 line-clamp-3">{article.summary}</p>
                      <button
                        className="mt-4 text-green-600 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadMore(article);
                        }}
                      >
                        اقرأ المزيد &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* عرض قائمة الفعاليات */}
          {activeSection === "events" && (
            <>
              {loading.events ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white rounded shadow-md p-4"
                    >
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p>
                        <Calendar className="inline-block mr-2" />{" "}
                        {new Date(event.date).toLocaleDateString("ar-EG")}
                      </p>
                      <p>
                        <Clock className="inline-block mr-2" /> {event.time}
                      </p>
                      <p>
                        <MapPin className="inline-block mr-2" /> {event.location}
                      </p>
                      <p>
                        <Users className="inline-block mr-2" /> الحضور:{" "}
                        {event.registered} / {event.capacity}
                      </p>
                      <button
                        onClick={() => handleRegistration(event)}
                        disabled={event.registered >= event.capacity}
                        className={`mt-4 px-4 py-2 rounded text-white ${
                          event.registered >= event.capacity
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        تسجيل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* عرض قائمة الوسائط */}
          {activeSection === "media" && (
            <>
              {loading.media ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {media.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded shadow-md p-4"
                    >
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      {item.type === "image" && (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded"
                        />
                      )}
                      {item.type === "video" && (
                        <video controls className="w-full h-48 rounded">
                          <source src={item.url} type="video/mp4" />
                          متصفحك لا يدعم عرض الفيديو.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
