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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/resources');
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
  }, []);

  useEffect(() => {
    // Filter resources based on category and search query
    const filtered = resources.filter((resource) => {
      const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, activeCategory, resources]);

  // Calculate pagination
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
      
      // If it's an image, download directly
      if (resource.images && resource.images.length > 0) {
        const imageUrl = resource.images[0]?.startsWith('http') 
          ? resource.images[0] 
          : `http://localhost:5000${resource.images[0]}`;
        
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resource.title}.jpg`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return;
      }

      // If it's a file or external URL
      if (resource.fileUrl || resource.externalUrl) {
        const fileUrl = resource.fileUrl || resource.externalUrl;
        
        // If it's an external URL, try to download directly
        if (fileUrl.startsWith('http')) {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Try to get filename from URL
          const filename = fileUrl.split('/').pop() || `${resource.title}.pdf`;
          link.setAttribute('download', filename);
          
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return;
        }

        // If it's a server file, use the download endpoint
        const response = await axios.get(`http://localhost:5000/api/resources/${resource._id}/download`, {
          responseType: 'blob'
        });
        
        const contentDisposition = response.headers['content-disposition'];
        let filename;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          filename = filenameMatch ? filenameMatch[1] : `${resource.title}.pdf`;
        } else {
          filename = `${resource.title}.pdf`;
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

  return (
    <div className="bg-[#EAFAEA] min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#780C28] mb-4">مكتبة الموارد</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            استكشف مجموعة متنوعة من الموارد التعليمية والتدريبية التي تقدمها دار الحسام لدعم تطويرك المهني والشخصي
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن موارد..."
                className="block w-full border border-gray-300 rounded-lg py-3 pr-10 pl-4 text-gray-900 focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter - Mobile Dropdown */}
            <div className="md:hidden w-full">
              <div className="relative">
                <select
                  className="block w-full bg-white border border-gray-300 rounded-lg py-3 pr-4 pl-10 text-gray-900 appearance-none focus:ring-2 focus:ring-[#780C28] focus:border-[#780C28]"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter size={20} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Category Filter - Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1 flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[#780C28] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="loader w-12 h-12 border-4 border-[#CAE0BC] border-t-[#780C28] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              className="mt-4 bg-[#780C28] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              onClick={() => window.location.reload()}
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">لم يتم العثور على موارد مطابقة للبحث</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentResources.map((resource) => (
                <div 
                  key={resource._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="relative h-48 flex items-center justify-center bg-gray-100">
                    {resource.images && resource.images.length > 0 ? (
                      <img 
                        src={resource.images[0]?.startsWith('http') ? resource.images[0] : `http://localhost:5000${resource.images[0]}`}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        {getResourceIcon(resource.category)}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#780C28] text-white text-xs font-medium px-2 py-1 rounded">
                      {categories.find(c => c.id === resource.category)?.label || 'مورد'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-1 line-clamp-1">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{resource.description}</p>
                    <div className="flex justify-center gap-2 mt-auto">
                      {resource.fileUrl || resource.externalUrl ? (
                        <>
                          <a
                            href={resource.fileUrl || resource.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-medium px-4 py-2 rounded bg-[#780C28] text-white hover:bg-opacity-90 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLink size={16} className="ml-1" />
                            عرض المورد
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(resource);
                            }}
                            disabled={isDownloading}
                            className={`flex items-center text-sm font-medium px-4 py-2 rounded bg-[#CAE0BC] text-[#780C28] hover:bg-opacity-90 transition-colors ${
                              isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#780C28] border-t-transparent rounded-full animate-spin ml-1" />
                                جاري التحميل...
                              </>
                            ) : (
                              <>
                                <Download size={16} className="ml-1" />
                                تحميل
                              </>
                            )}
                          </button>
                        </>
                      ) : resource.images && resource.images.length > 0 ? (
                        <>
                          <a
                            href={resource.images[0]?.startsWith('http') ? resource.images[0] : `http://localhost:5000${resource.images[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-medium px-4 py-2 rounded bg-[#780C28] text-white hover:bg-opacity-90 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLink size={16} className="ml-1" />
                            عرض الصورة
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(resource);
                            }}
                            disabled={isDownloading}
                            className={`flex items-center text-sm font-medium px-4 py-2 rounded bg-[#CAE0BC] text-[#780C28] hover:bg-opacity-90 transition-colors ${
                              isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#780C28] border-t-transparent rounded-full animate-spin ml-1" />
                                جاري التحميل...
                              </>
                            ) : (
                              <>
                                <Download size={16} className="ml-1" />
                                تحميل
                              </>
                            )}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`py-2 px-4 bg-white border border-gray-300 rounded-r-md text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    السابق
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`py-2 px-4 bg-white border border-gray-300 text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'bg-[#780C28] text-white border-[#780C28]'
                              : 'text-gray-700 hover:bg-gray-50'
                          } ${pageNumber === 1 ? 'border-r-0' : ''} ${
                            pageNumber === totalPages ? 'border-l-0' : ''
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="py-2 px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`py-2 px-4 bg-white border border-gray-300 rounded-l-md text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    التالى
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for resource details */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto flex flex-col">
            <button
              className="absolute left-6 top-6 text-gray-400 hover:text-[#780C28] transition-colors p-2 rounded-full hover:bg-gray-100"
              onClick={() => setSelectedResource(null)}
              aria-label="إغلاق"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#780C28] mb-2">{selectedResource.title}</h2>
              <span className="inline-block bg-[#780C28]/10 text-[#780C28] px-4 py-1 rounded-full text-sm font-medium">
                {categories.find(c => c.id === selectedResource.category)?.label || 'مورد'}
              </span>
            </div>

            <div className="relative flex items-center justify-center mb-6 bg-gray-50 rounded-2xl p-4">
              {selectedResource.images && selectedResource.images.length > 0 ? (
                <img
                  src={selectedResource.images[0]?.startsWith('http') ? selectedResource.images[0] : `http://localhost:5000${selectedResource.images[0]}`}
                  alt={selectedResource.title}
                  className="w-full max-h-[400px] object-contain rounded-xl"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64">
                  {getResourceIcon(selectedResource.category)}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">الوصف</h3>
              <p className="text-gray-700 text-base whitespace-pre-line break-words leading-relaxed">
                {selectedResource.description}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-auto">
              {selectedResource.fileUrl || selectedResource.externalUrl ? (
                <>
                  <a
                    href={selectedResource.fileUrl || selectedResource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#780C28] text-white hover:bg-[#780C28]/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink size={20} />
                    عرض المورد
                  </a>
                  <button
                    onClick={() => handleDownload(selectedResource)}
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-[#CAE0BC] text-[#780C28] hover:bg-[#CAE0BC]/90 transition-colors font-medium shadow-lg hover:shadow-xl ${
                      isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#780C28] border-t-transparent rounded-full animate-spin" />
                        جاري التحميل...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        تحميل
                      </>
                    )}
                  </button>
                </>
              ) : selectedResource.images && selectedResource.images.length > 0 ? (
                <>
                  <a
                    href={selectedResource.images[0]?.startsWith('http') ? selectedResource.images[0] : `http://localhost:5000${selectedResource.images[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#780C28] text-white hover:bg-[#780C28]/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink size={20} />
                    عرض الصورة
                  </a>
                  <button
                    onClick={() => handleDownload(selectedResource)}
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-[#CAE0BC] text-[#780C28] hover:bg-[#CAE0BC]/90 transition-colors font-medium shadow-lg hover:shadow-xl ${
                      isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#780C28] border-t-transparent rounded-full animate-spin" />
                        جاري التحميل...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        تحميل
                      </>
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;