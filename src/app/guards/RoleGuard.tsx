import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Role } from "@/types/auth";
import { defaultRouteByRole } from "@/lib/permissions";
import { useAuthState } from "@/shared/hooks/useAuthState";
import { LoadingState } from "@/shared/components/LoadingState";
import { ForbiddenState } from "@/shared/components/ForbiddenState";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  /**
   * Jika true, user dengan role yang tidak diizinkan akan diarahkan ke forbidden state.
   * Jika false, user akan diarahkan ke default route sesuai role mereka.
   * Default: true (tampilkan forbidden state)
   */
  showForbiddenState?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  showForbiddenState = true,
}) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuthState();

  if (isLoading) {
    return <LoadingState message="Memeriksa izin akses..." />;
  }

  // Jika user belum login, ProtectedRoute sudah menanganinya
  // tetapi kita tetap handle sebagai fallback
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek apakah role user ada dalam allowedRoles
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (showForbiddenState) {
      // Tampilkan forbidden state dengan opsi kembali ke home
      return (
        <ForbiddenState
          user={user}
          requiredRoles={allowedRoles}
        />
      );
    } else {
      // Redirect ke default route sesuai role user
      const defaultRoute = defaultRouteByRole[user.role];
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return <>{children}</>;
};
