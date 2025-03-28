
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Use only localStorage for auth state, no Supabase
  const isAuthenticated = localStorage.getItem("auth") === "true";

  if (!isAuthenticated) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
