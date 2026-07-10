import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "@/shared/hooks/useAuthState";
import { LoadingState } from "@/shared/components/LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return <LoadingState message="Memeriksa sesi..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
