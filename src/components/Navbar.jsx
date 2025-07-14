import React, { useState, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleJoinUsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('يجب تسجيل الدخول أولاً للوصول إلى صفحة التسجيل');
      navigate('/login');
    }
  };

  const menuItems = [
    {
      name: "برامج التدريب",
      path: "/training-programs",
    },
    { name: "الأخبار والفعاليات", path: "/news" },
    { name: "قصص النجاح", path: "/success-stories" },
    { name: "مكتبة الموارد", path: "/resources" },
    { name: "حجز القاعات", path: "/bookingPage" },
    {
      name: "حولنا",
      path: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "من نحن", path: "/about" },
        { name: "اتصل بنا", path: "/contact" },
        { name: "سجل معنا", path: "/join-us" },
      ],
    },
  ];

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-white py-4'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Welcome Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="block">
              <img
                src="/daaralhosam.jpg"
                alt="Logo"
                className={`transition-all duration-300 ${
                  isScrolled ? 'h-16' : 'h-20'
                } w-auto object-contain`}
              />
            </Link>
            {isLoggedIn && (
              <div className="text-gray-700 font-medium mr-4">
                مرحباً، {user?.username}
              </div>
            )}
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      className="flex items-center text-gray-700 hover:text-[#780C28] transition-all duration-300 text-base font-medium py-2 px-1 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index);
                      }}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`mr-1 transition-transform duration-300 ${
                          activeDropdown === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#780C28] transition-all duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-[#780C28] transition-all duration-300 text-base font-medium py-2 px-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#780C28] after:right-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-[#780C28] hover:text-[#6E8E59] transition-all duration-300 font-medium hover:scale-105"
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#780C28] transition-all duration-300 font-medium hover:scale-105"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#780C28] focus:outline-none p-2 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <div 
        className={`lg:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {menuItems.map((item, index) => (
            <div key={item.name}>
              {item.hasDropdown ? (
                <>
                  <button
                    className="w-full text-right px-4 py-3 text-gray-700 hover:text-[#780C28] hover:bg-gray-50 rounded-lg flex justify-between items-center font-medium transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(index);
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        activeDropdown === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div 
                    className={`pr-6 pb-2 transition-all duration-300 ${
                      activeDropdown === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.path}
                        className="block px-4 py-2 text-gray-600 hover:text-[#780C28] hover:bg-gray-50 rounded-md transition-all duration-300"
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block px-4 py-3 text-gray-700 hover:text-[#780C28] hover:bg-gray-50 rounded-lg font-medium transition-all duration-300"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* Auth Buttons - Mobile */}
          <div className="pt-4 border-t border-gray-100 mt-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-gray-700 font-medium">مرحباً، {user?.username}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right text-[#780C28] hover:text-[#6E8E59] px-4 py-2 transition-all duration-300 font-medium"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-right text-gray-700 hover:text-[#780C28] px-4 py-2 transition-all duration-300 font-medium"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}
            <Link
              to="/join-us"
              onClick={handleJoinUsClick}
              className={`block w-full text-center px-6 py-3 rounded-lg transition-all duration-300 font-medium mt-4 ${
                isLoggedIn 
                  ? 'bg-[#780C28] text-white hover:bg-[#6E8E59]' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
              }`}
            >
              سجل معنا
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
