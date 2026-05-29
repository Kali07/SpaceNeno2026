import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  const location = useLocation();

  const mustChangePassword =
    localStorage.getItem("change_password") === "true";

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Oblige l'utilisateur à changer son mot de passe
  if (
    mustChangePassword &&
    location.pathname !== "/updating"
  ) {
    return <Navigate to="/updating" replace />;
  }

  // 🔥 vérifie le rôle
  if (roles && !roles.includes(user.role?.label)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}