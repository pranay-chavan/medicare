import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "./components/common/Navbar";
import CheckinPage from "./pages/CheckinPage";
import AdminPage from "./pages/AdminPage";
import BillingPage from "./pages/BillingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MapPage from "./pages/MapPage";
import LoginPage from "./pages/LoginPage";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

function PageWrapper({ children }) {
  const location = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.remove("page-transition");
      void ref.current.offsetWidth;
      ref.current.classList.add("page-transition");
    }
  }, [location.pathname]);
  return <div ref={ref} className="page-transition" style={{ padding: "24px" }}>{children}</div>;
}

function Layout() {
  const { theme } = useTheme();
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<CheckinPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </PageWrapper>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}