import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import MembersPage from "@/pages/MembersPage";
import MemberDetailPage from "@/pages/MemberDetailPage";
import StationsPage from "@/pages/StationsPage";
import VillesPage from "@/pages/VillesPage";
import TeachingsPage from "@/pages/TeachingsPage";
import AdministrationPage from "@/pages/AdministrationPage";
import ProfilePage from "@/pages/ProfilePage";
import ApprovalPage from "@/pages/ApprovalPage";
import ContinentsPage from "@/pages/ContinentPage";
import PaysPage from "@/pages/PaysPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-8 h-8 border-3 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="members/:id" element={<MemberDetailPage />} />
              <Route path="stations" element={<StationsPage />} />
              <Route path="villes" element={<VillesPage />} />
              <Route path="teachings" element={<TeachingsPage />} />
              <Route path="administration" element={<AdministrationPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="approval" element={<ApprovalPage />} />
              <Route path="continents" element={<ContinentsPage />} />
              <Route path="pays" element={<PaysPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
