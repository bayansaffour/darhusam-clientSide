import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // إذا لم يكن المستخدم مسجل دخول، قم بتوجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }

  // إذا كان المستخدم مسجل دخول، اعرض المحتوى المطلوب
  return children;
};

export default ProtectedRoute; 