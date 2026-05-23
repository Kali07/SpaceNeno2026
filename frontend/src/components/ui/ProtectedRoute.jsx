import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔥 vérifie le rôle
  if (roles && !roles.includes(user.role?.label)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}