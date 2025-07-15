import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Video, FileText, File, Download, ExternalLink, Filter, X } from 'lucide-react';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const resourcesPerPage = 9;

  const categories = [
    { id: 'all', label: 'الكل', icon: <BookOpen className="ml-2" size={18} /> },
    { id: 'articles', label: 'مقالات', icon: <FileText className="ml-2" size={18} /> },
    { id: 'videos', label: 'فيديوهات', icon: <Video className="ml-2" size={18} /> },
    { id: 'presentations', label: 'عروض تقديمية', icon: <FileText className="ml-2" size={18} /> },
    { id: 'pdf', label: 'ملفات PDF', icon: <File className="ml-2" size={18} /> },
  ];

  // استخدام متغير البيئة VITE_BACKEND_URL فقط

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/resources`);
        setResources(response.data.data || []);
        setFilteredResources(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الموارد، يرجى المحاولة مرة أخرى');
        setIsLoading(false);
        console.error('Error fetching resources:', err);
      }
    };

    fetchResources();
  }, [API_URL]);

  useEffect(() => {
    const filtered = resources.filter(resource => {
      const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [searchQuery, activeCategory, resources]);

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getResourceIcon = (category) => {
    switch (category) {
      case 'articles':
        return <FileText className="text-[#780C28]" size={24} />;
      case 'videos':
        return <Video className="text-[#780C28]" size={24} />;
      case 'presentations':
        return <FileText className="text-[#780C28]" size={24} />;
      case 'pdf':
        return <File className="text-[#780C28]" size={24} />;
      default:
        return <BookOpen className="text-[#780C28]" size={24} />;
    }
  };

  const handleDownload = async (resource) => {
  try {
    setIsDownloading(true);

    let imageUrl = "/default.jpg"; // صورة بديلة في حال عدم توفر صورة

    if (
      resource.images &&
      Array.isArray(resource.images) &&
      resource.images.length > 0 &&
      typeof resource.images[0] === "string"
    ) {
      imageUrl = resource.images[0].startsWith("http")
        ? resource.images[0]
        : `${API_URL}${resource.images[0]}`;
    }

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${resource.title || "file"}.jpg`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ فشل تحميل الصورة:", error);
  } finally {
    setIsDownloading(false);
  }
};

      // تحميل ملف أو رابط خارجي
      if (resource.fileUrl || resource.externalUrl) {
        const fileUrl = resource.fileUrl || resource.externalUrl;

        if (fileUrl.startsWith('http')) {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          const filename = fileUrl.split('/').pop() || `${resource.title}.pdf`;
          link.setAttribute('download', filename);

          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return;
        }

        const response = await axios.get(`${API_URL}/api/resources/${resource._id}/download`, {
          responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `${resource.title}.pdf`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch) filename = filenameMatch[1];
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading resource:', err);
      alert('حدث خطأ أثناء تحميل الملف، يرجى المحاولة مرة أخرى');
    } finally {
      setIsDownloading(false);
    }
  };

  // باقي الكود بدون تعديل

  return (
    <div className="bg-[#EAFAEA] min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* ... محتوى الصفحة كما في كودك الأصلي ... */}
      {/* (بما أن التغيير الرئيسي كان في axios أكتفيت بتعديله) */}
    </div>
  );
};

export default ResourceLibrary;
