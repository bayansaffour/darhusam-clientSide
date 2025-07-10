// clientSide/src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import VolunteerForm from "./components/joinUs/VolunteerForm";
import TrainerForm from "./components/joinUs/TrainerForm";
import TraineeForm from "./components/joinUs/TraineeForm";
import PartnerForm from "./components/joinUs/PartnerForm";
import IndividualPartnerForm from "./components/joinUs/IndividualPartnerForm";
import JoinUsOptions from "./components/joinUs/JoinUsOptions";
import TermsPage from "./components/joinUs/TermsPage";
import HomePage from "./components/HomePage/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import News from "./components/NewsEvents/News";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSetup from "./pages/admin/Setup";
import SuccessStories from "./components/SuccessStories";
import TrainingPrograms from "./pages/TrainingPrograms";
import ResourceLibrary from './components/ResourceLibrary'
import AboutUs from "./components/AboutUs";
import BookingPage from "./pages/BookingPage";
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';

// Wrapper component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? 'pt-28' : ''}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/training-programs" element={<TrainingPrograms />} />
            <Route path="/join-us/terms/:type" element={<TermsPage />} />
            <Route path="/join-us" element={<ProtectedRoute><JoinUsOptions /></ProtectedRoute>} />
            <Route path="/join-us/volunteer" element={<VolunteerForm />} />
            <Route path="/join-us/trainer" element={<TrainerForm />} />
            <Route path="/join-us/trainee" element={<TraineeForm />} />
            <Route path="/join-us/partner" element={<PartnerForm />} />
            <Route
              path="/join-us/individual"
              element={<IndividualPartnerForm />}
            />
            <Route path="/news" element={<News />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourceLibrary />} />

            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/bookingPage" element={<BookingPage />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
