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
import RolePage from "@/pages/RolePage";
import GenerationPage from "@/pages/GenerationPage";
import StationDetailPage from "@/pages/StationDetailPage";

import ProtectedRoute from "@/components/ui/ProtectedRoute";

import { MessageProvider } from "@/context/MessageContext";
import Message from "@/components/ui/message.jsx";


// 🔹 PUBLIC ROUTE (login)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" replace /> : children;
}


function App() {
  return (
    <MessageProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>

            {/* 🔥 GLOBAL MESSAGE */}
            <Message />

            <Routes>

              {/* 🔹 LOGIN */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* 🔹 PROTECTED LAYOUT */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* 🔹 BASIC ROUTES */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="members/:id" element={<MemberDetailPage />} />
                <Route path="stations" element={<StationsPage />} />
                <Route path="stations/:id" element={<StationDetailPage />} />
                <Route path="villes" element={<VillesPage />} />
                <Route path="teachings" element={<TeachingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="continents" element={<ContinentsPage />} />
                <Route path="pays" element={<PaysPage />} />
                <Route path="role" element={<RolePage />} />
                <Route path="generation" element={<GenerationPage />} />

                {/* 🔥 ADMIN ONLY ROUTES */}
                <Route
                  path="administration"
                  element={
                    <ProtectedRoute
                      roles={[
                        "admin_technique",
                        "admin_fonctionnel",
                        "admin_national",
                        "admin_provincial",
                      ]}
                    >
                      <AdministrationPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="approvals"
                  element={
                    <ProtectedRoute
                      roles={[
                        "admin_technique",
                        "admin_fonctionnel",
                        "admin_national",
                        "admin_provincial",
                      ]}
                    >
                      <ApprovalPage />
                    </ProtectedRoute>
                  }
                />

              </Route>

              {/* 🔹 FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </MessageProvider>
  );
}

export default App;